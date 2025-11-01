<h1 align="center"> E.T. Nº12 D.E. 1º "Libertador Gral. José de San Martín" </h1>
<p align="center">
  <img src="https://et12.edu.ar/imgs/et12.gif">
</p>

## Computación : 2025

**Nombre TP**: EduBank

**Apellido y Nombre Alumno**: Verdugues Miguel, Guzman Josu, Tito Joel, Mendoza Davis, Bruno Carlos

**Curso**: 6 ° 7

# EduBank
Este proyecto es un Sistema Bancario Backend desarrollado con Node.js y Express que proporciona una API RESTful completa para gestionar operaciones bancarias. El sistema incluye módulos para:

- Gestión de Usuarios (clientes, empleados, gerentes)
- Sucursales Bancarias
- Tipos de Cuentas (Caja de Ahorro, Cuenta Corriente, etc.)
- Cuentas Bancarias con CBU único
- Transacciones (transferencias, depósitos, retiros)
- Tarjetas (débito y crédito)
- Préstamos
- Auditoría de operaciones
- Notificaciones a usuarios

```shell
 mysql --default-character-set=utf8mb4 -u mysql-user -p
```

<h3 align="center"> Diagrama de clases del Proyecto </h3>


```mermaid
erDiagram
    SUCURSAL {
        int IdSucursal PK
        string Nombre
        string Direccion
        string Ciudad
        string Telefono
        string Email
        boolean Estado
    }

    USUARIO {
        int IdUsuario PK
        int IdSucursal FK
        string Nombre
        string DNI
        string Email
        string Telefono
        string Direccion
        string PasswordHash
        enum Rol
        datetime FechaAlta
        boolean Activo
    }

    TIPO_CUENTA {
        int IdTipoCuenta PK
        string Nombre
        string Descripcion
        boolean PermiteCredito
        string Moneda
        decimal TasaInteres
    }

    CUENTA {
        int IdCuenta PK
        int IdUsuario FK
        int IdTipoCuenta FK
        int IdSucursal FK
        string CBU
        string Alias
        decimal Saldo
        datetime FechaApertura
        boolean Activa
    }

    TRANSACCION {
        int IdTransaccion PK
        int IdCuentaOrigen FK
        int IdCuentaDestino FK
        decimal Monto
        datetime Fecha
        enum Tipo
        string Descripcion
        enum Estado
    }

    TARJETA {
        int IdTarjeta PK
        int IdCuenta FK
        string NumeroTarjeta
        date FechaVencimiento
        string CVV
        enum Tipo
        decimal LimiteCredito
        decimal SaldoDisponible
        boolean Activa
    }

    PRESTAMO {
        int IdPrestamo PK
        int IdUsuario FK
        decimal Monto
        decimal TasaInteres
        int PlazoMeses
        datetime FechaInicio
        datetime FechaFin
        enum Estado
        decimal CuotaMensual
    }

    AUDITORIA {
        int IdAuditoria PK
        int IdUsuario FK
        string Accion
        datetime Fecha
        string Detalle
        string IP
    }

    NOTIFICACION {
        int IdNotificacion PK
        int IdUsuario FK
        string Titulo
        string Mensaje
        datetime FechaEnvio
        boolean Leida
        enum Tipo
    }

    SUCURSAL ||--o{ USUARIO : "tiene"
    SUCURSAL ||--o{ CUENTA : "opera_en"
    USUARIO ||--o{ CUENTA : "posee"
    USUARIO ||--o{ PRESTAMO : "solicita"
    USUARIO ||--o{ AUDITORIA : "genera"
    USUARIO ||--o{ NOTIFICACION : "recibe"
    TIPO_CUENTA ||--o{ CUENTA : "clasifica"
    CUENTA ||--o{ TRANSACCION : "origen_en"
    CUENTA ||--o{ TRANSACCION : "destino_en"
    CUENTA ||--o{ TARJETA : "asociada_a"

```

## Comenzando 🚀

Clonar el repositorio github, desde Github Desktop o ejecutar en la terminal o CMD:

```
https://github.com/JosuGuzman/EduBank
```
Y instalar depedencias:
```
npm install
```

## Pre-requisitos 📋
- Node.js (versión 16 o superior)
- Visual Studio Code - [Descargar](https://code.visualstudio.com/#alt-downloads)
- Git - [Descargar](https://git-scm.com/downloads)
- MySQL - [Descargar](https://dev.mysql.com/downloads/mysql/)
- npm o yarn como gestor de paquetes

## Despliegue 📦

_Para iniciar el proyecto primero debe desplegar la base de datos y para eso tiene que hacer segundo click en la carpeta scripts sql_
_y presionar en terminal integrado, le aparecera una terminal donde tiene que poner lo siguiente:_

```
mysql -u tuUsuario -p 
:tuContraseña
```
