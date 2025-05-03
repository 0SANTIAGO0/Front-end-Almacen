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
  const [activeSection, setActiveSection] = useState<"usuarios" | "productos" | "proveedores">("usuarios");

  return (
    <div className="flex h-screen font-sans">
      {/* Lógica: le indicas a TypeScript que `user` es tipo LoginResponseDto */}
      <Sidebar
        user={user as LoginResponseDto}
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />

      {/* Lógica: le indicas a TypeScript que `user` es tipo Usuario */}
      <MainContent
        user={user as Usuario}
        section={activeSection}
      />
    </div>
  );
};

export default App;
