// SeguimientoCiclos.jsx
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import Accessibility from 'highcharts/modules/accessibility';
import HighchartsReact from "highcharts-react-official";

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);
Accessibility(Highcharts);

const capacidadDeptoC2Data = [
  { name: 'Cordoba', y: 13664.6,  color: '#39FF14' },
  { name: 'Santander', y: 10271.27, color: '#0B6623' },
  { name: 'La Guajira', y: 9290.7,  color: '#7FFF00' },
  { name: 'Cesar', y: 9010.83,      color: '#228B22' },
  { name: 'Antioquia', y: 6065.53,  color: '#39FF14' },
  { name: 'Bolivar', y: 5896.42,    color: '#0B6623' },
  { name: 'Cauca', y: 5088.6,       color: '#7FFF00' },
  { name: 'Valle Del Cauca', y: 5066.1, color: '#228B22' },
  { name: 'Tolima', y: 4342.0,      color: '#39FF14' },
  { name: 'Norte De Santander', y: 3831.68, color: '#0B6623' },
  { name: 'Sucre', y: 3706.2,       color: '#7FFF00' },
  { name: 'Atlantico', y: 3400.4,   color: '#228B22' },
  { name: 'Cundinamarca', y: 3348.4, color: '#39FF14' },
  { name: 'Caldas', y: 3213.08,     color: '#0B6623' },
  { name: 'Huila', y: 3082.79,      color: '#7FFF00' },
  { name: 'Magdalena', y: 2181.66,  color: '#228B22' },
  { name: 'Risaralda', y: 2146.8,   color: '#39FF14' },
  { name: 'Boyaca', y: 1646.7,      color: '#0B6623' },
  { name: 'Meta', y: 1514.99,       color: '#7FFF00' },
  { name: 'Arauca', y: 641.6,       color: '#228B22' },
  { name: 'Casanare', y: 556.1,     color: '#39FF14' },
  { name: 'Narino', y: 366.9,       color: '#0B6623' },
  { name: 'Quindio', y: 229.3,      color: '#7FFF00' },
  { name: 'Bogota', y: 173.08,      color: '#228B22' },
  { name: 'Choco', y: 132.5,        color: '#39FF14' }
];
const totalCapacidadC2 = capacidadDeptoC2Data.reduce((sum, pt) => sum + pt.y, 0);

const proyectosEstadoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'Proyectos por estado - Ciclo 1',
    align: 'left',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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

const capacidadEstadoOptions = {
  chart: { type: 'column', backgroundColor: '#262626' },
  title: {
    text: 'Distribución de capacidad - Ciclo 1',
    align: 'left',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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

const proyectosDeptoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'Distribución de proyectos por departamento - Ciclo 1',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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
      ['Tolima', 55], ['Cesar', 47], ['Bolivar', 39], ['Antioquia', 37],
      ['Atlantico', 35], ['Santander', 29], ['Huila', 26], ['Magdalena', 24],
      ['Boyaca', 24], ['Norte_De_Santander', 22], ['La_Guajira', 21],
      ['Risaralda', 19], ['Cordoba', 19], ['Valle_Del_Cauca', 17],
      ['Casanare', 16], ['Sucre', 16], ['Caldas', 14], ['Meta', 5],
      ['Cundinamarca', 5], ['Cauca', 2], ['Bogota', 2], ['Nariño', 2],
      ['Arauca', 1]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
    ]
  }]
};

