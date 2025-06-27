import { useState } from "react";
import { crearMovimiento, actualizarMovimiento } from "./services/api";
import { MovimientoStock } from "./types";

interface MovementFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MovimientoStock;
}

const MovementForm = ({ onClose, onSuccess, initialData }: MovementFormProps) => {
  const [form, setForm] = useState<MovimientoStock>(
    initialData || {
      id: 0,
      tipo: "ENTRADA",
      cantidad: 0,
      fecha: new Date().toISOString().slice(0, 10),
      productoId: 0,
      usuarioId: 0
    }
  );

  const handleSubmit = async () => {
    if (initialData?.id) {
      await actualizarMovimiento(initialData.id, form);
    } else {
      await crearMovimiento(form);
    }
    onSuccess();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "cantidad" || name === "productoId" || name === "usuarioId" ? +value : value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {initialData ? "Actualizar Movimiento" : "Registrar Movimiento"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ENTRADA">ENTRADA</option>
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Cantidad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Producto ID</label>
            <input
              type="number"
              name="productoId"
              value={form.productoId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="ID del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario ID</label>
            <input
              type="number"
              name="usuarioId"
              value={form.usuarioId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="ID del usuario"
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
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementForm;
  