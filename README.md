# Sistema de Gestión de Ventas

## Descripción

Sistema de gestión de ventas desarrollado mediante Node.js, Express y Microsoft SQL Server Express. Su objetivo es administrar vendedores, clientes, productos, inventarios y pedidos mediante una API REST.

En este proyecto se implementaron operaciones CRUD, arquitectura modular, autenticación de usuarios, protección de rutas, validaciones, paginación y medidas de seguridad para fortalecer el funcionamiento y rendimiento del backend.

## Tecnologías utilizadas

- Node.js
- Express.js
- Microsoft SQL Server Express
- SQL Server Management Studio (SSMS)
- JavaScript
- Knex.js
- JSON Web Token (JWT)
- bcryptjs
- AES-256-GCM
- XSS
- Thunder Client

## Estructura de la base de datos

La base de datos `SistemaGestionVentas` contiene las siguientes tablas:

- **Vendedores:** almacena la información de los vendedores.
- **Clientes:** registra los datos de los clientes.
- **Productos:** almacena productos, precios y existencias.
- **Pedidos:** registra los pedidos realizados por los clientes y atendidos por los vendedores.
- **DetallePedido:** almacena los productos, cantidades y precios unitarios de cada pedido.
- **Usuarios:** almacena las cuentas de acceso y sus contraseñas mediante hashes.

## Instalación y configuración

1. Instalar Node.js y Microsoft SQL Server Express.
2. Descargar o clonar el repositorio.
3. Abrir el proyecto en Visual Studio Code.
4. Abrir una terminal dentro de la carpeta del proyecto.
5. Ejecutar `npm install` para instalar las dependencias.
6. Crear un archivo `.env` tomando como referencia `.env.example`.
7. Configurar los datos de conexión a SQL Server.
8. Configurar las variables secretas necesarias para JWT y AES.
9. Abrir `script.sql` en SQL Server Management Studio y ejecutarlo para crear la base de datos y cargar los registros de ejemplo.

**Importante:** No compartir ni subir el archivo `.env` al repositorio. Las claves secretas deben mantenerse privadas.

## Ejecución

Para iniciar el servidor en modo desarrollo:

`npm run dev`

Para iniciar el servidor en modo normal:

`npm start`

La API estará disponible en:

`http://localhost:3000`

## Rutas de la API

### Autenticación

- `POST /api/auth/registrar`: registra un usuario.
- `POST /api/auth/login`: inicia sesión y genera un token JWT.
- `GET /api/auth/perfil`: consulta la información del usuario autenticado.

### Vendedores

- `GET /api/vendedores-knex`
- `GET /api/vendedores-knex/:id`
- `POST /api/vendedores-knex`
- `PUT /api/vendedores-knex/:id`
- `DELETE /api/vendedores-knex/:id`

### Clientes

- `GET /api/clientes-knex`
- `GET /api/clientes-knex/:id`
- `POST /api/clientes-knex`
- `PUT /api/clientes-knex/:id`
- `DELETE /api/clientes-knex/:id`

### Productos

- `GET /api/productos-knex`
- `GET /api/productos-knex/:id`
- `POST /api/productos-knex`
- `PUT /api/productos-knex/:id`
- `DELETE /api/productos-knex/:id`

### Pedidos

- `GET /api/pedidos-knex`
- `GET /api/pedidos-knex/:id`
- `POST /api/pedidos-knex`
- `PUT /api/pedidos-knex/:id`
- `DELETE /api/pedidos-knex/:id`

### Detalle de pedidos

- `GET /api/detalle-pedidos-knex`
- `GET /api/detalle-pedidos-knex/:id`
- `POST /api/detalle-pedidos-knex`
- `PUT /api/detalle-pedidos-knex/:id`
- `DELETE /api/detalle-pedidos-knex/:id`

## Paginación

Se implementó un sistema de paginación para facilitar la consulta de registros y evitar devolver todos los datos en una sola respuesta.

Los endpoints de vendedores, clientes, productos y pedidos permiten utilizar los parámetros:

- `page`: número de página.
- `limit`: cantidad de registros por página.

Ejemplo:

`GET /api/productos-knex?page=1&limit=10`

La respuesta incluye los registros y los metadatos de paginación, como página actual, límite, total de registros y total de páginas. También se establece un límite máximo de 100 registros por consulta.

## Autenticación y seguridad

Se implementaron diferentes mecanismos para proteger la API:

- Autenticación mediante JSON Web Token (JWT).
- Contraseñas protegidas mediante hashes con bcryptjs.
- Tokens con tiempo de expiración de dos horas.
- Verificación de tokens para acceder a las rutas protegidas.
- Asignación del rol de vendedor durante el registro público.
- Protección de entradas mediante un middleware XSS.
- Consultas parametrizadas mediante Knex.js y SQL Server para reducir riesgos de SQL Injection.
- Cifrado y descifrado de información mediante AES-256-GCM.
- Uso de variables de entorno para mantener privadas las claves y los datos de conexión.

Las rutas de registro e inicio de sesión permanecen disponibles sin autenticación. Las demás rutas de la API requieren un token válido.

## Rendimiento y optimización

Se realizaron mejoras para optimizar las consultas y el manejo de información:

- Implementación de paginación en las consultas principales.
- Uso de índices en columnas relacionadas con las consultas de pedidos.
- Consultas ordenadas por identificador para mantener resultados consistentes.
- Uso de Knex.js para organizar las operaciones con la base de datos.

Se realizaron mediciones de tiempo de respuesta mediante Thunder Client. Los resultados variaron entre solicitudes, por lo que se consideraron mediciones de referencia y no una prueba de rendimiento controlada.

## Pruebas realizadas

Se utilizó Thunder Client para verificar el funcionamiento de los endpoints y las medidas de seguridad.

Entre las pruebas realizadas se encuentran:

- Registro de usuarios.
- Inicio de sesión y generación de tokens JWT.
- Consulta de rutas protegidas sin token, obteniendo respuesta HTTP 401.
- Acceso a rutas protegidas con token válido, obteniendo respuesta HTTP 200.
- Rechazo de tokens inválidos o expirados.
- Consulta de productos mediante paginación.
- Consulta de vendedores, clientes y pedidos.
- Operaciones CRUD.
- Prueba de cifrado y descifrado AES-256-GCM.
- Mediciones de tiempos de respuesta.

## Autor

Julio Alberto Gonzalez Tello

CESUN UNIVERSIDAD  
Ingeniería en Desarrollo de Software
