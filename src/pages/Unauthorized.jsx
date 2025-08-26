// src/pages/Unauthorized.jsx
// src/pages/Unauthorized.jsx
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import SecurityIcon from '../assets/svg-icons/security-Amarillo.svg';

export default function Unauthorized() {
    const { userRole } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/CentroMonitoreo'; // Redirigir al inicio con recarga
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-background bg-opacity-70 border border-[#666666] rounded-lg p-8 shadow-md w-full max-w-sm text-white">
                <div className="flex flex-col items-center space-y-4">
                    {/* Icono de seguridad personalizado */}
                    <div className="bg-[#FFC800] bg-opacity-20 p-3 rounded-full">
                        <img 
                            src={SecurityIcon} 
                            alt="Icono de seguridad" 
                            className="h-8 w-8" 
                        />
                    </div>

                    {/* Título con color amarillo */}
                    <h1 className="text-2xl font-bold text-[#FFC800]">¡Sesión expirada!</h1>
                    
                    {/* Mensaje descriptivo */}
                    <p className="text-center text-gray-300 mb-6">
                        Para proteger tu cuenta, hemos cerrado tu sesión por inactividad. ¡Es solo una medida de seguridad!
                    </p>

                    {/* Botón amarillo con icono */}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-2 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <img 
                            src={SecurityIcon} 
                            alt="Icono de seguridad" 
                            className="h-5 w-5" 
                        />
                        Iniciar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}