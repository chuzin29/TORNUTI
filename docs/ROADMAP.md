# Roadmap

El roadmap se ordena por impacto para quien organiza y juega. No hay fechas comprometidas ni métricas inventadas.

## Ahora

- [x] Monorepo con web y API separadas.
- [x] Portada, explorador, ficha, ranking, equipos, panel, autenticación y páginas legales.
- [x] Modo de demostración local sin infraestructura.
- [x] API con JWT, equipos, torneos, inscripciones, cuadro y resultados.
- [x] Cuadro de eliminación directa con siembra y byes repartidos.
- [x] Ledger de Aura y leaderboard.
- [x] Migración inicial, seed reproducible y documentación.
- [x] CI con typecheck, lint, pruebas y build.
- [x] Despliegue gratuito documentado.

## Siguiente

### Integración completa de datos

- [ ] Listados y fichas alimentados por la API cuando `NEXT_PUBLIC_API_URL` esté configurada.
- [ ] Inscripciones, creación de torneos y equipos contra la API.
- [ ] Manejo de sesión expirada y refresco de token.
- [ ] Estados de carga, error y reintento consistentes en todas las vistas.
- [ ] Pruebas de integración web contra una API de prueba.

Criterio de aceptación: con la API levantada, crear una cuenta, inscribirse, generar un cuadro y reportar un resultado se puede hacer desde la web sin usar Swagger.

### Panel del organizador

- [ ] Editar ficha, reglas, cupos y fechas desde la web.
- [ ] Aprobar, rechazar y retirar inscripciones.
- [ ] Programar partidos y cambiar sede u hora.
- [ ] Reportar resultados con confirmación y deshacer.
- [ ] Ver el estado de cada ronda y el avance del cuadro.
- [ ] Exportar acta y lista de inscritos en CSV.

### Formatos

- [ ] Generación de grupos y clasificación a playoff.
- [ ] Liga regular con tabla de posiciones.
- [ ] Sistema suizo con emparejamiento por puntaje.
- [ ] Doble eliminación con llave de perdedores.
- [ ] Desempates configurables: diferencia, enfrentamiento directo, sets.

### Cuentas y comunicación

- [ ] Recuperación de contraseña por correo.
- [ ] Verificación de correo.
- [ ] Notificaciones de cambios, cupos y resultados.
- [ ] Preferencias de privacidad del perfil.
- [ ] Eliminación de cuenta y exportación de datos.
- [ ] Roles de organización por torneo, no solo por cuenta.

## Después

### Competencia

- [ ] Marcador en vivo con actualización por sondeo o WebSocket.
- [ ] Múltiples canchas y horarios solapados.
- [ ] Árbitros y mesas de anotación con permisos limitados.
- [ ] Historial de cambios del acta.
- [ ] Estadísticas por jugador y por disciplina.
- [ ] Récords y logros de temporada.

### Comunidad

- [ ] Perfiles públicos de equipo con calendario e historial.
- [ ] Moderación de reportes y sanciones.
- [ ] Comentarios o avisos de la organización.
- [ ] Galería de portadas y escudos.
- [ ] Directorio de organizadores.

### Producto

- [ ] Instalación como PWA y consulta sin conexión.
- [ ] Accesibilidad auditada con usuarios reales.
- [ ] Internacionalización español e inglés.
- [ ] Aplicación móvil o web app con notificaciones.
- [ ] API pública con tokens de solo lectura para medios y comunidades.
- [ ] Integración con calendarios externos.

## Fuera de alcance por ahora

- Pagos, apuestas, apuestas deportivas o premios en dinero.
- Compra, venta o transferencia de Aura.
- Publicidad invasiva o venta de datos.
- Dependencias obligatorias de servicios de pago.
- Fotos de personas o testimonios inventados.

## Deuda técnica conocida

- El frontend mantiene una capa de demostración local que debe convivir con la API durante la migración.
- La generación de grupos, liga y suizo todavía no está implementada en el backend.
- La cobertura de pruebas es de reglas y utilidades; faltan pruebas end-to-end de navegador.
- Las notificaciones por correo requieren un proveedor gratuito con límites y configuración adicional.

## Cómo proponer un cambio

Abre un issue con el problema, el resultado esperado y el contexto. Para cambios grandes, describe primero el enfoque y el impacto en el modelo de datos. Consulta [CONTRIBUTING.md](../CONTRIBUTING.md).
