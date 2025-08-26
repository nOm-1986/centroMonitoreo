import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Configuración: Distribución de Proyectos por Departamento (Ciclo 1)
const proyectosDeptoOptions = {
  chart: { type: 'column', 
  backgroundColor: '#262626',   
  borderWidth: 1, 
  borderColor: '#262626',     
  plotBorderWidth: 1,      
  plotBorderColor: '#262626' },

  title: {
    text: 'DISTRIBUCIÓN DE PROYECTOS POR DEPARTAMENTO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total proyectos: <b>596</b>',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,                   // fuerza cada categoría
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -90,
      step: 1,                         // asegura que no salte ninguno
      style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' },
      formatter() { return this.value.replace(/_/g, ' '); }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Número de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    tickInterval: 10,
    gridLineWidth: 1,
    labels: { style: { fontSize: '12px', color: '#eee' } }
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      colorByPoint: true,
      borderRadius: 3,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() { return this.y; },
        style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
        y: -5
      },
      pointPadding: 0.1,
      groupPadding: 0.1
    }
  },
  series: [{
    name: 'Proyectos',
    data: [
      ['TOLIMA', 55], ['CESAR', 47], ['BOLIVAR', 39], ['ANTIOQUIA', 37],
      ['ATLANTICO', 35], ['SANTANDER', 29], ['HUILA', 26], ['MAGDALENA', 24],
      ['BOYACA', 24], ['NORTE_DE_SANTANDER', 22], ['LA_GUAJIRA', 21],
      ['RISARALDA', 19], ['CORDOBA', 19], ['VALLE_DEL_CAUCA', 17],
      ['CASANARE', 16], ['SUCRE', 16], ['CALDAS', 14], ['META', 5],
      ['CUNDINAMARCA', 5], ['CAUCA', 2], ['BOGOTA', 2], ['NARINO', 2],
      ['ARAUCA', 1]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
    ]
  }]
};

// Configuración: Proyectos por Estado (Ciclo 1)
const proyectosEstadoOptions = {
  chart: { type: 'column', 
  backgroundColor: '#262626',   
  borderWidth: 1, 
  borderColor: '#262626',     
  plotBorderWidth: 1,      
  plotBorderColor: '#262626' },

  title: {
    text: 'PROYECTOS POR ESTADO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Distribución de proyectos según su estado actual',
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -45,
      step: 1,
      style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Número de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    gridLineWidth: 1,
    labels: { style: { fontSize: '12px', color: '#eee' } }
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
    name: 'Proyectos',
    data: [
      { name: 'Cto Aprobado', y: 148, color: '#0B6623' },
      { name: 'Cto Negado',    y: 356, color: '#32CD32' },
      { name: 'Desistido',           y: 27,  color: '#39FF14' },
      { name: 'En operación',        y: 2,   color: '#228B22' },
      { name: 'En val. Completitud', y: 0, color: '#006400' },
      { name: 'Liberado',            y: 45,  color: '#3CB371' },
      { name: 'Retirado',            y: 15,  color: '#2E8B57' },
      { name: 'TOTAL',               y: 593, color: '#005A28' }
    ]
  }]
};

// Configuración: Capacidad Instalada por Departamento (Ciclo 1)
const capacidadDeptoOptions = {
  chart: { type: 'column', 
  backgroundColor: '#262626',   
  borderWidth: 1, 
  borderColor: '#262626',     
  plotBorderWidth: 1,      
  plotBorderColor: '#262626' },

  title: {
    text: 'CAPACIDAD POR DEPARTAMENTO - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: 'Total capacidad: <b>39.441 MW</b>',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -90,
      step: 1,
      style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' },
      formatter() { return this.value.replace(/_/g, ' '); }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    labels: {
      formatter() { return Highcharts.numberFormat(this.value, 0, ',', '.'); },
      style: { fontSize: '12px', color: '#eee' }
    },
    gridLineWidth: 1
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      colorByPoint: true,
      borderRadius: 3,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() { return Highcharts.numberFormat(this.y, 1); },
        style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
        y: -5
      },
      pointPadding: 0.1,
      groupPadding: 0.1
    }
  },
  series: [{
    name: 'Capacidad (MW)',
    data: [
      ['LA_GUAJIRA', 4760.3], ['BOLIVAR', 4185.1], ['CESAR', 2977.86],
      ['TOLIMA', 2735.55], ['SANTANDER', 2229.37], ['MAGDALENA', 1792.7],
      ['CORDOBA', 1636.0], ['ATLANTICO', 1447.7], ['ANTIOQUIA', 1347.63],
      ['RISARALDA', 1117.37], ['NORTE_DE_SANTANDER', 994.0], ['CASANARE', 897.1],
      ['HUILA', 809.4], ['VALLE_DEL_CAUCA', 754.42], ['BOYACA', 738.32],
      ['CALDAS', 623.69], ['SUCRE', 491.9], ['CUNDINAMARCA', 384.8],
      ['META', 339.8], ['ARAUCA', 30.0], ['CAUCA', 27.4], ['BOGOTA', 24.88], ['NARINO', 15.6]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
    ]
  }]
};

// Configuración: Distribución de Capacidad por Estado (Ciclo 1)
const capacidadEstadoOptions = {
  chart: { type: 'column', backgroundColor: '#262626' },
  title: {
    text: 'DISTRIBUCIÓN DE CAPACIDAD - CICLO 1',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total capacidad: <b>39.441,4 MW</b>',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -45,
      step: 1,
      style: { fontSize: '12px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    labels: {
      formatter() { return Highcharts.numberFormat(this.value, 0, ',', '.'); },
      style: { fontSize: '12px', color: '#eee' }
    }
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      borderRadius: 4,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() {
          // usa 1 decimal sólo en el TOTAL (índice 7)
          return Highcharts.numberFormat(this.y, this.point.index === 7 ? 1 : 2, ',', '.');
        },
        style: { fontWeight: 'bold', fontSize: '12px', color: '#fff' },
        y: -20
      },
      pointPadding: 0.1,
      groupPadding: 0.15
    }
  },
  series: [{
    name: 'Capacidad (MW)',
    data: [
      { name: 'Cto aprobado', y: 6082.74, color: '#0B6623' },
      { name: 'Cto negado',   y: 27158.94, color: '#7FFF00' },
      { name: 'Desistido',          y: 881.49, color: '#39FF14' },
      { name: 'En operación',       y: 17.0,   color: '#228B22' },
      { name: 'En val. completitud', y: 0,  color: '#00843D' },
      { name: 'Liberado',           y: 2774.23, color: '#32CD32' },
      { name: 'Retirado',           y: 1627.49, color: '#006400' },
      { name: 'TOTAL',              y: 39441.89, color: '#005A28' }
    ]
  }]
};

export default function Ciclo1Charts() {
  return (
    <div className="p-4 bg-[#262626] rounded-lg">
      {/* Primer bloque */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoOptions} />
      </div>

      {/* Separador */}
      <hr className="border-t border-[#666666] my-6" />

      {/* Segundo bloque */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoOptions} />
      </div>

      <hr className="border-t border-[#666666] my-6" />

      {/* Tercer bloque */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoOptions} />
      </div>

      <hr className="border-t border-[#666666] my-6" />

      {/* Cuarto bloque */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoOptions} />
      </div>
    </div>
    
  );
}
