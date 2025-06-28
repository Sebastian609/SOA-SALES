# 🎫 SOA Tickets API - Sistema de Gestión de Tickets de Eventos

## 📋 Descripción

SOA Tickets API es un sistema especializado de gestión de tickets para eventos, construido con Node.js, TypeScript, TypeORM y MySQL. El sistema permite la creación, gestión y validación de tickets únicos para diferentes ubicaciones de eventos.

## 🚀 Características Principales

- **Generación automática de códigos únicos**: Cada ticket tiene un código único de 8 caracteres alfanuméricos
- **Gestión completa de tickets**: CRUD completo con soft delete
- **Validación de tickets**: Sistema de uso de tickets con validaciones
- **Generación masiva**: Creación de múltiples tickets para un evento
- **Estadísticas**: Reportes de uso y estado de tickets
- **API RESTful**: Endpoints bien documentados con Swagger
- **Documentación completa**: Swagger UI integrado

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas:

```
src/
├── config/           # Configuración (Swagger, etc.)
├── infrastructure/   # Capa de infraestructura
│   ├── controller/   # Controladores HTTP
│   ├── database/     # Configuración de base de datos
│   ├── dto/          # Data Transfer Objects
│   └── entity/       # Entidades de TypeORM
├── repository/       # Capa de acceso a datos
├── routes/           # Definición de rutas
├── service/          # Lógica de negocio
├── utils/            # Utilidades
└── server.ts         # Punto de entrada
```

## 📦 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SOA-TICKETS
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=soa_tickets

   # Server Configuration
   SWAGGER_SERVER_URL=http://localhost:2225/api
   ```

4. **Configurar la base de datos**
   Ejecutar el script `database-setup.sql` en tu base de datos MySQL:
   ```bash
   mysql -u your_username -p < database-setup.sql
   ```

5. **Ejecutar el servidor**
   ```bash
   npm run dev
   ```

## 🎯 Uso de la API

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/tickets` | Crear un nuevo ticket |
| `POST` | `/api/tickets/generate` | Generar múltiples tickets |
| `PUT` | `/api/tickets` | Actualizar un ticket |
| `POST` | `/api/tickets/use` | Usar un ticket por código |
| `POST` | `/api/tickets/{id}/use` | Usar un ticket por ID |
| `GET` | `/api/tickets` | Obtener tickets paginados |
| `GET` | `/api/tickets/all` | Obtener todos los tickets |
| `GET` | `/api/tickets/active` | Obtener tickets activos |
| `GET` | `/api/tickets/unused` | Obtener tickets no utilizados |
| `GET` | `/api/tickets/used` | Obtener tickets utilizados |
| `GET` | `/api/tickets/statistics` | Obtener estadísticas |
| `GET` | `/api/tickets/{id}` | Obtener ticket por ID |
| `GET` | `/api/tickets/code/{code}` | Obtener ticket por código |
| `GET` | `/api/tickets/event-location/{eventLocationId}` | Obtener tickets por ubicación |
| `POST` | `/api/tickets/{id}/activate` | Activar un ticket |
| `POST` | `/api/tickets/{id}/deactivate` | Desactivar un ticket |
| `DELETE` | `/api/tickets/{id}` | Eliminar un ticket (soft delete) |

### Ejemplos de Uso

#### Crear un ticket
```bash
curl -X POST http://localhost:2225/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "eventLocationId": 1
  }'
```

#### Generar múltiples tickets
```bash
curl -X POST http://localhost:2225/api/tickets/generate \
  -H "Content-Type: application/json" \
  -d '{
    "eventLocationId": 1,
    "quantity": 100
  }'
```

#### Usar un ticket
```bash
curl -X POST http://localhost:2225/api/tickets/use \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC12345"
  }'
```

#### Obtener estadísticas
```bash
curl -X GET http://localhost:2225/api/tickets/statistics
```

#### Health Check
```bash
curl -X GET http://localhost:2225/api/health
```

## 📊 Estructura de la Base de Datos

### Tabla `tbl_tickets`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ticket_id` | INT | ID único del ticket (AUTO_INCREMENT) |
| `event_location_id` | INT | ID de la ubicación del evento |
| `code` | VARCHAR(255) | Código único del ticket |
| `used_at` | DATETIME | Fecha y hora de uso del ticket |
| `is_used` | TINYINT | Indica si el ticket ha sido usado |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |
| `is_active` | TINYINT | Indica si el ticket está activo |
| `deleted` | TINYINT | Indica si el ticket está eliminado (soft delete) |

### Tabla `tbl_event_locations`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `event_location_id` | INT | ID único de la ubicación |
| `name` | VARCHAR(255) | Nombre de la ubicación |
| `address` | TEXT | Dirección de la ubicación |
| `capacity` | INT | Capacidad de la ubicación |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |
| `is_active` | TINYINT | Indica si está activa |
| `deleted` | TINYINT | Indica si está eliminada |

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | localhost |
| `DB_PORT` | Puerto de la base de datos | 3306 |
| `DB_USERNAME` | Usuario de la base de datos | - |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `DB_NAME` | Nombre de la base de datos | soa_tickets |
| `SWAGGER_SERVER_URL` | URL del servidor para Swagger | http://localhost:2225/api |

### Scripts Disponibles

```json
{
  "dev": "ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest"
}
```

## 📚 Documentación

### Swagger UI

La documentación interactiva de la API está disponible en:
```
http://localhost:2225/api-docs
```

### Esquemas de Datos

#### CreateTicketDto
```typescript
{
  eventLocationId: number; // ID de la ubicación del evento
}
```

#### GenerateTicketsDto
```typescript
{
  eventLocationId: number; // ID de la ubicación del evento
  quantity: number;        // Cantidad de tickets a generar (1-1000)
}
```

#### UseTicketDto
```typescript
{
  code: string; // Código del ticket a usar
}
```

#### UpdateTicketDto
```typescript
{
  id: number;                    // ID del ticket
  eventLocationId?: number;      // ID de la ubicación del evento
  code?: string;                 // Código único del ticket
  isUsed?: boolean;              // Indica si el ticket ha sido usado
  usedAt?: string;               // Fecha y hora de uso
  isActive?: boolean;            // Indica si el ticket está activo
}
```

## 🧪 Testing

Para ejecutar las pruebas:

```bash
npm test
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📝 Notas Importantes

1. **Códigos únicos**: Los códigos de tickets se generan automáticamente con 8 caracteres alfanuméricos
2. **Soft Delete**: Los tickets no se eliminan físicamente, se marcan como eliminados
3. **Validaciones**: El sistema valida que los tickets no hayan sido usados previamente
4. **Límites**: La generación masiva está limitada a 1000 tickets por operación
5. **Relaciones**: Los tickets están relacionados con ubicaciones de eventos (`tbl_event_locations`)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para la gestión eficiente de tickets de eventos**
