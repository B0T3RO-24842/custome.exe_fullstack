-- ============================================
-- R-DROP DATABASE SCHEMA v4.0
-- Roles: comprador / vendedor / admin
-- ============================================

-- 1. LIMPIEZA
DROP FUNCTION IF EXISTS validar_no_autooferta() CASCADE;
DROP FUNCTION IF EXISTS actualizar_fiabilidad() CASCADE;
DROP FUNCTION IF EXISTS actualizar_timestamp() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

DROP TABLE IF EXISTS solicitudes_vendedor CASCADE;
DROP TABLE IF EXISTS resenas CASCADE;
DROP TABLE IF EXISTS disputas CASCADE;
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS transacciones CASCADE;
DROP TABLE IF EXISTS ofertas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS estados_disputa CASCADE;
DROP TABLE IF EXISTS estados_transaccion CASCADE;
DROP TABLE IF EXISTS estados_oferta CASCADE;
DROP TABLE IF EXISTS estados_producto CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS generos CASCADE;
DROP TABLE IF EXISTS tipo_documento CASCADE;

-- ============================================
-- 2. TABLAS CATÁLOGO
-- ============================================
CREATE TABLE generos (
    id_genero SERIAL PRIMARY KEY,
    nombre_genero VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NULL
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE estados_producto (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL,
    orden_calidad INT NOT NULL
);

CREATE TABLE estados_oferta (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL
);

CREATE TABLE estados_transaccion (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL
);

CREATE TABLE estados_disputa (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL
);

CREATE TABLE tipo_documento (
    id_tipo_doc SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NULL
);

-- ============================================
-- 3. TABLA PRINCIPAL: usuarios
-- rol: comprador (default) / vendedor / admin
-- puntos_fiabilidad y nivel_vendedor solo
-- aplican cuando rol = 'vendedor'
-- ============================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    id_tipo_doc INT NOT NULL DEFAULT 1 REFERENCES tipo_documento(id_tipo_doc),
    foto_perfil TEXT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'comprador'
        CHECK (rol IN ('comprador', 'vendedor', 'admin')),
    -- Campos de vendedor (se activan al aprobar solicitud)
    puntos_fiabilidad INT NOT NULL DEFAULT 0
        CHECK (puntos_fiabilidad BETWEEN 0 AND 100),
    nivel_vendedor VARCHAR(20) NOT NULL DEFAULT 'estandar'
        CHECK (nivel_vendedor IN ('estandar', 'pro')),
    total_ventas INT NOT NULL DEFAULT 0,
    cuenta_bancaria VARCHAR(100) NULL,
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. SOLICITUDES DE VENDEDOR
-- El comprador llena este formulario desde
-- su perfil para pedir convertirse en vendedor
-- ============================================
CREATE TABLE solicitudes_vendedor (
    id_solicitud SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    -- Datos extra que pide la plataforma
    numero_documento VARCHAR(50) NOT NULL,
    tipo_documento_id INT NOT NULL REFERENCES tipo_documento(id_tipo_doc),
    foto_documento_frontal TEXT NOT NULL, -- URL en Supabase Storage
    foto_documento_trasera TEXT NULL,     -- URL en Supabase Storage
    selfie_con_documento TEXT NULL,       -- URL en Supabase Storage (opcional)
    ciudad VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    descripcion_tienda TEXT NULL,         -- Por qué quiere vender
    -- Estado de la solicitud
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
    motivo_rechazo TEXT NULL,             -- Si admin rechaza, explica por qué
    revisado_por UUID NULL REFERENCES usuarios(id), -- ID del admin que aprobó/rechazó
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resuelta_at TIMESTAMP NULL,
    -- Un usuario solo puede tener una solicitud activa
    UNIQUE(usuario_id)
);

-- ============================================
-- 5. TABLA: productos
-- ============================================
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    vendedor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    id_categoria INT NOT NULL REFERENCES categorias(id_categoria),
    id_genero INT NOT NULL REFERENCES generos(id_genero),
    talla VARCHAR(20) NULL,
    id_estado_producto INT NOT NULL REFERENCES estados_producto(id_estado),
    marca VARCHAR(100) NULL,
    fotos JSONB NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    vistas INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fotos_minimas CHECK (jsonb_array_length(fotos) >= 1)
);

-- ============================================
-- 6. TABLA: ofertas
-- ============================================
CREATE TABLE ofertas (
    id_oferta SERIAL PRIMARY KEY,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    comprador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    id_estado INT NOT NULL DEFAULT 1 REFERENCES estados_oferta(id_estado),
    mensaje_oferta TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aceptada_at TIMESTAMP NULL,
    rechazada_at TIMESTAMP NULL
);

