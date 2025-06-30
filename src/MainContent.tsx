import React, { useState } from "react";

// Tablas
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import SupplierTable from "./SupplierTable";
import MovementStockTable from "./MovementStockTable";
import CategoryTable from "./CategoryTable";
import MarcaTable from "./MarcaTable";

// Formularios
import UserForm from "./UserForm";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";
import CategoryForm from "./CategoryForm";
import MarcaForm from "./MarcaForm";
import MovementForm from "./MovementForm";

// Otros
import Home from "./Home";

// Tipos
import { Usuario, Marca } from "./types";

// Estilos
import "./index.css";
import "./styles.css";

type Props = {
    user: Usuario;
    section:
    | "home"
    | "usuarios"
    | "productos"
    | "proveedores"
    | "movimientos"
    | "categorias"
    | "marcas";
};

const MainContent = ({ user, section }: Props) => {
    const [showCreate, setShowCreate] = useState(false);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);
    const [refreshMarcasTrigger, setRefreshMarcasTrigger] = useState(0);
    const [refreshProductosTrigger, setRefreshProductosTrigger] = useState(0);

    const onSuccess = () => {
        setShowCreate(false);
        setMarcaSeleccionada(null);

        if (section === "marcas") {
            setRefreshMarcasTrigger(prev => prev + 1);
        }

        if (section === "productos") {
            setRefreshProductosTrigger(prev => prev + 1);
        }
    };

    const handleOpenCreateMarcaModal = () => {
        setMarcaSeleccionada(null);
        setShowCreate(true);
    };

    const handleEditMarcaModal = (marca: Marca) => {
        setMarcaSeleccionada(marca);
        setShowCreate(true);
    };

    const renderTable = () => {
        switch (section) {
            case "home":
                return <Home user={user} />;
            case "usuarios":
                return <UserTable user={user} />;
            case "productos":
                return <ProductTable user={user} refreshTrigger={refreshProductosTrigger} />;
            case "proveedores":
                return <SupplierTable user={user} />;
            case "movimientos":
                return <MovementStockTable user={user} />;
            case "categorias":
                return <CategoryTable user={user} />;
            case "marcas":
                return (
                    <MarcaTable
                        user={user}
                        onOpenCreateModal={handleOpenCreateMarcaModal}
                        onEditMarca={handleEditMarcaModal}
                        refreshTrigger={refreshMarcasTrigger}
                    />
                );
            default:
                return null;
        }
    };

    const renderDialog = () => {
        switch (section) {
            case "usuarios":
                return <UserForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
            case "productos":
                return <ProductForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
            case "proveedores":
                return <SupplierForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
            case "movimientos":
                return <MovementForm 
                            initialData={undefined}
                            onClose={() => {
                            console.log("cerrando");
                            setShowCreate(false);
                                                }}
                            onSuccess={onSuccess} />;
            case "categorias":
                return <CategoryForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
            case "marcas":
                return (
                    <MarcaForm
                        initialData={marcaSeleccionada || undefined}
                        onClose={() => {
                            setShowCreate(false);
                            setMarcaSeleccionada(null);
                        }}
                        onSuccess={onSuccess}
                    />
                );
            default:
                return null;
        }
    };

    const sectionTitle: Record<typeof section, string> = {
        home: "HOME",
        usuarios: "LISTADO DE USARIOS",
        productos: "LISTADO DE PRODUCTOS",
        proveedores: "LISTADO DE PROVEEDORES",
        movimientos: "LISTADO DE MOVIMIENTOS DE STOCK",
        categorias: "LISTADO DE CATEGORÍAS",
        marcas: "LISTADO DE MARCAS",
    };

    const userRole = user.rol?.toLowerCase() || "";
    const puedeCrearEnSeccionSuperior = (currentSection: string) => {
        const rolesConPermiso = ["supervisor", "administrador", "almacenero"];
        const seccionesConBoton = ["usuarios", "productos", "proveedores", "marcas", "movimientos"];
        return rolesConPermiso.includes(userRole) && seccionesConBoton.includes(currentSection);
    };

    return (
        <div className="flex-1 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                <div className="flex flex-col items-center mb-4">
                    <h1 className="text-xl font-bold">{sectionTitle[section]}</h1>
                   {/* {puedeCrearEnSeccionSuperior(section) && (
                        <button
                            onClick={() => {
                                setShowCreate(true);
                                setMarcaSeleccionada(null);
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Crear Nuevo
                        </button>
                    )}
                        */}
                </div>

                {renderTable()}

                {showCreate && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        {renderDialog()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainContent;