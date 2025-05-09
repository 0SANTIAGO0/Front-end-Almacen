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
  const [filtros, setFiltros] = useState({ id: "", nombre: "", stock: "", codigoPedido: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const fetchData = async () => {
    const res = await getProductos();
    const filtrados = res.data.filter((producto: Producto) =>
      (filtros.id === "" || producto.idProducto!.toString().includes(filtros.id)) &&
      producto.nombreProducto.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      (filtros.stock === "" || producto.stockMinimo.toString().includes(filtros.stock)) &&
      (filtros.codigoPedido === "" || (producto.codigoPedido !== undefined && producto.codigoPedido !== null && producto.codigoPedido.toString().toLowerCase().includes(filtros.codigoPedido.toLowerCase())))
    );
    setProductos(filtrados);
    setPaginaActual(1); // Reset a la primera página al filtrar
  };

  useEffect(() => {
    fetchData();
  }, []);

  const puedeModificar = ["control_calidad", "supervisor", "almacenero", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["supervisor", "almacenero", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

  // Lógica de paginación
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

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
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Pedido</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Código de pedido"
              value={filtros.codigoPedido}
              onChange={(e) => setFiltros({ ...filtros, codigoPedido: e.target.value })}
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
              <th className="px-4 py-3">Código de Pedido</th>
              {puedeModificar && <th className="px-4 py-3">Acciones</th>}
              {puedeEliminar && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {productosPaginados.length === 0 ? (
              <tr>
                <td
                  colSpan={puedeModificar && puedeEliminar ? 9 : puedeModificar || puedeEliminar ? 8 : 7}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No se encontraron datos con los filtros ingresados.
                </td>
              </tr>
            ) : (
              productosPaginados.map((producto) => (
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
                  <td className="px-4 py-3">{producto.codigoPedido}</td>
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
                    </td>
                  )}
                  {puedeEliminar && (
                    <td className="px-4 py-3 space-x-2">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Anterior
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => cambiarPagina(i + 1)}
            className={`px-3 py-1 text-sm rounded ${paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Siguiente
        </button>
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
