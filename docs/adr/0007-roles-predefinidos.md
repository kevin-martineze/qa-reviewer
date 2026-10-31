# ADR 0007 — Roles predefinidos (no editables en v1)

Estado: Aceptada

## Contexto

Los permisos se cruzan con reglas que no caben en una matriz (el autor no da veredicto a su revisión). Roles editables por cada organización multiplican los casos a probar.

## Decisión

- Permisos como claves fijas en código (`reviews:read`, `verdicts:set`…).
- Roles fijos: de organización (`owner`, `admin`, `member`) y de proyecto (`project_admin`, `design_lead`, `designer`, `developer`, `viewer`). `owner` y `admin` cuentan como `project_admin` en todos los proyectos.
- La matriz vive igual en el front (experiencia) y en el API (seguridad); el API siempre vuelve a validar.

## Consecuencias

- Un rol nuevo es un cambio de código en los dos repos.
- La pantalla de roles solo muestra la matriz.
