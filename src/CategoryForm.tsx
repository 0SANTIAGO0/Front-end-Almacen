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
      descripcion: ""
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
        <h2 className="text-xl font-bold mb-4">{initialData ? "Editar Categoría" : "Nueva Categoría"}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="nombre"
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
