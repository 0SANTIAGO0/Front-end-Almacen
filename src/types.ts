export interface Producto {
    idProducto?: number;
    nombreProducto: string;
    descripcion: string;
    estado: boolean;  
    stockActual: number;
    stockMinimo: number;
    codigoPedido: number;
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
  export interface Pedido {
    id: number;
    idProveedor: number;
    nombreProveedor: string;
    fechaRecepcion: string;
    estado: string;
    observacion: string;
    idUsuario: number;
    nombreUsuario: string;
  }
  
  export interface PedidoCrear {
    idPedido: number;
    idProveedor: number;
    fechaRecepcion: string;
    estado: string;
    observacion: string;
    idUsuario: number;
  }
