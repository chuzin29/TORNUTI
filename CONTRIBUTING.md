# Contribuir

Gracias por querer mejorar Tornuti. El proyecto es abierto, se sostiene con trabajo voluntario y prioriza claridad sobre prisa.

## Antes de empezar

- Revisa los issues abiertos y el [roadmap](docs/ROADMAP.md).
- Para cambios grandes, abre un issue con el problema, la propuesta y el impacto en el modelo de datos.
- No abras issues públicos con vulnerabilidades. Sigue [SECURITY.md](SECURITY.md).
- No incluyas secretos, cadenas de conexión reales, tokens ni datos personales.

## Entorno

Requisitos: Node.js 20 o superior, npm 10 o superior y PostgreSQL 14 o superior. Docker es opcional.

```bash
git clone https://github.com/chuzin29/TORNUTI.git
cd TORNUTI
npm install
cp apps/api/.env.example apps/api/.env
docker compose up -d db
npm run db:deploy
npm run db:seed
npm run dev
```

## Flujo de trabajo

1. Crea una rama desde `main` con un nombre descriptivo: `feat/panel-organizador`, `fix/cupos-cerrados`, `docs/despliegue`.
2. Haz cambios pequeños y enfocados.
3. Ejecuta las verificaciones.
4. Escribe un commit claro en imperativo.
5. Abre un pull request con el problema, la solución, las pruebas y las capturas si hay cambios visuales.

## Verificaciones obligatorias

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Si cambias el esquema de Prisma:

```bash
npm run db:generate
npm run db:deploy
npm run db:seed
```

No edites una migración ya aplicada. Crea una nueva con `npx prisma migrate dev --name describe_el_cambio` en desarrollo y revisa el SQL antes de commitearlo.

## Estilo

- TypeScript estricto. Evita `any`; si es inevitable, justifica el caso.
- Componentes y funciones con nombres descriptivos.
- Español para copy de producto, documentación y mensajes al usuario.
- Código y variables en inglés cuando sea una convención técnica.
- Sin emojis en interfaz, documentación, código ni logs.
- Iconos en SVG. No agregues fuentes de iconos ni imágenes raster decorativas.
- Respeta los tokens de diseño de `apps/web/app/globals.css`.
- Mantén los formularios con label, ayuda y error accesibles.
- No agregues dependencias si una función pequeña resuelve el problema.

## Pruebas

- Toda regla nueva de negocio debe tener prueba.
- Los cambios de cuadro, siembra o avance de resultados deben actualizar o ampliar las pruebas existentes.
- Los cambios visuales deben revisarse en escritorio y móvil.
- Si cambias el contrato de la API, actualiza [docs/API.md](docs/API.md) y Swagger.

## Commits

Formato sugerido:

```text
feat: agrega aprobación de inscripciones
fix: corrige el avance de la segunda ronda
docs: documenta el despliegue en Render
test: cubre el reparto de byes
chore: actualiza dependencias de desarrollo
```

Un commit debe explicar el porqué, no solo el qué.

## Pull requests

Incluye:

- Resumen del cambio.
- Problema que resuelve.
- Cómo probarlo.
- Capturas o grabación si cambia la interfaz.
- Riesgos o migraciones necesarias.
- Confirmación de que las verificaciones pasan.

El mantenedor puede pedir cambios de alcance, pruebas o documentación. Se prefiere un buen cambio pequeño a uno enorme y difícil de revisar.

## Contenido de demostración

No agregues testimonios, clientes, cifras de usuarios ni logos de terceros que no existan. Si agregas datos de ejemplo, márcalos como demostración y usa nombres plausibles sin suplantar personas reales.

## Licencia

Al contribuir aceptas que tu aporte se publique bajo la licencia MIT del proyecto.
