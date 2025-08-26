// src/components/IndicadoresProyectos075.jsx
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

// Ícono de las tarjetas y del hero
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';

// Textos (quemados por ahora)
const LABEL_MAP = {
  total_proyectos_bd075: {
    label: 'Proyectos aprobados por entrar con FPO a 7 de agosto de 2026 =',
    icon: DemandaOn,
    value: '145 proyectos (4430 MW)',
  },
  total_proyectos_aprobados_bd075: {
    label: 'Solicitudes totales',
    icon: DemandaOn,
    value: '2802',
  },
  total_capacidad_instalada_bd075: {
    label: 'Proyectos en operación',
    icon: DemandaOn,
    value: '35  (2998 MW)',
  },
  total_capacidad_instalada_aprobados_bd075: {
    label: 'Proyectos en operación FNCER',
    icon: DemandaOn,
    value: '20 (1303 MW)',
  },
  total_proyectos_curva_s: {
    label: 'Solicitudes aprobadas FNCER por entrar',
    icon: DemandaOn,
    value: '385 (16789 MW)',
  },
  proyectos_aprobados_no_curva_s: {
    label: 'Proyectos FNCER con FPO vencida',
    icon: DemandaOn,
    value: '83  (1561 MW)',
  },
};

// Orden de tarjetas (se muestran TODAS; 3 por fila)
const ORDER = [
  'total_proyectos_aprobados_bd075',
  'total_capacidad_instalada_bd075',
  'total_capacidad_instalada_aprobados_bd075',
  'total_proyectos_curva_s',
  'proyectos_aprobados_no_curva_s',
];

// Helpers
function cleanSubtitle(raw) {
  // quita el " =" final del label para usarlo como subtítulo
  return String(raw || '').replace(/\s*=\s*$/, '');
}

export default function IndicadoresProyectos075() {
  const [loading] = useState(false);
  const [error] = useState('');

  const heroSubtitle = cleanSubtitle(LABEL_MAP.total_proyectos_bd075.label);
  const heroValue = LABEL_MAP.total_proyectos_bd075.value;

  const updated = new Date().toLocaleDateString('es-CO');

  if (loading) {
    return (
      <div className="px-4 py-6 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-700 rounded-sm w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {ORDER.map((_, i) => (
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

  if (error) {
    return <div className="text-red-400 p-6">Error: {error}</div>;
  }

  const cards = ORDER.map((key) => ({
    key,
    icon: LABEL_MAP[key].icon,
    label: LABEL_MAP[key].label,
    value: LABEL_MAP[key].value,
  }));

  return (
    <>
      {/* ───────── Indicador general (hero) ───────── */}
      <div className="px-4 pt-6 text-center">
        <div className="inline-flex items-center gap-4">
          {/* círculo amarillo + icono negro (forzado con filter) */}
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: '#FFC800' }}
          >
            <img
              src={DemandaOn}
              alt="Icono"
              className="w-7 h-7"
              style={{ filter: 'brightness(0) saturate(100%)' }} // vuelve el svg negro
            />
          </span>

          <span
            className="font-semibold leading-tight"
            style={{ color: '#FFC800', fontSize: '44px' }}
          >
            {heroValue}
          </span>
        </div>

        <div className="mt-2 text-[#D1D1D0] text-[20px]">
          {heroSubtitle}
        </div>
      </div>

      {/* ───────── Tarjetas: 3 por fila ───────── */}
      <div className="px-2 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map(({ key, icon, label, value }) => (
            <div key={key} className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow-sm">
              <div className="flex items-center mb-2">
                <img src={icon} alt={label} className="w-6 h-6 shrink-0" />
                <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                  {label}
                </span>
              </div>
              <div className="flex text-white text-2xl font-bold">
                {value}
                <HelpCircle
                  className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1 ml-4"
                  title="Ayuda"
                />
              </div>
              <div className="text-xs text-[#B0B0B0] mt-1">Actualizado el: {updated}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


