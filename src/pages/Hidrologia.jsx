import { Button } from "../components/ui/Button";

import { useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// HTML embebidos
import chart1Html from '../data/Chart1.html?raw';
import chart2Html from '../data/Chart2.html?raw';
import chart3Html from '../data/Chart3.html?raw'; // Información general
import tablaHidrologiaCompleta from '../data/tabla_hidrologia-completa.html?raw'; 

// Aportes hídricos
import bannerHidrologia from '../assets/bannerHidrologia.png';
import MapaHidrologia from '../components/MapaHidrologia';

// ===== Paleta =====
const COLORS = {
  down: '#EF4444',
  up: '#22C55E',
  blue: '#3B82F6',
  gray: '#D1D1D0',
  yellow: '#FFC800',
  chipText: '#111827',
  darkBg: '#262626',
  darkBg2: '#1f1f1f',
  border: '#3a3a3a',
};

/* ==================== helpers ==================== */
const extractCategories = (html) => {
  const m = html.match(/xAxis:\s*\{\s*categories:\s*\[([\s\S]*?)\]\s*,/);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map(mm => mm[1]);
};

const extractAllNumericSeries = (html) => {
  const sIdx = html.indexOf('series:');
  const tail = sIdx !== -1 ? html.slice(sIdx) : html;
  const re = /\{name:\s*'([^']+)'\s*,\s*data:\s*\[([\s\S]*?)\]/g;
  const out = [];
  let m;
  while ((m = re.exec(tail))) {
    const name = m[1];
    const nums = m[2]
      .split(',')
      .map(v => parseFloat(v))
      .filter(v => !Number.isNaN(v));
    out.push({ name, data: nums });
  }
  return out;
};

const extractUtcPairs = (src) => {
  const out = [];
  const re = /\[Date\.UTC\((\d+),\s*(\d+),\s*(\d+)\)\s*,\s*([0-9.\-]+)\]/g;
  let mm;
  while ((mm = re.exec(src))) {
    const y = +mm[1], m = +mm[2], d = +mm[3], val = parseFloat(mm[4]);
    out.push([Date.UTC(y, m, d), val]);
  }
  return out;
};

const extractSeriesByNameUTC = (html, seriesName) => {
  const idx = html.indexOf(`name: '${seriesName}'`);
  if (idx === -1) return [];
  const nextIdx = html.indexOf("name: '", idx + 6);
  const endIdx = nextIdx !== -1 ? nextIdx : html.indexOf('}]', idx);
  const block = html.slice(idx, endIdx);
  return extractUtcPairs(block);
};

// Tooltip SOLO para el slice/punto en pies (primeros 2 charts)
function singlePieTooltipFormatter() {
  return `
      <div style="pointer-events:auto;user-select:text;padding:6px;">
        <b>${this.series.name}</b><br/>
        ${this.x}: ${this.y}
      </div>
    `;
}

/* ======================= Índices (mock visual) ======================= */
const indices = [
  {
    title: 'Nivel de embalse actual',
    updated: '24/7/2025',
    value: '13.907,22 GWh-día',
    deltaText: '−23,31 GWh',
    deltaDir: 'down',
    pct: '80.89%',
    pctDeltaText: '−0,14%',
    pctDeltaDir: 'down',
  },
  {
    title: 'Aportes mensuales promedio',
    updated: 'Julio 2025',
    value: '311.55 GWh-día',
    deltaText: '−23,31 GWh',
    deltaDir: 'down',
    pct: '122.42%',
    pctDeltaText: '−0,14%',
    pctDeltaDir: 'down',
    sub: 'Media histórica: 254.48 GWh-día'
  },
  {
    title: 'Generación promedio diaria',
    updated: 'Julio vs junio 2025',
    groups: [
      { name: 'Hídrica', value: '195.49', unit: 'GWh-día', delta: '+7.2 GWh (+3.6%)', dir: 'up' },
      { name: 'Térmica', value: '24.37', unit: 'GWh-día', delta: '−0.7 GWh (−2.6%)', dir: 'down' },
      { name: 'FNCER', value: '15.03', unit: 'GWh-día', delta: '+1.2 GWh (+8.9%)', dir: 'up' },
    ],
    bottom: 'Demanda real promedio: 234.90 GWh – día',
    bottomDelta: '+7.7 GWh (+3.3%)',
    bottomDir: 'up',
  },
  {
    title: 'Precios de Energía – Julio vs junio 2025',
    updated: 'Promedios mensuales diarios (COP/kWh)',
    groups: [
      { name: 'Mínimo\nDiario', value: '102.96', unit: 'COP/kWh', delta: '−3.82 (−3.7%)', dir: 'down' },
      { name: 'Promedio\nDiario', value: '125.75', unit: 'COP/kWh', delta: '+13.77 (+10.9%)', dir: 'up' },
      { name: 'Máximo\nDiario', value: '352.33', unit: 'COP/kWh', delta: '+170.34 (+48.3%)', dir: 'up' },
    ],
    badge: 'Precio marginal de escasez',
    badgeValue: '865.22 COP/kWh'
  },
];

function TrendChip({ dir = 'up', children }) {
  const isUp = dir === 'up';
  const bg = isUp ? '#22C55E' : '#EF4444';
  return (
    <span
      className="
        inline-flex items-center gap-2 px-3 py-1
        rounded-full text-sm font-semibold
        whitespace-nowrap leading-none
      "
      style={{
        backgroundColor: bg,
        color: '#fff',
        border: '1px solid rgba(0,0,0,.15)',
      }}
    >
      <span aria-hidden className="text-base leading-none">{isUp ? '↑' : '↓'}</span>
      <span className="leading-none" style={{ color: '#fff' }}>{children}</span>
    </span>
  );
}

/* =================== Highcharts (desde HTML) =================== */
function useAportesOptionsFromHtml() {
  const aportes = useMemo(() => {
    const s1 = extractSeriesByNameUTC(chart2Html, 'Aportes (GWh-dia)');
    const s2 = extractSeriesByNameUTC(chart2Html, 'Aportes Media Histórica (GWh-dia)');
    const s3 = extractSeriesByNameUTC(chart2Html, 'Nivel de Embalse Util (%)');
    return { s1, s2, s3 };
  }, []);

  return useMemo(() => ({
    chart: {
      backgroundColor: COLORS.darkBg,
      height: 650,
      marginTop: 80,
      marginBottom: 180,
      spacingBottom: 40,
      type: 'column'
    },
    title: { 
      text: 'Aportes y nivel útil de embalses por mes', 
      align: 'left', 
      style: { color: '#fff', fontSize: '1.65em' } 
    },
    subtitle: { text: '', align: 'left', style: { color: COLORS.gray } },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickPixelInterval: 130,
      labels: {
        rotation: -45,
        align: 'right',
        autoRotation: undefined,
        formatter() { return Highcharts.dateFormat('%Y-%m', this.value); },
        style: { color: COLORS.gray, fontSize: '12px' }
      }
    },
    yAxis: [
      { title: { text: 'Aportes (GWh-día)', style: { color: COLORS.gray } }, labels: { style: { color: COLORS.gray } } },
      { title: { text: 'Nivel (%)', style: { color: COLORS.gray } }, labels: { style: { color: COLORS.gray } }, opposite: true }
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 20, itemStyle: { color: '#fff', fontSize: '16px' } },
    series: [
      { name: 'Aportes (GWh-dia)', type: 'line', color: '#05d80a', marker: { radius: 3 }, lineWidth: 2, data: aportes.s1, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Aportes Media Histórica (GWh-dia)', type: 'line', color: COLORS.yellow, dashStyle: 'Dash', marker: { radius: 3 }, lineWidth: 2, data: aportes.s2, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Nivel de Embalse Util (%)', type: 'area', yAxis: 1, color: COLORS.blue, fillOpacity: 0.3, lineWidth: 1, data: aportes.s3, tooltip: { valueSuffix: '%' } },
    ],
    tooltip: { 
      backgroundColor: 'rgba(0,0,0,.50)',
      style: { color: '#FFF', fontSize: '12px' },
      xDateFormat: '%Y-%m',
      shared: true,
      useHTML: true,
      formatter: function () {
        let header = `<b>${Highcharts.dateFormat("%e %b %Y", this.x)}</b><br/>`;
        let rows = this.points
          .map((point) => {
            const suffix =
              (point.series.options.tooltip &&
                point.series.options.tooltip.valueSuffix) || "";
            return `
              <div style="user-select:text;pointer-events:auto;margin:2px 0;">
                <span style="color:${point.color}">●</span>
                ${point.series.name}: <b>${Highcharts.numberFormat(point.y, 2)}${suffix}</b>
              </div>
            `;
          })
          .join("");
        return `<div style="padding:6px;">${header}${rows}</div>`;
      },
    },
  }), [aportes]);
}

