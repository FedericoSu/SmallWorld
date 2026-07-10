-- ============================================================
-- Datos de ejemplo para practicar en clase
-- Ejecutar DESPUES de schema.sql
-- ============================================================

INSERT INTO departamentos (nombre, presupuesto_mensual) VALUES
    ('Tecnologia', 25000.00),
    ('Ventas', 15000.00),
    ('Recursos Humanos', 8000.00),
    ('Administracion', 10000.00);

INSERT INTO empleados (nombre, apellido, email, puesto, salario, fecha_ingreso, departamento_id) VALUES
    ('Ana',     'Gomez',    'ana.gomez@empresa.com',    'Desarrolladora Backend', 3500.00, '2023-03-01', 1),
    ('Bruno',   'Diaz',     'bruno.diaz@empresa.com',   'Desarrollador Frontend', 3200.00, '2023-05-15', 1),
    ('Carla',   'Perez',    'carla.perez@empresa.com',  'Vendedora',              2200.00, '2022-11-10', 2),
    ('Diego',   'Fernandez','diego.fernandez@empresa.com','Jefe de Ventas',       2900.00, '2021-06-01', 2),
    ('Elena',   'Suarez',   'elena.suarez@empresa.com', 'Analista de RRHH',       2400.00, '2024-01-20', 3),
    ('Franco',  'Molina',   'franco.molina@empresa.com','Contador',               2600.00, '2022-02-14', 4);

-- Pagos de salario de ejemplo (mes 6 y 7 de 2026)
INSERT INTO pagos_salarios (empleado_id, mes, anio, monto_pagado, fecha_pago) VALUES
    (1, 6, 2026, 3500.00, '2026-06-30'),
    (2, 6, 2026, 3200.00, '2026-06-30'),
    (3, 6, 2026, 2200.00, '2026-06-30'),
    (4, 6, 2026, 2900.00, '2026-06-30'),
    (5, 6, 2026, 2400.00, '2026-06-30'),
    (6, 6, 2026, 2600.00, '2026-06-30'),
    (1, 7, 2026, 3500.00, '2026-07-31'),
    (2, 7, 2026, 3200.00, '2026-07-31'),
    (3, 7, 2026, 2200.00, '2026-07-31');
