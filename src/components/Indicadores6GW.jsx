// src/components/Indicadores6GW.jsx
// src/components/Indicadores6GW.jsx
import { useEffect, useMemo, useState } from 'react';
import { HelpCircle, Map as MapIcon, Bolt } from 'lucide-react';

import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import ProcessOn from '../assets/svg-icons/Process-On.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import EolicaOn from '../assets/svg-icons/Eolica-On.svg';
import HidrologiaOn from '../assets/svg-icons/Hidrologia-On.svg';
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg';
import CasaOn from '../assets/svg-icons/Casa-On.svg';
import TerritorioOn from '../assets/svg-icons/Territorio-On.svg';

import { API } from '../config/api';

// ─────────────────────────────────────────────────────────────────────────────
// Normalización y mapeo canónico
// ─────────────────────────────────────────────────────────────────────────────
function stripAccents(s = '') {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function canonicalKey(raw = '') {
  const clean = stripAccents(String(raw).trim()).toUpperCase();

  if (clean === 'EN OPERACION') return 'EN OPERACIÓN';
  if (clean === 'PRUEBAS') return 'PRUEBAS';
  if (clean === 'AGGE') return 'AGGE';
  if (clean === 'AGPE') return 'AGPE';
  if (
    clean === 'FNCER GRAN ESCALA' ||
    clean === 'FNCER' ||
    clean === 'FNCER GRAN-ESCALA' ||
    clean === 'FNCER A GRAN ESCALA' ||
    clean === 'FNCER GRAN  ESCALA'
  ) return 'FNCER GRAN ESCALA';

  if (clean === 'GENERACION DISTRIBUIDA') return 'GENERACION DISTRIBUIDA';
  if (clean === 'CAPACIDAD A ENTRAR 075') return 'CAPACIDAD A ENTRAR 075';
  if (clean === 'CAPACIDAD TOTAL') return 'CAPACIDAD TOTAL';

  return clean; // fallback
}

const LABEL_MAP = {
  'EN OPERACIÓN': { label: 'Capacidad instalada en operación', icon: DemandaOn },
  'PRUEBAS': { label: 'Capacidad instalada en pruebas', icon: ProcessOn },
  'CAPACIDAD A ENTRAR 075': { label: 'MW por entrar a julio de 2026', icon: Proyecto075On },
  'FNCER GRAN ESCALA': { label: 'FNCER gran escala', icon: EolicaOn },
  'AGGE': { label: 'Autogeneración a gran escala (AGGE)', icon: HidrologiaOn },
  'GENERACION DISTRIBUIDA': { label: 'Generación distribuida (GD)', icon: AutogeneracionOn },
  'AGPE': { label: 'Autogeneración a pequeña escala (AGPE)', icon: CasaOn },
  'ZNI': { label: 'Zonas no interconectadas (ZNI)', icon: TerritorioOn, special: true },
};

const ORDER = [
  'EN OPERACIÓN',
  'PRUEBAS',
  'CAPACIDAD A ENTRAR 075',
  'FNCER GRAN ESCALA',
  'AGGE',
  'GENERACION DISTRIBUIDA',
  'AGPE',
  'ZNI', // Añadir ZNI al orden
];

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────────
const formatMW = (n) =>
  Number(n ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function fetchIndicadores6GW() {
  const resp = await fetch(`${API}/v1/indicadores/6g_proyecto`, { method: 'POST' });
  if (!resp.ok) throw new Error('Error al consultar indicadores 6GW+');
  return resp.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export default function Indicadores6GW() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetchIndicadores6GW();
        if (alive) {
          setData(res);
          setLoading(false);
        }
      } catch (e) {
        if (alive) {
          setError(e.message || 'Error al consultar indicadores 6GW+');
          setLoading(false);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const normalized = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      original: d.indicador,
      key: canonicalKey(d.indicador),
      mw: Number(d.capacidad_mw ?? 0),
    }));
  }, [data]);

  // Total que mostramos arriba
  const totalMW = useMemo(() => {
    if (!normalized.length) return 0;
    const total = normalized.find((x) => x.key === 'CAPACIDAD TOTAL')?.mw;
    if (total != null && !Number.isNaN(total)) return total;
    // Respaldo: suma de categorías (sin duplicar "total")
    return normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .reduce((acc, x) => acc + (x.mw || 0), 0);
  }, [normalized]);

  const updated = useMemo(() => new Date().toLocaleDateString('es-CO'), []);

  const cards = useMemo(() => {
    if (!normalized.length) return [];

    // 1) tarjetas desde API (excluyendo "Capacidad Total")
    const apiCards = normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .map((x) => {
        const meta = LABEL_MAP[x.key];
        return {
          order: ORDER.indexOf(x.key) === -1 ? 999 : ORDER.indexOf(x.key),
          icon: meta?.icon ?? GWOff,
          label: meta?.label ?? x.original,
          value: x.mw,
          special: meta?.special || false,
        };
      })
      .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label, 'es'));

    // 2) tarjeta fija de ZNI
    const zniCard = {
      order: ORDER.indexOf('ZNI'),
      icon: TerritorioOn,
      label: 'Zonas no interconectadas (ZNI)',
      value: 13.89,
      special: true,
      fixedDate: '8/5/2025'
    };

    return [...apiCards, zniCard].sort((a, b) => a.order - b.order);
  }, [normalized]);

  if (loading) {
    return (
      <div className="px-4 py-6 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-700 rounded-sm w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
                <div className="h-6 bg-neutral-700 rounded-sm mb-4" />
                <div className="h-8 bg-neutral-600 rounded-sm mb-2" />
                <div className="h-3 bg-neutral-700 rounded-sm w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-400 p-6">Error: {error}</div>;

  return (
    <>
      {/* Encabezado total */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6 text-center md:text-left">
        <div>
          <p style={{ color: '#FFC800' }} className="mb-1 text-2xl">
            Capacidad instalada 6GW+ total:
          </p>
          <p className="text-6xl font-semibold text-white" style={{ lineHeight: '36px' }}>
            {formatMW(totalMW)} MW
          </p>
        </div>

        <button
          onClick={() => (window.location.href = '/CentroMonitoreo/proyectos075')}
          className="bg-white text-black px-4 py-2 rounded-sm shadow-sm hover:bg-gray-200 transition"
        >
          Ver seguimiento de proyectos
        </button>
      </div>

      {/* Tarjetas */}
      <div className="px-2">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Índice plan 6gw plus</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            card.special ? (
              // Card especial para Zonas no interconectadas (ZNI)
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
                <div className="flex items-center mb-2">
                  <img src={card.icon} alt={card.label} className="w-6 h-6 shrink-0" />
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {card.label}
                  </span>
                </div>
                <div className="flex text-white text-3xl font-bold">
                  {formatMW(card.value)} MW
                  <HelpCircle
                    className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                  />
                </div>
                <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {card.fixedDate || updated}</div>
              </div>
            ) : (
              <div key={i} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
                <div className="flex items-center mb-2">
                  <img src={card.icon} alt={card.label} className="w-6 h-6 shrink-0" />
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {card.label}
                  </span>
                </div>
                <div className="flex text-white text-3xl font-bold">
                  {formatMW(card.value)} MW
                  <HelpCircle
                    className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                  />
                </div>
                <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {updated}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}