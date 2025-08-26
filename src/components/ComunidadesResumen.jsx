import { Button } from "./ui/Button"

import { HelpCircle } from 'lucide-react'
import EnergiaElectricaOn from '../assets/svg-icons/EnergiaElectrica-On.svg'
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg'
import OfertaDemandaOn from '../assets/svg-icons/OfertaDemanda-On.svg'

export function ComunidadesResumen() {
  const [expanded, setExpanded] = useState(false)

  // Datos de ejemplo para cada tarjeta
  const datosComunidades = [
    { icon: <img src={EnergiaElectricaOn} alt='Comunidades instaladas' className="w-6 h-6 shrink-0"/>, 
      label: 'Comunidades instaladas', number: '---', value: '---', updated: '8/5/2025' },
    { icon: <img src={OfertaDemandaOn} alt='Comunidades proyectadas' className="w-6 h-6 shrink-0"/>, 
      label: 'Comunidades proyectadas', number: '---', value: '---', updated: '8/5/2025' },
  ]
  const datosSolar = [
    { icon: <img src={AutogeneracionOn} alt='Colombia Solar instalada' className="w-6 h-6 shrink-0"/>, 
      label: 'Colombia Solar instalada', number: '---', value: '---', updated: '8/5/2025' },
    { icon: <img src={AutogeneracionOn} alt='Colombia Solar proyectadas' className="w-6 h-6 shrink-0"/>, 
      label: 'Colombia Solar proyectadas', number: '---', value: '---', updated: '8/5/2025' },
  ]

  return (
    <div className="px-2 mb-8">
      {!expanded ? (
        <Button onClick={() => setExpanded(true)}>
          Ver Comunidades energéticas
        </Button>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sección Comunidades Energéticas */}
            <div className="bg-[#262626] p-4 rounded-lg border border-[#666666]">
              <h3 className="text-2xl font-semibold text-[#B0B0B0] mb-4">
                Comunidades Energéticas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {datosComunidades.map((d, i) => {
                  return (
                    <div
                      key={i}
                      className="bg-[#262626] p-4 rounded-lg border border-[#666666]"
                    >
                      <div className="flex items-center mb-2">
                        {d.icon}
                        <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                          {d.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-white font-bold text-xl">
                          No. {d.number} – {d.value}
                        </div>
                        <HelpCircle
                          className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1"
                          title="Ayuda"
                        />
                      </div>
                      <div className="text-xs text-[#B0B0B0] mt-1">
                        Actualizado el: {d.updated}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setExpanded(false)}
          >
            Ver menos
          </Button>
        </div>
      )}
    </div>
  );
}