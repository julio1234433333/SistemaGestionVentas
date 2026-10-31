IF DB_ID('SistemaGestionVentas') IS NULL
BEGIN
    CREATE DATABASE SistemaGestionVentas;
END;
GO

USE SistemaGestionVentas;
GO

IF OBJECT_ID('dbo.Vendedores', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Vendedores (
        IdVendedor INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL,
        Correo NVARCHAR(150) NOT NULL UNIQUE,
        Telefono NVARCHAR(20) NOT NULL
    );
END;
GO

IF OBJECT_ID('dbo.Clientes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clientes (
        IdCliente INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL,
        Correo NVARCHAR(150) NOT NULL UNIQUE,
        Telefono NVARCHAR(20) NOT NULL
    );
END;
GO

IF OBJECT_ID('dbo.Productos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Productos (
        IdProducto INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(250),
        Precio DECIMAL(10,2) NOT NULL
            CHECK (Precio >= 0),
        Existencia INT NOT NULL DEFAULT 0
            CHECK (Existencia >= 0)
    );
END;
GO

IF OBJECT_ID('dbo.Pedidos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Pedidos (
        IdPedido INT IDENTITY(1,1) PRIMARY KEY,
        IdCliente INT NOT NULL,
        IdVendedor INT NOT NULL,
        Fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Total DECIMAL(12,2) NOT NULL DEFAULT 0
            CHECK (Total >= 0),

        CONSTRAINT FK_Pedidos_Clientes
            FOREIGN KEY (IdCliente)
            REFERENCES dbo.Clientes(IdCliente),

        CONSTRAINT FK_Pedidos_Vendedores
            FOREIGN KEY (IdVendedor)
            REFERENCES dbo.Vendedores(IdVendedor)
    );
END;
GO

IF OBJECT_ID('dbo.DetallePedido', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.DetallePedido (
        IdDetalle INT IDENTITY(1,1) PRIMARY KEY,
        IdPedido INT NOT NULL,
        IdProducto INT NOT NULL,
        Cantidad INT NOT NULL CHECK (Cantidad > 0),
        PrecioUnitario DECIMAL(10,2) NOT NULL
            CHECK (PrecioUnitario >= 0),

        CONSTRAINT FK_DetallePedido_Pedidos
            FOREIGN KEY (IdPedido)
            REFERENCES dbo.Pedidos(IdPedido),

        CONSTRAINT FK_DetallePedido_Productos
            FOREIGN KEY (IdProducto)
            REFERENCES dbo.Productos(IdProducto),

        CONSTRAINT UQ_DetallePedido_Pedido_Producto
            UNIQUE (IdPedido, IdProducto)
    );
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Vendedores
    WHERE Correo = 'carlos@empresa.com'
)
BEGIN
    INSERT INTO dbo.Vendedores (Nombre, Correo, Telefono)
    VALUES ('Carlos Ramirez', 'carlos@empresa.com', '6641234567');
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Vendedores
    WHERE Correo = 'ana@empresa.com'
)
BEGIN
    INSERT INTO dbo.Vendedores (Nombre, Correo, Telefono)
    VALUES ('Ana Lopez', 'ana@empresa.com', '6649876543');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Clientes
    WHERE Correo = 'cliente1@empresa.com'
)
BEGIN
    INSERT INTO dbo.Clientes (Nombre, Correo, Telefono)
    VALUES ('Juan Perez', 'cliente1@empresa.com', '6641112233');
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Clientes
    WHERE Correo = 'cliente2@empresa.com'
)
BEGIN
    INSERT INTO dbo.Clientes (Nombre, Correo, Telefono)
    VALUES ('Maria Lopez', 'cliente2@empresa.com', '6644445566');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Productos
    WHERE Nombre = 'Laptop'
)
BEGIN
    INSERT INTO dbo.Productos
        (Nombre, Descripcion, Precio, Existencia)
    VALUES
        ('Laptop', 'Computadora portatil', 12000.00, 10);
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Productos
    WHERE Nombre = 'Mouse'
)
BEGIN
    INSERT INTO dbo.Productos
        (Nombre, Descripcion, Precio, Existencia)
    VALUES
        ('Mouse', 'Mouse USB', 250.00, 30);
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Productos
    WHERE Nombre = 'Teclado'
)
BEGIN
    INSERT INTO dbo.Productos
        (Nombre, Descripcion, Precio, Existencia)
    VALUES
        ('Teclado', 'Teclado USB', 450.00, 20);
END;
GO

SELECT * FROM dbo.Vendedores;
SELECT * FROM dbo.Clientes;
SELECT * FROM dbo.Productos;
SELECT * FROM dbo.Pedidos;
SELECT * FROM dbo.DetallePedido;
GO
