# Integración Mercado Pago - S.O.S Bombones

## 📁 Estructura

```
sos-bombones/
├── backend/                    ← Backend Node.js
│   ├── .env                    ← Credenciales (crear desde .env.example)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── src/                        ← Frontend React
│   ├── pages/
│   │   ├── Cart.tsx            ← Botón "Pagar con Mercado Pago"
│   │   ├── PaymentSuccess.tsx  ← Página post-pago exitoso
│   │   ├── PaymentFailure.tsx  ← Página post-pago fallido
│   │   └── PaymentPending.tsx  ← Página pago pendiente
```

## 🔐 Obtener Credenciales de Mercado Pago

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Crea una nueva aplicación o usa una existente
3. En "Credenciales de producción", copia el **Access Token**
4. Para pruebas, usa las credenciales de "Credenciales de prueba" (sandbox)

## ⚙️ Configuración

### Backend

```bash
cd backend
npm install

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar .env con tus credenciales
notepad .env  # o code .env
```

En el archivo `.env`:
```
MP_ACCESS_TOKEN=APP_USR-xxxx-xxxx-xxxx  ← Tu Access Token
FRONTEND_URL=http://localhost:5173       ← URL del frontend
PORT=3001
```

### Frontend

En el archivo `.env` del frontend (raíz del proyecto), agregar:
```
VITE_BACKEND_URL=http://localhost:3001
```

## 🚀 Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🔄 Flujo Completo

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. Cliente    │     │   2. Backend    │     │  3. Mercado     │
│   (React)       │────▶│   (Express)     │────▶│     Pago        │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │  4. Redirige al checkout de MP                │
         │◀──────────────────────────────────────────────│
         │                                               │
         │  5. Cliente paga                              │
         │                                               │
         │  6. MP redirige a /pago-exitoso               │
         │◀──────────────────────────────────────────────│
         │                                               │
         ▼                                               ▼
┌─────────────────┐                              ┌───────────────┐
│ PaymentSuccess  │                              │ 7. Webhook    │
│ "¡Gracias!"     │                              │ (opcional)    │
└─────────────────┘                              └───────────────┘
```

1. El cliente agrega productos al carrito
2. Hace clic en "Pagar con Mercado Pago"
3. El frontend llama a `/create-preference` del backend
4. El backend crea una preferencia en MP y devuelve la URL
5. El cliente es redirigido al checkout de Mercado Pago
6. El cliente paga con tarjeta/débito/MP/cuotas
7. Mercado Pago redirige a `/pago-exitoso`, `/pago-fallido` o `/pago-pendiente`

## 🧪 Probar Pagos (Sandbox)

Para pruebas, Mercado Pago ofrece tarjetas de prueba:

| Tarjeta           | Número              | CVV | Vencimiento |
|-------------------|---------------------|-----|-------------|
| Visa (Aprobado)   | 4509 9535 6623 3704 | 123 | 11/25       |
| Mastercard        | 5031 7557 3453 0604 | 123 | 11/25       |
| Rechazada         | 4000 0000 0000 0002 | 123 | 11/25       |

DNI para pruebas: `12345678`

## 🌐 Deploy en Producción (Hostinger)

### Backend
1. Sube la carpeta `backend/` a tu hosting
2. Configura las variables de entorno en el panel de Hostinger
3. Actualiza `FRONTEND_URL` a tu dominio real (con HTTPS)

### Frontend
1. En `.env`:
   ```
   VITE_BACKEND_URL=https://api.tudominio.com
   ```
2. `npm run build`
3. Sube el contenido de `dist/` a tu hosting

### URLs en el servidor
- Cambiar `MP_ACCESS_TOKEN` a las credenciales de **producción**
- Cambiar `FRONTEND_URL` a `https://tudominio.com`

## ✅ Seguridad

- ✅ Access Token solo en el backend, nunca en el frontend
- ✅ CORS configurado para aceptar solo tu dominio
- ✅ HTTPS obligatorio en producción
- ✅ Variables de entorno para credenciales
- ✅ Validación de datos en el backend

## 🛠️ Personalización

### Cambiar nombre en resumen de tarjeta
En `server.js`, modificar `statement_descriptor`:
```js
statement_descriptor: 'SOS BOMBONES'  // máx 22 caracteres
```

### Agregar cuotas
Mercado Pago maneja las cuotas automáticamente según la tarjeta.

### Webhook para confirmar pagos
El endpoint `/webhook` en el backend recibe notificaciones de MP.
Puedes usarlo para actualizar el estado del pedido en Supabase.

---

¿Dudas? Contacta al desarrollador.
