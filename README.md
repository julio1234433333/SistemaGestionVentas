# Sistema de Gestión de Ventas

## Descripción
Este proyecto consiste en el desarrollo de un sistema de gestión de ventas utilizando Node.js, Express y Microsoft SQL Server. Su objetivo es administrar vendedores, clientes, productos y pedidos.

## Tecnologías utilizadas
- Node.js
- Express
- Microsoft SQL Server Express
- SQL Server Management Studio (SSMS)
- JavaScript
- SQL

## Estructura de la base de datos
La base de datos `SistemaGestionVentas` contiene las siguientes tablas:

- Vendedores: almacena la información de los vendedores.
- Clientes: almacena la información de los clientes.
- Productos: almacena los productos, sus precios y existencias.
- Pedidos: registra los pedidos realizados por los clientes y atendidos por los vendedores.
- DetallePedido: registra los productos y cantidades de cada pedido.

## Instalación y configuración

1. Instalar Node.js y Microsoft SQL Server Express.
2. Abrir el proyecto en Visual Studio Code.
3. Abrir una terminal dentro de la carpeta del proyecto.
4. Ejecutar `npm install` para instalar las dependencias.
5. Configurar la conexión a SQL Server en el archivo `db.js`, utilizando los datos del equipo donde se ejecutará el proyecto.
6. Abrir `SistemaGestionVentas.sql` en SQL Server Management Studio y ejecutar el script para crear la base de datos y los datos de prueba. Se recomienda hacerlo en una instancia de prueba.

## Ejecución

Para iniciar el servidor en modo normal:

`npm start`

Para iniciar el servidor en modo desarrollo:

`npm run dev`

La API estará disponible en:

`http://localhost:3000`

## Rutas disponibles actualmente

- `GET /api/vendedores`: consulta vendedores.
- `GET /api/clientes`: consulta clientes.
- `GET /api/productos`: consulta productos.

Las operaciones adicionales se documentarán conforme se implementen y prueben.

## Autor
Estudiante de Ingeniería en Desarrollo de Software.