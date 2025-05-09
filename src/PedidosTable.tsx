import { useEffect, useState } from "react";
import { getPedidos, eliminarPedido } from "./services/api"; // Asegúrate de que las funciones están importadas
import { Pedido, Usuario } from "./types";
import { Search, FilePlus, Trash2, Pencil } from "lucide-react";
import PedidosForm from "./PedidosForm";
import { Download } from "lucide-react";

interface PedidosTableProps {
  user: Usuario;
}

const handleDescargarExcel = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/pedidos/excel", {
      method: "GET",
    });
    const blob = await response.blob();

    // Crear enlace para descargar
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pedidos.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar el Excel:", error);
  }
};

const PedidosTable = ({ user }: PedidosTableProps) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtros, setFiltros] = useState({ proveedor: "", usuario: "", estado: "" });
  const [showForm, setShowForm] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const fetchData = async () => {
    try {
      const res = await getPedidos(); // Obtener pedidos desde la API
      const filtrados = res.data.filter((p: Pedido) => {
        const proveedor = (p.nombreProveedor || "").toLowerCase();
        const usuario = (p.nombreUsuario || "").toLowerCase();
        const estado = (p.estado || "").toLowerCase();
        
        return (
          proveedor.includes(filtros.proveedor.toLowerCase()) &&
          usuario.includes(filtros.usuario.toLowerCase()) &&
          (filtros.estado ? estado === filtros.estado.toLowerCase() : true)
        );
      });
      
      setPedidos(filtrados);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Obtener datos cuando el componente se monta
  }, []);

  const puedeModificar = ["control_calidad","supervisor","almacenero","administrador", "gerente_almacen"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleEliminarPedido = async (id: number) => {
    try {
      await eliminarPedido(id); // Eliminar pedido usando la API
      fetchData(); // Refrescar la lista de pedidos
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros */}
      <div id="PedidosFiltro" className="w-4/5 bg-white p-4 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <input
              type="text"
              name="proveedor"
              placeholder="Buscar proveedor"
              value={filtros.proveedor}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="Buscar usuario"
              value={filtros.usuario}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="recibido">Recibido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={handleDescargarExcel}
            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
            title="Exportar a Excel"
          >
            <Download className="w-5 h-5" />
          </button>
          {puedeEliminar && (
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                setSelectedPedido(null);
                setShowForm(true);
              }}
              title="Nuevo Pedido"
            >
              <FilePlus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div id="PedidosTable" className="w-4/5 bg-white rounded-2xl shadow-lg overflow-x-auto">
        {pedidos.length === 0 ? (
          <div className="p-4 text-center text-gray-600">No se encontraron datos con los filtros ingresados.</div>
        ) : (
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Fecha Recepción</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Observación</th>
                <th className="px-4 py-3">Usuario</th>
                {puedeModificar && <th className="px-4 py-3">Acciones</th>}
                {puedeEliminar && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="even:bg-gray-50">
                  <td className="px-4 py-3">{pedido.nombreProveedor}</td>
                  <td className="px-4 py-3">{pedido.fechaRecepcion}</td>
                  <td className="px-4 py-3 capitalize">{pedido.estado}</td>
                  <td className="px-4 py-3">{pedido.observacion}</td>
                  <td className="px-4 py-3">{pedido.nombreUsuario}</td>
                  {puedeModificar && (
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        onClick={() => {
                          setSelectedPedido(pedido);
                          setShowForm(true);
                        }}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {puedeEliminar && (
                    <td>
                      <button
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleEliminarPedido(pedido.idPedido)} // Usando `id` según la interfaz `Pedido`
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
        )}
      </div>

      {/* Formulario modal */}
      {showForm && (
        <PedidosForm
          initialData={selectedPedido ?? undefined}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchData();
            setShowForm(false);
          }}
          idUsuarioLogueado={user.idUsuario ?? 0}
        />
      )}
    </div>
  );
};

export default PedidosTable;
