import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES, ROLE_PERMISSIONS } from '../config/roles';

import { useTheme } from './ThemeProvider';

import GWOff from '../assets/svg-icons/6GW-off.svg';
import GWOn from '../assets/svg-icons/6GW-on.svg';
import ComunidadesEnergOff from '../assets/svg-icons/ComunidadesEnerg-Off.svg';
import ComunidadesEnergOn from '../assets/svg-icons/ComunidadesEnerg-On.svg';
import Proyecto075Off from '../assets/svg-icons/Proyecto075-Off.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import AccionesEstrategicasOff from '../assets/svg-icons/AccionesEstrategicas-Off.svg';
import AccionesEstrategicasOn from '../assets/svg-icons/AccionesEstrategicas-On.svg';
import ProyectosTransmisionOn from '../assets/svg-icons/Transmision-On.svg';
import ProyectosTransmisionOff from '../assets/svg-icons/Transmision-Off.svg';

// NUEVOS: Hidrología y Energía firme (usa tus propios SVG si los tienes)
import HidroOff from '../assets/svg-icons/Hidrologia-Off.svg';
import HidroOn  from '../assets/svg-icons/Hidrologia-On.svg';

// Placeholder para Energía firme usando los de energía eléctrica:
import EnergiaFirmeOff from '../assets/svg-icons/EnergiaElectrica-Off.svg';
import EnergiaFirmeOn  from '../assets/svg-icons/EnergiaElectrica-On.svg';

// * All this must be converted to an React-Component: see https://www.svgr.com for detaills.  

export function Sidebar({ open, toggle, userRole }) {
  const { theme, setTheme } = useTheme(); 
  const { pathname } = useLocation();

  const hasPermission = (permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole];
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  };

  const isInAllowedRoles = (allowedRolesArray) => {
    if (!userRole) return false;
    if (!allowedRolesArray || allowedRolesArray.length === 0) return true;
    return allowedRolesArray.includes(userRole);
  };
  // ------------------------------------------

  // -------- estructura de secciones/ítems --------
  const sections = [
   /*  {
      title: 'Inicio',
      path: '/',
      icon: DashboardOff,
      activeIcon: DashboardOn,
      permission: 'dashboard',
    },
      permission: 'dashboard' // Asumimos que la ruta de inicio también requiere el permiso de dashboard
    }, */

    {
      title: 'SEGUIMIENTO PLAN 6GW+',
      items: [
        {
          title: 'Resumen',
          path: '/6GW+',
          icon: GWOff,
          activeIcon: GWOn,
          permission: 'dashboard',
        },
        {
          title: 'Proyectos 075',
          path: '/proyectos075',
          icon: Proyecto075Off,
          activeIcon: Proyecto075On,
          permission: 'proyectos',
        },
        {
          title: 'Transmisión',
          path: '/Transmision',
          icon: ProyectosTransmisionOff,
          activeIcon: ProyectosTransmisionOn,
          roles: [ROLES.ADMIN],
        },
        {
          title: 'Comunidades energéticas',
          path: '/en_construccion',
          icon: ComunidadesEnergOff,
          activeIcon: ComunidadesEnergOn,
          permission: 'comunidades',
        },
        {
          title: 'Acciones 6GW+',
          path: 'http://192.168.1.74:8065/boards/',
          icon: AccionesEstrategicasOff,
          activeIcon: AccionesEstrategicasOn,
          roles: [ROLES.ADMIN],
          external: true,
        },
      ],
    },
    // ---- NUEVA SECCIÓN: ABASTECIMIENTO ----
    {
      title: 'ABASTECIMIENTO',
      items: [
        {
          title: 'Hidrología',
          path: '/hidrologia',
          icon: HidroOff,
          activeIcon: HidroOn,
          permission: 'dashboard', // cambia a 'hidrologia' si defines ese permiso
        },
        {
          title: 'Energía firme',
          path: '/en_construccion', // cambia cuando tengas la página real
          icon: EnergiaFirmeOff,
          activeIcon: EnergiaFirmeOn,
          permission: 'dashboard',
        },
      ],
    },
  ];
  // -----------------------------------------------

  return (
    <aside
      className={`bg-sidebar font-sans mt-3 sticky top-24 text-gray-300 h-screen overflow-y-auto flex flex-col transition-all duration-300 ${
        open ? 'w-1/6 p-4' : 'w-16 p-2'
      }`}
    >
      {/* Botón toggle */}
      <div className="flex justify-end mb-4">
        <button onClick={toggle} className="text-white focus:outline-hidden" title="Expandir/Contraer">
          {open ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      <nav className="flex-1 space-y-6">
        {sections.map((section, si) => {
          let showSection = false;

          if (section.items) {
            showSection = section.items.some((item) =>
              (item.permission && hasPermission(item.permission)) ||
              (item.roles && isInAllowedRoles(item.roles)) ||
              (!item.permission && !item.roles)
            );
          } else {
            showSection =
              (section.permission && hasPermission(section.permission)) ||
              (section.roles && isInAllowedRoles(section.roles)) ||
              (!section.permission && !section.roles);
          }

          return (
            showSection && (
              <div key={si}>
                {section.items ? (
                  <>
                    <h4
                      className={`text-sm font-semibold text-[#D1D1D0] mb-2 ${
                        open ? '' : 'sr-only'
                      }`}
                    >
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => {
                        const showItem =
                          (item.permission && hasPermission(item.permission)) ||
                          (item.roles && isInAllowedRoles(item.roles)) ||
                          (!item.permission && !item.roles);

                        const isActive = pathname === item.path;
                        const IconSVG = isActive ? item.activeIcon : item.icon;

                        return (
                          showItem && (
                            <li key={i}>
                              {item.external ? (
                                <a
                                  href={item.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                                    isActive ? 'bg-[#333333]' : ''
                                  }`}
                                >
                                  <img src={IconSVG} alt={item.title} className="w-6 h-6 shrink-0" />
                                  {open && (
                                    <span
                                      className={`ml-3 text-base whitespace-nowrap ${
                                        isActive ? 'text-[#FFC800]' : 'text-gray-300'
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                  )}
                                </a>
                              ) : (
                                <Link
                                  to={item.path}
                                  className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                                    isActive ? 'bg-[#333333]' : ''
                                  }`}
                                >
                                  <img src={IconSVG} alt={item.title} className="w-6 h-6 shrink-0" />
                                  {open && (
                                    <span
                                      className={`ml-3 text-base whitespace-nowrap ${
                                        isActive ? 'text-[#FFC800]' : 'text-gray-300'
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                  )}
                                </Link>
                              )}
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={section.path}
                    className={`flex items-center px-2 py-1 rounded font-semibold hover:bg-gray-700 transition ${
                      pathname === section.path ? 'text-[#FFC800]' : 'text-gray-300'
                    }`}
                  >
                    <img
                      src={section.activeIcon || section.icon}
                      alt={section.title}
                      className="w-5 h-5 shrink-0"
                    />
                    {open && <span className="ml-3">{section.title}</span>}
                  </Link>
                )}
              </div>
            )
          );
        })}

        <button onClick={() => {
          console.log("click")
          setTheme(theme === "dark" ? "light" : "dark")}}>
          Change theme
        </button>
      </nav>
    </aside>
  );
}
