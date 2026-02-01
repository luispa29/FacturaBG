# FacturaBG - Sistema de Facturación Frontend

Este es el proyecto de frontend para el sistema de facturación BG, desarrollado con Angular 20.

## Tecnologías Utilizadas

- Angular 20.2.1
- PrimeNG 20.4.0 (Componentes de UI)
- TailwindCSS 3.4.19 (Estilos)
- PrimeIcons
- RxJS

## Prerrequisitos

- Node.js (se recomienda versión LTS)
- npm (administrador de paquetes de Node)
- Angular CLI (`npm install -g @angular/cli`)

## Instalación

1. Navegue a la carpeta del proyecto `FacturaBG`.
2. Instale las dependencias necesarias:

```bash
npm install
```

## Configuración

La configuración del entorno se encuentra en `src/environments/`. Asegúrese de que la propiedad `apiUrl` apunte a la dirección correcta de su API backend:

- Desarrollo: `src/environments/environment.ts`
- Producción: `src/environments/environment.prod.ts`

## Ejecución del Proyecto

Para iniciar un servidor de desarrollo local, ejecute:

```bash
npm start
```

Una vez que el servidor esté funcionando, abra su navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifique los archivos de origen.

## Construcción para Producción

Para compilar el proyecto para un entorno de producción, ejecute:

```bash
npm run build
```

Los archivos de salida se almacenarán en el directorio `dist/`. Por defecto, la compilación de producción optimiza la aplicación para el rendimiento.
