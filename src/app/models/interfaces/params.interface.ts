export interface PaginacionParams {
    filtro?: string;
    numeroPagina?: number;
    tamanoPagina?: number;
    soloActivos?: boolean;
}

export interface FacturaFiltroParams {
    NumeroFactura?: string;
    ClienteID?: number;
    VendedorID?: number;
    FechaDesde?: Date;
    FechaHasta?: Date;
    Pagina?: number;
    RegistrosPorPagina?: number;
}