-- ============================================
-- 7. TABLA: transacciones
-- ============================================
CREATE TABLE transacciones (
    id_transaccion SERIAL PRIMARY KEY,
    id_oferta INT NOT NULL UNIQUE REFERENCES ofertas(id_oferta) ON DELETE RESTRICT,
    monto_total DECIMAL(10,2) NOT NULL CHECK (monto_total > 0),
    comision_porcentaje DECIMAL(5,2) NOT NULL
        CHECK (comision_porcentaje >= 0 AND comision_porcentaje <= 100),
    comision_monto DECIMAL(10,2) NOT NULL CHECK (comision_monto >= 0),
    monto_vendedor DECIMAL(10,2) NOT NULL CHECK (monto_vendedor >= 0),
    id_estado INT NOT NULL DEFAULT 1 REFERENCES estados_transaccion(id_estado),
    payment_intent_id VARCHAR(200) NULL,
    tracking_number VARCHAR(100) NULL,
    transportadora VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pagado_at TIMESTAMP NULL,
    enviado_at TIMESTAMP NULL,
    entregado_at TIMESTAMP NULL,
    liberado_at TIMESTAMP NULL,
    CONSTRAINT monto_correcto CHECK (monto_total = comision_monto + monto_vendedor)
);

-- ============================================
-- 8. TABLAS: mensajes, disputas, resenas
-- ============================================
CREATE TABLE mensajes (
    id_mensaje SERIAL PRIMARY KEY,
    conversacion_id UUID NOT NULL,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    remitente_id UUID NOT NULL REFERENCES usuarios(id),
    destinatario_id UUID NOT NULL REFERENCES usuarios(id),
    contenido TEXT NOT NULL,
    archivo_adjunto TEXT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_automensaje CHECK (remitente_id != destinatario_id)
);

