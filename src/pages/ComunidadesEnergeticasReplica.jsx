// src/pages/ComunidadesEnergeticasReplica.jsx
import React from "react";
import bannerImg from "../assets/bannerComunidadesEnergeticas.png";
import iconCE from "../assets/svg-icons/ComunidadesEnerg-On.svg";

const ComunidadesEnergeticasReplica = () => {
  const dataCards = [
    { id: 1, title: "No. de comunidades postuladas", value: 20, icon: iconCE, date: "8/5/2025" },
    { id: 2, title: "No. de comunidades registradas", value: 97, icon: iconCE, date: "8/5/2025" },
    { id: 3, title: "No. de comunidades focalizadas", value: 97, icon: iconCE, date: "8/5/2025" },
    { id: 4, title: "No. de comunidades priorizadas", value: 8,  icon: iconCE, date: "8/5/2025" },
    { id: 5, title: "No. de comunidades postuladas", value: 20, icon: iconCE, date: "8/5/2025" },
    { id: 6, title: "No. de comunidades registradas", value: 97, icon: iconCE, date: "8/5/2025" },
    { id: 7, title: "No. de comunidades focalizadas", value: 97, icon: iconCE, date: "8/5/2025" },
    { id: 8, title: "No. de comunidades priorizadas", value: 8,  icon: iconCE, date: "8/5/2025" },
  ];

  return (
    <div className="bg-background min-h-screen text-white">
      {/* Banner MÁS BAJO */}
      <div className="relative w-full rounded-b-xl overflow-hidden">
        <img
          src={bannerImg}
          alt="Comunidades Energéticas"
          className="w-full h-32 sm:h-40 object-cover" /* altura reducida */
        />
        {/* Oscurecido suave para contraste del título */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8">
          <h1 className="text-3xl sm:text-6xl font-semibold tracking-tight">
            Comunidades energéticas
          </h1>
          <div className="hidden sm:flex items-center justify-center">
            <img src={iconCE} alt="Icono Comunidades" className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* TOTAL DE PROYECTOS FUERA DE CONTENEDOR */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
        <p className="text-lg sm:text-xl font-semibold text-gray-200">
          Total de proyectos
        </p>
        <img src={iconCE} alt="Icono Comunidades" className="w-6 h-6" />
        <span className="text-4xl sm:text-5xl font-extrabold" style={{ color: "#FFC800" }}>
          125
        </span>
      </div>

      {/* TARJETAS */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dataCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#262626] rounded-lg border border-[#3a3a3a] shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <img src={card.icon} alt="icono" className="w-5 h-5" />
                <span className="text-[16px] text-[#D5D5D5]">{card.title}</span>
              </div>

              <div className="flex items-center">
                <span className="text-3xl font-bold">{card.value}</span>
                <span
                  className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] bg-neutral-700 text-gray-300"
                  title="Información"
                >
                  i
                </span>
              </div>

              <div className="text-xs text-[#B0B0B0] mt-2">
                Actualizado el: {card.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComunidadesEnergeticasReplica;



