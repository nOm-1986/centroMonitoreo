// src/components/CapacidadInstalada.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig';

// ============== Caché ==============
const CACHE_PREFIX = 'chart-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS;
const memoryCache = new Map();

const getFromCache = (key) => {
  if (memoryCache.has(key)) return memoryCache.get(key);
  const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) return null;
  try {
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    memoryCache.set(key, data);
    return data;
  } catch {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
};

const setToCache = (key, data) => {
  const payload = JSON.stringify({ data, timestamp: Date.now() });
  memoryCache.set(key, data);
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, payload);
  } catch {
    // limpia dejando los 50 más recientes
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({ key: k, timestamp: JSON.parse(localStorage.getItem(k)).timestamp }))
      .sort((a, b) => b.timestamp - a.timestamp);
    keys.slice(50).forEach(i => localStorage.removeItem(i.key));
    localStorage.setItem(`${CACHE_PREFIX}${key}`, payload);
  }
};

// ============== Highcharts mods ==============
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// normaliza string (mayúsculas, sin tildes)
const norm = (s='') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

// color por fuente (robusto a variantes)
const colorFor = (name='') => {
  const n = norm(name);
  if (n.includes('SOLAR')) return '#FFC800';
  if (n.includes('EOLICA') || n.includes('EOLICO') || n.includes('VIENTO')) return '#5DFF97';
  if (n === 'PCH') return '#3B82F6';
  if (n.includes('TERM')) return '#F97316';
  if (n.includes('BIOMASA')) return '#B39FFF';
  return '#666666';
};

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const cacheKey = 'capacidad_instalada_acumulada';

    (async () => {
      try {
        const cached = getFromCache(cacheKey);
        if (cached && alive) {
          setOptions(cached);
          setIsCached(true);
          setLoading(false);
          return;
        }

        setLoading(true);
        setIsCached(false);
        setError(null);

        const res = await fetch(
          `${API}/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error('Error en la respuesta del servidor');

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('No hay datos disponibles');

        // ordena por fecha
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
        );

        // Fuentes detectadas dinámicamente (quitamos Biomasa)
        const fuentesAll = Object.keys(sorted[0]).filter(k => k !== 'fecha_entrada_operacion');
        const fuentesSinBiomasa = fuentesAll.filter(k => norm(k) !== 'BIOMASA');

        // --- ORDEN deseado en la pila ---
        // base inferior: PCH y EÓLICA
        const pchKey     = fuentesSinBiomasa.find(f => norm(f) === 'PCH');
        const eolicaKey  = fuentesSinBiomasa.find(f => norm(f).includes('EOLICA') || norm(f).includes('EOLICO') || norm(f).includes('VIENTO'));
        // tope superior: SOLAR (si existe)
        const solarKey   = fuentesSinBiomasa.find(f => norm(f).includes('SOLAR'));

        // el resto en el medio, manteniendo el orden original
        const middle = fuentesSinBiomasa.filter(f =>
          f !== pchKey && f !== eolicaKey && f !== solarKey
        );

        // orden final para stacking (primero = fondo, último = arriba)
        const orderedFuentes = [
          ...(pchKey ? [pchKey] : []),
          ...(eolicaKey ? [eolicaKey] : []),
          ...middle,
          ...(solarKey ? [solarKey] : []),
        ];

        // crea series acumuladas [timestamp, valor]
        const series = orderedFuentes.map(fuente => {
          let last = 0;
          const points = sorted.map(item => {
            const t = new Date(item.fecha_entrada_operacion).getTime();
            if (item[fuente] !== undefined && !isNaN(item[fuente])) {
              last = parseFloat(item[fuente]);
            }
            return [t, last];
          });
          return {
            name: fuente,
            data: points,
            color: colorFor(fuente),
          };
        });

        const chartOptions = {
          chart: {
            type: 'area',
            backgroundColor: '#262626',
            height: 550,
            marginBottom: 100,
          },
          title: {
            text: 'Evolución Capacidad Instalada por Tecnología',
            align: 'left',
            style: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '16px' }
          },
          subtitle: {
            text: isCached ? '(Datos en caché)' : '',
            style: { color: '#AAA', fontSize: '12px' }
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { day: '%e %b %Y', month: "%b '%y", year: '%Y' },
            labels: { rotation: -45, y: 18, style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
            title: { text: 'Fecha de entrada en operación', style: { color: '#FFF' } },
            lineColor: '#555', tickColor: '#888', tickLength: 5
          },
          yAxis: {
            min: 0,
            tickAmount: 6,
            gridLineDashStyle: 'Dash',
            gridLineColor: '#444',
            reversedStacks: false,           // ← fuerza que la 1a serie vaya al fondo
            title: { text: 'Capacidad acumulada (MW)', style: { color: '#FFF' } },
            labels: {
              formatter() { return this.value.toLocaleString() + ' MW'; },
              style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
            }
          },
          tooltip: {
            backgroundColor: '#1F2937',
            style: { color: '#FFF', fontSize: '12px' },
            shared: true,
            formatter() {
              const fecha = Highcharts.dateFormat('%e %b %Y', this.x);
              let total = 0;
              this.points.forEach(pt => { total += pt.y; });
              let s = `<b>Fecha: ${fecha}</b><br/><br/>`;
              s += `<span style="color:#FFD700"><b>Total: ${total.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})} MW</b></span><br/><br/>`;
              this.points.forEach(pt => {
                s += `<span style="color:${pt.color}">●</span> ${pt.series.name}: <b>${pt.y.toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1})} MW</b><br/><br/>`;
              });
              return s;
            }
          },
          plotOptions: {
            area: { stacking: 'normal', marker: { enabled: false }, lineWidth: 1 }
          },
          series,
          legend: {
            layout: 'horizontal',
            verticalAlign: 'bottom',
            y: 25,
            itemStyle: { color: '#ccc', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
            itemHoverStyle: { color: '#fff' }
          }
        };

        if (alive) {
          setOptions(chartOptions);
          setToCache(cacheKey, chartOptions);
          setTimeout(() => chartRef.current?.chart?.redraw(), 200);
        }
      } catch (e) {
        if (alive) setError(e.message || 'Error al cargar datos');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-card p-4  rounded-lg border-border shadow-sm flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
        </div>
        <p className="text-gray-300 mt-4">Cargando capacidad instalada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.062 19h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 16c-.77 1.333.2 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-300 text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  if (!options) return null;

  return (
    <section className="mt-8 mb-14">
      <div className="w-full bg-card p-4 pb-10 rounded-lg border border-[#666666] shadow-sm relative">
        {/* Ayuda */}
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Esta gráfica muestra la capacidad acumulada de los proyectos por tipo de energía a lo largo del tiempo.')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif">?</text>
          </svg>
        </button>

        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
    </section>
  );
}

export default CapacidadInstalada;

