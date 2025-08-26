// src/components/MapaProyectosTransmision.jsx
import React from 'react';

const MapaProyectosTransmision = ({ mapUrl, title = "Mapa del Proyecto" }) => {
  return (
    <div className="px-2 mt-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        {title}
      </h2>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow-sm">
        <iframe 
          src={mapUrl} 
          title={title}
          className="w-full h-[600px] border-none rounded-md"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MapaProyectosTransmision;