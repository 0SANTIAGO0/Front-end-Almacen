import { useState } from "react";
import { crearProducto, actualizarProducto } from "./services/api";
import { Producto } from "./types";

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Producto;
}

const ProductForm = ({ onClose, onSuccess, initialData }: ProductFormProps) => {
  const [form, setForm] = useState<Producto>(
    initialData || {
      nombreProducto: "",
      descripcion: "",
      estado: true,
      stockActual: 0,
      stockMinimo: 0,
      codigoPedido:0,
    }
  );

  const handleSubmit = async () => {
    if (initialData?.idProducto) {
      await actualizarProducto(initialData.idProducto, form);
    } else {
      await crearProducto(form);
    }
    onSuccess();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {initialData ? "Actualizar Producto" : "Registrar Nuevo Producto"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              name="nombreProducto"
              value={form.nombreProducto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="estado"
              name="estado"
              type="checkbox"
              checked={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.checked })}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor="estado" className="text-sm text-gray-700">
              Producto activo
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
            <input
              type="number"
              name="stockActual"
              value={form.stockActual}
              onChange={(e) => setForm({ ...form, stockActual: +e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Stock actual"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
            <input
              type="number"
              name="stockMinimo"
              value={form.stockMinimo}
              onChange={(e) => setForm({ ...form, stockMinimo: +e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Stock mínimo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Codigo de Pedido</label>
            <input
              type="number"
              name="codigoPedido"
              value={form.codigoPedido}
              onChange={(e) => setForm({ ...form, codigoPedido: +e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Stock mínimo"
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

export default ProductForm;
