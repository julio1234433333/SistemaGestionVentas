# Sistema de Gestión de Ventas

## Descripción
Este proyecto consiste en el desarrollo de un sistema de gestión de ventas utilizando Node.js, Express y Microsoft SQL Server. Su objetivo es administrar la información de vendedores, clientes, productos y pedidos mediante una API.

## Tecnologías utilizadas
- Node.js
- Express
- Microsoft SQL Server Express
- SQL Server Management Studio (SSMS)
- JavaScript
- Knex
- Thunder Client

## Estructura de la base de datos
La base de datos `SistemaGestionVentas` contiene las siguientes tablas:

- Vendedores: almacena la información de los vendedores.
- Clientes: almacena la información de los clientes.
- Productos: almacena los productos, sus precios y existencias.
- Pedidos: registra los pedidos realizados por los clientes y atendidos por los vendedores.
- DetallePedido: registra los productos y cantidades de cada pedido.

## Instalación y configuración

1. Instalar Node.js y Microsoft SQL Server Express.
2. Descargar o clonar el repositorio.
3. Abrir el proyecto en Visual Studio Code.
4. Abrir una terminal dentro de la carpeta del proyecto.
5. Ejecutar `npm install` para instalar las dependencias.
6. Crear un archivo `.env` tomando como referencia `.env.example`.
7. Configurar los datos de conexión a SQL Server en el archivo `.env`.
8. Abrir el archivo `script.sql` en SQL Server Management Studio y ejecutarlo para crear la base de datos y cargar los registros de ejemplo.

**Nota:** El script debe ejecutarse cuando la base de datos `SistemaGestionVentas` todavía no exista.

## Ejecución

Para iniciar el servidor en modo desarrollo:

`npm run dev`

Para iniciar el servidor en modo normal:

`npm start`

La API estará disponible en:

`http://localhost:3000`

## Rutas de la API

### Rutas originales
- `GET /api/vendedores`: consulta vendedores.
- `GET /api/clientes`: consulta clientes.
- `GET /api/productos`: consulta productos.
- `GET /api/pedidos`: consulta pedidos.

### Rutas implementadas con Knex

**Vendedores**
- `GET /api/vendedores-knex`
- `GET /api/vendedores-knex/:id`
- `POST /api/vendedores-knex`
- `PUT /api/vendedores-knex/:id`
- `DELETE /api/vendedores-knex/:id`

**Productos**
- `GET /api/productos-knex`
- `GET /api/productos-knex/:id`
- `POST /api/productos-knex`
- `PUT /api/productos-knex/:id`
- `DELETE /api/productos-knex/:id`

**Pedidos**
- `GET /api/pedidos-knex`
- `GET /api/pedidos-knex/:id`
- `POST /api/pedidos-knex`
- `PUT /api/pedidos-knex/:id`
- `DELETE /api/pedidos-knex/:id`

**Detalle de pedidos**
- `GET /api/detalle-pedidos-knex`
- `GET /api/detalle-pedidos-knex/:id`
- `POST /api/detalle-pedidos-knex`
- `PUT /api/detalle-pedidos-knex/:id`
- `DELETE /api/detalle-pedidos-knex/:id`

## Pruebas
Las rutas fueron probadas utilizando Thunder Client, verificando las operaciones de consulta, registro, actualización y eliminación de información.

## Autor
Julio Alberto Gonzalez Tello.