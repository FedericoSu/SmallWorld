-- ============================================================
-- Esquema de base de datos: empresa_admin
-- Administrador economico basico de una empresa
-- ============================================================

-- Se borran las tablas si ya existen, para poder ejecutar este
-- script varias veces durante la clase sin errores.
DROP TABLE IF EXISTS pagos_salarios;
DROP TABLE IF EXISTS empleados;
DROP TABLE IF EXISTS departamentos;

-- ------------------------------------------------------------
-- Tabla: departamentos
-- Cada departamento tiene un presupuesto mensual asignado.
-- ------------------------------------------------------------
CREATE TABLE departamentos (
    id                 SERIAL PRIMARY KEY,
    nombre             VARCHAR(100) NOT NULL UNIQUE,
    presupuesto_mensual NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- Tabla: empleados
-- Cada empleado pertenece (opcionalmente) a un departamento.
-- ------------------------------------------------------------
CREATE TABLE empleados (
    id             SERIAL PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    puesto         VARCHAR(100),
    salario        NUMERIC(12, 2) NOT NULL CHECK (salario >= 0),
    fecha_ingreso  DATE NOT NULL DEFAULT CURRENT_DATE,
    departamento_id INTEGER REFERENCES departamentos(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Tabla: pagos_salarios
-- Historial de pagos realizados a cada empleado, mes a mes.
-- ------------------------------------------------------------
CREATE TABLE pagos_salarios (
    id            SERIAL PRIMARY KEY,
    empleado_id   INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    mes           INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio          INTEGER NOT NULL CHECK (anio >= 2000),
    monto_pagado  NUMERIC(12, 2) NOT NULL CHECK (monto_pagado >= 0),
    fecha_pago    DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Evita cargar dos veces el pago del mismo mes/anio a un mismo empleado
    UNIQUE (empleado_id, mes, anio)
);

-- Indices para acelerar las consultas mas comunes del panel economico
CREATE INDEX idx_empleados_departamento ON empleados(departamento_id);
CREATE INDEX idx_pagos_empleado ON pagos_salarios(empleado_id);
CREATE INDEX idx_pagos_mes_anio ON pagos_salarios(anio, mes);
