import { useState } from "react";
import { crearMovimiento, actualizarMovimiento } from "./services/api";
import { MovimientoStock, MovimientoStockCrear } from "./types";

interface MovementFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MovimientoStock;
}

const MovementForm = ({ onClose, onSuccess, initialData }: MovementFormProps) => {
  const [form, setForm] = useState<MovimientoStock>(
    initialData || {
      idMovimiento: 0,
      nombreProducto: "",
      tipoMovimiento: "INGRESO",
      cantidad: 0,
      fechaMovimiento: new Date().toISOString(),
      realizadoPor: "",
      observacion: "",
      productoId: 0,
      usuarioId: 0,
    }
  );

  const handleSubmit = async () => {
  try {
    if (initialData?.idMovimiento) {
      const payload = {
        idProducto: form.productoId,
        tipoMovimiento: form.tipoMovimiento,
        cantidad: form.cantidad,
        idUsuario: form.usuarioId,
        observacion: form.observacion,
      };
      await actualizarMovimiento(initialData.idMovimiento, payload);
    } else {
      const payload = {
        idProducto: form.productoId,
        tipoMovimiento: form.tipoMovimiento,
        cantidad: form.cantidad,
        idUsuario: form.usuarioId,
        observacion: form.observacion,
      };
      await crearMovimiento(payload);
    }
    onSuccess();
    onClose();
  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    alert("Ocurrió un error al guardar el movimiento.");
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: ["cantidad", "productoId", "usuarioId"].includes(name) ? +value : value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {initialData ? "Actualizar Movimiento" : "Registrar Nuevo Movimiento"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
            <select
              name="tipoMovimiento"
              value={form.tipoMovimiento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="INGRESO">INGRESO</option>
              <option value="SALIDA">SALIDA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Cantidad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Producto</label>
            <input
              type="number"
              name="productoId"
              value={form.productoId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Producto ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Usuario</label>
            <input
              type="number"
              name="usuarioId"
              value={form.usuarioId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Usuario ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observación</label>
            <textarea
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Observaciones"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            {initialData ? "Actualizar" : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementForm;