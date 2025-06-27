import { useEffect, useState } from "react";
import { Categoria, Usuario } from "./types";
import { getCategorias, eliminarCategoria } from "./services/api";
import CategoryForm from "./CategoryForm";
import { FaSearch, FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const CategoryTable = ({ user }: { user: Usuario }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtros, setFiltros] = useState({ nombre: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  const puedeModificar = ["administrador", "supervisor"].includes(user.rol.toLowerCase());

  const fetchData = async () => {
    try {
      const res = await getCategorias();
      console.log("Categorías recibidas:", res.data);
      const filtradas = res.data.filter((c: Categoria) =>
        c.nombreCategoria.toLowerCase().includes(filtros.nombre.trim().toLowerCase())
      );
      setCategorias(filtradas);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Solo se ejecuta al montar

  const abrirModal = (categoria?: Categoria) => {
    setCategoriaSeleccionada(categoria || null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setCategoriaSeleccionada(null);
    setMostrarModal(false);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros */}
      <div className="w-4/5 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={filtros.nombre}
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
              placeholder="Buscar por nombre"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <FaSearch />
            </button>
            {puedeModificar && (
              <button onClick={() => abrirModal()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                <FaPlus />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="w-4/5 bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              {puedeModificar && <th className="px-4 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-gray-500 italic">No hay datos</td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.idCategoria} className="even:bg-gray-50">
                  <td className="px-4 py-3">{cat.idCategoria}</td>
                  <td className="px-4 py-3">{cat.nombreCategoria}</td>
                  <td className="px-4 py-3">{cat.descripcion}</td>
                  {puedeModificar && (
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => abrirModal(cat)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={async () => {
                          if (cat.idCategoria) {
                            await eliminarCategoria(cat.idCategoria);
                            fetchData();
                          }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <CategoryForm
          initialData={categoriaSeleccionada || undefined}
          onClose={cerrarModal}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default CategoryTable;