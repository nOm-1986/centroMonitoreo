import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Configuración de gráficas ANLA
const resumenANLAOptions = {
    chart: {
        type: 'column',
        backgroundColor: '#262626',
        spacing: [10, 10, 30, 10]
      },
    title: {
      text: 'Licencias FNCER otorgadas desde 07/08/2022 hasta la fecha',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      categories: ['2022', '2023', '2024', '2025'],
      tickPositions: [0, 1, 2, 3],
      title: {
        text: 'Año',
        style: { fontWeight: 'bold', color: '#ccc' }
      },
      labels: {
        enabled: true,
        step: 1,
        autoRotation: false,
        rotation: 0,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#eee'
        }
      },
      gridLineColor: '#333',
      lineColor: '#444'
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Cantidad de Licencias FNCER otorgadas',
        style: { fontWeight: 'bold', color: '#ccc' }
      },
      labels: {
        style: { fontSize: '12px', color: '#ddd' }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: '#fff',
          textOutline: 'none'
        }
      },
      gridLineColor: '#333'
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      x: -30,
      y: 25,
      floating: true,
      backgroundColor: '#1f1f1f',
      borderColor: '#555',
      borderWidth: 1,
      itemStyle: {
        color: '#ccc',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      style: { color: '#fff' },
      headerFormat: '<b>{category}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      useHTML: true
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            color: '#fff',
            fontWeight: 'bold',
            textOutline: 'none'
          }
        }
      }
    },
    series: [
      {
        name: 'Eólico',
        data: [1, 1, 0, 0],
        color: '#5DFF97'
      },
      {
        name: 'Fotovoltaico',
        data: [4, 3, 4, 5],
        color: '#FFC800'
      },
      {
        name: 'LT',
        data: [2, 6, 4, 3],
        color: '#228B22'
      }
    ],
    credits: { enabled: false }
  };

const seriesData = [
  {
    name: 'La Guajira',
    data: [
      { name: '2018', y: 240.0, color: '#0B6623' },
      { name: '2019', y: 346.5, color: '#32CD32' },
      { name: '2020', y: 200.0, color: '#39FF14' },
      { name: '2021', y: 571.2, color: '#228B22' },
      { name: '2022', y: 571.2, color: '#3CB371' },
      { name: '2023', y: 100.0, color: '#2E8B57' }
    ]
  },
  {
    name: 'Santander',
    data: [
      { name: '2019', y: 100.5, color: '#0B6623' },
      { name: '2022', y: 200.0, color: '#32CD32' },
      { name: '2023', y: 360.0, color: '#39FF14' },
      { name: '2024', y: 200.0, color: '#228B22' }
    ]
  },
  {
    name: 'Atlántico',
    data: [
      {name:'2021', y: 599.5, color:'#0B6623'},
      {name:'2022', y: 200.0, color:'#32CD32'}
    ]
  },
  {
    name: 'Cesar',
    data: [
      { name: '2019', y: 250.4, color: '#0B6623' },
      { name: '2021', y: 101.0, color: '#32CD32' },
      { name: '2023', y: 240.0, color: '#39FF14' },
      { name: '2025', y: 200.0, color: '#228B22' }
    ]
  },
  {
    name: 'Cundinamarca',
    data: [
      { name: '2022', y: 300.0, color: '#0B6623' },
      { name: '2023', y: 100.0, color: '#32CD32' }
    ]
  },
  {
    name: 'Córdoba - Sucre',
    data: [
      { name: '2025', y: 350.0, color: '#0B6623' }
    ]
  },
  {
    name: 'Córdoba',
    data: [
      { name: '2024', y: 200.0, color: '#0B6623' },
      { name: '2025', y: 135.0, color: '#32CD32' }
    ]
  },
  {
    name: 'Otros',
    data: [
      { name: '2021', y: 121.3, color: '#0B6623' },
      { name: '2022', y: 360.0, color: '#32CD32' },
      { name: '2024', y: 250.0, color: '#39FF14' },
      { name: '2025', y: 400.0, color: '#228B22' }
    ]
  }
];

