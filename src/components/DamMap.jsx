import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import { CircleMarker, GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useHidrologiaConsolidado } from '../services/indicadoresService';

import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

import REGIONES_URL from "../assets/geojson/RegionesHidro.geojson?url";


const regionBackground = {
  antioquia: "#9168EA",
  caldas: "#F06B6B",
  caribe: "#3B82F6",
  centro: "#F97316",
  oriente: "#FFC800",
  valle: "#32BF6F",
};

const TrendChip = ({ dir = '+', children }) => {
  const isUp = dir === '+';
  const bg = isUp ? '#22C55E' : '#EF4444';
  return (
    <span
      className="
        inline-flex items-center px-3 py-0.5 ml-2
        rounded-full text-sm font-semibold
        whitespace-nowrap leading-none
      "
      style={{
        backgroundColor: bg,
        color: '#fff',
        border: '1px solid rgba(0,0,0,.15)',
      }}
    >
      <span className="leading-none" style={{ color: '#fff' }}>{children}</span>
    </span>
  );
}

function fmtNum(val, suf) {
  const n = Number(val);
  return Number.isFinite(n)
    ? n.toLocaleString("es-CO", { maximumFractionDigits: 2 }) +
        (suf ? " " + suf : "")
    : "N/D";
}

const flattenData = (regiones) => {
    const result = [];
    regiones.forEach((region) => {
      region.embalses.forEach((embalse) => {
        result.push({
          region_id: region.id,
          region_nombre: region.nombre,
          region_nivel: region.resumen?.nivel || "",
          region_aportes_hidricos: region.resumen?.aportes_hidricos || "",
          region_capacidad_generacion: region.resumen?.capacidad_generacion_mw || "",

          embalse_nombre: embalse.nombre,
          embalse_id: embalse.id,
          coordenadas: embalse.coordinates,

          embalse_nivel: embalse.resumen?.nivel || "",
          embalse_aportes_hidricos: embalse.resumen?.aportes_hidricos || "",
          embalse_capacidad_generacion_mw: embalse.resumen?.capacidad_generacion_mw || "",
          embalse_recurso: embalse.resumen?.recurso || "",

          embalse_volumen_gwh_dia: embalse.detalle_embalse?.volumen_gwh_dia || "",
          embalse_detalle_nivel: embalse.detalle_embalse?.nivel || "",
          embalse_capacidad_gwh_dia: embalse.detalle_embalse?.capacidad_gwh_dia || "",

          embalse_aportes_gwh_dia: embalse.detalle_aportes?.aportes_gwh_dia || "",
          embalse_porcentaje: embalse.detalle_aportes?.porcentaje || "",
          embalse_media_historica_gwh_dia: embalse.detalle_aportes?.media_historica_gwh_dia || "",
          embalse_porcentaje_aportes_sin_delta: embalse.detalle_aportes?.porcentaje_aportes_sin_delta || "",
        });
      });
    });
  return result;
};

const getDataParenthesis = (data) => {
  const regex = /\(([^()]*)\)/;
  const coincidencias = data.match(regex);
  return {valor: coincidencias[1], signo: coincidencias[1][0]}
};

const getDataWithoutParenthesis = (data) => {
    const textoSinParentesis = data.replace(/\([^)]*\)/g, "");
    return textoSinParentesis
  }

const RegionDialog = ({ coords, damProperties }) => {
  const [open, setOpen] = useState(false);

  const region = damProperties["region_nombre"];
  const color = region ? regionBackground[region.toLowerCase()] : '#22c55e';

  const date = "27/10/2025"; // Fecha
  const embalse_nombre = damProperties.embalse_nombre ?? "Sin Nombre";
  //const embalse_id = damProperties.embalse_id ?? "Sin Id";
  const embalse_nivel = damProperties.embalse_nivel; // Nivel de embalse
  const embalse_aportes_hidricos = damProperties.embalse_aportes_hidricos; // Aportes hídricos -- respecto al día anterior
  const embalse_capacidad_generacion_mw = damProperties.embalse_capacidad_generacion_mw; // Capacidad del recurso de generacion
  const embalse_volumen_string = getDataWithoutParenthesis(damProperties.embalse_volumen_gwh_dia); // Volumen
  const embalse_volumen_delta = getDataParenthesis(damProperties.embalse_volumen_gwh_dia); // Volumen
  const embalse_detalle_nivel = damProperties.embalse_detalle_nivel;
  const embalse_capacidad_gwh_dia = damProperties.embalse_capacidad_gwh_dia; // Capacidd del embalse
  const embalse_aportes_string = getDataWithoutParenthesis(damProperties.embalse_aportes_gwh_dia); // Aportes hídricos --- variación 1ero sin lo del
  const embalse_aportes_delta = getDataParenthesis(damProperties.embalse_aportes_gwh_dia); // Aportes hídricos --- variación 1ero sin lo del
  const embalse_porcentaje = damProperties.embalse_porcentaje;
  const embalse_media_historica_gwh_dia = damProperties.embalse_media_historica_gwh_dia; // Aportes medios históricos
  const embalse_porcentaje_aportes_sin_delta = damProperties.embalse_porcentaje_aportes_sin_delta; // Aportes medios históricos
  const embalse_recurso = damProperties.embalse_recurso; // Recurso

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <CircleMarker
          center={[coords[1], coords[0]]}
          radius={6}
          pathOptions={{
            color: "#000",
            fillColor: color,
            weight: 1.4,
            fillOpacity: 0.9,
          }}
          eventHandlers={{
            click: () => {
              setOpen(true);
            },
          }}
        />
      </DialogTrigger>
      <DialogContent>
        {/* ! Contenido */}
        <div className="p-4 space-y-3">
          <div>
            <div className="flex justify-between">
              <h3 className="text-white text-lg font-bold tracking-wide justify-self-start">
                {embalse_nombre}
              </h3>
              <span
                className="rounded-full border-none text-[11px] text-gray-200 py-2 px-3 mr-2"
                style={{
                  backgroundColor: color,
                  mixBlendMode: "difference",
                  color: "white",
                }}
              >
                Región: {region}
              </span>
            </div>
            <span className="text-[11px] text-[#b0b0b0]">
              Datos promedio {date}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xl">
            <div className="bg-white/5 border border-white/20 rounded-lg">
              <div className="flex justify-between p-3">
                <span className="block text-sm text-white">
                  Nivel embalse:
                </span>
                <span className="font-bold text-sm">{embalse_nivel}</span>
              </div>
              <div className="flex-1 h-3 rounded-sm overflow-hidden bg-[#575756] mx-3">
                <div
                  className="h-3"
                  style={{ width: `${embalse_nivel}%`, background: "#22C55E" }}
                />
              </div>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-lg p-3">
              <span className="block text-sm text-white">
                Aportes hídricos:
              </span>
              <span className="font-bold text-sm">{embalse_aportes_string} GWh-día -- {embalse_aportes_hidricos}</span>
            </div>
          </div>
          <div className="w-full">
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 text-sm flex justify-between">
              <span className="text-[13px]">● Volumen:</span>
              <span>
                {embalse_volumen_string}
                <TrendChip dir={embalse_volumen_delta.signo}>{embalse_volumen_delta.valor}</TrendChip>
              </span>
            </div>
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 flex text-sm justify-between">
              <span className="text-[13px]">● Aportes hídricos:</span>
              <span>
                {embalse_aportes_string} GWh-día ({embalse_porcentaje_aportes_sin_delta}%)
                <TrendChip dir={embalse_aportes_delta.signo}>{embalse_aportes_delta.valor}</TrendChip>
              </span>
            </div>
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 flex text-sm justify-between">
              <span className="text-[13px]">● Capacidad del embalse:</span>{" "}
              <span>{embalse_capacidad_gwh_dia}</span>
            </div>
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 flex text-sm justify-between">
              <span className="text-[13px]">● Recurso de generación:</span>{" "}
              <span>{embalse_recurso}</span>
            </div>
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 flex text-sm justify-between">
              <span className="text-[13px]">
                ● Capacidad del recurso de generación:
              </span>{" "}
              <span>{embalse_capacidad_generacion_mw}</span>
            </div>
            <div className="pl-1 p-4 border-b-[1px] border-[#575756]/50 flex text-sm justify-between">
              <span className="text-[13px]">● Aportes medios históricos:</span>{" "}
              <span>{embalse_media_historica_gwh_dia}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const DamMap = () => {
  const [regiones, setRegiones] = useState(null);
  const [dataApi, setDataApi] = useState([]);
  const [loadingGeoJSON, setLoadingGeoJSON] = useState(true);

  useEffect(() => {
    Promise.all([fetch(REGIONES_URL)])
      .then(async ([r1]) => {
        const regionesJson = await r1.json();
        setRegiones(regionesJson);
        setLoadingGeoJSON(false);
      })
      .catch((err) => {
        console.error("Error cargando GeoJSON:", err);
        setLoadingGeoJSON(false);
      });
  }, []);

  const { data: consolidadoData, isLoading: loadingData } = useHidrologiaConsolidado();
  
  useEffect(() => {
    if (!consolidadoData) return;
    
    try {
      const flattened = flattenData(consolidadoData.regiones || []);
      setDataApi(flattened);
    } catch (error) {
      console.error('Error procesando datos consolidado:', error);
    }
  }, [consolidadoData]);
  
  const loading = loadingData || loadingGeoJSON;

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="max-h-[800px] h-screen  w-screen bg-[#0b1220] z-0 ">
      <MapContainer
        center={[4.6, -74.1]}
        zoom={6}
        className="h-full w-full"
        closePopupOnClick={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {regiones && (
          <GeoJSON
            data={regiones}
            style={(feature) => {
              const name = feature.properties.Region || null;
              const color = name ? regionBackground[name.toLowerCase()] : '#22c55e';

              return {
                color,
                weight: 1.4,
                fillColor: color,
                fillOpacity: 0.25,
              };
            }}
          />
        )}

        {dataApi &&
          dataApi.map((f, index) => {
            const coords = f.coordenadas;

            return (
              <RegionDialog
                key={index}
                coords={coords}
                damProperties={f}
              />
            );
          })}
      </MapContainer>
    </div>
  );
}

export { DamMap };
