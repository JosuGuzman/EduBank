<h1 align="center"> E.T. Nº12 D.E. 1º "Libertador Gral. José de San Martín" </h1>
<p align="center">
  <img src="https://et12.edu.ar/imgs/et12.gif">
</p>

## Computación : 2025

**Nombre TP**: EduBank

**Apellido y Nombre Alumno**: Miguel Verdugues, Josu Duran,

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

```mermaid
erDiagram
    Pais{   
        TINYINT idPais PK
        VARCHAR(20) nombre UK
        VARCHAR(30) entrenador
        CHAR(1) grupo
    }
    Estadio{
        TINYINT idEstadio PK
        VARCHAR(40) nombre UK
        VARCHAR(200) descripcion
    }
    TipoPartido{
        TINYINT idTipoPartido PK
        CHAR(13) tipoPartido UK
    }
    Partido{
        TINYINT idPartido PK
        TINYINT idLocal FK
        TINYINT idVisitante FK
        TINYINT idEstadio FK
        TINYINT idTipoPartido
        TIMESTAMP fecha
        TINYINT golesLocales
        TINYINT golesVisitantes
        TINYINT_UNSIGNED duracion
    }
    Posicion{
        TINYINT idPosicion PK
        CHAR(13) posicion UK
    }
    Jugador{
        SMALLINT idJugador PK
        TINYINT idPais FK
        TINYINT idPosicion FK
        VARCHAR(20) nombre
        VARCHAR(20) apellido
        DATE nacimiento 
        TINYINT_UNSIGNED numCamiseta
    }
    JugadorPartido{
        SMALLINT idJugador PK, FK
        TINYINT idPartido PK, FK
        SMALLINT idReemplazo FK
        TINYINT_UNSIGNED ingreso
        TINYINT_UNSIGNED ingresoAdicionado
        TINYINT_UNSIGNED egreso
        TINYINT_UNSIGNED egresoAdicionado
    }
    Gol{
        SMALLINT idJugador PK
        TINYINT idPartido PK, FK
        TINYINT_UNSIGNED minuto PK
        BOOL enContra
    }
    DefinicionPenal{
        TINYINT idPartido PK, FK
        SMALLINT idJugador PK, FK
        TINYINT_UNSIGNED turno PK
        BOOL acierto
    }

    Jugador }o--|| Posicion :""
    Jugador }o--|| Pais :""
    Partido }o--|| Estadio :""
    Partido }o--|| TipoPartido :""
    JugadorPartido }o--|| Jugador :""
    JugadorPartido }o--|| Partido :""
    Gol }o--|| Jugador :""
    Gol }o--|| Partido :""
    DefinicionPenal }o--|| Jugador :""
    DefinicionPenal }o--|| Partido :""


```

## Comenzando 🚀

Clonar el repositorio github, desde Github Desktop o ejecutar en la terminal o CMD:

```
https://github.com/JosuGuzman/EduBank
```

## Pre-requisitos 📋
