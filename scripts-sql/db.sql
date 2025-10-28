-- ========================================
-- SISTEMA BANCARIO COMPLETO
-- Autor: Miguel Verduguez
-- Motor: MySQL 
-- Codificación: UTF-8 (utf8mb4)
-- ========================================

DROP DATABASE IF EXISTS BancoDB;
CREATE DATABASE IF NOT EXISTS BancoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BancoDB;

-- ========================================
-- 1. SUCURSAL
-- ========================================
CREATE TABLE Sucursal (
    IdSucursal INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200),
    Ciudad VARCHAR(100),
    Telefono VARCHAR(20),
    Email VARCHAR(100),
    Estado BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 2. USUARIO
-- ========================================
CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    IdSucursal INT NULL,
    Nombre VARCHAR(100) NOT NULL,
    DNI VARCHAR(20) NOT NULL UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    PasswordHash VARCHAR(255) NOT NULL,
    Rol ENUM('cliente','empleado','gerente','admin') DEFAULT 'cliente',
    FechaAlta DATETIME DEFAULT CURRENT_TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdSucursal) REFERENCES Sucursal(IdSucursal) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 3. TIPO DE CUENTA
-- ========================================
CREATE TABLE TipoCuenta (
    IdTipoCuenta INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(200),
    PermiteCredito BOOLEAN DEFAULT FALSE,
    Moneda VARCHAR(10) DEFAULT 'ARS',
    TasaInteres DECIMAL(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 4. CUENTA
-- ========================================
CREATE TABLE Cuenta (
    IdCuenta INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NOT NULL,
    IdTipoCuenta INT NOT NULL,
    IdSucursal INT NOT NULL,
    CBU CHAR(22) UNIQUE NOT NULL,
    Alias VARCHAR(30) UNIQUE,
    Saldo DECIMAL(18,2) DEFAULT 0.00,
    FechaApertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    Activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdTipoCuenta) REFERENCES TipoCuenta(IdTipoCuenta),
    FOREIGN KEY (IdSucursal) REFERENCES Sucursal(IdSucursal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 5. TRANSACCION
-- ========================================
CREATE TABLE Transaccion (
    IdTransaccion INT AUTO_INCREMENT PRIMARY KEY,
    IdCuentaOrigen INT NULL,
    IdCuentaDestino INT NULL,
    Monto DECIMAL(18,2) NOT NULL,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo ENUM('deposito','retiro','transferencia','pago') NOT NULL,
    Descripcion VARCHAR(255),
    Estado ENUM('pendiente','completado','cancelado') DEFAULT 'completado',
    FOREIGN KEY (IdCuentaOrigen) REFERENCES Cuenta(IdCuenta),
    FOREIGN KEY (IdCuentaDestino) REFERENCES Cuenta(IdCuenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 6. TARJETA
-- ========================================
CREATE TABLE Tarjeta (
    IdTarjeta INT AUTO_INCREMENT PRIMARY KEY,
    IdCuenta INT NOT NULL,
    NumeroTarjeta CHAR(16) UNIQUE NOT NULL,
    FechaVencimiento DATE NOT NULL,
    CVV CHAR(3) NOT NULL,
    Tipo ENUM('debito', 'credito') NOT NULL,
    LimiteCredito DECIMAL(18, 2) DEFAULT 0.00,
    SaldoDisponible DECIMAL(18, 2) DEFAULT 0.00,
    Activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdCuenta) REFERENCES Cuenta(IdCuenta)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- ========================================
-- 7. PRESTAMO
-- ========================================
CREATE TABLE Prestamo (
    IdPrestamo INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NOT NULL,
    Monto DECIMAL(18,2) NOT NULL,
    TasaInteres DECIMAL(5,2) NOT NULL,
    PlazoMeses INT NOT NULL,
    FechaInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaFin DATETIME NULL,
    Estado ENUM('pendiente','aprobado','rechazado','cancelado','pagado') DEFAULT 'pendiente',
    CuotaMensual DECIMAL(18,2) NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 8. AUDITORIA
-- ========================================
CREATE TABLE Auditoria (
    IdAuditoria INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NULL,
    Accion VARCHAR(100) NOT NULL,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    Detalle VARCHAR(500),
    IP VARCHAR(50),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 9. NOTIFICACION
-- ========================================
CREATE TABLE Notificacion (
    IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Mensaje VARCHAR(500) NOT NULL,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Leida BOOLEAN DEFAULT FALSE,
    Tipo ENUM('transaccion','prestamo','seguridad','general') DEFAULT 'general',
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;