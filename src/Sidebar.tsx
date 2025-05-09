import { LogOut, Users, Box, Truck, Warehouse } from "lucide-react"; // Asegúrate de que Warehouse esté disponible o usa otro ícono
import "./styles.css";

type Props = {
  user: {
    idUsuario: number;
    nombreUsuario: string;
    cargo: string;
    rol: string;
  };
  onSectionChange: (
    section: "usuarios" | "productos" | "proveedores" | "almacen"
  ) => void;
  activeSection: string;
};

const Sidebar = ({ user, onSectionChange, activeSection }: Props) => {
  const puedeVerProveedores = ["supervisor", "administrador", "gerente_almacen"].includes(
    user.rol.toLowerCase()
  );

  const navItems = [
    { label: "Usuarios", value: "usuarios", icon: <Users className="w-4 h-4" /> },
    { label: "Productos", value: "productos", icon: <Box className="w-4 h-4" /> },
    { label: "Almacén", value: "almacen", icon: <Warehouse className="w-4 h-4" /> }, // Nueva opción
    ...(puedeVerProveedores
      ? [{ label: "Proveedores", value: "proveedores", icon: <Truck className="w-4 h-4" /> }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-[calc(100%-2rem)] bg-white border shadow-lg rounded-2xl my-4 ml-4 flex flex-col justify-between p-4">
      <div>
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-bold">
            {user.nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-lg font-semibold">{user.nombreUsuario}</h2>
          <p className="text-sm text-gray-500">{user.rol}</p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() =>
                onSectionChange(item.value as "usuarios" | "productos" | "proveedores" | "almacen")
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${
                  activeSection === item.value
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <hr className="border-t-2 border-gray-30 mb-6 mt-6" />
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow transition-all"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
