import React, { useState } from "react";
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import SupplierTable from "./SupplierTable";
import UserForm from "./UserForm";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";

import Home from "./Home"; // Importar el nuevo componente
import { Usuario } from "./types";
import "./index.css";
import "./styles.css";
import MovementStockTable from "./MovementStockTable";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";

type Props = {
  user: Usuario;
  section: "home" | "usuarios" | "productos" | "proveedores" | "movimientos" | "categorias";
};

const MainContent = ({ user, section }: Props) => {
  const [showCreate, setShowCreate] = useState(false);

  const onSuccess = () => setShowCreate(false);

  const renderTable = () => {
    switch (section) {
      case "home":
        return <Home user={user} />;
      case "usuarios":
        return <UserTable user={user} />;
      case "productos":
        return <ProductTable user={user} />;
      case "proveedores":
        return <SupplierTable user={user} />;
      case "movimientos":
        return <MovementStockTable user={user} />;
      case "categorias":
          return <CategoryTable user={user} />;
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
        return <CategoryForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
      case "categorias":
        return <CategoryForm onClose={() => setShowCreate(false)} onSuccess={onSuccess} />;
      default:
        return null;
    }
  };

  const sectionTitle = {
    home: "Inicio",
    usuarios: "Listado de Usuarios",
    productos: "Listado de Productos",
    proveedores: "Listado de Proveedores",
    movimientos: "Listado de Movimientos de Stock",
    categorias: "Listado de Categorías"
  };

  return (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{sectionTitle[section]}</h2>
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
