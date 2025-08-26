import React, { useRef, useState, useEffect } from 'react';
import MapaCreg075 from '../components/MapaCreg075';
import MapaCreg174 from '../components/MapaCreg174';



export default function MapasCreg() {
  const chartRef = useRef(null);
  const tabs = ['Proyectos - CREG 075', 'Autogeneración y GD - CREG 174'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="space-y-6 mt-10">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Geovisor proyecto de generación</h2>

      {/* Pestañas */}
      <div className="flex space-x-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab ? 'border-b-2 border-[#FFC600] text-[#FFC600] text-[18px]' : 'text-gray-300 text-[18px]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proyectos - CREG 075 */}
      {activeTab === 'Proyectos - CREG 075' && (
        <div className="bg-[#262626] p-2 rounded-lg border border-[#666666] shadow-sm z-1 overflow-hidden">
          <MapaCreg075 />
        </div>
      )}

      {/* Autogeneración y GD - CREG 174 */}
      {activeTab === 'Autogeneración y GD - CREG 174' && (
        <div className="bg-[#262626] p-2 rounded-lg border border-[#666666] shadow-sm z-1 overflow-hidden">
          <MapaCreg174 />
        </div>
      )}

    </section>
  );
}





