import {  useState } from "react";
import { Pedido, PedidoCrear } from "./types";
import { crearPedido, actualizarPedido } from "./services/api";
import { X } from "lucide-react";

interface PedidosFormProps {
  initialData?: Pedido;
  onClose: () => void;
  onSuccess: () => void;
  idUsuarioLogueado?: number;
}

const PedidosForm = ({ initialData, onClose, onSuccess,idUsuarioLogueado }: PedidosFormProps) => {
  const [formData, setFormData] = useState<PedidoCrear>({
    idPedido : initialData?.id ?? 0,
    idProveedor: initialData?.idProveedor ?? 0,
    fechaRecepcion: initialData?.fechaRecepcion ?? "",
    estado: initialData?.estado ?? "",
    observacion: initialData?.observacion ?? "",
    idUsuario: initialData?.idProveedor ?? idUsuarioLogueado ?? 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData) {
        // Actualizar pedido
        formData.idPedido = initialData.id
        await actualizarPedido(initialData.id, formData);
      } else {
        // Crear nuevo pedido
        await crearPedido(formData);
      }
      onSuccess(); // Llamar a la función onSuccess cuando el pedido sea creado o actualizado con éxito
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialData ? "Editar Pedido" : "Nuevo Pedido"}</h2>
          <button onClick={onClose} className="p-2 bg-gray-300 text-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="idProveedor" className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor ID
            </label>
            <input
              type="number"
              id="idProveedor"
              name="idProveedor"
              value={formData.idProveedor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fechaRecepcion" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Recepción
            </label>
            <input
              type="date"
              id="fechaRecepcion"
              name="fechaRecepcion"
              value={formData.fechaRecepcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar Estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="recibido">Recibido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">
              Observación
            </label>
            <textarea
              id="observacion"
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Guardando..." : initialData ? "Actualizar Pedido" : "Crear Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PedidosForm;
