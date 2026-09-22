# dict_styles.md — Diccionario de estilos OficiAR

Este documento define el esquema de colores, la tipografia y las formas (clases Tailwind/NativeWind) del proyecto OficiAR. Estos estilos fueron desarrollados originalmente en el mockup de frontend web y se adaptan aqui para la version movil con React Native y NativeWind.

---

## 1. Esquema de colores

### Colores principales

| Token | Hex | Uso |
|---|---|---|
| `oficiar-very-dark` | `#051A26` | Fondo header, textos principales, color del Logo |
| `oficiar-dark` | `#0B3954` | Barra de tabs, avatares, fondos secundarios oscuros |
| `oficiar-blue` | `#3D80B7` | Tab activo, texto destacado, texto "AR" del Logo, spinner |
| `oficiar-blue-btn` | `#0077B5` | Botones de accion primarios |
| `oficiar-yellow` | `#FFC107` | Boton "Hazte Officer", acentos amarillos |
| `oficiar-gray` | `#EDEDED` | Fondo general de pantallas |

### Grises

| Token | Hex | Uso |
|---|---|---|
| `oficiar-dark-gray` | `#6C757D` | Textos secundarios, separadores |
| `oficiar-light-gray` | `#ADB5BD` | Bordes, placeholders |
| `oficiar-soft-gray` | `#979797` | Textos terciarios |

### Color de alerta

| Token | Hex | Uso |
|---|---|---|
| `oficiar-red` | `#FF7676` | Errores, alertas generales |

### Colores de estado

| Token | Hex | Estado |
|---|---|---|
| `oficiar-status-caducado` | `#FF7676` | Servicio caducado |
| `oficiar-status-discusion` | `#F5B067` | Servicio en discusion |
| `oficiar-status-finalizado` | `#65B0EE` | Servicio finalizado |
| `oficiar-status-ejecucion` | `#79F085` | Servicio en ejecucion |

---

## 2. Tipografia

**Fuente objetivo:** Inter (sans-serif) — misma que en la version web.

**Estado actual en movil:** se usa la fuente del sistema (Roboto en Android, San Francisco en iOS). Para instalar Inter se requiere `expo-font` y `@expo-google-fonts/inter`.

### Variantes de texto

| Variante | Clases NativeWind | Uso |
|---|---|---|
| **h1** | `text-2xl font-black text-oficiar-very-dark` | Titulo principal de pantalla |
| **h2** | `text-xl font-extrabold text-oficiar-very-dark` | Titulo de seccion |
| **h3** | `text-lg font-bold text-oficiar-very-dark` | Nombre en cards, subtitulos |
| **subtitle** | `text-base font-medium text-neutral-700` | Subtitulos, descripciones destacadas |
| **body** | `text-sm text-neutral-500` | Parrafos, texto de lectura |
| **small** | `text-xs font-light text-neutral-400` | Fechas, notas, datos secundarios |

---

## 3. Formas

### 3.1 Botones

**Base de todos los botones:**
```
items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50
```

| Variante | Fondo | Texto |
|---|---|---|
| **primary** | `bg-oficiar-blue-btn` | `text-white font-semibold` |
| **secondary** | `border border-neutral-300` | `text-neutral-700 font-semibold` |
| **yellow** | `bg-oficiar-yellow` | `text-oficiar-very-dark font-semibold` |
| **danger** | `bg-red-50` | `text-red-600 font-semibold` |

**Boton inline (al lado de un input):**
```
items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50
```
Texto: `font-semibold text-white`

### 3.2 Botones de accion en listas

| Accion | Contenedor | Texto |
|---|---|---|
| **Eliminar** | `rounded-lg bg-red-50 px-3 py-2 active:opacity-80` | `text-sm font-semibold text-red-600` |
| **Editar** | `rounded-lg bg-blue-50 px-3 py-2 active:opacity-80` | `text-sm font-semibold text-oficiar-blue` |
| **Desactivar** | `rounded-lg bg-red-50 px-3 py-1.5 active:opacity-80` | `text-xs font-semibold text-red-600` |
| **Reactivar** | `rounded-lg bg-green-50 px-3 py-1.5 active:opacity-80` | `text-xs font-semibold text-green-600` |
| **Guardar** | `rounded-lg bg-oficiar-blue-btn px-3 py-2 active:opacity-80 disabled:opacity-50` | `text-sm font-semibold text-white` |
| **Cancelar** | `rounded-lg border border-neutral-300 px-3 py-2 active:opacity-80 disabled:opacity-50` | `text-sm font-semibold text-neutral-600` |

### 3.3 Campos de texto (inputs)

