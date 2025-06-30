import { useEffect, useState } from "react";
import { getMovimientos, eliminarMovimiento } from "./services/api";
import { MovimientoStock, Usuario } from "./types";
import MovementForm from "./MovementForm";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

const MovementStockTable = ({ user }: { user: Usuario }) => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [filtros, setFiltros] = useState({
    id: "",
    tipoMovimiento: "",
    producto: "",
    usuario: ""
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<MovimientoStock | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const movimientosPorPagina = 10;

  const puedeModificar = ["almacenero", "administrador", "supervisor"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["administrador", "supervisor"].includes(user.rol.toLowerCase());

  const fetchData = async () => {
    const res = await getMovimientos();

    console.log(res.data);

    const filtrados = res.data.filter((m: MovimientoStock) =>
      (filtros.id === "" || m.idMovimiento.toString().includes(filtros.id)) &&
      m.tipoMovimiento?.toLowerCase().includes(filtros.tipoMovimiento.toLowerCase()) &&
      m.nombreProducto?.toLowerCase().includes(filtros.producto.toLowerCase()) &&
      m.realizadoPor?.toLowerCase().includes(filtros.usuario.toLowerCase())
    );

    setMovimientos(filtrados);
    setPaginaActual(1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indiceInicio = (paginaActual - 1) * movimientosPorPagina;
  const indiceFin = indiceInicio + movimientosPorPagina;
  const movimientosPaginados = movimientos.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(movimientos.length / movimientosPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros */}
      <div className="w-[95%] bg-white p-4 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                placeholder="ID Movimiento"
                value={filtros.id}
                onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
          </div>

          <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mov.</label>    
              <input
                type="text"
                placeholder="Tipo Movimiento"
                value={filtros.tipoMovimiento}
                onChange={(e) => setFiltros({ ...filtros, tipoMovimiento: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
          </div>

          <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <input
                type="text"
                placeholder="Producto"
                value={filtros.producto}
                onChange={(e) => setFiltros({ ...filtros, producto: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
          </div>

          <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuarios</label>
              <input
                type="text"
                placeholder="Usuario"
                value={filtros.usuario}
                onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
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
          {puedeModificar && (
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                setMovimientoSeleccionado(null);
                setMostrarModal(true);
              }}
              title="Nuevo Movimiento"
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
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Observación</th>
              {puedeModificar && <th className="px-4 py-3">Editar</th>}
              {puedeEliminar && <th className="px-4 py-3">Eliminar</th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {movimientosPaginados.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 italic text-gray-500">
                  No se encontraron movimientos.
                </td>
              </tr>
            ) : (
              movimientosPaginados.map((mov) => (
                <tr key={mov.idMovimiento} className="even:bg-gray-50">
                  <td className="px-4 py-3">{mov.idMovimiento}</td>
                  <td className="px-4 py-3">{mov.tipoMovimiento}</td>
                  <td className="px-4 py-3">{mov.cantidad}</td>
                  <td className="px-4 py-3">{new Date(mov.fechaMovimiento).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{mov.nombreProducto}</td>
                  <td className="px-4 py-3">{mov.realizadoPor}</td>
                  <td className="px-4 py-3">{mov.observacion}</td>
                  {puedeModificar && (
                    <td className="px-4 py-3">
                      <button
                        className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        onClick={() => {
                          setMovimientoSeleccionado(mov);
                          setMostrarModal(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {puedeEliminar && (
                    <td className="px-4 py-3">
                      <button
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => eliminarMovimiento(mov.idMovimiento).then(fetchData)}
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
            <MovementForm
              initialData={movimientoSeleccionado || undefined}
              onClose={() => {
                setMostrarModal(false)
                setMovimientoSeleccionado(null);
              }}
              onSuccess={fetchData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementStockTable;