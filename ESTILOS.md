# ESTILOS.md — Clases estandarizadas del proyecto OficiAR

Este documento define las combinaciones de clases de Tailwind (NativeWind) que se usan en el proyecto. Seguir estas convenciones para mantener consistencia visual.

---

## Paleta de colores (tailwind.config.js)

| Token | Hex | Uso |
|---|---|---|
| `oficiar-very-dark` | `#051A26` | Fondo header, textos principales |
| `oficiar-dark` | `#0B3954` | Barra de tabs, avatares |
| `oficiar-blue` | `#3D80B7` | Tab activo, texto destacado |
| `oficiar-blue-btn` | `#0077B5` | Botones de accion primarios |
| `oficiar-yellow` | `#FFC107` | Boton "Hazte Officer" |
| `oficiar-gray` | `#EDEDED` | Fondo general de pantallas |

---

## Fondos de pantalla

| Contexto | Clases |
|---|---|
| Pantalla general | `flex-1 bg-oficiar-gray` |
| Formulario (login, registro) | `flex-1 bg-neutral-50` |
| Header principal | `items-center gap-1 bg-oficiar-very-dark px-6 pb-2 pt-12` |
| Barra de tabs | `flex-row bg-oficiar-dark` |
| Seccion de formulario (crear/buscar) | `gap-2 border-b border-neutral-200 bg-white px-4 py-3` |

---

## Botones (componente Button)

| Variante | Fondo | Texto |
|---|---|---|
| `primary` | `bg-oficiar-blue-btn` | `text-white` |
| `secondary` | `border border-neutral-300` | `text-neutral-700` |
| `yellow` | `bg-oficiar-yellow` | `text-oficiar-very-dark` |
| `danger` | `bg-red-50` | `text-red-600` |

Base del boton: `items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50`

---

## Campos de texto (componente Field)

| Estado | Clases del TextInput |
|---|---|
| Normal | `rounded-lg border border-neutral-300 p-3` |
| Con error | `rounded-lg border border-red-600 p-3` |
| Label | `font-semibold` |
| Mensaje de error | `text-xs text-red-600` |

---

## TextInput inline (crear/buscar en tabs)

```
rounded-lg border border-neutral-300 px-3 py-2
```

Boton al lado del input:
```
items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50
```

Texto del boton: `font-semibold text-white`

---

## Badge (componente Badge)

| Variante | Fondo | Texto |
|---|---|---|
| `red` | `bg-red-100` | `text-red-700` |
| `green` | `bg-green-100` | `text-green-700` |
| `blue` | `bg-blue-100` | `text-blue-700` |
| `neutral` | `bg-neutral-100` | `text-neutral-700` |

Base del badge: `rounded-full px-2.5 py-1`

Tamanos de texto: `sm` → `text-[10px]`, `md` → `text-xs`

---

## ChipSelect (componente ChipSelect)

| Estado | Clases |
|---|---|
| Chip activo | `rounded-full px-4 py-2 bg-blue-600` + `text-sm font-semibold text-white` |
| Chip inactivo | `rounded-full px-4 py-2 border border-neutral-300 bg-white` + `text-sm text-neutral-700` |

---

## Logo (componente Logo)

| Tamano | Clase |
|---|---|
| `sm` | `text-2xl` |
| `md` | `text-4xl` |
| `lg` | `text-5xl` |

Texto "Ofici": `font-black` + `text-white` (light) o `text-oficiar-very-dark` (dark)

Texto "AR": `font-black text-oficiar-blue`

---

## Tarjetas de lista (FlatList items)

```
rounded-xl bg-white px-4 py-3
```

Contenedor de la lista: `px-4 py-3 gap-2`

Texto vacio: `py-8 text-center text-neutral-400`

---

## Avatar circular (TabUsuarios)

```
h-10 w-10 items-center justify-center rounded-full bg-oficiar-dark
```

Letra del avatar: `text-lg font-bold text-white`

---

## Textos

| Contexto | Clases |
|---|---|
| Nombre/titulo principal | `font-semibold text-oficiar-very-dark` |
| Subtexto/email | `text-xs text-neutral-400` |
| Titulo de pantalla | `text-2xl font-bold text-neutral-900` |
| Subtitulo de pantalla | `text-neutral-500` |
| Nombre en header | `text-lg font-bold text-white` |
| Tab activo | `text-sm font-semibold text-oficiar-blue` |
| Tab inactivo | `text-sm font-semibold text-white/50` |
| Link | `text-center text-blue-600` |

---

## Mensajes de error

```
rounded-lg bg-red-50 p-3 text-center text-red-700
```

---

## Botones de accion en listas

| Accion | Fondo | Texto |
|---|---|---|
| Eliminar | `rounded-lg bg-red-50 px-3 py-2 active:opacity-80` | `text-sm font-semibold text-red-600` |
| Editar | `rounded-lg bg-blue-50 px-3 py-2 active:opacity-80` | `text-sm font-semibold text-oficiar-blue` |
| Desactivar | `rounded-lg bg-red-50 px-3 py-1.5 active:opacity-80` | `text-xs font-semibold text-red-600` |
| Reactivar | `rounded-lg bg-green-50 px-3 py-1.5 active:opacity-80` | `text-xs font-semibold text-green-600` |
| Guardar (edicion inline) | `rounded-lg bg-oficiar-blue-btn px-3 py-2 active:opacity-80 disabled:opacity-50` | `text-sm font-semibold text-white` |
| Cancelar (edicion inline) | `rounded-lg border border-neutral-300 px-3 py-2 active:opacity-80 disabled:opacity-50` | `text-sm font-semibold text-neutral-600` |

---

## Barra inferior (footer admin)

```
flex-row gap-3 border-t border-neutral-200 bg-white px-6 py-3
```

---

## Tab activo (indicador)

```
border-b-2 border-oficiar-blue
```

---

## Elemento inactivo (usuario desactivado)

```
opacity-50
```

---

## Spinner de carga

```tsx
<ActivityIndicator color="#3D80B7" />
```

Contenedor centrado: `flex-1 items-center justify-center`