**Input con label fijo (Field):**
```
rounded-lg border border-neutral-300 p-3
```
- Label: `font-semibold`
- Con error: `rounded-lg border border-red-600 p-3`
- Mensaje de error: `text-xs text-red-600`

**Input inline (crear/buscar en tabs):**
```
flex-1 rounded-lg border border-neutral-300 px-3 py-2
```

**Barra de busqueda (adaptada de web):**
```
w-full rounded-full border-2 border-oficiar-blue py-3 px-6 text-oficiar-very-dark
```

### 3.4 Dropdown

```
w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-oficiar-very-dark
```

Menu desplegable:
```
bg-white border border-neutral-200 rounded-lg shadow-lg
```

Item del menu:
```
w-full p-2 rounded text-left text-sm text-oficiar-very-dark font-medium
```

### 3.5 Cards

**Card de lista (item de FlatList):**
```
rounded-xl bg-white px-4 py-3
```

**Card de servicio:**
```
w-full bg-white rounded-lg shadow-sm px-4 py-4
```

**Card de perfil:**
```
w-full bg-white rounded-2xl shadow-md border border-neutral-100 p-5
```

**Card de testimonio:**
```
bg-oficiar-gray w-full p-5 rounded-lg shadow-md
```

**Card de oferta:**
```
bg-white rounded-lg shadow-md overflow-hidden
```

**Formulario (glassmorphism — solo si aplica en movil):**
```
bg-white/70 p-8 w-full rounded-2xl shadow-xl
```

### 3.6 Badge

**Base:**
```
rounded-full px-2.5 py-1
```

| Variante | Fondo | Texto |
|---|---|---|
| **red** | `bg-red-100` | `text-red-700 font-bold` |
| **green** | `bg-green-100` | `text-green-700 font-bold` |
| **blue** | `bg-blue-100` | `text-blue-700 font-bold` |
| **neutral** | `bg-neutral-100` | `text-neutral-700 font-bold` |

Tamanos: `sm` → `text-[10px]`, `md` → `text-xs`

### 3.7 ChipSelect

| Estado | Contenedor | Texto |
|---|---|---|
| **Activo** | `rounded-full px-4 py-2 bg-blue-600` | `text-sm font-semibold text-white` |
| **Inactivo** | `rounded-full px-4 py-2 border border-neutral-300 bg-white` | `text-sm text-neutral-700` |

### 3.8 Header

```
items-center gap-1 bg-oficiar-very-dark px-6 pb-2 pt-12
```

Nombre del usuario: `text-lg font-bold text-white`

### 3.9 Barra de tabs

**Contenedor:**
```
flex-row bg-oficiar-dark
```

**Tab activo:**
```
flex-1 items-center py-3 border-b-2 border-oficiar-blue
```
Texto activo: `text-sm font-semibold text-oficiar-blue`

**Tab inactivo:**
```
flex-1 items-center py-3
```
Texto inactivo: `text-sm font-semibold text-white/50`

### 3.10 Footer

```
flex-row gap-3 border-t border-neutral-200 bg-white px-6 py-3
```

### 3.11 Seccion de formulario (crear/buscar)

```
gap-2 border-b border-neutral-200 bg-white px-4 py-3
```

### 3.12 Avatar circular

```
h-10 w-10 items-center justify-center rounded-full bg-oficiar-dark
```
Letra: `text-lg font-bold text-white`

### 3.13 Logo

Texto "Ofici": `font-black text-oficiar-very-dark` (o `text-white` en modo light)

Texto "AR": `font-black text-oficiar-blue`

Tamanos: `sm` → `text-2xl`, `md` → `text-4xl`, `lg` → `text-5xl`

### 3.14 Contenedor de lista vacia

```
py-8 text-center text-neutral-400
```

### 3.15 Mensaje de error

```
rounded-lg bg-red-50 p-3 text-center text-red-700
```

### 3.16 Elemento inactivo (usuario desactivado)

```
opacity-50
```

### 3.17 Spinner de carga

```tsx
<ActivityIndicator color="#3D80B7" />
```
Contenedor: `flex-1 items-center justify-center`

### 3.18 Estados de servicio

| Estado | Clase de texto |
|---|---|
| Caducado | `text-oficiar-status-caducado font-semibold` |
| En discusion | `text-oficiar-status-discusion font-semibold` |
| Finalizado | `text-oficiar-status-finalizado font-semibold` |
| En ejecucion | `text-oficiar-status-ejecucion font-semibold` |

### 3.19 Fondos de pantalla

| Contexto | Clases |
|---|---|
| Pantalla general | `flex-1 bg-oficiar-gray` |
| Formulario (login, registro) | `flex-1 bg-neutral-50` |

### 3.20 Link

```
text-center text-blue-600
```
