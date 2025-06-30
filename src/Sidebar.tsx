import { LogOut, Users, Box, Truck, Warehouse, Home as HomeIcon, Tag } from "lucide-react"; // Importa 'Tag' para el icono de Marcas y Categorias
import "./styles.css";

// Define los tipos de las props para el componente Sidebar
type Props = {
    user: {
        idUsuario: number;
        nombreUsuario: string;
        cargo: string; // Asumo que 'cargo' también es parte de tu objeto user
        rol: string;
    };
    // Define los tipos de secciones que Sidebar puede cambiar
    onSectionChange: (
        // Asegúrate de que todas tus secciones estén aquí, incluyendo "marcas" y "almacen"
        section: "home" | "usuarios" | "productos" | "proveedores" | "movimientos" | "categorias" | "marcas"
    ) => void;
    activeSection: string; // La sección actualmente activa
};

const Sidebar = ({ user, onSectionChange, activeSection }: Props) => {
    // Convierte el rol del usuario a minúsculas para una comparación consistente
    const rol = user.rol.toLowerCase();

    // Define los roles que tienen acceso a secciones restringidas (Usuarios, Marcas, Proveedores, Almacen)
    // Añadimos "gerente_almacen" para ser consistentes con la lógica de MainContent
    const rolesConPermisoRestricto = ["supervisor", "administrador"];
    const tieneAccesoRestricto = rolesConPermisoRestricto.includes(rol);

    // Array de objetos que representan los elementos del menú de navegación
    const navItems = [
        { label: "Inicio", value: "home", icon: <HomeIcon className="w-4 h-4" /> },
        // Condicionalmente muestra "Usuarios" si el rol tiene acceso restringido
        ...(tieneAccesoRestricto
            ? [{ label: "Usuarios", value: "usuarios", icon: <Users className="w-4 h-4" /> }]
            : []),
        // AÑADIDO: Condicionalmente muestra "Marcas" si el rol tiene acceso restringido
        
        { label: "Marcas", value: "marcas", icon: <Tag className="w-4 h-4" /> }, // Usa el ícono Tag   
        { label: "Categorías", value: "categorias", icon: <Tag className="w-4 h-4" /> },
        { label: "Productos", value: "productos", icon: <Box className="w-4 h-4" /> },
        // CATEGORÍAS Y MOVIMIENTOS: Los hice condicionales si también necesitan acceso restringido,
        // o puedes dejarlos fijos si son para todos los roles.
        // Usé Tag para Categorias como en tu último código, y Warehouse para Movimientos/Almacen.
      
        { label: "Movimientos", value: "movimientos", icon: <Warehouse className="w-4 h-4" /> }, // Si "Almacén" es diferente de "Movimientos"

        // Condicionalmente muestra "Proveedores" si el rol tiene acceso restringido
        ...(tieneAccesoRestricto
            ? [{ label: "Proveedores", value: "proveedores", icon: <Truck className="w-4 h-4" /> }]
            : []),
    ];

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.clear(); // Limpia el almacenamiento local (tokens, etc.)
        window.location.href = "/login"; // Redirige a la página de login
    };

    return (
        <div className="w-64 h-[calc(100%-2rem)] bg-white border shadow-lg rounded-2xl my-4 ml-4 flex flex-col justify-between p-4">
            <div>
                {/* Sección del perfil de usuario */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-bold">
                        {user.nombreUsuario.charAt(0).toUpperCase()} {/* Muestra la primera letra del nombre */}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold">{user.nombreUsuario}</h2>
                    <p className="text-sm text-gray-500">{user.rol}</p> {/* Muestra el rol del usuario */}
                </div>

                {/* Sección de navegación */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.value}
                            // Al hacer clic, cambia la sección activa en el componente padre (App.tsx)
                            onClick={() =>
                                // Casting a 'section' que incluye todos los posibles valores
                                onSectionChange(item.value as "home" | "usuarios" | "productos" | "proveedores" | "marcas" | "movimientos" | "categorias")
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeSection === item.value // Estilo para la sección activa
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon} {/* Icono del elemento de navegación */}
                            {item.label} {/* Etiqueta del elemento de navegación */}
                        </button>
                    ))}
                </nav>

                <hr className="border-t-2 border-gray-30 mb-6 mt-6" /> {/* Separador */}
            </div>

            {/* Botón de cerrar sesión */}
            <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow transition-all"
            >
                <LogOut className="w-4 h-4" /> {/* Icono de cerrar sesión */}
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Sidebar;
