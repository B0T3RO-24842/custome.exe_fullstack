// Tipos compartidos del backend

export interface Usuario {
    id: string;
    nombre_completo: string;
    documento_identidad: string;
    telefono: string;
    email: string;
    puntos_fiabilidad: number;
    nivel_vendedor: 'estandar' | 'pro';
    total_ventas: number;
    verificado: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Producto {
    id_producto: number;
    vendedor_id: string;
    titulo: string;
    descripcion: string;
    precio: number;
    id_categoria: number;
    id_genero: number;
    talla?: string;
    id_estado_producto: number;
    marca?: string;
    fotos: string[]; // Array de URLs
    disponible: boolean;
    vistas: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Oferta {
    id_oferta: number;
    id_producto: number;
    comprador_id: string;
    monto: number;
    id_estado: number;
    mensaje_oferta?: string;
    created_at: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }