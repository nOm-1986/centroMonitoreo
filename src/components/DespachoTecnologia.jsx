import React, { useRef } from 'react';
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
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: '#262626'
  },
  title: { style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' } },
  subtitle: { style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  yAxis: [
    {
      labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
      title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
      gridLineColor: '#333'
    },
    {
      labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
      title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
      opposite: true,
      gridLineColor: '#333'
    }
  ],
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#262626',
    style: { color: '#fff', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    shared: true
  }
});

export function DespachoTecnologia() {
  const chartRef = useRef(null);

  // Etiquetas de fechas (trimestrales de ene‑2020 a oct‑2028)
  const categories = [
    'ene-2020','abr-2020','jul-2020','oct-2020',
    'ene-2021','abr-2021','jul-2021','oct-2021',
    'ene-2022','abr-2022','jul-2022','oct-2022',
    'ene-2023','abr-2023','jul-2023','oct-2023',
    'ene-2024','abr-2024','jul-2024','oct-2024',
    'ene-2025','abr-2025','jul-2025','oct-2025',
    'ene-2026','abr-2026','jul-2026','oct-2026',
    'ene-2027','abr-2027','jul-2027','oct-2027',
    'ene-2028','abr-2028','jul-2028','oct-2028'
  ];

  // Datos de ejemplo: reemplaza con tus valores reales
  const capacidadData = [
    120, 130, 125, 140, 150, 160, 170, 180,
    200, 210, 220, 230, 250, 300, 350, 400,
    450, 500, 550, 600, 650, 700, 800, 1000,
    1500, 1800, 2000, 2100, 2200, 2300, 2400, 2500,
    2600, 2700
  ];
  const proyectosData = [
    5, 6, 6, 7, 7, 8, 8, 9,
    9, 10, 12, 14, 16, 18, 20, 22,
    25, 30, 35, 40, 45, 50, 60, 75,
    90, 100, 110, 120, 130, 140, 150, 160,
    170, 180
  ];

  const options = {
    chart: { 
      type: 'area', 
      height: 450, 
      zoomType: '',
      backgroundColor: '#262626',
      plotBackgroundColor: '#262626'
    },
    title: { text: 'Capacidad instalada / No. de proyectos histórica y proyectada' },
    subtitle: { text: 'Fuente: XM. 2020-2028' },
    xAxis: { categories },
    yAxis: [
      { title: { text: 'Capacidad Instalada (GW)' } },
      { title: { text: 'Número de proyectos' }, opposite: true }
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'top' },
    //exporting: { enabled: true, buttons: { contextButton: { menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'] } } },
    series: [
      { name: 'Capacidad instalada', data: capacidadData, yAxis: 0, color: '#FFC800', fillOpacity: 0.5 },
      { name: 'Número de proyectos', data: proyectosData, yAxis: 1, type: 'line', color: '#FF9900' }
    ],
    responsive: {
      rules: [{
        condition: { maxWidth: 600 },
        chartOptions: { legend: { layout: 'vertical', align: 'center', verticalAlign: 'bottom' } }
      }]
    }
  };

  return (
    <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default DespachoTecnologia;