// Tipos compartidos del frontend

export interface User {
    id: string;
    nombre_completo: string;
    email: string;
    puntos_fiabilidad: number;
    nivel_vendedor: 'estandar' | 'pro';
    verificado: boolean;
  }
  
  export interface Product {
    id_producto: number;
    titulo: string;
    descripcion: string;
    precio: number;
    categoria: string;
    genero: string;
    talla?: string;
    estado: string;
    marca?: string;
    fotos: string[];
    vendedor_id: string;
    vendedor?: {
      nombre_completo: string;
      puntos_fiabilidad: number;
    };
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, nombre: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
  }