# Empresa Admin — Proyecto educativo (Node.js + Express + PostgreSQL)

Proyecto de ejemplo, pensado para clase, que implementa un administrador
economico basico de una empresa: carga de empleados, registro de sus
salarios y consultas economicas simples (cuanto se paga por mes, cuanto
gasta cada departamento, etc).

## Objetivo del proyecto

Mostrar, con un caso simple y realista, como se construye una API REST
con Node.js + Express que persiste datos en PostgreSQL, separando
responsabilidades en carpetas claras: rutas, controladores, configuracion
de base de datos y SQL.

## Modelo de datos

Tres tablas relacionadas entre si:

- **departamentos**: las areas de la empresa (Tecnologia, Ventas, etc.), cada una con un presupuesto mensual.
- **empleados**: las personas que trabajan en la empresa. Cada empleado pertenece a un departamento (opcional) y tiene un salario.
- **pagos_salarios**: el historial de pagos reales hechos a cada empleado, mes a mes.

```
departamentos (1) ───< (N) empleados (1) ───< (N) pagos_salarios
```

Esto permite cruzar informacion: por ejemplo, saber cuanto gasta en
salarios cada departamento, o cuanto pago la empresa en total en un mes
determinado.

## Frontend

El proyecto incluye una interfaz web simple para visualizar y cargar datos
sin usar `curl`. Es HTML + CSS + JS "vanilla" (sin React, sin build): el
propio Express la sirve como archivos estaticos desde `public/`, asi que no
hace falta levantar un segundo servidor.

Tiene 4 pestanas:

- **Economia**: tarjetas resumen (empleados, departamentos, presupuesto
  total, ultimo mes pagado), una barra de progreso por departamento que
  compara salarios vs. presupuesto mensual, y la tabla de pagos por mes.
- **Empleados**: formulario para crear empleados y tabla con edicion rapida
  de salario + eliminar.
- **Departamentos**: tabla de departamentos y su presupuesto.
- **Pagos**: formulario para registrar pagos y el historial completo.

Se abre automaticamente al entrar a `http://localhost:3000` con el servidor
corriendo (ver "Instalacion y puesta en marcha" mas abajo).

## Estructura de carpetas

```
SmallWorld/
├── db/
│   ├── schema.sql          # Creacion de las tablas (DDL)
│   └── seed.sql            # Datos de ejemplo para practicar
├── public/                 # Frontend estatico (HTML/CSS/JS, sin build)
│   ├── index.html          # Pestanas: Economia / Empleados / Departamentos / Pagos
│   ├── css/
│   │   └── styles.css      # Estilos (colores light/dark, tablas, meters)
│   └── js/
│       ├── api.js          # Funciones fetch() hacia /api/...
│       └── app.js          # Tabs, renderizado de tablas/formularios/reportes
├── src/
│   ├── config/
│   │   └── db.js           # Conexion (pool) a PostgreSQL
│   ├── controllers/
│   │   ├── empleados.controller.js      # Logica de CRUD de empleados
│   │   ├── departamentos.controller.js  # Logica de consulta de departamentos
│   │   ├── pagos.controller.js          # Logica de registro/consulta de pagos
│   │   └── economia.controller.js       # Reportes economicos (consultas cruzadas)
│   ├── routes/
│   │   ├── empleados.routes.js     # URLs de /api/empleados
│   │   ├── departamentos.routes.js # URLs de /api/departamentos
│   │   ├── pagos.routes.js         # URLs de /api/pagos
│   │   └── economia.routes.js      # URLs de /api/economia
│   ├── db/
│   │   ├── create-tables.js  # Ejecuta db/schema.sql contra la base
│   │   └── seed.js           # Ejecuta db/seed.sql contra la base
│   ├── app.js               # Configuracion de Express (middlewares + rutas)
│   └── server.js            # Punto de entrada: levanta el servidor HTTP
├── .env.example             # Plantilla de variables de entorno
├── package.json
└── README.md
```

### Que hace cada archivo importante

| Archivo | Que hace |
|---|---|
| `db/schema.sql` | Define las tres tablas con SQL real: tipos, claves primarias, foraneas y validaciones (`CHECK`). |
| `db/seed.sql` | Inserta departamentos, empleados y pagos de ejemplo para poder probar la API sin cargar datos a mano. |
| `src/config/db.js` | Crea el `Pool` de conexiones a PostgreSQL usando las variables de entorno del `.env`. |
| `src/db/create-tables.js` | Script que lee `db/schema.sql` y lo ejecuta contra la base (equivalente a correr el `.sql` a mano, pero desde Node). |
| `src/db/seed.js` | Igual que el anterior, pero ejecuta `db/seed.sql`. |
| `src/controllers/*.controller.js` | Contienen las funciones que atienden cada request: leen `req.body`/`req.params`, ejecutan la consulta SQL y responden con `res.json(...)`. |
| `src/routes/*.routes.js` | Conectan una URL + metodo HTTP (GET, POST, etc.) con la funcion del controlador correspondiente. |
| `src/app.js` | Arma la aplicacion Express: activa el parseo de JSON, sirve `public/` como archivos estaticos y monta todas las rutas bajo `/api/...`. |
| `src/server.js` | Carga las variables de entorno y pone a escuchar el servidor en el puerto configurado. |
| `public/index.html` | Estructura de la pagina: las 4 pestanas, las tablas y los formularios (sin contenido dinamico todavia). |
| `public/js/api.js` | Un `fetch()` por cada endpoint de la API; centraliza el manejo de errores de las respuestas. |
| `public/js/app.js` | Cambia de pestana, llama a `api.js` y arma el HTML de tablas/tarjetas/reportes con los datos recibidos. |
| `public/css/styles.css` | Estilos de toda la interfaz, incluyendo modo claro/oscuro automatico (`prefers-color-scheme`). |

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL instalado y corriendo localmente (o accesible por red)

## Instalacion y puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear la base de datos en PostgreSQL

Con `psql` o cualquier cliente (pgAdmin, DBeaver, etc.):

```sql
CREATE DATABASE empresa_admin;
```

### 3. Configurar las variables de entorno

Copiar el archivo de ejemplo y completar los datos de tu instalacion de PostgreSQL:

```bash
cp .env.example .env
```

### 4. Crear las tablas

```bash
npm run db:create
```

Esto ejecuta `db/schema.sql` contra la base de datos indicada en `.env`.

### 5. Cargar datos de ejemplo (opcional pero recomendado)

```bash
npm run db:seed
```

Esto ejecuta `db/seed.sql`, que carga 4 departamentos, 6 empleados y
algunos pagos de salario ya registrados.

### 6. Levantar el servidor

```bash
npm run dev
```

El servidor queda escuchando en `http://localhost:3000` (o el puerto
que hayas puesto en `.env`). Se reinicia solo cada vez que guardas un
cambio en `src/` (gracias a `node --watch`).

Para correrlo sin auto-reinicio: `npm start`.

### 7. Abrir el frontend

Con el servidor corriendo, abrir `http://localhost:3000` en el navegador.
Ahi esta la interfaz visual (ver seccion "Frontend" mas arriba). No hace
falta ningun paso extra: Express sirve esos archivos directamente.

## Endpoints de la API

### Empleados

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/empleados` | Lista todos los empleados (con su departamento) |
| GET | `/api/empleados/:id` | Obtiene un empleado por ID |
| POST | `/api/empleados` | Crea un empleado nuevo |
| PUT | `/api/empleados/:id/salario` | Actualiza el salario de un empleado |
| DELETE | `/api/empleados/:id` | Elimina un empleado |

### Departamentos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/departamentos` | Lista todos los departamentos |
| GET | `/api/departamentos/:id` | Obtiene un departamento por ID |

### Pagos de salarios

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/pagos` | Lista todos los pagos (o filtra con `?empleado_id=`) |
| POST | `/api/pagos` | Registra el pago de un salario |

### Reportes economicos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/economia/pagos-por-mes` | Total pagado por la empresa, agrupado por mes/anio |
| GET | `/api/economia/salarios-por-departamento` | Suma de salarios actuales, agrupada por departamento |

## Ejemplos de uso (curl)

### Crear un empleado

```bash
curl -X POST http://localhost:3000/api/empleados \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Lucia",
    "apellido": "Torres",
    "email": "lucia.torres@empresa.com",
    "puesto": "Disenadora UX",
    "salario": 2800,
    "departamento_id": 1
  }'
```

Respuesta:

```json
{
  "id": 7,
  "nombre": "Lucia",
  "apellido": "Torres",
  "email": "lucia.torres@empresa.com",
  "puesto": "Disenadora UX",
  "salario": "2800.00",
  "fecha_ingreso": "2026-07-08",
  "departamento_id": 1
}
```

### Listar empleados

```bash
curl http://localhost:3000/api/empleados
```

### Ver un empleado por ID

```bash
curl http://localhost:3000/api/empleados/1
```

### Actualizar el salario de un empleado

```bash
curl -X PUT http://localhost:3000/api/empleados/1/salario \
  -H "Content-Type: application/json" \
  -d '{ "salario": 3800 }'
```

### Eliminar un empleado

```bash
curl -X DELETE http://localhost:3000/api/empleados/7
```

### Registrar el pago de un salario

```bash
curl -X POST http://localhost:3000/api/pagos \
  -H "Content-Type: application/json" \
  -d '{
    "empleado_id": 1,
    "mes": 8,
    "anio": 2026,
    "monto_pagado": 3500
  }'
```

### Consultar cuanto paga la empresa por mes

```bash
curl http://localhost:3000/api/economia/pagos-por-mes
```

Respuesta:

```json
[
  { "anio": 2026, "mes": 7, "cantidad_pagos": 3, "total_pagado": "8900.00" },
  { "anio": 2026, "mes": 6, "cantidad_pagos": 6, "total_pagado": "16800.00" }
]
```

### Consultar salarios agrupados por departamento

```bash
curl http://localhost:3000/api/economia/salarios-por-departamento
```

Respuesta:

```json
[
  {
    "departamento_id": 1,
    "departamento": "Tecnologia",
    "presupuesto_mensual": "25000.00",
    "cantidad_empleados": "2",
    "total_salarios": "6700.00"
  }
]
```

## Ideas para seguir practicando en clase

- Agregar validaciones mas estrictas (por ejemplo, con una libreria como `zod` o `joi`).
- Agregar un endpoint para editar los datos completos de un empleado (no solo el salario).
- Agregar paginacion a `GET /api/empleados`.
- Agregar un endpoint para crear departamentos.
- Calcular si un departamento se paso de su `presupuesto_mensual`.
