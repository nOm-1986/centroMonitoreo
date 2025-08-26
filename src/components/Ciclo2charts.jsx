import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Configurar miles y decimales al estilo español
Highcharts.setOptions({
  lang: {
    decimalPoint: ',',
    thousandsSep: '.'
  }
});

// Datos y opciones para Ciclo 2
const proyectosDeptoC2Options = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626',
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'DISTRIBUCIÓN DE PROYECTOS POR DEPARTAMENTO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: 'Total proyectos: <b>1.718</b>',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    lineColor: '#444',
    gridLineColor: '#333',
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -90,
      step: 1,
      style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Cantidad de Proyectos', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    labels: { style: { fontSize: '12px', color: '#eee' } },
    gridLineColor: '#333'
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      colorByPoint: true,
      borderRadius: 3,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() { return Highcharts.numberFormat(this.y, 0, ',', '.'); },
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
      { name: 'CESAR', y: 143, color: '#39FF14' },
      { name: 'CORDOBA', y: 143, color: '#0B6623' },
      { name: 'SANTANDER', y: 131, color: '#7FFF00' },
      { name: 'VALLE_DEL_CAUCA', y: 127, color: '#228B22' },
      { name: 'BOLIVAR', y: 123, color: '#39FF14' },
      { name: 'ANTIOQUIA', y: 116, color: '#0B6623' },
      { name: 'TOLIMA', y: 112, color: '#7FFF00' },
      { name: 'ATLANTICO', y: 107, color: '#228B22' },
      { name: 'HUILA', y: 102, color: '#39FF14' },
      { name: 'SUCRE', y: 99, color: '#0B6623' },
      { name: 'LA_GUAJIRA', y: 83, color: '#7FFF00' },
      { name: 'MAGDALENA', y: 80, color: '#228B22' },
      { name: 'NORTE_DE_SANTANDER', y: 76, color: '#39FF14' },
      { name: 'CUNDINAMARCA', y: 57, color: '#0B6623' },
      { name: 'CALDAS', y: 54, color: '#7FFF00' },
      { name: 'BOYACA', y: 42, color: '#228B22' },
      { name: 'META', y: 30, color: '#39FF14' },
      { name: 'RISARALDA', y: 28, color: '#0B6623' },
      { name: 'CASANARE', y: 22, color: '#7FFF00' },
      { name: 'CAUCA', y: 13, color: '#228B22' },
      { name: 'ARAUCA', y: 10, color: '#39FF14' },
      { name: 'QUINDIO', y: 8, color: '#0B6623' },
      { name: 'BOGOTA', y: 6, color: '#7FFF00' },
      { name: 'NARINO', y: 4, color: '#228B22' },
      { name: 'CHOCO', y: 2, color: '#39FF14' }
    ]
  }]
};

const proyectosEstadoC2Options = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626'
  },
  title: {
    text: 'PROYECTOS POR ESTADO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Distribución de proyectos según su estado actual<br>Los conceptos aprobados son Autogeneración',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    lineColor: '#444',
    gridLineColor: '#333',
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
    max: 1800,
    tickInterval: 200,
    labels: { style: { fontSize: '12px', color: '#eee' } },
    gridLineColor: '#333'
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
      { name: 'Cto aprobado', y: 4, color: '#0B6623' },
      { name: 'Desistido',          y: 168, color: '#32CD32' },
      { name: 'En evaluación',      y: 1458, color: '#39FF14' },
      { name: 'Retirado',           y: 88, color: '#228B22' },
      { name: 'TOTAL',              y: 1718, color: '#005A28' }
    ]
  }]
};