const capacidadDeptoOptions = {
  chart: { type: 'column',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
    plotBorderWidth: 1,
    plotBorderColor: '#262626' },

  title: {
    text: 'Capacidad por departamento - Ciclo 1',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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
      ['La_Guajira', 4760.3], ['Bolivar', 4185.1], ['Cesar', 2977.86],
      ['Tolima', 2735.55], ['Santander', 2229.37], ['Magdalena', 1792.7],
      ['Cordoba', 1636.0], ['Atlantico', 1447.7], ['Antioquia', 1347.63],
      ['Risaralda', 1117.37], ['Norte_De_Santander', 994.0], ['Casanare', 897.1],
      ['Huila', 809.4], ['Valle_Del_Cauca', 754.42], ['Boyaca', 738.32],
      ['Caldas', 623.69], ['Sucre', 491.9], ['Cundinamarca', 384.8],
      ['Meta', 339.8], ['Arauca', 30.0], ['Cauca', 27.4], ['Bogota', 24.88], ['Nariño', 15.6]
    ],
    colors: [
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00','#228B22','#39FF14','#0B6623','#7FFF00','#228B22',
      '#39FF14','#0B6623','#7FFF00','#228B22','#39FF14','#0B6623',
      '#7FFF00'
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
    text: 'Proyectos por estado - Ciclo 2',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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
    text: 'Distribución de capacidad - Ciclo 2',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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
    text: 'Distribución de proyectos por departamento - Ciclo 2',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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
      { name: 'Cesar', y: 143, color: '#39FF14' },
      { name: 'Cordoba', y: 143, color: '#0B6623' },
      { name: 'Santander', y: 131, color: '#7FFF00' },
      { name: 'Valle_Del_Cauca', y: 127, color: '#228B22' },
      { name: 'Bolivar', y: 123, color: '#39FF14' },
      { name: 'Antioquia', y: 116, color: '#0B6623' },
      { name: 'Tolima', y: 112, color: '#7FFF00' },
      { name: 'Atlantico', y: 107, color: '#228B22' },
      { name: 'Huila', y: 102, color: '#39FF14' },
      { name: 'Sucre', y: 99, color: '#0B6623' },
      { name: 'La_Guajira', y: 83, color: '#7FFF00' },
      { name: 'Magdalena', y: 80, color: '#228B22' },
      { name: 'Norte_De_Santander', y: 76, color: '#39FF14' },
      { name: 'Cundinamarca', y: 57, color: '#0B6623' },
      { name: 'Caldas', y: 54, color: '#7FFF00' },
      { name: 'Boyaca', y: 42, color: '#228B22' },
      { name: 'Meta', y: 30, color: '#39FF14' },
      { name: 'Risaralda', y: 28, color: '#0B6623' },
      { name: 'Casanare', y: 22, color: '#7FFF00' },
      { name: 'Cauca', y: 13, color: '#228B22' },
      { name: 'Arauca', y: 10, color: '#39FF14' },
      { name: 'Quindio', y: 8, color: '#0B6623' },
      { name: 'Bogota', y: 6, color: '#7FFF00' },
      { name: 'Nariño', y: 4, color: '#228B22' },
      { name: 'Choco', y: 2, color: '#39FF14' }
    ]
  }]
};

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
    text: 'Capacidad instalada por departamento - Ciclo 2',
    style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' }
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


const datosTiempos = [
  { name: 'Cundinamarca', dias: 199 },
  { name: 'Otros', dias: 206 },
  { name: 'La Guajira', dias: 219 },
  { name: 'Atlántico', dias: 221 },
  { name: 'Córdoba', dias: 255 },
  { name: 'Cesar', dias: 287 },
  { name: 'Santander', dias: 288 },
  { name: 'Códoba - Sucre', dias: 476 }
];

const viridisPalette = [
  '#440154', '#46327e', '#365c8d', '#277f8e',
  '#1fa187', '#4ac16d', '#a0da39', '#fde725'
];


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

export function GraficaCiclo1() {
  return (
    <div className="grid md:grid-cols-2 gap-4 ">
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoOptions} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoOptions} />
      </div>
    </div>
  );
}

export function GraficaCiclo2() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosEstadoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadEstadoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={proyectosDeptoC2Options} />
      </div>
      <div className="w-full h-120 p-4 bg-[#262626] rounded-lg shadow-sm border border-[#666666] overflow-hidden">
        <HighchartsReact highcharts={Highcharts} options={capacidadDeptoC2Options} />
      </div>
    </div>
  );
}

export default function SeguimientoCiclos() {
  const [ciclo, setCiclo] = useState(1);

  return (
    <div className="p-4 font-sans rounded-lg" style={{ background: '#262626', fontFamily: 'Nunito Sans, sans-serif' }}>

      <div className="flex space-x-6 mb-4 font-sans text-sm">
        <button
            className={`pb-1 border-b-2 transition text-[18px] ${
                ciclo === 1
                    ? 'border-[#FFC800] text-[#FFC800]'
                    : 'border-transparent text-gray-300'
            }`}
            onClick={() => setCiclo(1)}
        >
          Ciclo 1
        </button>
        <button
            className={`pb-1 border-b-2 transition text-[18px] ${
                ciclo === 2
                    ? 'border-[#FFC800] text-[#FFC800]'
                    : 'border-transparent text-gray-300'
            }`}
            onClick={() => setCiclo(2)}
        >
          Ciclo 2
        </button>

      </div>

      <div className="mt-4">
        {ciclo === 1 && <GraficaCiclo1 />}
        {ciclo === 2 && <GraficaCiclo2 />}

      </div>
    </div>
  );
}
