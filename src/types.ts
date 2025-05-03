export interface Producto {
    idProducto?: number;
    nombreProducto: string;
    descripcion: string;
    estado: boolean;  
    stockActual: number;
    stockMinimo: number;
  }
  
  export interface Usuario {
    idUsuario?: number;
    nombreUsuario: string;
    correo: string;
    contrasenia: string;
    rol: string;
    estado: boolean;
  }
  
  export interface Proveedor {
    idProveedor?: number;
    nombreProveedor: string;
    contacto: string;
    telefono: string;
    direccion: string;
  }