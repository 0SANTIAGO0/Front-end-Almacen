// CategoryForm.tsx
import { useState } from "react";
import { crearCategoria, actualizarCategoria } from "./services/api";
import { Categoria } from "./types";

type CategoryFormProps = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Categoria;
};

const CategoryForm = ({ onClose, onSuccess, initialData }: CategoryFormProps) => {
  const [form, setForm] = useState<Categoria>(
    initialData || {
      nombreCategoria: "",
      descripcion: "",
      estado: "Activo",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === "estado"
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (initialData?.idCategoria) {
        await actualizarCategoria(initialData.idCategoria, form);
      } else {
        await crearCategoria(form);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="nombreCategoria"
              value={form.nombreCategoria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Nombre de la categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Descripción"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              id="estado"
              name="estado"
              value={form.estado || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;