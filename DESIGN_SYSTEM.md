# ProFE — Sistema de diseño

Concepto: **la pizarra táctica del entrenador**. ProFE es una herramienta de trabajo para
profesores de Educación Física, no una app de fitness para el usuario final. El diseño debe
transmitir organización y profesionalidad, con un único acento de energía reservado para la
acción principal.

---

## 1. Paleta de colores

### Principal

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-ink` | `#16233A` | Texto principal, header, navbar, footer |
| `--color-chalk` | `#F6F5F1` | Fondo general de la app |
| `--color-surface` | `#FFFFFF` | Fondo de tarjetas, modales, inputs |

### Secundaria / acentos

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-action` | `#FF7A3C` | Botones primarios, enlaces activos, CTA. Un solo acento — no mezclar con otros colores vivos en el mismo componente |
| `--color-turf` | `#2F9E6E` | Estados de éxito, badges positivos, acentos secundarios |
| `--color-alert` | `#D93B3B` | Errores, validaciones fallidas |
| `--color-warning` | `#E0A100` | Avisos, estados intermedios |

### Neutros

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-gray-900` | `#1A1D23` | Texto sobre fondo claro |
| `--color-gray-600` | `#6B7280` | Texto secundario, placeholders |
| `--color-gray-300` | `#D1D5DB` | Bordes, separadores |
| `--color-gray-100` | `#F1F1EF` | Fondos alternos, hover suave |

**Regla de uso**: el naranja (`--color-action`) se reserva para *una* acción por vista. Si hay
varios botones, solo el principal lleva ese color; el resto usa estilo `outline` o `ghost` (ver
sección 3).

---

## 2. Tipografía

| Rol | Familia | Pesos |
|---|---|---|
| Titulares (h1–h3) | **Space Grotesk** | 500, 700 |
| Cuerpo / UI / formularios | **Inter** | 400, 500, 600 |

Importar desde Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Escala tipográfica (base 16px, ratio ~1.25)

| Token | Tamaño | Uso |
|---|---|---|
| `--font-size-h1` | 2.44rem (39px) | Título de página |
| `--font-size-h2` | 1.95rem (31px) | Sección principal |
| `--font-size-h3` | 1.56rem (25px) | Subsección, título de tarjeta |
| `--font-size-body` | 1rem (16px) | Texto general, inputs |
| `--font-size-small` | 0.875rem (14px) | Texto secundario, ayuda de formulario |
| `--font-size-caption` | 0.75rem (12px) | Etiquetas, metadatos |

Line-height: 1.2 para titulares, 1.5 para cuerpo de texto.

---

## 3. Guía de componentes

### Botones

| Variante | Estilo | Uso |
|---|---|---|
| Primario | Fondo `--color-action`, texto blanco, `border-radius: 8px` | Una por vista: la acción principal |
| Secundario | Borde 1px `--color-ink`, fondo transparente, texto `--color-ink` | Acciones alternativas |
| Ghost | Sin borde, texto `--color-ink`, subrayado en hover | Acciones terciarias, cancelar |
| Peligro | Fondo `--color-alert`, texto blanco | Eliminar, acciones destructivas |

Estados: `hover` oscurece un 10%, `disabled` reduce opacidad a 0.5, `focus-visible` añade un
anillo de 2px en `--color-action` con offset.

### Formularios

- Label siempre encima del input (nunca placeholder como único label).
- Input: borde 1px `--color-gray-300`, `border-radius: 6px`, padding `12px 16px`.
- Focus: borde `--color-action` + sombra suave del mismo color.
- Error: borde `--color-alert` + mensaje de ayuda en `--font-size-small` debajo del campo.
- Nunca ocultar los criterios de un campo (ej. requisitos de contraseña) hasta el error; mostrarlos desde el principio.

### Tarjetas (unidades didácticas / sesiones)

- Fondo `--color-surface`, borde 1px `--color-gray-300`, `border-radius: 8px`.
- Borde izquierdo de 4px con el color de categoría (ej. `--color-turf` para una unidad activa,
  `--color-gray-600` para archivada). Este borde es el elemento distintivo de ProFE: evita el
  "kit de tarjetas idénticas" — cada tarjeta comunica su estado de un vistazo.
- Sombra solo en `hover`, nunca en reposo: `box-shadow: 0 4px 12px rgba(22,35,58,0.08)`.

---

## 4. Espaciado y tamaños

Escala base de 4px:

| Token | Valor |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

`border-radius` global: 6px en inputs, 8px en botones y tarjetas, 999px en badges/pills.

---

## 5. Responsive

Mobile-first. Breakpoints:

| Nombre | Ancho mínimo |
|---|---|
| `sm` | 480px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

- Navbar: por debajo de `md`, colapsa a menú hamburguesa.
- Tarjetas: 1 columna en móvil, 2 en `md`, 3 en `lg`.
- Formularios (Login/Register): ancho completo en móvil, máximo `400px` centrado desde `md`.
- Line-length del cuerpo de texto: máximo ~75 caracteres en cualquier resolución.

---

## 6. Páginas base

### Home
Hero simple: titular corto (Space Grotesk, `--font-size-h1`) + descripción breve + CTA único
("Empezar" o "Iniciar sesión") en `--color-action`. Sin carrusel ni secciones decorativas
innecesarias — es la puerta de entrada, no una landing de marketing.

### Login
Formulario centrado, ancho máximo 400px, fondo `--color-surface` sobre `--color-chalk`. Campos:
email, contraseña. Botón primario a ancho completo. Enlace ghost a "Registrarse" debajo.

### Register
Misma estructura que Login, con los campos adicionales de registro. Mantener la misma anchura y
alineación que Login para que la transición entre ambas páginas se sienta continua.

---

## 7. Variables CSS listas para usar

```css
:root {
  /* Color */
  --color-ink: #16233A;
  --color-chalk: #F6F5F1;
  --color-surface: #FFFFFF;
  --color-action: #FF7A3C;
  --color-turf: #2F9E6E;
  --color-alert: #D93B3B;
  --color-warning: #E0A100;
  --color-gray-900: #1A1D23;
  --color-gray-600: #6B7280;
  --color-gray-300: #D1D5DB;
  --color-gray-100: #F1F1EF;

  /* Tipografía */
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-size-h1: 2.44rem;
  --font-size-h2: 1.95rem;
  --font-size-h3: 1.56rem;
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-caption: 0.75rem;

  /* Espaciado */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radios */
  --radius-input: 6px;
  --radius-card: 8px;
  --radius-pill: 999px;
}
```

---

## 8. Consistencia y validación

- Un solo acento vivo (`--color-action`) por vista; el resto de color viene de `--color-ink` y
  grises.
- Ningún componente nuevo se implementa sin pasar primero por esta guía: si hace falta un color,
  tamaño o espaciado que no está aquí, se añade aquí antes de usarse en código.
- Antes de construir el frontend completo, validar esta guía con un mockup de Home, Login y
  Register (ver US-011, último criterio de aceptación).
