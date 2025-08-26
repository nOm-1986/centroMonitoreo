import { Button } from "./ui/Button"

import { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig';

// ─────────── Configuración de caché ───────────
const CACHE_PREFIX = 'generacion-despacho-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS;
const memoryCache = new Map();

const getFromCache = (key) => {
  if (memoryCache.has(key)) return memoryCache.get(key);
  const cachedItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!cachedItem) return null;

  try {
    const { data, timestamp } = JSON.parse(cachedItem);
    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    memoryCache.set(key, data);
    return data;
  } catch (e) {
    console.error('Error parsing cache', e);
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
};

const setToCache = (key, data) => {
  const timestamp = Date.now();
  const cacheItem = JSON.stringify({ data, timestamp });
  memoryCache.set(key, data);
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  } catch (e) {
    console.error('LocalStorage is full, clearing oldest items...');
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({ key: k, timestamp: JSON.parse(localStorage.getItem(k)).timestamp }))
      .sort((a, b) => b.timestamp - a.timestamp);

    keys.slice(50).forEach(item => localStorage.removeItem(item.key));
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  }
};

// ─────────── Carga de módulos Highcharts ───────────
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: {
    align: 'left',
    style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' }
  },
  subtitle: {
    style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' }
  },
  xAxis: {
    labels: {
      style: { color: '#ccc', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif' },
      rotation: -45,
      align: 'right'
    },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  }
});

// ─────────── Helpers tooltip ───────────
const fmt = (v, dec = 2) => Highcharts.numberFormat(v, dec, ',', '.');

function areaTooltipFormatter() {
  // this.points contiene cada serie en esa X
  const pts = this.points || [];
  const total = pts.reduce((s, p) => s + p.y, 0);

  const rows = pts.map(p => `
    <tr>
      <td style="padding:0 8px 0 0; white-space:nowrap;">${p.series.name}:</td>
      <td style="text-align:right;"><b>${fmt(p.y, 2)} MWh-día</b></td>
    </tr>
  `).join('');

  return `
    <span style="font-size:12px"><b>${this.x}</b></span>
    <table>
      ${rows}
      <tr>
        <td colspan="2" style="border-top:1px solid #555; padding-top:4px">
          Total: <b>${fmt(total, 2)} MWh-día</b>
        </td>
      </tr>
    </table>
  `;
}

export function GeneracionDespacho() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'generacion_despacho_data';

    const fetchData = async () => {
      try {
        // Cache
        const cachedData = getFromCache(cacheKey);
        if (cachedData && isMounted) {
          setOptions(cachedData);
          setIsCached(true);
          setLoading(false);
          return;
        }

        setLoading(true);
        setIsCached(false);
        setError(null);

        const resp = await fetch(`${API}/v1/graficas/6g_proyecto/grafica_generacion_diaria`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);

        const data = await resp.json();
        if (!data || !Array.isArray(data)) throw new Error('Datos recibidos no válidos');

        // Ordenar por fecha
        const sorted = [...data].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        const categories = sorted.map(item => item.fecha.slice(0, 10));

        // Mostrar aprox. 12 labels en X
        const tickInt = Math.max(1, Math.ceil(categories.length / 12));

        // Series (asegura nombres iguales a tus keys reales)
        const techs = ['TERMICA', 'COGENERADOR', 'HIDRAULICA', 'SOLAR', 'EOLICA'];
        const colorMap = {
          EOLICA: '#5DFF97',
          SOLAR: '#FFC800',
          HIDRAULICA: '#3B82F6',
          COGENERADOR: '#D1D1D0',
          TERMICA: '#F97316'
        };

        const series = techs.map((tech, idx) => ({
          name: tech,
          data: categories.map(date => {
            const rec = sorted.find(d => d.fecha.slice(0, 10) === date);
            return rec && rec[tech] != null ? Number(rec[tech]) : 0;
          }),
          color: colorMap[tech],
          index: idx,
          legendIndex: idx
        }));

        const chartOptions = {
          chart: { type: 'area', height: 400, backgroundColor: '#262626' },
          title: { text: 'Generación Real Diaria por Tecnología' },
          subtitle: { text: isCached ? '(Datos en caché)' : '' },
          legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
          xAxis: {
            categories,
            tickInterval: tickInt,
            title: { text: 'Fecha', style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } },
            labels: { rotation: -45, style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } }
          },
          yAxis: {
            title: { text: 'Generación (MWh-día)', style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
            labels: { style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } },
            min: 0,
            gridLineColor: '#333'
          },
          plotOptions: {
            area: { stacking: 'normal', marker: { enabled: false } }
          },
          series,
          tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: '#1f2937',
            borderColor: '#666',
            formatter: areaTooltipFormatter
          },
          exporting: { enabled: true }
        };

        if (isMounted) {
          setOptions(chartOptions);
          setToCache(cacheKey, chartOptions);
          setTimeout(() => {
            chartRef.current?.chart?.redraw();
          }, 200);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        if (isMounted) setError('No se pudo cargar la gráfica de Generación Real Diaria por Tecnología');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm flex flex-col items-center justify-center h-[450px]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica de Generación Real Diaria por Tecnología...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow-sm flex flex-col items-center justify-center h-[450px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="w-full bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() =>
            alert('Esta gráfica muestra la generación real diaria de energía desglosada por tecnología (térmica, cogenerador, hidráulica, solar y eólica).')
          }
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              fontFamily="Nunito Sans, sans-serif"
              pointerEvents="none"
            >?</text>
          </svg>
        </button>

        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
    </section>
  );
}

export default GeneracionDespacho;
