import React, { useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro global con Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: "Nunito Sans, sans-serif" },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent'
  },
  title: { style: { color: "#fff", fontSize: "16px", fontWeight: '600' } },
  subtitle: { style: { color: "#aaa", fontSize: "12px" } },
  xAxis: {
    labels: { style: { color: "#ccc", fontSize: "10px" } },
    title: { style: { color: "#ccc" } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: "#ccc", fontSize: "10px" } },
    title: { style: { color: "#ccc" } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#112937',
    style: { color: '#fff', fontSize: '12px' },
    formatter: function () {
      return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y}</b>`;
    }
  }
});

export function SeguimientoBarras() {
  const chartRef = useRef(null);
  const [view, setView] = useState('capacidad');
  
  // — CAPACIDAD Y PROYECTOS —
  const categories = [
    '0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30-35', '35-40', '40-45',
    '45-50', '50-55', '55-60', '60-65', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100'
  ];

  const capacidadData = [
    10, 10.4, 11, 11.4, 13.3, 15.8, 16.8, 18.4, 20,
    22, 24, 22, 20, 18.4, 16.8, 15.8, 13.3, 11.4, 11.1, 10.4
  ];

  const proyectosData = [
    1, 2, 1, 3, 5, 8, 9, 7, 6,
    12, 15, 14, 10, 8, 6, 5, 4, 3, 2, 1
  ];

  const options = {
    chart: { type: 'column', height: 360 },
    title: { text: 'No. de proyectos vs porcentaje de avance', style: { color: '#fff' } },
    subtitle: { text: 'Fuente: XM_2020-2024', style: { color: '#aaa' } },
    xAxis: {
      categories,
      title: { text: 'Porcentaje de avance', style: { color: '#ccc' } },
      tickInterval: 1,
      labels: {
        style: { color: '#ccc', fontSize: '10px' },
        rotation: -45,
        step: 1,
        autoRotation: false
      },
      gridLineColor: '#333'
    },
    yAxis: {
      title: {
        text: view === 'capacidad' ? 'Número de Proyectos' : 'Número de proyectos',
        style: { color: '#ccc' }
      },
      labels: { style: { color: '#ccc', fontSize: '10px' } },
      gridLineColor: '#333'
    },
    plotOptions: {
      column: {
        colorByPoint: false,
        color: '#FFC800'
      }
    },
    legend: {
        itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
      },
    series: [{
      name: view === 'capacidad' ? 'Proyectos' : 'Número de proyectos',
      data: view === 'capacidad' ? capacidadData : proyectosData
    }],
 /*    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
        }
      }
    } */
  };

  return (
    <section className="mt-6">
      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
          className={`pb-1 border-b-2 text-[18px] ${
            view === 'capacidad' ? 'border-[#FFC600] text-[#FFC600]' : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('capacidad')}
        >
          Capacidad instalada
        </button>
        <button
          className={`pb-1 border-b-2 text-[18px] ${
            view === 'proyectos' ? 'border-[#FFC600] text-[#FFC600]' : 'border-transparent text-gray-300'
          }`}
          onClick={() => setView('proyectos')}
        >
          Numero de proyectos
        </button>
      </div>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm relative">
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
        {/* Gráfica */}
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </section>
  );
}

export default SeguimientoBarras;