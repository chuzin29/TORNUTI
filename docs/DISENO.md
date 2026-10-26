# Diseño

## Dirección visual

Tornuti se parece al programa de mano de una jornada deportiva y al cuaderno de la mesa de anotación. Papel cálido, tinta oscura, azul cobalto y un acento lima ácido. Las reglas finas separan información como en un impreso; los números usan cifras tabulares para que una columna de marcadores nunca baile.

La interfaz evita el aspecto de panel corporativo genérico. No hay degradados decorativos, glassmorphism ni tarjetas flotantes sin motivo. La jerarquía se construye con escala tipográfica, espacio y líneas.

## Principios

1. **La cuenta primero.** Fechas, cupos, marcadores y Aura se leen de un vistazo.
2. **Una sola idea por bloque.** Cada sección responde una pregunta: qué es, cuándo, dónde, quién juega, cómo va.
3. **Textura sin ruido.** La retícula y las portadas geométricas aportan carácter sin competir con el contenido.
4. **Autoría visible.** Los iconos, portadas y el gráfico de marca son SVG propios, no capturas ni arte de terceros.
5. **Sin emojis.** Los iconos son SVG y el texto usa palabras. Esto aplica a interfaz, documentos, código y mensajes de registro.
6. **El estado se muestra con palabras y color, no solo con color.** Cada badge tiene etiqueta textual.

## Tipografía

- **Archivo Variable** para titulares, cuerpo y datos.
- Titulares con peso 800 y tracking negativo.
- Etiquetas pequeñas en mayúsculas, peso 700 y tracking amplio.
- Cifras tabulares en marcadores, cupos, fechas y Aura.
- El texto de cuerpo se limita a unas 65 letras por línea.

## Paleta

Los tokens viven en `apps/web/app/globals.css` y se consumen desde Tailwind.

| Token | Papel |
| --- | --- |
| `background` | Papel cálido de fondo. |
| `surface` | Superficie de tarjetas y fichas. |
| `elevated` | Bloques secundarios y cabeceras de tabla. |
| `foreground` | Tinta principal. |
| `muted-foreground` | Texto secundario con contraste suficiente. |
| `line` | Reglas finas y bordes. |
| `primary` | Cobalto para acciones y enlaces. |
| `accent` | Lima ácido para el momento de campeón y llamadas puntuales. |
| `aura` | Ámbar para Aura y recompensas. |
| `success` | Verde para confirmaciones y torneos en juego. |
| `danger` | Rojo para errores y cupo completo. |

El modo oscuro invierte la lógica de papel y tinta, mantiene el cobalto como acento y sube la luminosidad del lima y el ámbar para conservar contraste.

## Retícula y espaciado

- Contenedor `shell` con ancho máximo y padding lateral consistente.
- Retícula de 12 columnas en escritorio, una columna en móvil.
- Espaciado en múltiplos de 4.

## Sistema de botones

Todos los botones comparten una píldora con **bisel**: brillo superior, borde
interno y caída inferior, definidos en tokens (`--btn-rim`, `--btn-low`)
que invierten la lógica en modo oscuro. Al pasar el cursor el botón se
elevará 2 px con una curva suave; al presionar se comprime. Esto aplica a
`Button` (variantes primario, secundario, contorno, ghost, danger y aura)
y al botón insignia `StretchyButton`.

### Botón Stretch

El botón insignia suelta una **masa homogénea de pintura** dentro de su
radio de alcance (invisible, sin margen dibujado): la masa nace del borde
de la píldora, exactamente del lado del puntero, y corre hasta la mano con
onda viajera y culebreo lento; la cabeza engorda y se estira con la
velocidad. Es una sola silueta rellena curva —nunca hilos ni líneas
rectas—. El botón se inclina suavemente hacia la masa y, al moverse
rápido, solo lleva una estela de difuminación ligera (tope 0.65 px).
Al presionar se comprime, la masa se contiene y el guante cierra el puño.

La superficie trae relieve 3D: cúpula de gel con brillo lateral y luz de
subsurface abajo (`--sb-sheen`, `--sb-dome`), hundido interior al presionar.

- Archivo: `apps/web/components/StretchyButton.tsx`
- Variantes: `ink` (tinta sobre papel), `accent` (lima), `aura` (ámbar) y `outline`.
- Acepta `href` (renderiza un `Link`) o `onClick` (renderiza un `button`).
- Con `disabled` o `isLoading` no suelta masa.
- Con `prefers-reduced-motion` no hay masa ni inclinación; solo estados CSS.
- El guante reacciona a su atributo `data-grip` a través de `lib/grip-bus.ts`.

```tsx
<StretchyButton href="/crear" label="Publica tu torneo gratis" size="lg" radius={160} variant="ink" />
```

## Cursor personalizado

El cursor del ratón se reemplaza por un **guante de caricatura** (estilo
Mickey: relleno blanco, contorno grueso y caída) con tres poses: señalar
(por defecto), abierto (cuando algún botón Stretch lo atrae con su masa)
y puño (mientras se presiona). Los campos de texto
(`input`, `textarea`, `select`) conservan el cursor nativo y ahí el guante
se oculta. Está oculto en dispositivos táctiles.