function useDesabastecimientoOptionsFromHtml() {
  const parsed = useMemo(() => {
    const categories = extractCategories(chart1Html);
    const series = extractAllNumericSeries(chart1Html);
    return { categories, series };
  }, []);
  const s0 = parsed.series?.[0]?.data ?? [];
  const s1 = parsed.series?.[1]?.data ?? [];
  const s2 = parsed.series?.[2]?.data ?? [];
  const s3 = parsed.series?.[3]?.data ?? [];

  return useMemo(() => ({
    chart: { zooming: { type: 'xy' }, backgroundColor: COLORS.darkBg, marginTop: 50, marginBottom: 100, spacingBottom: 60, height: 600 },
    title: { text: 'Estatuto de desabastecimiento', align: 'left', margin: 50, style: { color: '#fff', fontSize: '1.65em' } },
    subtitle: { text: '', align: 'left', style: { color: COLORS.gray } },
    xAxis: {
      categories: parsed.categories,
      labels: { style: { color: COLORS.gray, fontSize: '14px' } },
      title: { text: 'Fecha', style: { color: COLORS.gray, fontSize: '16px' } },
    },
    yAxis: [
      { title: { text: 'Precios (COP/kWh)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { style: { color: COLORS.gray, fontSize: '14px' } } },
      { title: { text: 'Nivel de Embalse Util (%)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { format: '{value}%', style: { color: COLORS.gray, fontSize: '14px' } }, opposite: true },
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 30, itemStyle: { color: COLORS.gray, fontSize: '16px' } },
    tooltip: {
      valueDecimals: 2, style: { color: '#FFF', fontSize: '12px' }, useHTML: true, shared: true,
      formatter: function () {
        let header = `<b>${Highcharts.dateFormat("%e %b %Y", this.x)}</b><br/>`;
        let rows = this.points.map(
          (point) => `
            <div style="user-select:text;pointer-events:auto;margin:2px 0;">
              <span style="color:${point.color}">●</span>
              ${point.series.name}: <b>${Highcharts.numberFormat(point.y, 2)}</b>
            </div>`
        ).join("");
        return `<div style="padding:6px;">${header}${rows}</div>`;
      }
    },
    plotOptions: { series: { marker: { enabled: false } } },
    series: [
      { name: 'Precio de bolsa en períodos punta (COP/kWh)', type: 'spline', yAxis: 0, color: '#05d80a', data: s0 },
      { name: 'Precio marginal de escasez (COP/kWh)', type: 'spline', yAxis: 0, color: COLORS.yellow, dashStyle: 'ShortDash', data: s1 },
      { name: 'Nivel de embalse útil (%)', type: 'areaspline', yAxis: 1, color: COLORS.blue, fillOpacity: 0.2, data: s2 },
      { name: 'Senda de referencia (%)', type: 'spline', yAxis: 1, color: COLORS.down, dashStyle: 'Dot', data: s3 },
    ],
  }), [parsed]);
}

/* -------- inyección de estilos para iframes embebidos (srcDoc) -------- */
function injectStylesForGeneral(html) {
  const CSS = `
    :root, body { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; }
    a, button { color: ${COLORS.gray}; }
    .btn, .button, .dt-button { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; color: ${COLORS.gray} !important; }
    .card, .panel, .container, .content, .dataTables_wrapper { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    table thead tr, table thead th, table thead td,
    .table thead tr, .table thead th, .table thead td,
    .thead, .thead-dark, .thead-light,
    .dataTables_wrapper .dataTables_scrollHead,
    .dataTables_wrapper .dataTables_scrollHeadInner {
      background: #1f1f1f !important;
      color: ${COLORS.gray} !important;
      border-color: ${COLORS.border} !important;
    }
    table, .table { color: ${COLORS.gray} !important; border-color: ${COLORS.border} !important; }
    table tbody tr, .table tbody tr, tr[role="row"] { background: ${COLORS.darkBg} !important; }
    table tbody tr:nth-child(even), .table tbody tr:nth-child(even) { background: ${COLORS.darkBg2} !important; }
    table tbody td, .table tbody td, table tbody th, .table tbody th { border-color: #2e2e2e !important; background: transparent !important; }
    .table-striped tbody tr:nth-of-type(odd) { background: ${COLORS.darkBg} !important; }
    .table-hover tbody tr:hover { background: #2a2a2a !important; }
    .text-muted, .muted, small { color: ${COLORS.gray} !important; }
    .progress { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; height: 14px !important; }
    .progress .progress-bar { background: ${COLORS.blue} !important; }
  `;
  if (html.includes('</head>')) {
    return html.replace('</head>', `<style>${CSS}</style></head>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`;
}

function injectStylesForAportes(html) {
  const CSS = `
    :root, body { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; }
    a, button { color: ${COLORS.gray}; }
    .btn, .button, .dt-button { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; color: ${COLORS.gray} !important; }
    .card, .panel, .container, .content, .dataTables_wrapper { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    table thead tr, table thead th, table thead td,
    .table thead tr, .table thead th, .table thead td,
    .thead, .thead-dark, .thead-light,
    .dataTables_wrapper .dataTables_scrollHead,
    .dataTables_wrapper .dataTables_scrollHeadInner {
      background: #1f1f1f !important;
      color: ${COLORS.gray} !important;
      border-color: ${COLORS.border} !important;
    }
    .bg-primary, .bg-info, .bg-warning, .bg-success, .bg-danger { background-color: ${COLORS.gray} !important; }
    table, .table { color: ${COLORS.gray} !important; border-color: ${COLORS.border} !important; }
    table tbody tr, .table tbody tr, tr[role="row"] { background: ${COLORS.darkBg} !important; }
    table tbody tr:nth-child(even), .table tbody tr:nth-child(even) { background: ${COLORS.darkBg2} !important; }
    table tbody td, .table tbody td, table tbody th, .table tbody th { border-color: #2e2e2e !important; background: transparent !important; }
    .table-striped tbody tr:nth-of-type(odd) { background: ${COLORS.darkBg} !important; }
    .table-hover tbody tr:hover { background: #2a2a2a !important; }
    .text-muted, .muted, small { color: ${COLORS.gray} !important; }
    .progress { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; height: 14px !important; }
    .progress .progress-bar { transition: background-color .25s ease; }
  `;

  const SCRIPT = `
  (function(){
    function parsePercent(s){
      if(!s) return NaN;
      var m = String(s).match(/([0-9]+(?:[\\.,][0-9]+)?)/);
      if(!m) return NaN;
      return parseFloat(m[1].replace(',', '.'));
    }
    function colorFor(p){
      if (p > 90) return '${COLORS.blue}';
      if (p >= 60) return '${COLORS.up}';
      if (p >= 30) return '#F59E0B';
      return '${COLORS.down}';
    }
    var bars = document.querySelectorAll('.progress .progress-bar, .progress-bar');
    bars.forEach(function(bar){
      var p = NaN;
      if (bar.style && bar.style.width) p = parsePercent(bar.style.width);
      if (isNaN(p)) {
        var txt = (bar.closest('td') && bar.closest('td').textContent) || bar.parentElement.textContent || '';
        p = parsePercent(txt);
      }
      if (!isNaN(p)) bar.style.backgroundColor = colorFor(p);
    });

    var whitey = document.querySelectorAll('.bg-white, .card, .panel, .row, .col, .section, .container, .content');
    whitey.forEach(function(n){
      var styleBg = getComputedStyle(n).backgroundColor;
      if (styleBg === 'rgb(255, 255, 255)') n.style.backgroundColor = '${COLORS.darkBg}';
    });
  })();
  `;

  if (html.includes('</head>') && html.includes('</body>')) {
    return html
      .replace('</head>', `<style>${CSS}</style></head>`)
      .replace('</body>', `<script>${SCRIPT}</script></body>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}<script>${SCRIPT}</script></body></html>`;
}

/* --------------------------------- Página --------------------------------- */
export default function Hidrologia() {
  const aportesOptions = useAportesOptionsFromHtml();
  const desabOptions = useDesabastecimientoOptionsFromHtml();
  const [tab, setTab] = useState('aportes');

  // Ref del contenido a imprimir (API v3)
  const printRef = useRef(null);

  // Estilos de impresión
  const pageStyle = `
    @page { size: A4 portrait; margin: 12mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .avoid-break, .rounded-xl, .highcharts-container, .leaflet-container {
      break-inside: avoid; page-break-inside: avoid;
    }
    iframe { width: 100% !important; border: 1px solid #e5e7eb; }
    .shadow, .shadow-md, .shadow-lg { box-shadow: none !important; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
  `;

  // Disparador de impresión
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'hidrologia',
    pageStyle,
    copyStyles: true,
    removeAfterPrint: true,
  });

  return (
    <>
      <style>{`@media print { ${pageStyle} }`}</style>

      <section className="space-y-6" ref={printRef}>
        {/* Banner + botón imprimir */}
        <div
          className="rounded-2xl overflow-hidden h-24 md:h-28 lg:h-32 relative avoid-break"
          style={{
            backgroundImage: `url(${bannerHidrologia})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <h1 className="absolute left-6 top-1/2 -translate-y-1/2 text-white font-bold text-3xl md:text-4xl">
            Seguimiento Hidrológico
          </h1>

          <div className="absolute right-4 bottom-3 no-print">
            <Button
              onClick={handlePrint}
              title="Descargar PDF"
              type="button"
            >
              Descargar PDF
            </Button>
          </div>
        </div>

        {/* ÍNDICES */}
        <h2 className="text-lg text-gray-300 avoid-break">Índices</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="text-gray-300 text-sm mb-2 flex items-center gap-3">
              <span className="font-semibold text-white">{indices[0].title}</span>
              <span className="text-xs text-gray-400">Actualizado: {indices[0].updated}</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-white text-xl">{indices[0].value}</p>
              <TrendChip dir={indices[0].deltaDir}>{indices[0].deltaText}</TrendChip>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#D1D1D0]">
                <div className="h-3" style={{ width: '81%', background: COLORS.blue }} />
              </div>
              <TrendChip dir={indices[0].pctDeltaDir}>{indices[0].pctDeltaText}</TrendChip>
            </div>
            <div className="mt-1 text-gray-300">{indices[0].pct}</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="text-gray-300 text-sm mb-2 flex items-center gap-3">
              <span className="font-semibold text-white">{indices[1].title}</span>
              <span className="text-xs text-gray-400">Actualizado: {indices[1].updated}</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-white text-xl">{indices[1].value}</p>
              <TrendChip dir={indices[1].deltaDir}>{indices[1].deltaText}</TrendChip>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-white text-xl">{indices[1].pct}</p>
              <TrendChip dir={indices[1].pctDeltaDir}>{indices[1].pctDeltaText}</TrendChip>
            </div>
            <div className="text-xs text-gray-400 mt-2">{indices[1].sub}</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="text-gray-300 text-sm mb-4">
              <span className="font-semibold text-white">{indices[2].title}</span>
              <div className="text-xs text-gray-400">{indices[2].updated}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {indices[2].groups.map((g) => (
                <div key={g.name} className="rounded-lg border border-[#3a3a3a] p-3">
                  <div className="text-yellow-400 font-semibold mb-1">{g.name}</div>
                  <div className="text-white text-xl">{g.value}</div>
                  <div className="text-gray-300 text-sm">{g.unit}</div>
                  <div className="mt-2"><TrendChip dir={g.dir}>{g.delta}</TrendChip></div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-[#3a3a3a] p-3">
              <div className="text-white">{indices[2].bottom}</div>
              <div className="mt-2"><TrendChip dir={indices[2].bottomDir}>{indices[2].bottomDelta}</TrendChip></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="text-gray-300 text-sm mb-4">
              <span className="font-semibold text-white">{indices[3].title}</span>
              <div className="text-xs text-gray-400">{indices[3].updated}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {indices[3].groups.map((g) => (
                <div key={g.name} className="rounded-lg border border-[#3a3a3a] p-3">
                  <div className="text-yellow-400 font-semibold whitespace-pre-line mb-1">{g.name}</div>
                  <div className="text-white text-xl">{g.value}</div>
                  <div className="text-gray-300 text-sm">{g.unit}</div>
                  <div className="mt-2"><TrendChip dir={g.dir}>{g.delta}</TrendChip></div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-[#FFC800] text-[#111] px-3 py-1.5 rounded-md text-sm font-semibold">
                {indices[3].badge}
              </span>
              <span className="text-[#FFC800] font-semibold">{indices[3].badgeValue}</span>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-2 md:p-3 lg:p-4 avoid-break">
          <div className="py-4 rounded-xl bg-[#1f1f1f] flex items-center justify-center text-gray-400 text-lg">
            <MapaHidrologia/>
          </div>
        </div>

        {/* Tabla + Gráfica Aportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl avoid-break">
            {/* Tabs */}
            <div className="px-3 pt-3 border-b border-[#3a3a3a]">
              <div className="flex gap-6">
                <button
                  onClick={() => setTab('general')}
                  className={`pb-2 text-sm ${tab==='general' ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Información general
                </button>
                <button
                  onClick={() => setTab('aportes')}
                  className={`pb-2 text-sm ${tab==='aportes' ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Aportes hídricos
                </button>
              </div>
            </div>
            {/* Iframe */}
            <div className="p-3">
              <iframe
                title={tab === 'general' ? 'Tabla información general' : 'Tabla aportes hídricos'}
                srcDoc={
                  tab === 'general'
                    ? injectStylesForGeneral(chart3Html)
                    : injectStylesForAportes(tablaHidrologiaCompleta)
                }
                className="w-full h-[560px] rounded-lg border border-[#3a3a3a] bg-[#1f1f1f]"
              />
            </div>
          </div>

          {/* Gráfica Aportes */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <HighchartsReact highcharts={Highcharts} options={aportesOptions} />
          </div>
        </div>

        {/* Estatuto de desabastecimiento */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 h-[650px] avoid-break">
          <HighchartsReact highcharts={Highcharts} options={desabOptions} />
        </div>
      </section>
    </>
  );
}












