import React from 'react'
import { MoveUp, HelpCircle } from 'lucide-react'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import HidroOn from '../assets/svg-icons/Hidrologia-On.svg'
import GeneracionTermicaOn from '../assets/svg-icons/GeneracionTermica-On.svg' 
import EolicaOn from '../assets/svg-icons/Eolica-On.svg'

const indicadores = [
  {
    titulo: 'Demanda energía SIN',
    valor: '225.40 MWh',
    variacion: '+11.77%',
    icono: <img src={DemandaOn} alt='Demanda energía SIN' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación hidráulica',
    valor: '177.38 MWh',
    variacion: '+11.77%',
    icono: <img src={HidroOn} alt='Generación hidráulica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación térmica',
    valor: '19.95 MWh',
    variacion: '+11.77%',
    icono: <img src={GeneracionTermicaOn} alt='Generación térmica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación solar y eólica',
    valor: '9.94 MWh',
    variacion: '+11.77%',
    icono: <img src={EolicaOn} alt='Generación solar y eólica' className="w-6 h-6 shrink-0"/>,
    fecha: 'Actualizado el: 8/5/2025'
  }
]

export function IndicadoresResumen() {
  return (
    <section className="mb-6">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4 ">Índices</h2>

      {/* Grid responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="bg-neutral-700 text-center rounded-sm gap-1 px-2 text-[#d1d1d0] text-[11px] font-medium flex h-6 self-center">
                <MoveUp size={12} className='self-center'/>
                <div className='self-center'>
                  {i.variacion}
                </div>
              </div>
              <HelpCircle
                className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1"
                title="Ayuda"
              />
            </div>

            <div className="text-xs text-[#B0B0B0]">
              {i.fecha}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}