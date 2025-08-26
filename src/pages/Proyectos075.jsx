import React, { useState } from 'react';
import BannerSeguimiento from '../components/BannerSeguimiento';
import SeguimientoBarras from '../components/SeguimientoBarras';
import ProjectGrid from '../components/ProjectGrid';
import HitosBarras from '../components/HitosBarras';
import SeguimientoIndices from '../components/SeguimientoIndices';
import SeguimientoCiclos from '../components/SeguimientoCiclos';
import Ciclo1charts from '../components/Ciclo1charts';
import Ciclo2charts from '../components/Ciclo2charts';
import { Search } from "lucide-react";
import IndicadoresProyectos075 from '../components/IndicadoresProyectos075';

export default function Proyectos075() {
    const [showCiclos, setShowCiclos] = useState(false);

    return (
        <div className="text-white min-h-screen font-sans">
            <BannerSeguimiento />
                
            <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowCiclos(false)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded transition font-sans ${
                            !showCiclos ? 'bg-[#FFC800] text-black hover:bg-[#e6b000]' : 'bg-[#3a3a3a] text-white'
                        }`}
                    >
                        Seguimiento de proyectos 075
                    </button>
                    <button
                        onClick={() => setShowCiclos(true)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded transition font-sans ${
                            showCiclos ? 'bg-[#FFC800] text-black hover:bg-[#e6b000]' : 'bg-[#3a3a3a] text-white'
                        }`}
                    >
                        Seguimiento de ciclos de asignación
                    </button>
                </div>
                {/* Botón deshabilitado para búsqueda
                <div className="relative">
                    <Search size={20} className="absolute left-2 top-2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="pl-8 pr-3 py-1 rounded-sm bg-[#1f1f1f] text-white font-sans focus:outline-hidden"
                    />
                </div>
                */}        
            </div>

            {!showCiclos ? (
                <div id="proyectos-tab">
                    <div className="p-6 bg-[#262626] rounded-lg">
                        <IndicadoresProyectos075 />
                    </div>
                    <br />
                    <div>
                        <ProjectGrid />
                    </div>
                </div>
            ) : (
                <div id="ciclos-tab">
                    <div>
                        <SeguimientoIndices />
                    </div>
                    <div>
                        <SeguimientoCiclos />
                    </div>
                </div>
            )}
        </div>
    );
}