CREATE TABLE disputas (
    id_disputa SERIAL PRIMARY KEY,
    id_transaccion INT NOT NULL REFERENCES transacciones(id_transaccion) ON DELETE RESTRICT,
    iniciador_id UUID NOT NULL REFERENCES usuarios(id),
    motivo TEXT NOT NULL,
    evidencia_fotos JSONB NULL,
    id_estado INT NOT NULL DEFAULT 1 REFERENCES estados_disputa(id_estado),
    resolucion TEXT NULL,
    ganador_id UUID NULL REFERENCES usuarios(id),
    revisado_por UUID NULL REFERENCES usuarios(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resuelta_at TIMESTAMP NULL
);

CREATE TABLE resenas (
    id_resena SERIAL PRIMARY KEY,
    id_transaccion INT NOT NULL REFERENCES transacciones(id_transaccion) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES usuarios(id),
    evaluado_id UUID NOT NULL REFERENCES usuarios(id),
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    fotos_producto JSONB NULL,
    verificada BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_autoresena CHECK (autor_id != evaluado_id),
    UNIQUE(id_transaccion, autor_id)
);

-- ============================================
-- 9. ÍNDICES
-- ============================================
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_solicitudes_estado ON solicitudes_vendedor(estado);
CREATE INDEX idx_solicitudes_usuario ON solicitudes_vendedor(usuario_id);
CREATE INDEX idx_productos_vendedor ON productos(vendedor_id);
CREATE INDEX idx_productos_categoria_genero ON productos(id_categoria, id_genero);
CREATE INDEX idx_productos_disponible ON productos(disponible) WHERE disponible = TRUE;
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_ofertas_producto ON ofertas(id_producto);
CREATE INDEX idx_ofertas_comprador ON ofertas(comprador_id);
CREATE INDEX idx_ofertas_estado ON ofertas(id_estado);
CREATE INDEX idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX idx_mensajes_no_leidos ON mensajes(destinatario_id, leido) WHERE leido = FALSE;
CREATE INDEX idx_transacciones_estado ON transacciones(id_estado);

-- ============================================
-- 10. DATOS SEMILLA
-- ============================================
INSERT INTO tipo_documento (nombre_tipo, descripcion) VALUES
    ('Cédula de ciudadanía', 'Documento de identidad colombiano'),
    ('Cédula de extranjería', 'Documento para extranjeros en Colombia'),
    ('Pasaporte', 'Documento de viaje internacional'),
    ('Tarjeta de identidad', 'Para menores de edad');

INSERT INTO generos (nombre_genero, descripcion) VALUES
    ('Masculino', 'Ropa y accesorios para hombre'),
    ('Femenino', 'Ropa y accesorios para mujer'),
    ('Unisex', 'Productos sin distinción de género');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES
    ('Urbana', 'Moda urbana y streetwear'),
    ('Lujo', 'Marcas premium y diseñadores'),
    ('Deportiva', 'Ropa y calzado deportivo'),
    ('Casual', 'Ropa de uso diario'),
    ('Accesorios', 'Complementos y accesorios');

INSERT INTO estados_producto (nombre_estado, descripcion, orden_calidad) VALUES
    ('Nuevo con etiqueta', 'Producto sin usar, con etiqueta original', 1),
    ('Como nuevo', 'Sin uso visible, sin etiqueta', 2),
    ('Usado bueno', 'Uso ligero, buen estado general', 3),
    ('Usado aceptable', 'Uso moderado, puede tener defectos menores', 4);

INSERT INTO estados_oferta (nombre_estado, descripcion) VALUES
    ('Pendiente', 'Esperando respuesta del vendedor'),
    ('Aceptada', 'Vendedor aceptó la oferta'),
    ('Rechazada', 'Vendedor rechazó la oferta'),
    ('Pagada', 'Comprador completó el pago'),
    ('Cancelada', 'Oferta cancelada por cualquier parte');

INSERT INTO estados_transaccion (nombre_estado, descripcion) VALUES
    ('Pago pendiente', 'Esperando confirmación de pago'),
    ('Pagado', 'Pago confirmado, fondos retenidos'),
    ('Enviado', 'Producto en tránsito'),
    ('Entregado', 'Producto recibido por comprador'),
    ('Completado', 'Fondos liberados al vendedor'),
    ('Cancelado', 'Transacción cancelada'),
    ('En disputa', 'Existe una disputa activa');

INSERT INTO estados_disputa (nombre_estado, descripcion) VALUES
    ('Abierta', 'Disputa recién creada'),
    ('En revisión', 'Equipo de soporte revisando evidencias'),
    ('Resuelta a favor del comprador', 'Se devuelve el dinero'),
    ('Resuelta a favor del vendedor', 'Se libera el dinero'),
    ('Cerrada sin resolución', 'Ambas partes llegaron a acuerdo');

-- ============================================
-- 11. FUNCIONES Y TRIGGERS
-- ============================================

-- Auto-crear perfil cuando alguien se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id, nombre_completo, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Cuando admin aprueba solicitud → cambiar rol a vendedor
CREATE OR REPLACE FUNCTION aprobar_solicitud_vendedor()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'aprobada' AND OLD.estado = 'pendiente' THEN
        UPDATE usuarios
        SET rol = 'vendedor', verificado = TRUE
        WHERE id = NEW.usuario_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_aprobar_vendedor
    AFTER UPDATE ON solicitudes_vendedor
    FOR EACH ROW EXECUTE FUNCTION aprobar_solicitud_vendedor();

-- Actualizar puntos de fiabilidad al recibir reseña
CREATE OR REPLACE FUNCTION actualizar_fiabilidad()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE usuarios
    SET puntos_fiabilidad = (
        SELECT COALESCE(AVG(calificacion) * 20, 100)
        FROM resenas WHERE evaluado_id = NEW.evaluado_id
    )
    WHERE id = NEW.evaluado_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_actualizar_fiabilidad
    AFTER INSERT ON resenas
    FOR EACH ROW EXECUTE FUNCTION actualizar_fiabilidad();

-- No ofertarse a sí mismo
CREATE OR REPLACE FUNCTION validar_no_autooferta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.comprador_id = (
        SELECT vendedor_id FROM productos WHERE id_producto = NEW.id_producto
    ) THEN
        RAISE EXCEPTION 'No puedes ofertar en tu propio producto.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_autooferta
    BEFORE INSERT ON ofertas
    FOR EACH ROW EXECUTE FUNCTION validar_no_autooferta();

-- Timestamps automáticos
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_updated
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_productos_updated
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================
-- 12. RLS - SEGURIDAD A NIVEL DE FILA
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_vendedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;

-- Usuarios
CREATE POLICY "usuarios_ver_propio" ON usuarios
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "usuarios_actualizar_propio" ON usuarios
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "usuarios_insert_trigger" ON usuarios
    FOR INSERT WITH CHECK (true);

-- Solicitudes vendedor
CREATE POLICY "solicitud_ver_propia" ON solicitudes_vendedor
    FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "solicitud_crear" ON solicitudes_vendedor
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "solicitud_actualizar_propia" ON solicitudes_vendedor
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Productos
CREATE POLICY "productos_ver_publicos" ON productos
    FOR SELECT USING (disponible = TRUE OR vendedor_id = auth.uid());
CREATE POLICY "productos_crear" ON productos
    FOR INSERT WITH CHECK (auth.uid() = vendedor_id);
CREATE POLICY "productos_editar_propios" ON productos
    FOR UPDATE USING (vendedor_id = auth.uid());

-- Ofertas
CREATE POLICY "ofertas_ver_propias" ON ofertas
    FOR SELECT USING (
        auth.uid() = comprador_id OR
        auth.uid() IN (
            SELECT vendedor_id FROM productos WHERE id_producto = ofertas.id_producto
        )
    );

-- Mensajes
CREATE POLICY "mensajes_ver_propios" ON mensajes
    FOR SELECT USING (
        auth.uid() = remitente_id OR auth.uid() = destinatario_id
    );