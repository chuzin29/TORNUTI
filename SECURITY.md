# Seguridad

## Versiones soportadas

La rama `main` recibe correcciones de seguridad. No se mantienen versiones antiguas en paralelo.

| Versión | Soporte |
| --- | --- |
| `main` | Sí |
| Versiones anteriores | No |

## Cómo reportar una vulnerabilidad

No abras un issue público. Usa el reporte privado de vulnerabilidades de GitHub:

1. Entra al repositorio en GitHub.
2. Abre **Security**.
3. Elige **Report a vulnerability**.
4. Describe el problema con pasos reproducibles, impacto y versión afectada.

Si el reporte privado no está disponible, contacta al mantenedor desde el perfil de GitHub del repositorio. No publiques detalles explotables.

Incluye, si es posible:

- Tipo de vulnerabilidad.
- Componente y ruta afectada.
- Pasos para reproducir.
- Prueba de concepto mínima.
- Impacto esperado.
- Mitigación sugerida.

## Qué esperar

- Confirmación de recepción en un plazo razonable.
- Evaluación del impacto y la severidad.
- Corrección coordinada antes de la divulgación pública.
- Crédito en el aviso si la persona lo desea.

No se ofrece recompensa económica. El proyecto es voluntario y gratuito.

## Alcance

Están en alcance:

- Autenticación, autorización y manejo de sesión.
- Exposición de datos personales.
- Inyección, validación y manejo de errores.
- Reglas de cupos, inscripciones, resultados y Aura.
- Configuración de CORS, cabeceras y rate limiting.
- Dependencias con vulnerabilidades explotables en producción.

Fuera de alcance:

- Ataques de denegación de servicio volumétricos.
- Ingeniería social.
- Vulnerabilidades en servicios de terceros sin impacto directo en Tornuti.
- Reportes generados solo por herramientas automáticas sin prueba de impacto.
- Falta de cabeceras en entornos de desarrollo local.

## Prácticas del proyecto

- Contraseñas con bcrypt y costo 12.
- JWT con secreto obligatorio en producción.
- Guards globales de autenticación y roles.
- Comprobación de propiedad en cada operación sensible.
- Validación estricta de DTOs.
- Rate limiting global y específico en autenticación.
- Helmet, CORS configurable y límite de payload.
- Migraciones versionadas.
- Sin secretos en el repositorio.
- Dependencias revisadas antes de desplegar.

## Si sospechas que una cuenta fue comprometida

Cambia la contraseña, revoca los tokens emitidos rotando `JWT_SECRET` y revisa los movimientos de Aura y las inscripciones recientes. Si hay datos de otras personas afectados, informa de inmediato por el canal privado.
