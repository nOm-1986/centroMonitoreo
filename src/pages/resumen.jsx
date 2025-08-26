import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';

import bannerImage from '../assets/bannerResumenEstrategia6GW.png';
import { ComunidadesResumen } from '../components/ComunidadesResumen';
import { CapacidadHistorica } from '../components/CapacidadHistorica';
import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';
import { GeneracionHoraria } from '../components/GeneracionHoraria';
import MapaCreg075 from '../components/MapaCreg075';
import MapaCreg174 from '../components/MapaCreg174';
import { GeneracionDespacho } from '../components/GeneracionDespacho';
import MapasCreg from '../components/MapasCreg';
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import Plan6gw2 from '../assets/Plan6gw+2.svg'; // o .png


import Indicadores6GW from '../components/Indicadores6GW'; // <-- nuevo
import { Import } from 'lucide-react';

export default function Resumen() {
  const navigate = useNavigate();

  const handleDownload = () => {
    //Lógica para descargar el archivo 
    window.open('https://app.upme.gov.co/Reportes_CentroMonitoreo/Reportes/Reporte_Resumen_CentroMonitoreo.pdf',  "resumenPdf");
    //console.log("Descargar resumen");
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 mt-6">
        <img
          src={bannerImage}
          alt="Plan 6GW Plus"
          className="w-full object-cover h-[170px]"
        />
        <div className="absolute inset-0 flex justify-between items-center px-6">

            {/* Título + botón en columna */}
          <div className="flex flex-col">
          <h1 className="mb-2 font-semibold text-white">
            <span className="inline-flex items-baseline gap-2">
              {/* “Seguimiento” grande y responsivo */}
              <span className="text-[clamp(28px,4.6vw,41px)] leading-none tracking-tight">
                Seguimiento
              </span>
              <img
                src={Plan6gw2}
                alt="Plan 6GW+"
                className="h-[1em] md:h-[50px] w-auto align-baseline translate-y-[0.8em]"
              />
               </span>
            </h1>
            <br/>
            <Button onClick={handleDownload}>
              Descargar resumen
              </Button>
          </div>
          {/* El ícono grande lo moví al componente hijo si quieres; si no, déjalo */}
          {/* <img src={GWOff} className="w-24 h-24 shrink-0" />  */}
        </div>
      </div>

      {/* Aquí renderizamos el nuevo componente que maneja su propio fetch */}
      <Indicadores6GW />

      {/* Resto de secciones */}
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts />
      <MapasCreg />
      <GeneracionDespacho />
      <GeneracionHoraria />
    </div>
  );
}


