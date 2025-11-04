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


# ♻️ Residuos Electrónicos (E-Waste)

## 🌍 Mapa Mental

```mermaid
mindmap
  root((Residuos Electrónicos E-Waste))
    E-Waste_en_el_Mundo_y_Región
      "América Latina genera el 9% global [1]"
      "Argentina: 3er mayor generador de Latam [1, 3]"
      "Generación per cápita de Argentina: 8,7 kg (2017) [2]"
      "Producción global: Más de 40M de toneladas anuales [3]"
    Composición_y_Peligrosidad
      "Sustancias químicas tóxicas [6]"
      Metales_Pesados
        "Plomo [2, 8]"
        "Mercurio [8]"
        "Cadmio [8]"
        "Berilio [8]"
      Químicos_Peligrosos
        "Retardantes de fuego bromados [8]"
        "Plástico PVC [8]"
      "Pilas: Derraman metales pesados en acuíferos [4]"
    Destino_Final_y_Contaminación
      Disposición_Insegura
        "Rellenos sanitarios [2, 6]"
        "Basurales a cielo abierto [6]"
        "Incineración [6]"
      Impacto_en_Argentina
        "Contaminación de napas freáticas (Plomo, Bromo) [2]"
        "Filtración de químicos tóxicos al suelo y atmósfera [8]"
      El_Pueblo_Veneno_(Guiyu,_China)
        "Recibe el 80% de la basura electrónica mundial [16]"
        Prácticas_Tóxicas
          "Quema de plásticos para clasificación [18]"
          "Extracción de oro con ácido [18]"
          "Ácidos vertidos en arroyos [18]"
        "Riesgos para la salud: Daños pulmonares, cáncer, problemas neurológicos [18]"
        "Condiciones de trabajo esclavo [21]"
    Soluciones_y_Regulación
      Jerarquía_de_Gestión
        "Reutilización: Extender vida útil [9]"
        "Reciclaje: Recuperar metales valiosos [9]"
        "Valor: Evita la extracción primaria de recursos [7]"
      Responsabilidad_Extendida_del_Productor_(REP)
        "Definición: El productor se hace cargo de los impactos ambientales del ciclo de vida [10, 11]"
        "Incentiva a reducir sustancias tóxicas [11]"
        "Mejores resultados con la REP Individual [12]"
      Acciones_y_Propuestas_en_Argentina
        "Proyecto de ley (desde 2008): Presupuestos mínimos para RAEE [13]"
        "Gobierno CABA: Solo recolecta el 1% [3]"
        "Plan Piloto de Pilas: Productores responsables de la gestión [5]"

```

1. ONU – Global E-waste Monitor (2020). United Nations University.
1. Greenpeace Argentina (2018). Informe sobre residuos electrónicos en el país.
1. Ministerio de Ambiente y Desarrollo Sustentable (Argentina, 2021).
1. INTI – Gestión de pilas y baterías usadas (2019).
1. Plan Piloto de Gestión de Pilas – Gobierno de CABA (2022).
1. Basel Convention – E-waste and hazardous materials guidelines (2019).
1. European Environmental Agency (EEA, 2020). Circular economy and resource efficiency.
1. EPA – Environmental Protection Agency (EE.UU.) (2020). Toxic Substances in Electronics.
1. ONU Medio Ambiente (2019). Jerarquía de gestión de residuos y sostenibilidad.
1. OCDE (2016). Extended Producer Responsibility – Guidance Manual.
1. European Commission (2018). Directive on Waste Electrical and Electronic Equipment (WEEE).
1. OECD Report (2020). Individual vs Collective Producer Responsibility Models.
1. Proyecto de Ley RAEE – Senado de la Nación Argentina (2008–2023).
1. China Daily (2018). Guiyu: The world’s electronic waste capital.
1. The Guardian (2019). Inside Guiyu: Toxic recycling town of the world.
1. Human Rights Watch (2020). E-waste workers and environmental health hazards.

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
