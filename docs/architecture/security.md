# Seguridad y privacidad

Las capturas salen de aplicaciones reales (Lideris maneja datos clínicos). El mayor riesgo de la plataforma es **acumular datos sensibles en imágenes**.

## Datos en las capturas

1. **Solo datos de prueba.** La skill captura sobre datos creados para QA (fixtures del proyecto). El manifiesto declara `privacy.dataset`.
2. **Enmascarado antes de subir.** Cada proyecto define en su configuración de la skill los `maskSelectors` (nombres de paciente, documentos, teléfonos, correos…). La skill los tapa en el DOM antes de capturar, y la imagen nunca sale sin enmascarar.
3. **Declaración obligatoria.** El API rechaza manifiestos sin `privacy.masked = true` (`manifest.privacy_required`).
4. **Retención.** Las capturas de revisiones `closed` se borran a los 90 días (configurable). Los comentarios y veredictos se conservan.

## Almacenamiento

- Bucket privado, sin acceso público y cifrado en reposo.
- Solo URLs firmadas: subida (PUT, 15 min, tipo y tamaño fijos) y lectura (GET, 15 min).
- Tipos permitidos: `image/png` y `image/webp`. Tamaño máximo por imagen: 5 MB. El API verifica tipo y tamaño con `HEAD` antes de publicar.

## Autenticación y tokens

- **Tokens de la skill**: personales, por proyecto y revocables. Se guarda solo el hash SHA-256, el valor se muestra una vez y se registra `lastUsedAt`. En la máquina del dev viven en una variable de entorno (`QA_REVIEWER_TOKEN`), **nunca dentro de la skill ni del repo**.
- **Sesión de la plataforma**: access token corto (15 min) y refresh token (7 días) en cookies `httpOnly`, `Secure` y `SameSite=Lax`, manejadas solo por el server de SvelteKit.
- **Webhook de GitHub**: se verifica `X-Hub-Signature-256`.
- **Autorización**: por rol de proyecto en cada endpoint. Un reviewer de un proyecto no ve revisiones de otro.

## Repos públicos

Este repo es público:

- Los fixtures del adaptador `mock` usan capturas sin datos de personas (p. ej. LIDER-628, del módulo de compras).
- `.env*` va en `.gitignore`. Solo se versiona `.env.example`.
- Nada de URLs internas, tokens, nombres de buckets reales ni capturas de QA con pacientes.

## Abuso

- Rate limit por token: 30 revisiones por hora y 500 subidas por hora.
- Límites por ronda: 40 pantallas.
- Auditoría: creación, publicación, veredictos, envíos y revocaciones quedan con actor y fecha.
