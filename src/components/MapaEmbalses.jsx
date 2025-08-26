// src/components/MapaEmbalses.jsx
import React, { useEffect, useState, useRef } from 'react';
// Importamos el contenido HTML en crudo (Vite: ?raw, CRA: raw-loader)
import { MoveUp, HelpCircle } from 'lucide-react'
import defaultHtml from './default.html?raw';
import HidroOn from '../assets/svg-icons/Hidrologia-On.svg';

export function MapaEmbalses() {
  const embalses = [
    { region: "Antioquia", porcentaje: 28.33 },
    { region: "Caldas", porcentaje: 27.15 },
    { region: "Caribe", porcentaje: 25.02 },
    { region: "Centro", porcentaje: 32.88 },
    { region: "Oriente", porcentaje: 30.10 },
    { region: "Valle", porcentaje: 29.45 },
  ];

  const [svgContent, setSvgContent] = useState('');
  const [zoom, setZoom] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(defaultHtml, 'text/html');
    const svg = doc.querySelector('#svg1074');
    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('stroke', '#888');
      svg.setAttribute('stroke-width', '0.5');
    }
    setSvgContent(svg ? svg.outerHTML : '');
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const svgEl = mapRef.current.querySelector('svg');
    if (!svgEl) return;

    svgEl.style.cursor = 'pointer';
    const paths = svgEl.querySelectorAll('path');
    paths.forEach(path => {
      const originalFill = path.getAttribute('fill') || '#ffffff';
      path.dataset.originalFill = originalFill;
      path.addEventListener('mouseenter', () => path.setAttribute('fill', '#FFCC00'));
      path.addEventListener('mouseleave', () => path.setAttribute('fill', path.dataset.originalFill));
      path.addEventListener('click', () => {
        const name = path.getAttribute('name') || path.id;
        const dept = embalses.find(e => e.region === name);
        setSelectedDept({ name, porcentaje: dept ? dept.porcentaje : 50.00 });
      });
    });

    return () => {
      paths.forEach(path => path.replaceWith(path.cloneNode(true)));
    };
  }, [svgContent]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

  return (
    <section className="mt-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Mapa */}
      <div className="map-container xl:col-span-3 bg-[#262626] rounded-lg border border-[#666666] shadow-sm overflow-hidden h-[650px] p-2 relative">
        {/* Controles de zoom */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom in"
          >+</button>
          <button
            onClick={handleZoomOut}
            className="bg-white text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Zoom out"
          >−</button>
        </div>

        {/* Modal de detalles */}
        {selectedDept && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-[#262626] p-6 rounded-lg border border-[#666666] max-w-md w-full">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">
                DEPARTAMENTO DE {selectedDept.name.toUpperCase()}: {selectedDept.porcentaje.toFixed(2)}%
              </h2>
              <div className="divide-y divide-gray-600">
                <div className="py-2 flex justify-between">
                  <span>Volumen útil diario:</span>
                  <span>{selectedDept.porcentaje.toFixed(2)}%</span>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedDept(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          id="map"
          ref={mapRef}
          className="w-full h-full overflow-hidden flex items-center justify-center"
        >
          <div
            className="w-full h-full fill-current text-white"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-col gap-4">
        { /* Nueva card */ }
        <div className="flex flex-col gap-3 p-5 bg-[#262626] border border-[#575756] rounded-lg" >
          <div className="flex items-start gap-3">
            <img src={HidroOn} alt='Generación hidráulica' className="w-6 h-6 shrink-0"/>
            <h3 className="text-[18px] font-normal leading-[26px] text-[#B0B0B0] font-sans">
              Total nacional
            </h3>
          </div>

          <div className='flex gap-x-3 justify-items-center'>
            <div className="text-[26px] font-semibold text-white">
              30,02%
            </div>
            <div className="bg-neutral-700 text-center rounded-sm gap-1 px-2 text-[#d1d1d0] text-[11px] font-medium flex h-6 self-center">
              <MoveUp size={12} className='self-center'/>
              <div className='self-center'>
                11.77%
              </div>
            </div>
            <HelpCircle
              className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded-sm h-6 w-6 p-1"
              title="Ayuda"
            />
          </div>

          <div className="text-xs text-[#B0B0B0]">
            Actualizado el: 8/5/2025 – Volumen útil diario %
          </div>
        </div>


        {embalses.map((e, i) => (
          <div
            key={i}
            className="bg-[#262626] p-3 rounded-lg border border-[#666666] text-white flex gap-3 items-center"
          >
            <span className="text-[20px] text-[#d1d1d0]">{e.region}:</span>
            <span className="font-semibold text-[20px]">{e.porcentaje.toFixed(2)}%</span>
            <div className="bg-neutral-700 text-center rounded-sm gap-1 px-2 text-[#d1d1d0] text-[11px] font-medium flex h-6 self-center">
              <MoveUp size={12} className='self-center'/>
              <div className='self-center'>11.77%</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



