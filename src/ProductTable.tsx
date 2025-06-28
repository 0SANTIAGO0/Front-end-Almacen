// ProductTable.tsx
import { useEffect, useState } from "react";
import { getProductos, eliminarProducto } from "./services/api";
import { Producto, Usuario } from "./types";
import ProductForm from "./ProductForm";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

const ProductTable = ({ user }: { user: Usuario }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtros, setFiltros] = useState({ id: "", nombre: "", stock: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const fetchData = async () => {
    try {
      const res = await getProductos();
      const data = res.data;
      const filtrados = data.filter((producto: Producto) =>
        (filtros.id === "" || producto.idProducto!.toString().includes(filtros.id)) &&
        producto.nombreProducto.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
        (filtros.stock === "" || producto.stockMinimo.toString().includes(filtros.stock))
      );
      setProductos(filtrados);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const puedeModificar = ["control_calidad", "supervisor", "almacenero", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["supervisor", "almacenero", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

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
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input type="text" className="w-full border px-3 py-2" value={filtros.id} onChange={(e) => setFiltros({ ...filtros, id: e.target.value })} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" className="w-full border px-3 py-2" value={filtros.nombre} onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
            <input type="text" className="w-full border px-3 py-2" value={filtros.stock} onChange={(e) => setFiltros({ ...filtros, stock: e.target.value })} />
          </div>
          <button className="bg-blue-600 text-white p-2 rounded" onClick={fetchData} title="Buscar">
            <Search className="w-5 h-5" />
          </button>
          {puedeModificar && (
            <button className="bg-green-600 text-white p-2 rounded" onClick={() => { setProductoSeleccionado(null); setMostrarModal(true); }} title="Nuevo">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="w-[95%] bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              {puedeModificar && <th>Editar</th>}
              {puedeEliminar && <th>Eliminar</th>}
            </tr>
          </thead>
          <tbody>
            {productosPaginados.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-gray-500">No se encontraron productos</td>
              </tr>
            ) : (
              productosPaginados.map((producto) => (
                <tr key={producto.idProducto} className="even:bg-gray-50">
                  <td>{producto.idProducto}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.estado === "ACTIVO" ? <span className="text-green-600">Activo</span> : <span className="text-red-500">Inactivo</span>}</td>
                  <td>{producto.stockActual}</td>
                  <td>{producto.stockMinimo}</td>
                  {puedeModificar && (
                    <td>
                      <button className="bg-yellow-500 text-white p-1 rounded" onClick={() => { setProductoSeleccionado(producto); setMostrarModal(true); }}>
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {puedeEliminar && (
                    <td>
                      <button className="bg-red-600 text-white p-1 rounded" onClick={() => eliminarProducto(producto.idProducto!).then(fetchData)}>
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
      <div className="mt-4 flex gap-2">
        <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="px-3 py-1 bg-gray-200 rounded">
          Anterior
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button key={i} onClick={() => cambiarPagina(i + 1)} className={`px-3 py-1 rounded ${paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="px-3 py-1 bg-gray-200 rounded">
          Siguiente
        </button>
      </div>

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
