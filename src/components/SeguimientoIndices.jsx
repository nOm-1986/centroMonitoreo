// SeguimientoIndices.jsx
import React from 'react'
import { MoveUp, HelpCircle } from 'lucide-react'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import HidroOn from "../assets/svg-icons/Hidrologia-On.svg";
import GeneracionTermicaOn from "../assets/svg-icons/GeneracionTermica-On.svg";
import EolicaOn from "../assets/svg-icons/Eolica-On.svg";

const indicadores = [
  {
    titulo: 'Postulaciones totales ciclo 1',
    valor: '38.541 MW',
    variacion: '596 proyectos',
    icono: <img src={DemandaOn} alt='Demanda energía SIN' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Postulaciones totales ciclo 2',
    valor: '98.868 MW',
    variacion: '1718 proyectos',
    icono: <img src={DemandaOn} alt='Generación hidráulica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Aprobaciones ciclo 1',
    valor: '6.082 MW',
    variacion: '148 proyectos',
    icono: <img src={DemandaOn} alt='Generación térmica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Aprobaciones ciclo 2',
    valor: '90,8 MW',
    variacion: '4 proyectos',
    icono: <img src={DemandaOn} alt='Generación solar y eólica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'En evaluación ciclo 2',
    valor: '81.802 MW',
    variacion: '1,458 proyectos',
    icono: <img src={DemandaOn} alt='Generación solar y eólica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  }
]

export default function SeguimientoIndices() {

  return (
      <section className="mb-6">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Índices</h2>

        {/* Grid responsiva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {indicadores.map((i, idx) => (
              <div
                  key={idx}
                  className="flex flex-col gap-3 p-5 bg-[#262626] border border-[#575756] rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {i.icono}
                  <h3 className="text-[18px] font-normal leading-[26px] text-[#B0B0B0] font-sans">
                    {i.titulo}
                  </h3>
                </div>

                <div className='flex gap-x-3 justify-items-center'>
                  <div className="text-xl font-semibold text-white">
                    {i.valor}
                  </div>
                </div>

                <div className='flex gap-x-3 justify-items-center'>
                  <div className="bg-neutral-700 text-center rounded-sm gap-1 px-2 text-[#d1d1d0] text-[11px] font-medium flex h-6 self-center">
                    <div className='self-center'>
                      {i.variacion}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#B0B0B0]">
                  {i.fecha}
                </div>
              </div>
          ))}
        </div>
      </section>
  );
}
