// src/components/auth/AuthButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, microsoftProvider } from '../../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'; // Importar onAuthStateChanged
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logosEnergiaUpme.svg';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';


export default function AuthButton() {
  // Estado para mensajes de error al usuario
  const [error, setError] = useState('');

  // Estados de carga:
  // unifiedLoading: Booleano para controlar el spinner global que cubre toda la pantalla.
  // Inicia en true para que el spinner se muestre durante la verificación inicial de autenticación.
  const [unifiedLoading, setUnifiedLoading] = useState(true);

  // buttonLoading: Objeto para controlar el estado de carga de cada botón de proveedor (Google/Microsoft).
  const [buttonLoading, setButtonLoading] = useState({ google: false, microsoft: false });

  // Hooks de React Router para navegación y obtener la ruta actual
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el usuario actual y la función para actualizar su rol desde el contexto de autenticación
  const { updateUserRole, currentUser } = useAuth();

  
  

  /**
   * Función memoizada para validar el correo electrónico del usuario con una API externa.
   * Utiliza useCallback para evitar re-renderizados innecesarios.
   * @param {string} email - El correo electrónico a validar.
   * @returns {Promise<{isValid: boolean, error?: string, role?: string, userData?: object}>}
   */
  const validateEmailWithAPI = useCallback(async (email) => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwAOie4leu3GxulRCYziBv0-OTqyXxkJ77JUBFwBa4xvfUlKiTqGdvhXaLSm7UtJMp9/exec?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error('Error al validar el email con la API');
      }

      const data = await response.json();

      // Bandera: La API respondió exitosamente y contiene resultados.
      if (!data.success || !data.results || data.results.length === 0) {
        return { isValid: false, error: 'Correo no encontrado en la lista de autorizados.' };
      }

      const userData = data.results[0];
      // Bandera: El usuario tiene acceso permitido según la propiedad 'acceso' en la API.
      if (!userData.acceso) {
        return { isValid: false, error: 'Usuario no tiene acceso permitido según la lista.' };
      }

      // Bandera: Todas las validaciones de la API son exitosas.
      return {
        isValid: true,
        role: userData.rol,
        userData: userData
      };
    } catch (err) {
      console.error("Error en validación de email con API:", err);
      return { isValid: false, error: 'Error al comunicarse con el servicio de autorización.' };
    }
  }, []);

  /**
   * Realiza la verificación completa de autorización del usuario, incluyendo dominio y API.
   * Esta función es el "orquestador" de las validaciones.
   * @param {string} userEmail - El correo electrónico del usuario autenticado por Firebase.
   */
  const performAuthorizationCheck = useCallback(async (userEmail) => {
    // Activa el spinner global al iniciar la verificación de autorización
    setUnifiedLoading(true);
    setError(''); // Limpia cualquier mensaje de error previo

    let firebaseAuthSuccess = true; // Bandera: Autenticación con Firebase exitosa (viene de handleLogin o onAuthStateChanged)
    let domainAllowed = false;      // Bandera: Dominio del correo permitido
    let apiValidationSuccess = false; // Bandera: Validación con la API externa exitosa

    try {
      // 1. Validación de Dominio Permitido
      const emailDomain = userEmail.split('@')[1];
      domainAllowed = ALLOWED_DOMAINS.some(domain =>
        emailDomain === domain || userEmail.endsWith(`@${domain}`)
      );

      if (!domainAllowed) {
        await signOut(auth); // Cierra sesión inmediatamente si el dominio no está permitido
        setError(`Acceso denegado: Solo se permiten dominios de ${ALLOWED_DOMAINS.join(', ')}`);
        updateUserRole(null); // Limpia el rol en el contexto
        return; // Detiene la ejecución posterior
      }

      // 2. Validación con la API externa (solo si el dominio está permitido)
      const validation = await validateEmailWithAPI(userEmail);

      if (!validation.isValid) {
        await signOut(auth); // Cierra sesión si la validación de la API falla
        setError(validation.error || 'Correo no autorizado');
        updateUserRole(null); // Limpia el rol en el contexto
        return; // Detiene la ejecución posterior
      }

      // Bandera: Validación con la API externa exitosa
      apiValidationSuccess = true;

      // Si todas las banderas son true, actualiza el rol y navega al dashboard.
      // Aquí el condicional de banderas ya está implícito porque la función
      // solo llega a este punto si todas las validaciones previas fueron exitosas.
      if (firebaseAuthSuccess && domainAllowed && apiValidationSuccess) {
        updateUserRole(validation.role);
        // Solo navega si el usuario está actualmente en la página de login o en la raíz.
        // Esto evita redirecciones innecesarias si el usuario ya está en otra parte.
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/6GW+'); // Redirige al dashboard
        }
      }

    } catch (err) {
      console.error("Error durante la verificación de autorización:", err);
      setError('Ocurrió un error inesperado al verificar tus credenciales.');
      await signOut(auth); // Asegura el cierre de sesión ante cualquier error inesperado
      updateUserRole(null); // Limpia el rol en el contexto
    } finally {
      // Siempre desactiva los spinners al finalizar la verificación, sin importar el resultado.
      setUnifiedLoading(false);
      setButtonLoading({ google: false, microsoft: false });
    }
  }, [updateUserRole, validateEmailWithAPI, navigate, location.pathname]);

  /**
   * Efecto para manejar el estado de autenticación inicial de Firebase
   * y las subsecuentes autenticaciones/desautenticaciones.
   * Utiliza onAuthStateChanged para una gestión robusta del estado.
   */
  useEffect(() => {
    // onAuthStateChanged se ejecuta al montar el componente y cada vez que el estado de auth cambia.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si hay un usuario de Firebase logueado, procede con la verificación de autorización completa.
        await performAuthorizationCheck(user.email);
      } else {
        // Si no hay un usuario de Firebase, limpia el rol, desactiva spinners
        // y redirige a la página de login si no está ya en ella.
        updateUserRole(null);
        setUnifiedLoading(false);
        setButtonLoading({ google: false, microsoft: false });

        // Si la ruta actual no es login o la raíz, redirige al login
        if (location.pathname !== '/login' && location.pathname !== '/') {
          navigate('/login');
        }
      }
    });

    // Función de limpieza: desuscribe el listener al desmontar el componente.
    return () => unsubscribe();
  }, [performAuthorizationCheck, updateUserRole, navigate, location.pathname]);


  /**
   * Maneja el proceso de inicio de sesión con un proveedor de autenticación (Google/Microsoft).
   * @param {firebase.auth.AuthProvider} provider - El proveedor de autenticación.
   * @param {string} providerType - El tipo de proveedor ('google' o 'microsoft').
   */
  const handleLogin = async (provider, providerType) => {
    setError(''); // Limpia mensajes de error previos
    // Activa la carga del botón específico y el spinner global
    setButtonLoading(prev => ({ ...prev, [providerType]: true }));
    setUnifiedLoading(true);

    try {
      await signOut(auth); // Asegura que cualquier sesión anterior se cierre antes de iniciar una nueva.
      const result = await signInWithPopup(auth, provider); // Inicia el popup de autenticación.

      // Una vez que Firebase autentica, se procede a la verificación de autorización completa.
      // performAuthorizationCheck se encarga de la navegación o de establecer el error.
      await performAuthorizationCheck(result.user.email);

    } catch (err) {
      console.error("Error de autenticación:", err);
      // Muestra un mensaje de error más amigable si el popup fue cerrado por el usuario.
      setError(err.message.includes('popup-closed')
        ? 'El popup de inicio de sesión fue cerrado.'
        : 'Error al autenticar. Inténtalo de nuevo.');
      // En caso de error, asegura que todos los estados de carga se reinicien.
      setUnifiedLoading(false);
      setButtonLoading({ google: false, microsoft: false });
      await signOut(auth); // Asegura que la sesión de Firebase se cierre en caso de error.
    }
  };

  /**
   * Maneja el cierre de sesión del usuario.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra la sesión de Firebase.
      updateUserRole(null); // Limpia el rol del usuario en el contexto.
      navigate('/'); // Redirige a la página de inicio/login.
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  // Muestra el spinner global de carga mientras 'unifiedLoading' es true.
  // Este div está diseñado para cubrir toda la pantalla y tener un fondo consistente.
  if (unifiedLoading) {
    return (
      // 3. MODIFICADO: Se quitó el style para que el fondo no sea opaco
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-[#FFC800]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="mt-4 text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Contenido principal del componente (formulario de login o mensaje de bienvenida)
  return (
   <div className="w-full max-w-md mx-auto">
      <div className="bg-background bg-opacity-70 border border-[#666666] rounded-lg p-8 shadow-md w-full max-w-sm text-white">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Energia UPME" className="h-16 object-contain" />
        </div>

        <h1 className="text-center text-xl font-bold mb-6">Centro de Monitoreo Energético</h1>

        <div className="flex flex-col items-center gap-4">
          {/* Muestra el mensaje de bienvenida si el usuario está autenticado, de lo contrario, los botones de login */}
          {!currentUser && (
        
            <>
              <button
                onClick={() => handleLogin(googleProvider, 'google')}
                className="w-full max-w-xs bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-2 rounded-sm font-medium transition-colors flex items-center justify-center"
                disabled={buttonLoading.google} // Deshabilita el botón mientras se carga
              >
                {buttonLoading.google ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : 'Entrar con Google'}
              </button>

              <button
                onClick={() => handleLogin(microsoftProvider, 'microsoft')}
                className="w-full max-w-xs bg-[#0078D4] hover:bg-[#106EBE] text-white px-4 py-2 rounded-sm font-medium transition-colors flex items-center justify-center"
                disabled={buttonLoading.microsoft} // Deshabilita el botón mientras se carga
              >
                {buttonLoading.microsoft ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : 'Entrar con Microsoft'}
              </button>
            </>
          )}

          {/* Muestra mensajes de error si existen */}
          {error && (
            <p className="mt-2 text-sm text-red-500 text-center w-full">
              {error}
            </p>
          )}
        </div>
      </div>
      </div>
    
  );
}