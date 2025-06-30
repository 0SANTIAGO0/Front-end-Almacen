import { useEffect, useState, useCallback } from "react";
// CORRECCI�N: Importamos 'updateMarca' de 'apiMarcas' para el soft delete, no 'deleteMarca'.
import { getMarcas, updateMarca } from "./services/api";
import { Marca, Usuario } from "./types"; // Importa el tipo Marca y Usuario
import { Search, Plus, Pencil, Trash2 } from "lucide-react"; // Iconos de Lucide React

type MarcaTableProps = {
    user: Usuario; // Recibe el usuario para los roles
    onOpenCreateModal: () => void;
    onEditMarca: (marca: Marca) => void;
    refreshTrigger: number; // Prop para forzar la actualizacion de la tabla
};

const MarcaTable = ({ user, onOpenCreateModal, onEditMarca, refreshTrigger }: MarcaTableProps) => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [filtros, setFiltros] = useState({ id: "", nombreMarca: "", paisOrigen: "", estado: "" }); // Filtros para marcas incluyendo estado

    const [paginaActual, setPaginaActual] = useState(1);
    const marcasPorPagina = 10; // Cantidad de marcas a mostrar por p�gina

    const fetchData = useCallback(async () => {
        try {
            const res = await getMarcas(); // Obtiene todas las marcas del backend (incluidas las inactivas)
            // AQUI: Este console.log te mostrar� los datos que realmente se reciben del backend
            console.log("Datos de marcas recibidos en MarcaTable:", res.data);

            // Filtra las marcas localmente seg�n los valores de los filtros
            const filtradas = res.data.filter((marca: Marca) =>
                (filtros.id === "" || marca.idMarca?.toString().includes(filtros.id)) &&
                (marca.nombreMarca.toLowerCase().includes(filtros.nombreMarca.toLowerCase())) &&
                (filtros.paisOrigen === "" || (marca.paisOrigen && marca.paisOrigen.toLowerCase().includes(filtros.paisOrigen.toLowerCase()))) &&
                // CORRECCI�N EN EL FILTRO DE ESTADO: Usamos === para una coincidencia exacta de estado
                (filtros.estado === "" || (marca.estado && filtros.estado.toLowerCase() === marca.estado.toLowerCase()))
            );
            setMarcas(filtradas); // Actualiza el estado de las marcas filtradas
            setPaginaActual(1); // Reinicia a la primera p�gina al aplicar nuevos filtros
            console.log("Marcas filtradas para mostrar:", filtradas); // Muestra las marcas despu�s de aplicar los filtros
        } catch (error) {
            console.error("Error al obtener marcas:", error);
            // Aqui puedes a�adir l�gica para mostrar un mensaje de error en la Ui al usuario
        }
    }, [filtros]); // El fetchData depende de los filtros

    // useEffect para llamar a fetchData cuando los filtros cambian o refreshTrigger cambia
    useEffect(() => {
        fetchData();
    }, [filtros, fetchData, refreshTrigger]);

    // L�gica de permisos (copia la l�gica de tu ProductTable)
    const userRole = user?.rol?.toLowerCase() || ''; // Asegurarse de que user.rol no sea undefined
    const puedeModificar = ["supervisor","administrador"].includes(userRole);
    const puedeEliminar = ["supervisor","administrador"].includes(userRole);

    // L�gica de paginaci�n
    const indiceInicio = (paginaActual - 1) * marcasPorPagina;
    const indiceFin = indiceInicio + marcasPorPagina;
    const marcasPaginadas = marcas.slice(indiceInicio, indiceFin); // Marcas para la p�gina actual
    const totalPaginas = Math.ceil(marcas.length / marcasPorPagina); // C�lculo del total de p�ginas

    // Funci�n para cambiar la p�gina actual
    const cambiarPagina = (nuevaPagina: number) => { // Tipado explicito para 'nuevaPagina'
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    // CORRECCI�N CLAVE AQUi: Manejador para "eliminar" una marca (cambiar a estado Inactivo)
    const handleEliminarMarca = async (id: number | undefined) => { // Tipado explicito para 'id'
        if (id === undefined) {
            console.error("No se puede eliminar la marca: ID no definido.");
            return;
        }
        if (window.confirm("�Est�s seguro de que quieres cambiar el estado de esta marca a 'Inactivo'?")) { // Mensaje adaptado a soft delete
            try {
                // Primero, busca la marca completa en el estado actual para obtener todos sus campos
                const marcaToDelete = marcas.find(m => m.idMarca === id);
                if (marcaToDelete) {
                    // Crea un nuevo objeto de marca con el estado cambiado a "Inactivo"
                    const updatedMarca = { ...marcaToDelete, estado: "Inactivo" };
                    // Llama a 'updateMarca' para enviar una petici�n PUT y cambiar el estado en el backend
                    await updateMarca(id, updatedMarca);
                    fetchData(); // Vuelve a cargar la lista para reflejar el cambio.
                    // Si el filtro de "Estado" est� en "Activo", la marca "Inactiva" desaparecer�.
                    // Si est� en "Todos", seguir� visible pero con el estado actualizado.
                } else {
                    console.error("Marca no encontrada en la lista para cambiar estado a inactivo.");
                }
            } catch (error) {
                console.error("Error al cambiar estado de marca a Inactivo:", error);
                // Aqui puedes a�adir una alerta o mensaje al usuario en caso de error
                alert("Ocurri� un error al intentar cambiar el estado de la marca.");
            }
        }
    };

    return (
        <div className="p-6 flex flex-col items-center gap-6">
            {/* Secci�n de Filtros */}
            <div className="w-[95%] bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex flex-wrap items-end gap-4">
                    {/* Filtro por ID de Marca */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID de Marca</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ID"
                            value={filtros.id}
                            onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
                        />
                    </div>
                    {/* Filtro por Nombre de Marca */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Marca</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre de Marca"
                            value={filtros.nombreMarca}
                            onChange={(e) => setFiltros({ ...filtros, nombreMarca: e.target.value })}
                        />
                    </div>
                    {/* Filtro por Pais de Origen */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pais de Origen</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Pais de Origen"
                            value={filtros.paisOrigen}
                            onChange={(e) => setFiltros({ ...filtros, paisOrigen: e.target.value })}
                        />
                    </div>
                    {/* Filtro por Estado (Selector) */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filtros.estado}
                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        >
                            <option value="">Todos</option> {/* Opci�n para mostrar todos los estados */}
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    {/* Bot�n de Buscar */}
                    <button
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                        onClick={fetchData}
                        title="Buscar"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {/* Bot�n de Nueva Marca (solo si el usuario tiene permisos de modificaci�n) */}
                    {puedeModificar && (
                        <button
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                            onClick={onOpenCreateModal} // Llama a la prop para abrir el modal de creacion
                            title="Nueva Marca"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Tabla de Marcas */}
            <div className="w-[95%] bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-center table-auto">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nombre de Marca</th>
                            <th className="px-4 py-3">Pais de Origen</th>
                            <th className="px-4 py-3">Estado</th> {/* Columna Estado */}
                            {puedeModificar && <th className="px-4 py-3">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {marcasPaginadas.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={puedeModificar ? 5 : 4}
                                    className="px-4 py-6 text-center text-gray-500 italic"
                                >
                                    No se encontraron datos con los filtros ingresados.
                                </td>
                            </tr>
                        ) : (
                            marcasPaginadas.map((marca: Marca) => ( // Tipado explicito aqui
                                <tr key={marca.idMarca} className="even:bg-gray-50">
                                    <td className="px-4 py-3">{marca.idMarca}</td>
                                    <td className="px-4 py-3">{marca.nombreMarca}</td>
                                    <td className="px-4 py-3">{marca.paisOrigen}</td>
                                    <td className="px-4 py-3">
                                        {/* Muestra el estado y aplica color seg�n el valor */}
                                        <span className={`font-semibold ${marca.estado === 'Activo' ? 'text-green-600' : 'text-red-500'}`}>
                                            {marca.estado}
                                        </span>
                                    </td>
                                    {puedeModificar && (
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                                onClick={() => onEditMarca(marca)}
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            {puedeEliminar && (
                                                <button
                                                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                    onClick={() => handleEliminarMarca(marca.idMarca)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Secci�n de Paginaci�n */}
            <div className="mt-4 flex justify-center items-center gap-2">
                <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => cambiarPagina(i + 1)}
                        className={`px-3 py-1 text-sm rounded ${paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal del Formulario (se muestra condicionalmente) */}
            {/* Este modal es gestionado por MainContent.tsx, pero se incluye aqui para contexto */}
        </div>
    );
};

export default MarcaTable;
