// src/components/CapacidadHistorica.jsx
import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Configuración global del tema oscuro + Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' },
    plotBorderWidth: 0,
    plotBackgroundColor: 'transparent'
  },
  title: {
    style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif', fontWeight: '600' }
  },
  subtitle: {
    style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' }
  },
  xAxis: {
    type: 'datetime',
    labels: {
      style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' },
      rotation: -45,
      format: '{value:%Y-%m-%d}'
    },
    title: {
      style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 'normal' },
      text: 'Fecha'
    },
    gridLineColor: '#333',
    tickInterval: 30 * 24 * 3600 * 1000 // un mes
  },
  yAxis: {
    labels: {
      style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' }
    },
    title: {
      style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 'normal' }
    },
    gridLineColor: '#333',
    min: 0
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    shared: true,
    xDateFormat: '%Y-%m-%d',
    valueSuffix: ' MW'
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: { hover: { enabled: true } }
      },
      lineWidth: 1.5
    }
  }
});

export function CapacidadHistorica() {
  const chartRef = useRef(null);

  // Fecha de corte para la proyección: 27 de mayo de 2025
  const projectionCutoffDate = Date.UTC(2025, 4, 27);

  // Datos FNCER para 2025 - Capacidad Instalada (MW)
  const fncerData = [
    {
      name: 'Solar',
      data: [
        [Date.UTC(2025, 0, 1), 168],
        [Date.UTC(2025, 1, 1), 221],
        [Date.UTC(2025, 2, 1), 105],
        [Date.UTC(2025, 3, 1), 188],
        [Date.UTC(2025, 4, 1), 92],
        [Date.UTC(2025, 5, 1), 240],
        [Date.UTC(2025, 6, 1), 135],
        [Date.UTC(2025, 7, 1), 203],
        [Date.UTC(2025, 8, 1), 118],
        [Date.UTC(2025, 9, 1), 176],
        [Date.UTC(2025, 10, 1), 233],
        [Date.UTC(2025, 11, 1), 159]
      ],
      color: '#deed1b',
      zoneAxis: 'x',
      zones: [
        { value: projectionCutoffDate },
        {
          color: 'rgba(222, 237, 27, 0.7)',
          fillColor: 'rgba(222, 237, 27, 0.3)'
        }
      ],
      fillOpacity: 0.5
    },
    {
      name: 'Eólica',
      data: [
        [Date.UTC(2025, 0, 1), 133],
        [Date.UTC(2025, 1, 1), 78],
        [Date.UTC(2025, 2, 1), 185],
        [Date.UTC(2025, 3, 1), 102],
        [Date.UTC(2025, 4, 1), 155],
        [Date.UTC(2025, 5, 1), 68],
        [Date.UTC(2025, 6, 1), 193],
        [Date.UTC(2025, 7, 1), 115],
        [Date.UTC(2025, 8, 1), 170],
        [Date.UTC(2025, 9, 1), 88],
        [Date.UTC(2025, 10, 1), 143],
        [Date.UTC(2025, 11, 1), 199]
      ],
      color: '#183e34',
      zoneAxis: 'x',
      zones: [
        { value: projectionCutoffDate },
        {
          color: 'rgba(24, 62, 52, 0.7)',
          fillColor: 'rgba(24, 62, 52, 0.3)'
        }
      ],
      fillOpacity: 0.5
    },
    {
      name: 'Biomasa',
      data: [
        [Date.UTC(2025, 0, 1), 58],
        [Date.UTC(2025, 1, 1), 33],
        [Date.UTC(2025, 2, 1), 71],
        [Date.UTC(2025, 3, 1), 25],
        [Date.UTC(2025, 4, 1), 64],
        [Date.UTC(2025, 5, 1), 48],
        [Date.UTC(2025, 6, 1), 77],
        [Date.UTC(2025, 7, 1), 29],
        [Date.UTC(2025, 8, 1), 52],
        [Date.UTC(2025, 9, 1), 39],
        [Date.UTC(2025, 10, 1), 68],
        [Date.UTC(2025, 11, 1), 43]
      ],
      color: '#05d80a',
      zoneAxis: 'x',
      zones: [
        { value: projectionCutoffDate },
        {
          color: 'rgba(5, 216, 10, 0.7)',
          fillColor: 'rgba(5, 216, 10, 0.3)'
        }
      ],
      fillOpacity: 0.5
    }
  ];

  // Opciones para este Highcharts
  const options = {
    chart: {
      type: 'area',
      height: 600,
      zoomType: ''
    },
    title: {
      text: 'Capacidad Instalada de entrada de nuevos proyectos'
    },
    subtitle: {
      text: 'UPME'
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      layout: 'horizontal'
    },
    xAxis: {
      plotLines: [
        {
          color: 'red',
          dashStyle: 'Dash',
          value: projectionCutoffDate,
          width: 2,
          label: {
            text: 'Hoy',
            rotation: -90,
            align: 'left',
            textAlign: 'left',
            verticalAlign: 'top',
            x: -8,
            y: 17,
            style: {
              color: 'black',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 'bold'
            }
          },
          zIndex: 5
        }
      ]
    },
    yAxis: {
      title: {
        text: 'Capacidad Instalada (MW)',
        style: { fontWeight: 'bold', fontFamily: 'Nunito Sans, sans-serif' }
      },
      min: 0
    },
  /*   exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
        }
      }
    }, */
    series: fncerData,
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            legend: {
              layout: 'vertical',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }
      ]
    }
  };

  // Forzamos redraw en el montaje
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.reflow();
    }
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg border border-[#666666] shadow-sm">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default CapacidadHistorica;
