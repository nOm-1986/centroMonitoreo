// src/components/CurvaSCurva.jsx
import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// cargar módulos
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
    plotBackgroundColor: 'transparent',
  },
  title: {
    style: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      fontFamily: 'Nunito Sans, sans-serif'
    }
  },
  subtitle: {
    style: {
      color: '#aaa',
      fontSize: '12px',
      fontFamily: 'Nunito Sans, sans-serif'
    }
  },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    shared: true
  }
});

export function CurvaS({ projectName = 'Proyecto 01' }) {
  const chartRef = useRef(null);

  // categorías de % avance
  const categories = [
    '0 %','5 %','10 %','15 %','20 %','25 %','30 %','35 %','40 %','45 %',
    '50 %','55 %','60 %','65 %','70 %','75 %','80 %','85 %','90 %','95 %','100 %'
  ];

  // datos de ejemplo: reemplaza con los tuyos
  const programado = [0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 27, 29, 30, 31, 31.5, 31.8, 31.9, 32, 32, 32];
  const cumplido   = [0, 0.5, 1, 2, 3, 5, 7, 11, 15, 19, 23, 26, 28, 29, 30, 30.5, 30.8, 30.9, 31, 31.2, 31.5];

  const options = {
    chart: { type: 'spline', height: 360, zoomType: '' },
    title: {
      text: `Curva S – % de avance – Programado vs cumplido, ${projectName}`
    },
    subtitle: {
      text: 'Fuente: XM. 2020-2024'
    },
    xAxis: {
      categories,
      title: { text: '% avance' }
    },
    yAxis: {
      title: { text: '% completado' }
    },
    plotOptions: {
      spline: {
        marker: { enabled: true }
      }
    },
    series: [
      {
        name: 'Programado',
        data: programado,
        color: '#5DA1FF',       // azul claro
        marker: { symbol: 'circle' }
      },
      {
        name: 'Cumplido',
        data: cumplido,
        color: '#B8FF65',       // verde lima
        marker: { symbol: 'circle' }
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
  };

  return (
    <section className="mt-8">
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow-sm relative">
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
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </section>
  );
}

export default CurvaS;