- Archivo: `apps/web/components/CustomCursor.tsx`
- Montado globalmente en `apps/web/components/providers/providers.tsx`
- Los colores siguen los tokens `--glove-fill`, `--glove-ink` y `--glove-shade`
  para adaptarse al modo claro y oscuro.
- Con `prefers-reduced-motion` no tiembla ni gira con la inercia.

## Marquee de disciplinas

La portada incluye una cinta continua con las disciplinas de la agenda,
que recorre el ancho de la página en bucle para dar la sensación de
vitrina deportiva.

- Sección `Marquee` en `apps/web/app/page.tsx`
- Animación con la utilidad `animate-marquee` solo bajo `motion-safe`
- El segundo listado del marquee es `aria-hidden` para lectores de pantalla

## Material de tarjetas y movimiento con scroll

Las cajas de la interfaz usan el material `.glass-card`: fondo de vidrio
(`backdrop-blur` con saturación), cúpula de brillo arriba, hilo de 1 px,
dos capas de profundidad y hover que eleva 4 px con curva
`--ease-apple`. Aplica a tarjetas de torneo, pasos, categorías, el top de
Aura y la fila de métricas de portada.

El movimiento ligado al scroll vive en `apps/web/components/motion.tsx`:

- `Reveal`: entra al detalle cuando la pieza cruza el camarín; un solo
  `IntersectionObserver` compartido para todo el árbol, con retardo por
  escalones (`--reveal-d`). Una vez terminada la entrada, el atributo se
  retira para que hover y foco recuperen su propia transición.
- `Parallax`: profundidad con `translate3d` en un rAF coalescido con
  listeners pasivos; no relee layout cada frame.
- `ScrollProgress`: hilo de lectura fijo en el borde superior.

Sin JavaScript el estado oculto no existe (la página se lee completa:
`html.js`), y con `prefers-reduced-motion` no hay reveals ni parallax.

## Accesibilidad

- Todos los componentes interactivos soportan `prefers-reduced-motion`
- Los botones respetan `Enter` y `Espacio` para activar
- El guante no interfiere con la navegación por teclado
- Los estados `disabled` no generan animaciones

## Componentes

- Bordes de 1 px; radios pequeños para mantener la sensación de impreso.
- Las fichas usan una columna principal y una lateral pegajosa en escritorio.
- Las tablas y cuadros permiten desplazamiento horizontal en pantallas angostas.

### Marca

El símbolo combina dos corchetes y un rombo central. Funciona como marcador de posición y como ficha de cuadro. La versión de texto usa mayúsculas y tracking amplio.

### Portadas

`TournamentCover` genera una composición SVG distinta según el patrón (`court`, `grid`, `arc`, `score`, `flag`, `bracket`) y la categoría. No usa fotos. Esto evita dependencias externas, peso innecesario y problemas de licencia.

### Badges de estado

- Inscripción abierta: cobalto suave.
- Últimos cupos: ámbar.
- En juego: verde con punto.
- Finalizado: contorno neutro.
- Programado: superficie elevada.

Los partidos usan sus propios estados: Programado, En juego, Finalizado. No reutilizan el estado del torneo.

### Aura

El Aura se presenta como ámbar, con el símbolo de la marca y cifras tabulares. No se muestra como moneda ni como saldo bancario. La copy insiste en que es reputación y que no se compra.

### Cuadro

El cuadro proyectado se ordena por siembra estándar y reparte los byes. Si hay partidos reales, la pestaña muestra resultados, ganador resaltado y fecha. Para liga o suizo se explica el formato en lugar de dibujar un cuadro de eliminación engañoso.

## Movimiento

- Transiciones de 150 a 250 ms.
- Las tarjetas se elevan 2 px al pasar el cursor.
- Los tabs cambian con borde inferior, sin deslizamientos largos.
- Los toasts entran y salen con opacidad y desplazamiento corto.
- Se respeta `prefers-reduced-motion`.

## Accesibilidad

- Enlace para saltar al contenido.
- Foco visible con anillo de cobalto.
- Contraste mínimo AA en texto y controles.
- Formularios con `label`, `hint`, `error` y `aria-describedby`.
- Tabs con `role`, `aria-selected` y `aria-controls`.
- Iconos decorativos con `aria-hidden`; los controles tienen nombre accesible.
- Navegación completa con teclado.
- El color nunca es el único indicador de estado.

## Responsive

- La cabecera colapsa a un menú con las mismas acciones.
- La ficha pasa de dos columnas a una.
- Las tarjetas de torneo conservan la portada y la información esencial.
- Los tabs se desplazan horizontalmente sin romper el layout.
- Las tablas de partidos se apilan con el marcador centrado.

## Voz y contenido

- Español claro, directo y con textura local.
- Sin promesas de dinero, inversionistas ni métricas inventadas.
- El contenido de demostración se etiqueta como demostración.
- Las fechas se muestran en `America/El_Salvador`.
- No se usan testimonios falsos, logos de clientes ficticios ni cifras de usuarios que no existen.

## Anti-patrones evitados

- Emojis como iconos.
- Gradientes morados de plantilla.
- Tarjetas idénticas en cuadrícula infinita sin jerarquía.
- Texto gris claro sobre fondo claro.
- Botones sin estado de foco.
- Cuadros que muestran un campeón antes de la final.
- Contadores de cupos abiertos en torneos ya comenzados o finalizados.
- Animaciones largas o decorativas.
