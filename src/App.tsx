// App.tsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { LoginResponseDto } from "./user";
import { Usuario } from "./types";
import "./styles.css";

// App acepta un usuario que puede ser de ambos tipos
type AppProps = {
  user: Usuario | LoginResponseDto;
};

const App = ({ user }: AppProps) => {
  const [activeSection, setActiveSection] = useState<"home" | "usuarios" | "productos" | "proveedores" | "movimientos" | "categorias" >("home");

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        user={user as LoginResponseDto}
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />

      <MainContent
        user={user as Usuario}
        section={activeSection}
      />
    </div>
  );
};

export default App;
