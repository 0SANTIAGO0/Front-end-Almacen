import { useState } from "react";
import { crearProveedor, actualizarProveedor } from "./services/api";
import { Proveedor } from "./types";

type SupplierFormProps = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Proveedor;
};

const SupplierForm = ({ onClose, onSuccess, initialData }: SupplierFormProps) => {
  const [form, setForm] = useState<Proveedor>(
    initialData || {
      nombreProveedor: "",
      contacto: "",
      telefono: "",
      direccion: "",
    }
  );

  const handleSubmit = async () => {
    if (initialData) {
      await actualizarProveedor(initialData.idProveedor!, form);
    } else {
      await crearProveedor(form);
    }
    onSuccess();
    onClose();
  };

  const handleInputChange = (field: keyof Proveedor) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {initialData ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="nombreProveedor" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proveedor
            </label>
            <input
              id="nombreProveedor"
              type="text"
              value={form.nombreProveedor}
              onChange={handleInputChange("nombreProveedor")}
              placeholder="Ej. ABC Tech"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contacto" className="block text-sm font-medium text-gray-700 mb-1">
              Contacto
            </label>
            <input
              id="contacto"
              type="text"
              value={form.contacto}
              onChange={handleInputChange("contacto")}
              placeholder="Ej. Juan Pérez"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="telefono"
              type="text"
              value={form.telefono}
              onChange={handleInputChange("telefono")}
              placeholder="Ej. +51 987 654 321"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              value={form.direccion}
              onChange={handleInputChange("direccion")}
              placeholder="Ej. Av. Industrial 123"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;
