// src/components/GraficaAcumuladoCapacidadProyectos.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

export function GraficaAcumuladoCapacidadProyectos() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
          // No requiere body
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data: [{ nombre_proyecto, fecha_finalizacion, capacidad_acumulada, tipo_proyecto_fuente, numero_proyectos }, ...]
        // Agrupamos por tipo_proyecto_fuente
        const fuentesMap = {};
        data.forEach((d) => {
          if (!fuentesMap[d.tipo_proyecto_fuente]) {
            fuentesMap[d.tipo_proyecto_fuente] = { acumulado: 0, cantidad: 0 };
          }
          fuentesMap[d.tipo_proyecto_fuente].acumulado += d.capacidad_acumulada;
          fuentesMap[d.tipo_proyecto_fuente].cantidad += d.numero_proyectos;
        });
        const categories = Object.keys(fuentesMap);
        const dataAcumulado = categories.map((f) => fuentesMap[f].acumulado);
        const dataNumProyectos = categories.map((f) => fuentesMap[f].cantidad);

        setOptions({
          chart: { type: 'column', height: 350 },
          title: { text: 'Capacidad acumulada / No. de proyectos por fuente' },
          subtitle: { text: 'Fuente: API. Sin rango (todos los proyectos)' },
          xAxis: { categories, title: { text: 'Tipo de proyecto / Fuente' } },
          yAxis: [
            {
              title: { text: 'Capacidad acumulada (MW)' },
              labels: { style: { color: '#FFC800' } },
              gridLineColor: '#333333'
            },
            {
              title: { text: 'Número de proyectos' },
              opposite: true,
              labels: { style: { color: '#4CAF50' } },
              gridLineColor: '#333333'
            }
          ],
          series: [
            {
              name: 'Capacidad acumulada (MW)',
              data: dataAcumulado,
              type: 'column',
              yAxis: 0,
              color: '#FFC800'
            },
            {
              name: 'Número de proyectos',
              data: dataNumProyectos,
              type: 'line',
              yAxis: 1,
              color: '#4CAF50'
            }
          ],
      /*     exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
              }
            }
          } */
        });
      } catch (err) {
        console.error(err);
        setError('No fue posible cargar la gráfica de acumulado de capacidad.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
       <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm flex flex-col items-center justify-center h-64">
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
        <p className="text-gray-300">Cargando gráfica de acumulado de capacidad...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm relative">
      {/* Botón de ayuda superpuesto */}
      <button
        className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
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
            y="16"
            textAnchor="middle"
            fontSize="16"
            fill="#fff"
            fontWeight="bold"
            fontFamily="Nunito Sans, sans-serif"
            pointerEvents="none"
          >?</text>
        </svg>
      </button>
      {/* Gráfica */}
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaAcumuladoCapacidadProyectos;
