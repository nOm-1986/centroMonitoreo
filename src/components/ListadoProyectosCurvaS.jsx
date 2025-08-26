// src/components/ListadoProyectosCurvaS.jsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig'; 

// Configuración de caché
const CACHE_PREFIX = 'chart-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS; 

// Caché en memoria para la sesión actual
const memoryCache = new Map();

// Helper para obtener datos del caché
const getFromCache = (key) => {
  // Primero verificar caché en memoria
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  // Si no está en memoria, verificar localStorage
  const cachedItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!cachedItem) return null;

  try {
    const { data, timestamp } = JSON.parse(cachedItem);
    
    // Verificar si el caché ha expirado
    if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    // Almacenar en memoria para acceso más rápido
    memoryCache.set(key, data);
    return data;
  } catch (e) {
    console.error('Error parsing cache', e);
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
};

// Helper para guardar datos en el caché
const setToCache = (key, data) => {
  const timestamp = Date.now();
  const cacheItem = JSON.stringify({ data, timestamp });
  
  // Almacenar en ambos niveles de caché
  memoryCache.set(key, data);
  
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  } catch (e) {
    console.error('LocalStorage is full, clearing oldest items...');
    // Limpieza de caché si está lleno (mantener solo los 50 más recientes)
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({
        key: k,
        timestamp: JSON.parse(localStorage.getItem(k)).timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    keys.slice(50).forEach(item => {
      localStorage.removeItem(item.key);
    });
    
    // Intentar nuevamente
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  }
};

export function ListadoProyectosCurvaS() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProyectos() {
      //crear clave de caché
      
      // Recomendado (si puede variar por usuario/filtros)
      const cacheKey = 'listado_proyectos_curva_s';
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setProyectos(cachedData);
        setLoading(false);
        return;   
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/v1/graficas/6g_proyecto/listado_proyectos_curva_s`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProyectos(data);

          
        setToCache(cacheKey, data); // Almacenar en caché

      } catch (err) {
        console.error(err);
        setError('No fue posible cargar el listado de proyectos para curva S.');
      } finally {
        setLoading(false);
      }
    }
    fetchProyectos();
  }, []);

  if (loading) {
    return (
       <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
        ></div>
      </div>
        <p className="text-gray-300">Cargando listado de proyectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Preparar opciones para la curva S
  const chartOptions = {
    chart: {
      type: 'spline',
      backgroundColor: '#262626',
      plotBorderColor: '#444',
      plotBorderWidth: 1
    },
    title: {
      text: 'Curva S de Proyectos',
      style: { color: '#fff', fontSize: '20px' }
    },
    xAxis: {
      categories: proyectos.map(p => p.id),
      title: { text: 'ID del Proyecto', style: { color: '#ccc' } },
      labels: { style: { color: '#ccc' } },
      gridLineColor: '#444'
    },
    yAxis: {
      title: { text: '% de Avance', style: { color: '#ccc' } },
      labels: { style: { color: '#ccc' } },
      gridLineColor: '#444',
      max: 100,
      min: 0
    },
    series: [
      {
        name: '% Avance',
        data: proyectos.map(p =>
          p.porcentaje_avance != null ? p.porcentaje_avance : 0
        ),
        marker: { enabled: true }
      }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: '#ccc' } }
  };

   

  return (
    <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Proyectos (Curva S)</h2>

      {/* Gráfica Curva S */}
      <div className="mb-6 relative">
        <button
        className="absolute top-[10px] right-[45px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow-sm hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="rounded-full"
        >
          <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="16"
            fill="#fff"
            fontWeight="bold"
            fontFamily="Nunito Sans, sans-serif"
            pointerEvents="none"
          >?</text>
        </svg>
      </button>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Tabla de Proyectos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-sm text-white font-sans">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Tecnología</th>
              <th className="px-3 py-2 text-left">Ciclo</th>
              <th className="px-3 py-2 text-left">Promotor</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Capacidad (MW)</th>
              <th className="px-3 py-2 text-left">Departamento</th>
              <th className="px-3 py-2 text-left">Municipio</th>
              <th className="px-3 py-2 text-left">FPO</th>
              <th className="px-3 py-2 text-left">% Avance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {proyectos.map((p, i) => (
              <tr key={i} className="hover:bg-gray-800">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.nombre_proyecto}</td>
                <td className="px-3 py-2">{p.tipo_proyecto}</td>
                <td className="px-3 py-2">{p.tecnologia}</td>
                <td className="px-3 py-2">{p.ciclo_asignacion}</td>
                <td className="px-3 py-2">{p.promotor}</td>
                <td className="px-3 py-2">{p.estado_proyecto}</td>
                <td className="px-3 py-2">{p.capacidad_instalada_mw}</td>
                <td className="px-3 py-2">{p.departamento}</td>
                <td className="px-3 py-2">{p.municipio || '-'}</td>
                <td className="px-3 py-2">
                  {p.fpo ? p.fpo.split('T')[0] : '-'}
                </td>
                <td className="px-3 py-2">
                  {p.porcentaje_avance != null
                    ? `${p.porcentaje_avance}%`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListadoProyectosCurvaS;
