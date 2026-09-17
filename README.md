# OficiAR

Aplicacion movil para conectar usuarios con trabajadores de oficios. Desarrollada con **React Native (Expo)** en el frontend y **Spring Boot** en el backend.

---

## Requisitos previos

| Herramienta | Version minima |
|---|---|
| Java (JDK) | 25 o superior |
| Maven | 3.9+ (o usar el wrapper `mvnw` incluido) |
| MySQL | 8.0 |
| Node.js | 20 LTS o superior |
| Expo Go | Ultima version en tu celular (Android/iOS) |

**IDEs recomendados:**
- **IntelliJ IDEA** para el backend (carpeta `oficiar/`)
- **Visual Studio Code** para el frontend (carpeta `my-expo-app/`)

---

## 1. Base de datos (MySQL)

Abrir **MySQL Workbench** (o la terminal de MySQL) y ejecutar el archivo `script proyecto.txt` que esta en la raiz del repositorio.

Ese script:
- Crea la base de datos `oficiar_db3`
- Crea todas las tablas (`users`, `roles`, `user_role`, `perfil`, `user_perfil`)
- Inserta los 3 roles iniciales: `ROLE_CLIENT`, `ROLE_WORKER`, `ROLE_ADMIN`
- Inserta el catalogo de oficios (Plomero, Electricista, Carpintero, etc.)
- Crea el usuario administrador por defecto (`admin` / `admin123`)

---

## 2. Configurar el Backend (Spring Boot)

Abrir la carpeta `oficiar/` en **IntelliJ IDEA**.

En el archivo `src/main/resources/application.properties`, cambiar la password de MySQL por la tuya:

```properties
spring.datasource.password=123456
```

Reemplazar `123456` con la contraseña de **tu** MySQL local. Lo demas no se toca.

---

## 3. Configurar el Frontend (Expo / React Native)

Abrir la carpeta `my-expo-app/` en **Visual Studio Code**.

### 3.1 Instalar dependencias

Desde la terminal:

```bash
npm install
```

Esto instala todas las librerias del proyecto:
- **expo** ~57.0.22 — Framework principal
- **expo-router** ~57.0.17 — Navegacion basada en archivos
- **nativewind** ^4.2.6 — Tailwind CSS para React Native
- **react-hook-form** ^7.87.0 — Manejo de formularios
- **react-native-reanimated** — Animaciones
- **react-native-safe-area-context** — Areas seguras del dispositivo
- **react-native-screens** — Navegacion nativa

### 3.2 Configurar la IP del backend

Crear (o editar) el archivo `.env` en la raiz de `my-expo-app/`:

```
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:8080/oficiar
```

Para obtener tu IP local:

1. Abrir una terminal y ejecutar `ipconfig`
2. Buscar **Adaptador de LAN inalambrica Wi-Fi** → **Direccion IPv4**
3. Usar esa IP (ejemplo: `192.168.0.5`)

**Importante:** Tu celular y tu computador deben estar conectados a la **misma red Wi-Fi**.

---

## 4. Ejecutar el proyecto

### 4.1 Backend

Desde IntelliJ, hacer clic en el boton **Run** de la clase principal. El backend queda corriendo en `http://localhost:8080/oficiar`.

### 4.2 Frontend

Desde la terminal de VS Code:

```bash
npx expo start
```

Escanear el codigo QR con la app **Expo Go** en tu celular.

---

## 5. Estilos (NativeWind / Tailwind CSS)

El proyecto usa **NativeWind v4** que permite escribir clases de Tailwind CSS directamente en los componentes de React Native.

La paleta de colores personalizada esta definida en `tailwind.config.js`:

| Clase | Color | Hex |
|---|---|---|
| `oficiar-very-dark` | Azul muy oscuro | `#051A26` |
| `oficiar-dark` | Azul oscuro | `#0B3954` |
| `oficiar-blue` | Azul medio | `#3D80B7` |
| `oficiar-blue-btn` | Azul botones | `#0077B5` |
| `oficiar-yellow` | Amarillo | `#FFC107` |
| `oficiar-gray` | Gris claro | `#EDEDED` |

Ejemplo de uso:

```tsx
<View className="bg-oficiar-dark">
  <Text className="text-oficiar-yellow">Hola</Text>
</View>
```

Para mas detalles sobre las clases estandarizadas del proyecto, ver `ESTILOS.md`.

