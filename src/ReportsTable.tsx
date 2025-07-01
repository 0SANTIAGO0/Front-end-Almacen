import { useEffect, useState } from "react";
import { ProductoBajoStock, Usuario } from "./types";
import { Search } from "lucide-react";
import { getProductosBajoStock } from "./services/api";

const ReportsTable = ({ user }: { user: Usuario }) => {
  const [productos, setProductos] = useState<ProductoBajoStock[]>([]);
  const [filtros, setFiltros] = useState({
    id: "",
    producto: "",
    categoria: "",
    marca: ""
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const fetchData = async () => {
    try {
      const res = await getProductosBajoStock();
      console.log("Productos bajo stock:", res.data);

      const filtrados = res.data.filter((p) =>
        (filtros.id === "" || p.idProducto.toString().includes(filtros.id)) &&
        p.nombreProducto.toLowerCase().includes(filtros.producto.toLowerCase()) &&
        p.nombreCategoria.toLowerCase().includes(filtros.categoria.toLowerCase()) &&
        p.nombreMarca.toLowerCase().includes(filtros.marca.toLowerCase())
      );
      setProductos(filtrados);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al cargar reporte:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

        <h1 className="text-2xl font-bold text-center text-red-600">
        Productos con bajo stock
        </h1>
      {/* Filtros */}
      <div className="w-[95%] bg-white p-4 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
              type="text"
              placeholder="ID Producto"
              value={filtros.id}
              onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <input
              type="text"
              placeholder="Nombre Producto"
              value={filtros.producto}
              onChange={(e) => setFiltros({ ...filtros, producto: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              placeholder="Categoría"
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <input
              type="text"
              placeholder="Marca"
              value={filtros.marca}
              onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={fetchData}
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="w-[95%] bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center table-auto">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Stock Actual</th>
              <th className="px-4 py-3">Stock Mínimo</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {productosPaginados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 italic text-gray-500">
                  No se encontraron productos con bajo stock.
                </td>
              </tr>
            ) : (
              productosPaginados.map((p) => (
                <tr key={p.idProducto} className="even:bg-gray-50">
                  <td className="px-4 py-3">{p.idProducto}</td>
                  <td className="px-4 py-3">{p.nombreProducto}</td>
                  <td className="px-4 py-3">{p.nombreCategoria}</td>
                  <td className="px-4 py-3">{p.nombreMarca}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">{p.stockActual}</td>
                  <td className="px-4 py-3">{p.stockMinimo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-center gap-2">
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
            className={`px-3 py-1 text-sm rounded ${
              paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
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
    </div>
  );
};

export default ReportsTable;
