import { useEffect, useState } from "react";
import { Producto } from "./types";
import { crearProducto, actualizarProducto } from "./services/api";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Producto;
  productosExistentes: Producto[]; // Le pasas los productos para extraer marcas y categorías
};

const ProductForm = ({
  onClose,
  onSuccess,
  initialData,
  productosExistentes,
}: Props) => {
  const [form, setForm] = useState<Producto>(
    initialData || {
      nombreProducto: "",
      descripcion: "",
      estado: "Activo",
      stockActual: 0,
      stockMinimo: 0,
      nombreMarca: "",
      nombreCategoria: "",
      idMarca: 0,
      idCategoria: 0,
    }
  );

  // Generar marcas únicas desde los productos
  const marcasUnicas = Array.from(
    new Map(
      productosExistentes.map((m) => [
        m.idMarca,
        { id: m.idMarca, nombre: m.nombreMarca },
      ])
    ).values()
  );

  const categoriasUnicas = Array.from(
    new Map(
      productosExistentes.map((c) => [
        c.idCategoria,
        { id: c.idCategoria, nombre: c.nombreCategoria },
      ])
    ).values()
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estado"
          ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
          : name === "stockActual" || name === "stockMinimo"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (initialData?.idProducto) {
        await actualizarProducto(initialData.idProducto, form);
      } else {
        await crearProducto(form);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              name="nombreProducto"
              value={form.nombreProducto}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Ej. Laptop HP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Descripción breve"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock Actual
              </label>
              <input
                type="number"
                name="stockActual"
                value={form.stockActual}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock Mínimo
              </label>
              <input
                type="number"
                name="stockMinimo"
                value={form.stockMinimo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              name="idCategoria"
              value={form.idCategoria}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Selecciona una categoría</option>
              {categoriasUnicas.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <select
              name="idMarca"
              value={form.idMarca}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Selecciona una marca</option>
              {marcasUnicas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            {initialData ? "Actualizar" : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;