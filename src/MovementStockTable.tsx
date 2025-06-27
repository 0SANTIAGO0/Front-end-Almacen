import { useEffect, useState } from "react";
import {
  getMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
} from "./services/api";
import { MovimientoStock, Usuario } from "./types";
import MovementForm from "./MovementForm";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

const MovementStockTable = ({ user }: { user: Usuario }) => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [filtros, setFiltros] = useState({ tipo: "", productoId: "", usuarioId: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<MovimientoStock | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const movimientosPorPagina = 10;

  const puedeModificar = ["almacenero", "administrador", "supervisor"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["administrador", "supervisor"].includes(user.rol.toLowerCase());

  const fetchData = async () => {
    const res = await getMovimientos();
    const filtrados = res.data.filter((movimiento) =>
      (filtros.tipo === "" || movimiento.tipo.includes(filtros.tipo.toUpperCase())) &&
      (filtros.productoId === "" || movimiento.productoId.toString().includes(filtros.productoId)) &&
      (filtros.usuarioId === "" || movimiento.usuarioId.toString().includes(filtros.usuarioId))
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
        <div className="flex flex-wrap items-end gap-4">
          <input
            type="text"
            placeholder="Tipo (ENTRADA o SALIDA)"
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="min-w-[150px] border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Producto ID"
            value={filtros.productoId}
            onChange={(e) => setFiltros({ ...filtros, productoId: e.target.value })}
            className="min-w-[150px] border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Usuario ID"
            value={filtros.usuarioId}
            onChange={(e) => setFiltros({ ...filtros, usuarioId: e.target.value })}
            className="min-w-[150px] border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button onClick={fetchData} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            <Search className="w-5 h-5" />
          </button>
          {puedeModificar && (
            <button onClick={() => {
              setMovimientoSeleccionado(null);
              setMostrarModal(true);
            }} className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
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
              <th className="px-4 py-3">Producto ID</th>
              <th className="px-4 py-3">Usuario ID</th>
              {puedeModificar && <th className="px-4 py-3">Acciones</th>}
              {puedeEliminar && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {movimientosPaginados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 italic text-gray-500">
                  No se encontraron movimientos.
                </td>
              </tr>
            ) : (
              movimientosPaginados.map((mov) => (
                <tr key={mov.id} className="even:bg-gray-50">
                  <td className="px-4 py-3">{mov.id}</td>
                  <td className="px-4 py-3">{mov.tipo}</td>
                  <td className="px-4 py-3">{mov.cantidad}</td>
                  <td className="px-4 py-3">{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{mov.productoId}</td>
                  <td className="px-4 py-3">{mov.usuarioId}</td>
                  {puedeModificar && (
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        onClick={() => {
                          setMovimientoSeleccionado(mov);
                          setMostrarModal(true);
                        }}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {puedeEliminar && (
                    <td className="px-4 py-3">
                      <button
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => eliminarMovimiento(mov.id).then(fetchData)}
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
                setMostrarModal(false);
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