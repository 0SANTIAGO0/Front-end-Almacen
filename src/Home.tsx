import { Usuario } from "./types";
import "./styles.css";

const Home = ({ user }: { user: Usuario }) => {
  return (
    <div id="div_video" className="relative w-full  overflow-hidden rounded-2xl">
      {/* Video de fondo */}
      <video id="video"
        className="absolute top-0 left-0 w-full object-cover opacity-
         z-0"
        autoPlay
        loop
        muted
      >
        <source src="../public/Recursos/video_fondo.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Contenido en primer plano */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-both p-8">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          Bienvenido, {user.nombreUsuario} 👋
        </h1>
        <p className="mt-4 text-lg drop-shadow-md">
          Selecciona una sección en la barra lateral para comenzar.
        </p>
      </div>
    </div>
  );
};

export default Home;