const getChartOptions = (serie, index) => ({
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626'
  },
  title: {
    text: serie.name,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: 0,
      step: 1,
      style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'MW Licenciados', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    gridLineWidth: 1,
    labels: { style: { fontSize: '12px', color: '#eee' } },
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      borderRadius: 4,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{point.y}',
        style: { fontWeight: 'bold', color: '#fff' },
        y: -20
      },
      pointPadding: 0.1,
      groupPadding: 0.1
    }
  },
  series: [{
    name: serie.name,
    data: serie.data
  }]
});

const datosTiempos = [
  { name: 'Cundinamarca', dias: 199 },
  { name: 'Otros', dias: 206 },
  { name: 'La Guajira', dias: 219 },
  { name: 'Atlántico', dias: 221 },
  { name: 'Córdoba', dias: 255 },
  { name: 'Cesar', dias: 287 },
  { name: 'Santander', dias: 288 },
  { name: 'Córdoba - Sucre', dias: 476 }
];

const viridisPalette = [
  '#440154', '#463276', '#366c8d', '#277f8e',
  '#1fa187', '#4ac16d', '#a0da39', '#fde725'
];

const tiempoPromedioANLAOptions = {
  chart: {
    type: 'bar',
    backgroundColor: '#262626',
    style: {
      ffontFamily: 'Nunito Sans, Segoe UI, sans-serif'
    },
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'Tiempo Promedio de Aprobación de Licencias por Departamento',
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  subtitle: {
    text: 'Desde la fecha de inicio hasta la fecha de la licencia',
    style: {
      fontSize: '14px',
      color: '#ccc'
    }
  },
  xAxis: {
    categories: datosTiempos.map(i => i.name),
    tickPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    labels: {
      enabled: true,
      step: 1,
      autoRotation: false,
      rotation: 0,
      style: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#eee'
      }
    },
    gridLineColor: '#333',
    lineColor: '#444'
  },
  yAxis: {
    title: { text: null },
    labels: {
      style: {
        color: '#eee',
        fontSize: '12px'
      }
    },
    gridLineColor: '#388'
  },
  tooltip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#338',
    style: { color: '#fff' },
    valueSuffix: 'dias',
    pointFormat: 'Promedio de aprobación: <b>{point.y}</b>',
    useHTML: true
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      dataLabels: {
        enabled: true,
        format: '{point.y} dias',
        color: '#fff',
        inside: true,
        align: 'right',
        style: {
          fontWeight: 'bold',
          fontSize: '12px',
          textOutline: 'none'
        }
      }
    }
  },
  series: [{
    name: "Tiempo Promedio de Aprobación (Días)",
    data: datosTiempos.map((item, index) => ({
      name: item.name,
      y: item.dias,
      color: viridisPalette[index]
    }))
  }],
  credits: {
    enabled: true,
    text: 'Fuente: ANLA - Datos procesados por la UPME',
    style: {
      fontSize: '10px',
      color: '#999'
    }
  },
  legend: { enabled: false }
};

export default function GraficaANLA() {
  return (
    <div className="space-y-6 rounded-lg">
      {/* Gráfico Resumen ANLA */}
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Esta gráfica muestra las licencias FNCIER otorgadas por año y tecnología.')}
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
        <HighchartsReact highcharts={Highcharts} options={resumenANLAOptions} />
      </div>
      
      {/* Gráficos por departamento */}
      <h2 className="text-xl font-semibold mb-4 text-white">
        Evolución de la capacidad instalada licenciada por Departamento
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {seriesData.map((serie, index) => (
          <div key={index} className="bg-[#262626] rounded-lg border border-[#666666] h-[420px] p-1  relative">
            <button
          className="absolute top-[13px] right-[48px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert(`Gráfica de ${serie.name}: Muestra la capacidad instalada licenciada en MW por año.`)}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
            <HighchartsReact highcharts={Highcharts} options={getChartOptions(serie, index)} />
          </div>
        ))}
      </div>
      
      {/* Gráfico de tiempos promedio */}
      <div className="bg-[#262626] rounded-lg border border-[#666666] relative p-2">
        <button
          className="absolute top-[4%] right-[52px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Muestra el tiempo promedio en días que tarda la aprobación de licencias por departamento.')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
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
        <HighchartsReact highcharts={Highcharts} options={tiempoPromedioANLAOptions} />
      </div>
    </div>
  );
}