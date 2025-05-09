import React, { useState } from "react";
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import SupplierTable from "./SupplierTable";
import UserForm from "./UserForm";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";
import { Usuario } from "./types";
import PedidosTable from "./PedidosTable";
import './index.css';
import "./styles.css";

type Props = {
  user: Usuario;
  section: "usuarios" | "productos" | "proveedores" | "almacen";
};


const MainContent = ({ user, section }: Props) => {
  const [showCreate, setShowCreate] = useState(false);

  const onSuccess = () => {
    setShowCreate(false);
  };

  const renderTable = () => {
    switch (section) {
      case "usuarios":
        return <UserTable user={user} />;
      case "productos":
        return <ProductTable user={user} />;
      case "proveedores":
        return <SupplierTable user={user} />;
      case "almacen":
        return <PedidosTable user={user} />;
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
      default:
        return null;
    }
  };

  const sectionTitle = {
    usuarios: "Listado de Usuarios",
    productos: "Listado de Productos",
    proveedores: "Listado de Proveedores",
    almacen: "Listado de Pedidos"
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
