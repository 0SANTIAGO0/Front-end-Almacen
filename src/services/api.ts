// api.ts
import axios from "axios";
import { Producto, Usuario, Proveedor, Pedido, PedidoCrear, MovimientoStock, Categoria, Marca } from "../types"; // Asegúrate de tener la ruta correcta

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// PRODUCTOS
export const getProductos = () => api.get<Producto[]>("/productos");
export const crearProducto = (data: Producto) => api.post("/productos", data);
export const actualizarProducto = (id: number, data: Producto) => {
  return api.put(`/productos/${id}`, {
    ...data,
    idProducto: id  // Asegura que el ID venga también en el body
  });
};
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

// MOVIMIENTOS STOCK
export const getMovimientos = () => api.get<MovimientoStock[]>("/movimientos-stock");
export const crearMovimiento = (data: MovimientoStock) => api.post("/movimientos-stock", data);
export const actualizarMovimiento = (id: number, data: MovimientoStock) => api.put(`/movimientos-stock/${id}`, data);
export const eliminarMovimiento = (id: number) => api.delete(`/movimientos-stock/${id}`);

// CATEGORIAS
export const getCategorias = () => api.get<Categoria[]>("/categorias");
export const crearCategoria = (data: Categoria) => api.post("/categorias", data);
export const actualizarCategoria = (id: number, data: Categoria) => api.put(`/categorias/${id}`, data);
export const eliminarCategoria = (id: number) => api.delete(`/categorias/${id}`);

// MARCAS
export const getMarcas = () => api.get<Marca[]>("/marcas");
export const getMarcaById = (id: number) => api.get<Marca>(`/marcas/${id}`);
export const createMarca = (marca: Marca) => api.post("/marcas", marca);
export const updateMarca = (id: number, marca: Marca) => api.put(`/marcas/${id}`, marca);
export const deleteMarca = (id: number) => api.delete(`/marcas/${id}`);

