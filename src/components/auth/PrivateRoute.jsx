// src/components/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Asegúrate de importar ROLES y ROLE_PERMISSIONS desde tu archivo de configuración de roles
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';
import { ROLES, ROLE_PERMISSIONS } from '../../config/roles';

/**
 * Componente PrivateRoute para proteger rutas de tu aplicación.
 * Verifica la autenticación, el dominio del correo y los roles/permisos del usuario.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que se renderizarán si el usuario tiene acceso.
 * @param {string} [props.requiredPermission] - Un permiso específico (ej. 'dashboard', 'proyectos')
 * que el rol del usuario debe tener para acceder a esta ruta. Si se omite, no se verifica permiso específico.
 * @param {string[]} [props.allowedRoles] - Un array de roles permitidos explícitamente para esta ruta.
 * Si se proporciona, esta verificación tiene prioridad sobre `requiredPermission`.
 * @param {string} [props.unauthenticatedRedirect = '/login'] - Ruta a la que redirigir si el usuario no está autenticado.
 * @param {string} [props.unauthorizedRedirect = '/unauthorized'] - Ruta a la que redirigir si el usuario está autenticado
 * pero no tiene el rol/permiso necesario o su dominio no está autorizado.
 */
export default function PrivateRoute({
  children,
  requiredPermission, // Propiedad para un permiso específico
  allowedRoles,       // Propiedad para roles específicos permitidos
  unauthenticatedRedirect = '/login', // Redirección si no está logueado
  //unauthorizedRedirect = '/unauthorized' // Redirección si no está autorizado (pero sí logueado)
  unauthorizedRedirect = '/login'
}) {
  const { currentUser, userRole, loading } = useAuth();

  // 1. Manejo del estado de carga:
  // Muestra un spinner o mensaje de "Cargando..." mientras se verifica el estado de autenticación y el rol.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC800] mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // 2. Manejo de usuarios NO autenticados:
  // Si no hay un usuario logueado (`currentUser` es nulo), redirige a la página de login.
  if (!currentUser) {
    return <Navigate to={unauthenticatedRedirect} replace />;
  }

  // 3. Manejo de autorización de dominio:
  // Verifica si el dominio del correo del usuario logueado está en tu lista de dominios permitidos.
  const isDomainAuthorized = ALLOWED_DOMAINS.some(domain =>
    currentUser.email?.endsWith(`@${domain}`) || currentUser.email?.endsWith(`.${domain}`)
  );

  if (!isDomainAuthorized) {
    // Si el dominio no está autorizado, redirige a la página de "no autorizado".
    // (La lógica de `AuthButton` ya debería haber cerrado la sesión si el dominio no es válido,
    // pero esta es una capa de seguridad adicional en la ruta).
    console.warn(`Acceso denegado por dominio: ${currentUser.email} en la ruta ${window.location.pathname}`);
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // 4. Manejo de autorización por Rol y Permiso:
  // Esta función interna determina si el usuario tiene el acceso requerido para la ruta actual.
  const hasRequiredAccess = () => {
    // Si el usuario no tiene un rol asignado (por ejemplo, un error en la carga del rol), deniega el acceso.
    if (!userRole) {
      console.warn("Usuario autenticado pero sin rol asignado. Acceso denegado.");
      return false;
    }

    // A. Si se especifican `allowedRoles` (roles explícitos permitidos para esta ruta):
    // Esta verificación tiene prioridad. Solo se permite si el `userRole` está en esa lista.
    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.includes(userRole);
    }

    // B. Si no se especifican `allowedRoles`, verifica por `requiredPermission`:
    if (requiredPermission) {
      // Obtiene la lista de permisos para el rol actual del usuario.
      const permissionsForUserRole = ROLE_PERMISSIONS[userRole];

      // Si no hay permisos definidos para el rol del usuario o no es un array, deniega el acceso.
      if (!permissionsForUserRole || !Array.isArray(permissionsForUserRole)) {
        console.warn(`No hay permisos definidos para el rol: ${userRole}`);
        return false;
      }

      // Si el rol tiene el permiso de acceso total ('*'), entonces tiene acceso.
      if (permissionsForUserRole.includes('*')) {
        return true;
      }

      // Finalmente, verifica si el rol del usuario tiene el permiso específico requerido para esta ruta.
      return permissionsForUserRole.includes(requiredPermission);
    }

    // C. Si no se requiere `allowedRoles` ni `requiredPermission`,
    // y el usuario ya está autenticado y con dominio autorizado, concede el acceso.
    return true;
  };

  // Si la función `hasRequiredAccess()` devuelve `false`, redirige a la página de "no autorizado".
  if (!hasRequiredAccess()) {
    console.warn(`Acceso denegado para el rol '${userRole}' en la ruta ${window.location.pathname}. Permiso requerido: '${requiredPermission}' o no está en los roles permitidos: [${allowedRoles?.join(', ')}]`);
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Si todas las verificaciones pasan, renderiza los componentes hijos (la página a la que quería acceder).
  return children;
}