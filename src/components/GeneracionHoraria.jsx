// src/components/GeneracionHoraria.jsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

// Carga módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global
Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { align: 'left', style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: { backgroundColor: '#1f2937', style: { color: '#fff', fontSize: '12px' }, useHTML: true }
});

const fmt = (v, dec = 2) => Highcharts.numberFormat(v, dec, ',', '.');
const SCALE = 1000;

function areaTooltipFormatter() {
  const pts = this.points || [];
  const total = pts.reduce((s, p) => s + p.y, 0);
  const rows = pts.map(p => `
    <tr>
      <td style="padding:0 8px 0 0;white-space:nowrap;">
        <span style="color:${p.series.color}">●</span> ${p.series.name}:
      </td>
      <td style="text-align:right;"><b>${fmt(p.y)} MW/h</b></td>
    </tr>
  `).join('');
  return `
    <span style="font-size:12px"><b>Hora: ${this.x}</b></span>
    <table>${rows}
      <tr><td colspan="2" style="border-top:1px solid #555;padding-top:4px">
        Total: <b>${fmt(total)} MW/h</b>
      </td></tr>
    </table>
  `;
}

async function fetchPromedio(payload) {
  const resp = await fetch(
      `${API}/v1/graficas/6g_proyecto/generacion_horaria_promedio`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
  if (!resp.ok) throw new Error('Error al consultar generación horaria');
  return resp.json();
}

function stackedMax(series, len) {
  let max = 0;
  for (let i = 0; i < len; i++) {
    const sum = series.reduce((s, srs) => s + (srs.data[i] || 0), 0);
    if (sum > max) max = sum;
  }
  return max;
}

export function GeneracionHoraria() {
  const [opts1, setOpts1] = useState(null);
  const [opts2, setOpts2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) Prepara payloads
        const payload1 = { fecha_inicio: '2022-01-01', fecha_fin: '2022-06-30', meses: 6 };
        const hoy       = new Date();
        const fecha_fin2 = hoy.toISOString().slice(0,10);
        const inicio    = new Date(hoy.getFullYear(), hoy.getMonth()-5,1)
                           .toISOString().slice(0,10);
        const payload2  = { fecha_inicio: inicio, fecha_fin: fecha_fin2, meses: 6 };

        // 2) Fetch paralelo
        const [data1, data2] = await Promise.all([
          fetchPromedio(payload1),
          fetchPromedio(payload2)
        ]);

        // 3) Horas y series
        const horas1 = data1.map(d => d.hora);
        const horas2 = data2.map(d => d.hora);
        const toMW   = arr => arr.map(v => v * SCALE);

        const series1 = [
          { name:'TÉRMICA',     data: toMW(data1.map(d=>d.TERMICA)),     color:'#F97316' },
          { name:'COGENERADOR', data: toMW(data1.map(d=>d.COGENERADOR)), color:'#D1D1D0' },
          { name:'HIDRÁULICA',  data: toMW(data1.map(d=>d.HIDRAULICA)),  color:'#3B82F6' },
          { name:'SOLAR',       data: toMW(data1.map(d=>d.SOLAR)),       color:'#FFC800' }
        ];
        const max1 = Math.ceil(stackedMax(series1, horas1.length)*1.1);

        // 4) BaseOptions (primer gráfico)
        const baseOptions = {
          chart: { type:'area', height:500 },
          title: { text:'Curva de generación primer semestre 2022' },
          xAxis: {
            categories: horas1, tickInterval:1,
            title: { text:'Hora del día', style:{color:'#ccc'} },
            labels:{style:{color:'#ccc'}}, gridLineColor:'#333'
          },
          yAxis: {
            min:0, max:max1, tickInterval:Math.ceil(max1/5),
            title:{text:'Generación (MW/h)',style:{color:'#ccc'}},
            labels:{style:{color:'#ccc'},formatter(){return fmt(this.value,0);}},
            gridLineColor:'#333'
          },
          tooltip:{ shared:true, formatter:areaTooltipFormatter, borderColor:'#666' },
          plotOptions:{ area:{ stacking:'normal', lineWidth:1, marker:{enabled:false} } },
          series: series1,
          responsive:{ rules:[{ condition:{maxWidth:600}, chartOptions:{ legend:{layout:'horizontal',align:'center',verticalAlign:'bottom'} } }] }
        };

        setOpts1(baseOptions);

        // 5) VariantOptions (segundo gráfico)
        const series2 = [
          { name:'TÉRMICA',     data: toMW(data2.map(d=>d.TERMICA)),     color:'#F97316' },
          { name:'COGENERADOR', data: toMW(data2.map(d=>d.COGENERADOR)), color:'#D1D1D0' },
          { name:'HIDRÁULICA',  data: toMW(data2.map(d=>d.HIDRAULICA)),  color:'#3B82F6' },
          { name:'EÓLICA',      data: toMW(data2.map(d=>d.EOLICA)),      color:'#5DFF97' },
          { name:'SOLAR',       data: toMW(data2.map(d=>d.SOLAR)),       color:'#FFC800' }
        ];
        const max2 = Math.ceil(stackedMax(series2, horas2.length)*1.1);

        const variantOptions = {
          ...baseOptions,
          title: { text:'Curva de generación últimos 6 meses' },
          xAxis: { ...baseOptions.xAxis, categories: horas2 },
          yAxis: { ...baseOptions.yAxis, max: max2, tickInterval: Math.ceil(max2/5) },
          series: series2
        };

        setOpts2(variantOptions);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-white p-6">Cargando gráfica…</div>;
  if (error)   return <div className="text-red-400 p-6">Error: {error}</div>;

  return (
    <section className="mt-8">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">
        Curva de generación horaria promedio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm">
          <HighchartsReact highcharts={Highcharts} options={opts1} />
        </div>
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm">
          <HighchartsReact highcharts={Highcharts} options={opts2} />
        </div>
      </div>
    </section>
  );
}




export default GeneracionHoraria;





