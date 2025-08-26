// src/components/HitosBarras.jsx
import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// ——— Carga de módulos ———
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// ——— Tema oscuro global con Nunito Sans ———
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent'
  },
  title:    { style: { color: '#fff', fontSize: '16px', fontWeight: '600' } },
  subtitle: { style: { color: '#aaa', fontSize: '12px' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title:  { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle:       { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle:  { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' }
  }
});

// Helpers
const monthAbbrEs = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const fmtMesYY = (yyyy_mm) => {
  // "2025-12" -> "Dic-25"
  const [y, m] = yyyy_mm.split('-');
  const mi = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
  return `${monthAbbrEs[mi]}-${y.slice(2)}`;
};

// Endpoints (POST sin datos de entrada)
async function fetchHitosPorCumplir() {
  const resp = await fetch(`${API}/v1/graficas/6g_proyecto/hitos_por_cumplir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}' // POST sin payload
  });
  if (!resp.ok) throw new Error('Error al consultar hitos_por_cumplir');
  return resp.json();
}

async function fetchProyectosIncumplimientos() {
  const resp = await fetch(`${API}/v1/graficas/6g_proyecto/proyectos_incumplimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}' // POST sin payload
  });
  if (!resp.ok) throw new Error('Error al consultar proyectos_incumplimientos');
  return resp.json();
}

export function HitosBarras() {
  const chartRefs = useRef([]);
  const [opt1, setOpt1] = useState(null);
  const [opt2, setOpt2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [hitos, incumpl] = await Promise.all([
          fetchHitosPorCumplir(),
          fetchProyectosIncumplimientos()
        ]);

        // ===== Gráfica 1: Número de hitos por cumplir =====
        // Orden cronológico por "fpo_mes_año"
        const hitosSorted = [...hitos].sort((a, b) => a.fpo_mes_año.localeCompare(b.fpo_mes_año));
        const categorias1 = hitosSorted.map(d => fmtMesYY(d.fpo_mes_año));
        const data1 = hitosSorted.map(d => d.hitos_por_cumplir ?? 0);

        const options1 = {
          title:    { text: 'Número de hitos por cumplir' },
          subtitle: { text: 'Fuente: XM. 2020-2024' },
          chart:    { type: 'column', height: 350 },
          xAxis: {
            categories: categorias1,
            title:      { text: null },
            tickInterval: 1,
            labels: {
              style:       { color: '#ccc', fontSize: '10px' },
              rotation:    -45,
              step:         1,
              autoRotation: false
            },
            gridLineColor: '#333'
          },
          yAxis: { title: { text: 'Número de hitos', style: { color: '#ccc' } }, min: 0 },
          plotOptions: {
            column: {
              borderRadius: 4,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                formatter() { return Highcharts.numberFormat(this.y, 0, ',', '.'); },
                style: { fontWeight: 'bold', color: '#fff' },
                y: -10
              },
              pointPadding: 0.1,
              groupPadding: 0.1
            }
          },
          series: [
            {
              name: 'Hitos por cumplir',
              data: data1,
              color: '#3B82F6'
            }
          ]
        };

        // ===== Gráfica 2: Proyectos por número de incumplimientos =====
        const incSorted = [...incumpl].sort((a, b) => a.incumplimientos - b.incumplimientos);
        const categorias2 = incSorted.map(d => String(d.incumplimientos));
        const data2 = incSorted.map(d => d.count ?? 0);

        const options2 = {
          title:    { text: 'Número de hitos con incumplimientos' }, // mantengo tu título
          subtitle: { text: 'Fuente: XM. 2020-2024' },
          chart:    { type: 'column', height: 350 },
          xAxis: {
            categories: categorias2,
            title:      { text: null },
            tickInterval: 1,
            labels: {
              style:       { color: '#ccc', fontSize: '10px' },
              rotation:    -45,
              step:         1,
              autoRotation: false
            },
            gridLineColor: '#333'
          },
          yAxis: { title: { text: 'Número de hitos', style: { color: '#ccc' } }, min: 0 },
          plotOptions: {
            column: {
              borderRadius: 4,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                formatter() { return Highcharts.numberFormat(this.y, 0, ',', '.'); },
                style: { fontWeight: 'bold', color: '#fff' },
                y: -10
              },
              pointPadding: 0.1,
              groupPadding: 0.1
            }
          },
          series: [
            {
              name: 'Hitos incumplidos',
              data: data2,
              color: '#F87171'
            }
          ]
        };

        setOpt1(options1);
        setOpt2(options2);
        setLoading(false);
      } catch (e) {
        setError(e.message || String(e));
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold">
        Seguimiento de hitos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1 */}
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm relative">
          {/* Botón de ayuda */}
          <button
            className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
            style={{ width: 30, height: 30 }}
            title="Ayuda"
            onClick={() => alert('Esta gráfica muestra el número de hitos por cumplir por mes.')}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
              <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
              <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif" pointerEvents="none">?</text>
            </svg>
          </button>

          {loading && <div className="text-white">Cargando…</div>}
          {error   && <div className="text-red-400">Error: {error}</div>}
          {!loading && !error && opt1 && (
            <HighchartsReact
              highcharts={Highcharts}
              options={opt1}
              ref={el => (chartRefs.current[0] = el)}
            />
          )}
        </div>

        {/* Chart 2 */}
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm relative">
          {/* Botón de ayuda */}
          <button
            className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
            style={{ width: 30, height: 30 }}
            title="Ayuda"
            onClick={() => alert('Esta gráfica muestra proyectos agrupados por número de incumplimientos.')}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
              <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
              <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif" pointerEvents="none">?</text>
            </svg>
          </button>

          {loading && <div className="text-white">Cargando…</div>}
          {error   && <div className="text-red-400">Error: {error}</div>}
          {!loading && !error && opt2 && (
            <HighchartsReact
              highcharts={Highcharts}
              options={opt2}
              ref={el => (chartRefs.current[1] = el)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default HitosBarras;

