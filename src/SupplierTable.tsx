import { useEffect, useState } from "react";
import { getProveedores, eliminarProveedor } from "./services/api";
import { Proveedor, Usuario } from "./types";
import SupplierForm from "./SupplierForm";
import { FaSearch, FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa"; // Íconos modernos

const SupplierTable = ({ user }: { user: Usuario }) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtros, setFiltros] = useState({ nombre: "", contacto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  const puedeModificar = ["control_calidad", "supervisor", "administrador", "gerente_almacen"].includes(user.rol.toLowerCase());
  const puedeEliminar = ["administrador", "gerente_almacen"].includes(user.rol.toLowerCase());

  const fetchData = async () => {
    try {
      const res = await getProveedores(); // Obtener proveedores desde la API
      const filtrados = res.data.filter((p: Proveedor) =>
        (p.nombreProveedor?.toLowerCase() || "").includes(filtros.nombre.toLowerCase()) &&
        (p.contacto?.toLowerCase() || "").includes(filtros.contacto.toLowerCase())
      );
      setProveedores(filtrados);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFiltroChange = (field: keyof typeof filtros) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [field]: e.target.value });
  };

  const handleEliminar = async (id: number) => {
    await eliminarProveedor(id);
    fetchData();
  };

  const abrirModal = (proveedor?: Proveedor) => {
    setProveedorSeleccionado(proveedor || null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProveedorSeleccionado(null);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Filtros en tarjeta flotante */}
      <div id="barraSupplier" className="w-4/5 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Nombre Proveedor</label>
            <input
              type="text"
              placeholder="Nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange("nombre")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700 block mb-1">Contacto</label>
            <input
              type="text"
              placeholder="Contacto"
              value={filtros.contacto}
              onChange={handleFiltroChange("contacto")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              <FaSearch />
            </button>
            {puedeModificar && (
              <button
                onClick={() => abrirModal()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
              >
                <FaPlus />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla en tarjeta flotante */}
      <div id="tableSupplier" className="w-4/5 bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-center table-auto">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3 border-b">Nombre</th>
              <th className="px-4 py-3 border-b">Contacto</th>
              <th className="px-4 py-3 border-b">Teléfono</th>
              <th className="px-4 py-3 border-b">Dirección</th>
              {puedeModificar && <th className="px-4 py-3 border-b">Acciones</th>}
              {puedeEliminar && <th className="px-4 py-3 border-b"></th>}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  No se encontraron datos con los filtros ingresados
                </td>
              </tr>
            ) : (
              proveedores.map((proveedor) => (
                <tr key={proveedor.idProveedor} className="even:bg-gray-50">
                  <td className="px-4 py-2 border-b">{proveedor.nombreProveedor}</td>
                  <td className="px-4 py-2 border-b">{proveedor.contacto}</td>
                  <td className="px-4 py-2 border-b">{proveedor.telefono}</td>
                  <td className="px-4 py-2 border-b">{proveedor.direccion}</td>
                  {puedeModificar && (
                    <td className="px-4 py-2 border-b space-x-2">
                      <button
                        onClick={() => abrirModal(proveedor)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  )}
                  {puedeEliminar && (
                    <td className="px-4 py-2 border-b space-x-2">
                      <button
                        onClick={() => handleEliminar(proveedor.idProveedor!)}
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

      {/* Modal con Formulario */}
      {mostrarModal && (
        <SupplierForm
          initialData={proveedorSeleccionado || undefined}
          onClose={cerrarModal}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default SupplierTable;
