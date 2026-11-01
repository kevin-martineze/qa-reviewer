# ADR 0004 — Capturas fuera del API, con URLs firmadas

Estado: Aceptada

## Contexto

Una ronda puede traer 40 capturas de hasta 5 MB. Pasarlas por el API lo vuelve lento y caro, y guardarlas en Mongo infla la base.

## Decisión

- Las capturas viven en un almacenamiento de objetos privado. La skill sube cada imagen con una URL `PUT` firmada (15 min, tipo y tamaño fijos) y la web las lee con URLs `GET` firmadas (15 min).
- El API solo firma y verifica (`HEAD`) antes de publicar.
- Dos drivers detrás de un mismo puerto: `s3` (AWS S3 o compatible: MinIO, R2) y `local` (disco, firmado con HMAC y servido por el API), para desarrollo sin servicios externos.

## Consecuencias

- Si una URL vence con el visor abierto, la web recarga la revisión para pedir URLs nuevas.
- Las capturas de revisiones cerradas se borran a los 90 días (configurable).
