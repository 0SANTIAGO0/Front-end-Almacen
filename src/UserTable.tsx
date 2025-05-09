import { useEffect, useState } from "react";
import { getUsuarios, eliminarUsuario } from "./services/api";
import { Usuario } from "./types";
import UserForm from "./UserForm";
import {
  Search,
  UserPlus,
  Trash2,
  Pencil
} from "lucide-react";

interface UserTableProps {
  user: Usuario;
}

const UserTable = ({ user }: UserTableProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtros, setFiltros] = useState({ nombre: "", correo: "", rol: "" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | undefined>(undefined);
  const [noResultados, setNoResultados] = useState(false); // Estado para mostrar el mensaje

  const fetchData = async () => {
    const res = await getUsuarios();
    const filtrados = res.data.filter((u: Usuario) =>
      u.nombreUsuario.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      u.correo.toLowerCase().includes(filtros.correo.toLowerCase()) &&
      (filtros.rol ? u.rol.toLowerCase() === filtros.rol.toLowerCase() : true)
    );
    setUsuarios(filtrados);
    setNoResultados(filtrados.length === 0); // Establecer si no hay resultados
  };

  useEffect(() => {
    fetchData();
  }, []);

  const puedeModificar = ["administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros */}
      <div id="barraUsuario" className="w-4/5 bg-white p-4 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Buscar por nombre"
              value={filtros.nombre}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              type="text"
              name="correo"
              placeholder="Buscar por correo"
              value={filtros.correo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="rol"
              value={filtros.rol}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="administrador">Administrador</option>
              <option value="gerente_almacen">Gerente Almacén</option>
              <option value="almacenero">Almacenero</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          {puedeModificar && (
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                setUsuarioSeleccionado(undefined);
                setMostrarFormulario(true);
              }}
              title="Nuevo Usuario"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div id="tableUsuario" className="w-4/5 bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              {puedeModificar && <th className="px-4 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {usuarios.map((usuario) => (
              <tr key={usuario.idUsuario} className="even:bg-gray-50">
                <td className="px-4 py-3">{usuario.nombreUsuario}</td>
                <td className="px-4 py-3">{usuario.correo}</td>
                <td className="px-4 py-3 capitalize">{usuario.rol}</td>
                <td className="px-4 py-3">
                  {usuario.estado ? (
                    <span className="text-green-600 font-semibold">Activo</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactivo</span>
                  )}
                </td>
                {puedeModificar && (
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      onClick={() => {
                        setUsuarioSeleccionado(usuario);
                        setMostrarFormulario(true);
                      }}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => eliminarUsuario(usuario.idUsuario!).then(fetchData)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mensaje si no se encuentran resultados */}
      </div>
        {noResultados && (
            <div className="p-4 text-center text-gray-600">No se encontraron datos con los filtros ingresados.</div>
          )}
          
      {/* Modal */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <UserForm
              initialData={usuarioSeleccionado}
              onClose={() => {
                setMostrarFormulario(false);
                setUsuarioSeleccionado(undefined);
              }}
              onSuccess={fetchData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
