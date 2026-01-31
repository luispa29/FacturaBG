export interface ApiResponse<T> {
    codigo: number;
    mensaje: string;
    datos: T;
    paginacion?: PaginacionInfo;
}

export interface PaginacionInfo {
    paginaActual: number;
    tamanoPagina: number;
    totalRegistros: number;
    totalPaginas: number;
}

export interface Cliente {
    clienteID: number;
    identificacion: string;
    nombre: string;
    telefono: string;
    email: string;
    activo: boolean;
    fechaRegistro: Date;
}

export interface Producto {
    id: number;
    nombre: string;
    precioUnitario: number;
    stockActual: number;
    activo: boolean;
    fechaCreacion: Date;
}

export interface Usuario {
    usuarioID: number;
    username: string;
    nombre: string;
    email: string;
    activo: boolean;
    fechaCreacion: Date;
}

export interface Factura {
    id: number;
    numeroFactura: string;
    clienteID: number;
    vendedorID: number;
    fechaFactura: Date;
    subtotal: number;
    impuesto: number;
    total: number;
    detalles: FacturaDetalle[];
    pagos: FacturaPago[];
}

export interface FacturaDetalle {
    id: number;
    facturaID: number;
    productoID: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface FacturaPago {
    id: number;
    facturaID: number;
    formaPagoID: number;
    monto: number;
    referencia: string;
}

export interface FormaPago {
    id: number;
    nombre: string;
    activo: boolean;
}

export interface LoginResponse {
    token: string;
    nombre: string;
    usuario?: Usuario;
}
