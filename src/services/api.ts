// api.ts
import axios from "axios";
import { Producto, Usuario, Proveedor, Pedido, PedidoCrear } from "../types"; // Asegúrate de tener la ruta correcta

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// PRODUCTOS
export const getProductos = () => api.get<Producto[]>("/productos");
export const crearProducto = (data: Producto) => api.post("/productos", data);
export const actualizarProducto = (id: number, data: Producto) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id: number) => api.delete(`/productos/${id}`);

// USUARIOS
export const getUsuarios = () => api.get<Usuario[]>("/usuarios");
export const crearUsuario = (data: Usuario) => api.post("/usuarios", data);
export const actualizarUsuario = (id: number, data: Usuario) => api.put(`/usuarios/${id}`, data);
export const eliminarUsuario = (id: number) => api.delete(`/usuarios/${id}`);

// PROVEEDORES
export const getProveedores = () => api.get<Proveedor[]>("/proveedores");
export const crearProveedor = (data: Proveedor) => api.post("/proveedores", data);
export const actualizarProveedor = (id: number, data: Proveedor) => api.put(`/proveedores/${id}`, data);
export const eliminarProveedor = (id: number) => api.delete(`/proveedores/${id}`);

// PEDIDOS
export const getPedidos = () => api.get<Pedido[]>("/pedidos");
export const getPedidoPorId = (id: number) => api.get<Pedido>(`/pedidos/${id}`);
export const crearPedido = (data: PedidoCrear) => api.post("/pedidos", data);
export const actualizarPedido = (id: number, data: PedidoCrear) => api.put(`/pedidos/${id}`, data);
export const eliminarPedido = (id: number) => api.delete(`/pedidos/${id}`);
