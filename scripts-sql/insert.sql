USE BancoDB;
-- ========================================
-- 1. SUCURSAL
-- ========================================
INSERT INTO Sucursal (Nombre, Direccion, Ciudad, Telefono, Email)
VALUES (
        'Sucursal Central',
        'Av. Siempre Viva 742',
        'Buenos Aires',
        '011-1234-5678',
        'central@banco.com'
    );
-- ========================================
-- 2. USUARIO
-- ========================================
INSERT INTO Usuario (
        IdSucursal,
        Nombre,
        DNI,
        Email,
        Telefono,
        Direccion,
        PasswordHash,
        Rol
    )
VALUES (
        1,
        'Juan Pérez',
        '40123456',
        'juan.perez@correo.com',
        '011-2222-3333',
        'Calle Falsa 123',
        'hash123',
        'cliente'
    ),
    (
        1,
        'María Gómez',
        '38999888',
        'maria.gomez@banco.com',
        '011-9999-1111',
        'Av. Libertad 555',
        'hash456',
        'empleado'
    ),
    (
        1,
        'Carlos López',
        '37555111',
        'carlos.lopez@banco.com',
        '011-8888-7777',
        'San Martín 101',
        'hash789',
        'gerente'
    );
-- ========================================
-- 3. TIPO DE CUENTA
-- ========================================
INSERT INTO TipoCuenta (
        Nombre,
        Descripcion,
        PermiteCredito,
        Moneda,
        TasaInteres
    )
VALUES (
        'Caja de Ahorro',
        'Cuenta básica para ahorro personal',
        FALSE,
        'ARS',
        0.00
    ),
    (
        'Cuenta Corriente',
        'Cuenta para movimientos frecuentes',
        TRUE,
        'ARS',
        3.50
    );
-- ========================================
-- 4. CUENTA
-- ========================================
INSERT INTO Cuenta (
        IdUsuario,
        IdTipoCuenta,
        IdSucursal,
        CBU,
        Alias,
        Saldo
    )
VALUES (
        1,
        1,
        1,
        '0000003100012345678901',
        'juan.ahorro',
        150000.00
    ),
    (
        1,
        2,
        1,
        '0000003200012345678902',
        'juan.corriente',
        50000.00
    ),
    (
        2,
        2,
        1,
        '0000003300012345678903',
        'maria.corriente',
        120000.00
    );
-- ========================================
-- 5. TRANSACCION
-- ========================================
INSERT INTO Transaccion (
        IdCuentaOrigen,
        IdCuentaDestino,
        Monto,
        Tipo,
        Descripcion,
        Estado
    )
VALUES (
        1,
        2,
        2000.00,
        'transferencia',
        'Transferencia entre cuentas propias',
        'completado'
    ),
    (
        3,
        1,
        5000.00,
        'transferencia',
        'Pago recibido de María',
        'completado'
    );
-- ========================================
-- 6. TARJETA
-- ========================================
INSERT INTO Tarjeta (
        IdUsuario,
        IdCuenta,
        NumeroTarjeta,
        FechaVencimiento,
        CVV,
        Tipo,
        LimiteCredito,
        SaldoDisponible
    )
VALUES (
        1,
        2,
        '4555555544443333',
        '2028-12-31',
        '123',
        'credito',
        100000.00,
        85000.00
    ),
    (
        1,
        1,
        '4111111122223333',
        '2027-05-31',
        '456',
        'debito',
        0.00,
        0.00
    );
-- ========================================
-- 7. PRESTAMO
-- ========================================
INSERT INTO Prestamo (
        IdUsuario,
        Monto,
        TasaInteres,
        PlazoMeses,
        Estado,
        CuotaMensual
    )
VALUES (1, 200000.00, 10.50, 24, 'aprobado', 9458.00);
-- ========================================
-- 8. AUDITORIA
-- ========================================
INSERT INTO Auditoria (IdUsuario, Accion, Detalle, IP)
VALUES (
        1,
        'Inicio de sesión',
        'El usuario ingresó correctamente',
        '192.168.0.10'
    ),
    (
        2,
        'Transferencia',
        'Transferencia de $2000 a cuenta propia',
        '192.168.0.15'
    );
-- ========================================
-- 9. NOTIFICACION
-- ========================================
INSERT INTO Notificacion (IdUsuario, Titulo, Mensaje, Tipo)
VALUES (
        1,
        'Transferencia realizada',
        'Tu transferencia de $2000 fue completada con éxito.',
        'transaccion'
    ),
    (
        1,
        'Préstamo aprobado',
        'Tu solicitud de préstamo ha sido aprobada.',
        'prestamo'
    );
