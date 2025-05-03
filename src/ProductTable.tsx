import { useEffect, useState } from "react";
import { getProductos, eliminarProducto } from "./services/api";
import { Producto, Usuario } from "./types";
import ProductForm from "./ProductForm";
import {
  Search,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

const ProductTable = ({ user }: { user: Usuario }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtros, setFiltros] = useState({ id: "", nombre: "", stock: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const fetchData = async () => {
    const res = await getProductos();
    const filtrados = res.data.filter((producto: Producto) =>
      (filtros.id === "" || producto.idProducto!.toString().includes(filtros.id)) &&
      producto.nombreProducto.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      (filtros.stock === "" || producto.stockMinimo.toString().includes(filtros.stock))
    );
    setProductos(filtrados);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const puedeModificar = ["supervisor", "almacenero", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros */}
      <div className="w-[95%] bg-white p-4 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de Producto</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID"
              value={filtros.id}
              onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
              value={filtros.nombre}
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Stock mínimo"
              value={filtros.stock}
              onChange={(e) => setFiltros({ ...filtros, stock: e.target.value })}
            />
          </div>
          <button
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={fetchData}
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          {puedeModificar && (
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                setProductoSeleccionado(null);
                setMostrarModal(true);
              }}
              title="Nuevo Producto"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="w-[95%] bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center table-auto">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Stock Actual</th>
              <th className="px-4 py-3">Stock Mínimo</th>
              {puedeModificar && <th className="px-4 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {productos.map((producto) => (
              <tr key={producto.idProducto} className="even:bg-gray-50">
                <td className="px-4 py-3">{producto.idProducto}</td>
                <td className="px-4 py-3">{producto.nombreProducto}</td>
                <td className="px-4 py-3">{producto.descripcion}</td>
                <td className="px-4 py-3">
                  {producto.estado ? (
                    <span className="text-green-600 font-semibold">Activo</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactivo</span>
                  )}
                </td>
                <td className="px-4 py-3">{producto.stockActual}</td>
                <td className="px-4 py-3">{producto.stockMinimo}</td>
                {puedeModificar && (
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      onClick={() => {
                        setProductoSeleccionado(producto);
                        setMostrarModal(true);
                      }}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => eliminarProducto(producto.idProducto!).then(fetchData)}
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
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <ProductForm
              initialData={productoSeleccionado || undefined}
              onClose={() => {
                setMostrarModal(false);
                setProductoSeleccionado(null);
              }}
              onSuccess={fetchData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
