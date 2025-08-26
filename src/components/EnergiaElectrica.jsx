// src/components/EnergiaElectrica.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

// Cargar módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro con Nunito Sans y fondo #262626
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent',
  },
  title: { style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' } },
  subtitle: { style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333',
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333',
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' },
  },
  tooltip: {
    backgroundColor: '#262626',
    style: { color: '#fff', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' },
  }
});

export function EnergiaElectrica() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const [loading, setLoading] = useState(true); // ← Nuevo estado
  const [error, setError] = useState(null);
  const chartRefs = useRef([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    if (loading) {
      setError('Error al cargar la imagen: Energía Eléctrica, El servidor está tardando demasiado en responder.Por favor, inténtelo más tarde.');
      setLoading(false);
    }
  }, 20000); // 10 segundos

  return () => clearTimeout(timeoutId);
    async function fetchData() {
      setLoading(true); // ← Inicia loading
      try {
        const res = await fetch(`${API}/v1/graficas/energia_electrica`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ fecha_inicio: '2025-05-05', fecha_fin: '2025-05-06' })
        });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

        const data = await res.json();

        // --- Procesar datos como antes...
        const estatuto = data.grafica_estatuto;
        const fechas = estatuto.map(d => d.fecha);
        const volUtil = estatuto.map(d => d['Volumen útil del embalse']);

        const precios = data.grafica_precios;
        const preciosMin = precios.map(d => d['Precio Bolsa Minimo Horario']);
        const preciosAvg = precios.map(d => d['Precio Bolsa Promedio Horario']);
        const preciosMax = precios.map(d => d['Precio Bolsa Máximo Horario']);

        const dem = data.grafica_demanda;
        const demCom = dem.map(d => d['Demanda Comercial por Sistema']);
        const enerFirm = dem.map(d => d['Energía en Firme Cargo por Confiabilidad']);
        const obrFirm = dem.map(d => d['Obligación de Energía en Firme']);

        const demRel = data.grafica_demanda_relacion;
        const relOEF = demRel.map(d => d['Relacion Demanda Comercial / OEF']);
        const relEFICC = demRel.map(d => d['Relacion Demanda Comercial / EFICC']);

        const volReg = data.grafica_volumen_util_regiones;
        const regiones = volReg.map(d => d.region);
        const volRegData = volReg.map(d => d[Object.keys(d).find(k => k !== 'region')]);

        const capTec = data.grafica_capacidad_instalada_tecnologia;
        const fuentes = capTec.map(d => d.fuente);
        const capTecData = capTec.map(d => d[Object.keys(d).find(k => k !== 'fuente')]);

        const baseOptions = [
          {
            title: { text: 'Volumen útil del embalse (diario)' },
            subtitle: { text: 'Fuente: API. 2025-05-05 → 2025-05-06' },
            chart: { zoomType: '', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: fechas },
            yAxis: { title: { text: 'Volumen útil (m³)' } },
            series: [{ name: 'Volumen útil embalse', data: volUtil }]
          },
          {
            title: { text: 'Precios de Bolsa (horario)' },
            subtitle: { text: 'Fuente: API. 2025-05-05 → 2025-05-06' },
            chart: { zoomType: '', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: fechas },
            yAxis: { title: { text: 'Precio (COP)' } },
            series: [
              { name: 'Mínimo', data: preciosMin },
              { name: 'Promedio', data: preciosAvg },
              { name: 'Máximo', data: preciosMax }
            ]
          },
          {
            title: { text: 'Demanda vs energía en firme' },
            subtitle: { text: 'Fuente: API. 2025-05-05 → 2025-05-06' },
            chart: { zoomType: '', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: fechas },
            yAxis: { title: { text: 'Cantidad' } },
            series: [
              { name: 'Demanda Comercial', data: demCom },
              { name: 'Energía en Firme', data: enerFirm },
              { name: 'Obligación Energía Firme', data: obrFirm }
            ]
          },
          {
            title: { text: 'Relación Demanda / Firme' },
            subtitle: { text: 'Fuente: API. 2025-05-05 → 2025-05-06' },
            chart: { zoomType: '', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: fechas },
            yAxis: { title: { text: 'Ratio' } },
            series: [
              { name: 'Dem/ OEF', data: relOEF },
              { name: 'Dem/ EFICC', data: relEFICC }
            ]
          },
          {
            title: { text: 'Volumen útil por región (mes)' },
            chart: { type: 'column', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: regiones },
            yAxis: { title: { text: 'Volumen (m³)' } },
            series: [{ name: 'Volumen útil', data: volRegData }]
          },
          {
            title: { text: 'Capacidad instalada por tecnología' },
            chart: { type: 'column', height: 350 },
            colors: ['#FFC600', '#FFD700', '#FF9900'], // ← Aquí
            xAxis: { categories: fuentes },
            yAxis: { title: { text: 'Capacidad (GW)' } },
            series: [{ name: 'Capacidad inst.', data: capTecData }]
          }
        ];

        // Inyectamos el fondo gris en cada chart y los botones de exportar
        const opts = baseOptions.map(opt => ({
          ...opt,
          chart: {
            ...opt.chart,
            backgroundColor: '#262626'
          },
       /*    exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
              }
            }
          } */
        }));

        setCharts(opts);
      } catch (err) {
        console.error('Error cargando datos API', err);
      }  finally {
        setLoading(false); // ← Finaliza loading
      }

    }
    fetchData();
  }, [loading]);

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  if (loading) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded-sm border border-[#666666] shadow-sm flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
          ></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando energía eléctrica...</p>
      </div>
    );
  }
    if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm flex flex-col items-center justify-center h-[500px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-500 text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Energía eléctrica</h2>

      {/* Filtro externo */}
      <div className="mb-4">
        <select
          className="bg-[#262626] text-gray-200 p-2 rounded-sm border border-[#666666] font-sans"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Mostrar todos</option>
          {charts.map((c,i) => (
            <option key={i} value={String(i)}>
              {c.title.text}
            </option>
          ))}
        </select>
      </div>

      {/* Grid dinámico */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          const dynOpt = {
            ...opt,
            chart: { ...opt.chart, height: isFiltered ? 600 : opt.chart.height }
          };
          return (
            <div
              key={idx}
              className="bg-[#262626] p-4 rounded-sm border border-[#666666] shadow-sm relative"
            >
            {/*   <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >⛶</button> */}

              {/* Botón de ayuda */}
              <button
                className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
                style={{ width: 30, height: 30 }}
                title="Ayuda"
                onClick={() => alert('Ok Aquí puedes mostrar ayuda contextual o abrir un modal.')}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="rounded-full"
                >
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

              <HighchartsReact
                highcharts={Highcharts}
                options={dynOpt}
                ref={el => chartRefs.current[idx] = el}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}


