// src/components/IndicadoresEnergia.jsx
import React, { useEffect, useState } from 'react';
import { API } from '../config/api';
import { CACHE_CONFIG } from '../config/cacheConfig'; 


// Configuración de caché (puedes centralizar esto en un archivo aparte)
const CACHE_PREFIX = 'indicadores-cache-';
const CACHE_EXPIRATION_MS = CACHE_CONFIG.EXPIRATION_MS; // 1 hora de expiración

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
      memoryCache.delete(key);
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
    // Limpieza de caché si está lleno
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({
        key: k,
        timestamp: JSON.parse(localStorage.getItem(k)).timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Ordenar de más antiguo a más nuevo
    
    // Eliminar los 20% más antiguos
    keys.slice(0, Math.ceil(keys.length * 0.2)).forEach(item => {
      localStorage.removeItem(item.key);
      memoryCache.delete(item.key.replace(CACHE_PREFIX, ''));
    });
    
    // Intentar nuevamente
    localStorage.setItem(`${CACHE_PREFIX}${key}`, cacheItem);
  }
};


export function IndicadoresEnergia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    async function fetchIndicadores() {
      //Generar clave de caché
      const cacheKey = `indicadores_energia_${fechaInicio}_${fechaFin}`;
      
      //Primero verificar caché
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setIndicadores(cachedData);
        setIsCached(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsCached(false);
      try {
        const res = await fetch(`${API}/v1/indicadores/energia_electrica`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        setIndicadores(data);
        setToCache(cacheKey, data); // Almacenar en caché

      } catch (err) {
        console.error(err);
        setError('No fue posible cargar los indicadores.');
      } finally {
        setLoading(false);
      }
    }
    fetchIndicadores();
  }, [fechaInicio, fechaFin]);

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
        <p className="text-gray-300">Cargando indicadores...</p>
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

  // indicadores ≈ { precio_escases: {...}, porcentaje_embalses: {...} }
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
        Indicadores Energía Eléctrica
      </h2>
      <div className="bg-[#262626] p-4 rounded-sm border border-gray-700 shadow-sm">
        {/* Precio de escasez */}
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-300">
            {indicadores.precio_escases.identificador}
          </h3>
          {indicadores.precio_escases.valor_1 !== null ? (
            <p className="text-xl text-white">
              {(indicadores.precio_escases.valor_1).toLocaleString()} {indicadores.precio_escases.unidad}
            </p>
          ) : (
            <p className="text-gray-400">Sin datos</p>
          )}
        </div>

        {/* Porcentaje embalse */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-300">
            {indicadores.porcentaje_embalses.identificador}
          </h3>
          <p className="text-xl text-white">
            {(indicadores.porcentaje_embalses.valor_1 * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-400">
            Cambio: { (indicadores.porcentaje_embalses.cambio_porcentual * 100).toFixed(2) }%
          </p>
        </div>
      </div>
    </section>
  );
}

export default IndicadoresEnergia;