const capacidadDeptoC2Data = [
  { name: 'CORDOBA', y: 13664.6,  color: '#39FF14' },
  { name: 'SANTANDER', y: 10271.27, color: '#0B6623' },
  { name: 'LA GUAJIRA', y: 9290.7,  color: '#7FFF00' },
  { name: 'CESAR', y: 9010.83,      color: '#228B22' },
  { name: 'ANTIOQUIA', y: 6065.53,  color: '#39FF14' },
  { name: 'BOLIVAR', y: 5896.42,    color: '#0B6623' },
  { name: 'CAUCA', y: 5088.6,       color: '#7FFF00' },
  { name: 'VALLE DEL CAUCA', y: 5066.1, color: '#228B22' },
  { name: 'TOLIMA', y: 4342.0,      color: '#39FF14' },
  { name: 'NORTE DE SANTANDER', y: 3831.68, color: '#0B6623' },
  { name: 'SUCRE', y: 3706.2,       color: '#7FFF00' },
  { name: 'ATLANTICO', y: 3400.4,   color: '#228B22' },
  { name: 'CUNDINAMARCA', y: 3348.4, color: '#39FF14' },
  { name: 'CALDAS', y: 3213.08,     color: '#0B6623' },
  { name: 'HUILA', y: 3082.79,      color: '#7FFF00' },
  { name: 'MAGDALENA', y: 2181.66,  color: '#228B22' },
  { name: 'RISARALDA', y: 2146.8,   color: '#39FF14' },
  { name: 'BOYACA', y: 1646.7,      color: '#0B6623' },
  { name: 'META', y: 1514.99,       color: '#7FFF00' },
  { name: 'ARAUCA', y: 641.6,       color: '#228B22' },
  { name: 'CASANARE', y: 556.1,     color: '#39FF14' },
  { name: 'NARINO', y: 366.9,       color: '#0B6623' },
  { name: 'QUINDIO', y: 229.3,      color: '#7FFF00' },
  { name: 'BOGOTA', y: 173.08,      color: '#228B22' },
  { name: 'CHOCO', y: 132.5,        color: '#39FF14' }
];
const totalCapacidadC2 = capacidadDeptoC2Data.reduce((sum, pt) => sum + pt.y, 0);

const capacidadDeptoC2Options = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626',
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'CAPACIDAD INSTALADA POR DEPARTAMENTO - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }
  },
  subtitle: {
    text: `Total de capacidad instalada: <b>${Highcharts.numberFormat(totalCapacidadC2, 1, ',', '.')} MW</b>`,
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    lineColor: '#444',
    gridLineColor: '#333',
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -90,
      step: 1,
      style: { fontSize: '11px', fontWeight: 'bold', color: '#eee' }
    },
    crosshair: true
  },
  yAxis: {
    title: { text: 'Capacidad (MW)', style: { fontWeight: 'bold', color: '#ccc' } },
    min: 0,
    labels: {
      formatter() { return Highcharts.numberFormat(this.value, 1, ',', '.'); },
      style: { fontSize: '12px', color: '#eee' }
    },
    gridLineColor: '#333'
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      colorByPoint: true,
      borderRadius: 3,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() { return Highcharts.numberFormat(this.y, 1, ',', '.'); },
        style: { fontWeight: 'bold', fontSize: '11px', color: '#fff', textOutline: 'none' },
        y: -5
      },
      pointPadding: 0.1,
      groupPadding: 0.1
    }
  },
  series: [{
    name: 'Capacidad Instalada (MW)',
    data: capacidadDeptoC2Data
  }]
};

const capacidadEstadoC2Options = {
  chart: {
    type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626',
    spacing: [10, 10, 30, 10]
  },
  title: {
    text: 'DISTRIBUCIÓN DE CAPACIDAD - CICLO 2',
    style: { fontSize: '22px', fontWeight: 'bold', color: '#fff' }
  },
  subtitle: {
    text: 'Total capacidad: <b>99.035,23 MW</b><br>Los conceptos aprobados son Autogeneración',
    useHTML: true,
    style: { fontSize: '14px', color: '#ccc' }
  },
  xAxis: {
    type: 'category',
    tickInterval: 1,
    lineColor: '#444',
    gridLineColor: '#333',
    title: { text: '', style: { fontWeight: 'bold', color: '#ccc' } },
    labels: {
      rotation: -30,
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
    },
    gridLineColor: '#333'
  },
  legend: { enabled: false },
  plotOptions: {
    column: {
      borderRadius: 4,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter() { return Highcharts.numberFormat(this.y, 2, ',', '.'); },
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
      { name: 'Cto aprobado', y: 90.80,    color: '#0B6623' },
      { name: 'Desistido',          y: 11801.90, color: '#7FFF00' },
      { name: 'En evaluación',      y: 81802.32, color: '#39FF14' },
      { name: 'Retirado',           y: 5173.21,  color: '#228B22' },
      { name: 'TOTAL',              y: 98868.23, color: '#005A28' }
    ]
  }]
};

export default function Ciclo2Charts() {
  return (
    <div className="p-4 bg-[#262626] rounded-lg">
      {/* Distribución Proyectos por Departamento */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoC2Options} />
      </div>
      <hr className="border-t border-[#666666] my-6"/>

      {/* Proyectos por Estado */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoC2Options} />
      </div>
      <hr className="border-t border-[#666666] my-6"/>

      {/* Capacidad Instalada por Departamento */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoC2Options} />
      </div>
      <hr className="border-t border-[#666666] my-6"/>

      {/* Distribución de Capacidad por Estado */}
      <div className="w-full h-120 p-4 bg-[#262626] rounded-sm shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoC2Options} />
      </div>
    </div>
  );
}
