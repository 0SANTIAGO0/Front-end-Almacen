import { useState, useEffect } from 'react';
import { createMarca, updateMarca } from './services/api';
import { Marca } from './types';
// Eliminado: import axios from 'axios';

type MarcaFormProps = {
    initialData?: Marca;
    onClose: () => void;
    onSuccess: () => void;
};

const MarcaForm = ({ initialData, onClose, onSuccess }: MarcaFormProps) => {
    const [formData, setFormData] = useState<Marca>({
        idMarca: initialData?.idMarca || undefined,
        nombreMarca: initialData?.nombreMarca || '',
        paisOrigen: initialData?.paisOrigen || undefined,
        estado: initialData?.estado || 'Activo',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (formData.idMarca) {
                if (formData.idMarca === undefined) {
                    throw new Error("ID de marca no definido para la actualizacion.");
                }
                await updateMarca(formData.idMarca, formData);
            } else {
                await createMarca(formData);
            }
            setLoading(false);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setLoading(false);
            // Ahora se maneja el error de forma más genérica sin axios.isAxiosError
            // Si el error es una instancia de Error, mostramos su mensaje.
            // Para errores de red o del servidor sin Axios, 'err' podría ser un objeto Response
            // o simplemente un Error con un mensaje de "Network Error" si la solicitud falló antes de llegar al servidor.
            // No podemos parsear el mensaje específico de "Duplicate entry" del backend sin la estructura de error de Axios.
            if (err instanceof Error) {
                // Podríamos intentar una comprobación de cadena básica si el backend siempre
                // devuelve un error en el mensaje de la excepción de JS, pero es menos fiable.
                if (err.message && err.message.includes("Duplicate entry") && err.message.includes("nombre_marca")) {
                    setError("No es posible agregar 2 marcas iguales.");
                } else {
                    setError('Error al guardar la marca: ' + err.message);
                }
            } else {
                // Para errores que no son instancias de Error (ej. promesas rechazadas con otros tipos)
                setError('Error desconocido al guardar la marca: ' + String(err));
            }
            console.error('Error saving marca:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{formData.idMarca ? 'Editar Marca' : 'Crear Nueva Marca'}</h2>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div className="mb-4">
                <label htmlFor="nombreMarca" className="block text-sm font-medium text-gray-700 mb-1">Nombre de Marca</label>
                <input
                    type="text"
                    id="nombreMarca"
                    name="nombreMarca"
                    value={formData.nombreMarca}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="paisOrigen" className="block text-sm font-medium text-gray-700 mb-1">Pais de Origen</label>
                <input
                    type="text"
                    id="paisOrigen"
                    name="paisOrigen"
                    value={formData.paisOrigen || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                    id="estado"
                    name="estado"
                    value={formData.estado || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : (formData.idMarca ? 'Actualizar' : 'Guardar')}
                </button>
            </div>
        </form>
    );
};

export default MarcaForm;
