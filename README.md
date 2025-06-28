# 🛒 SOA Sales API - Sistema de Gestión de Ventas

## 📋 Descripción

SOA Sales API es un sistema especializado de gestión de ventas y sus detalles para una arquitectura SOA, construido con Node.js, TypeScript, TypeORM y MySQL. El sistema permite la creación, gestión y seguimiento de ventas con múltiples detalles asociados.

## 🚀 Características Principales

- **Gestión completa de ventas**: CRUD completo con soft delete
- **Detalles de venta**: Manejo de múltiples detalles por venta
- **Estadísticas avanzadas**: Reportes de ventas y métricas
- **Paginación eficiente**: Consultas optimizadas con paginación
- **Validación robusta**: Validación de datos con class-validator
- **API RESTful**: Endpoints bien documentados con Swagger
- **Arquitectura SOA**: Microservicio independiente para ventas
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

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SOA-SALES
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
   DB_NAME=soa_sales

   # Server Configuration
   PORT=2226
   SWAGGER_SERVER_URL=http://localhost:2226/api
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

#### Gestión de Ventas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/sales` | Crear una nueva venta con detalles |
| `PUT` | `/api/sales` | Actualizar una venta existente |
| `GET` | `/api/sales` | Obtener ventas paginadas |
| `GET` | `/api/sales/all` | Obtener todas las ventas |
| `GET` | `/api/sales/active` | Obtener ventas activas |
| `GET` | `/api/sales/statistics` | Obtener estadísticas de ventas |
| `GET` | `/api/sales/{id}` | Obtener venta por ID |
| `GET` | `/api/sales/user/{userId}` | Obtener ventas por usuario |
| `GET` | `/api/sales/partner/{partnerId}` | Obtener ventas por partner |
| `DELETE` | `/api/sales/{id}/delete` | Eliminar una venta (soft delete) |
| `POST` | `/api/sales/{id}/activate` | Activar una venta |
| `POST` | `/api/sales/{id}/deactivate` | Desactivar una venta |
| `POST` | `/api/sales/{id}/restore` | Restaurar una venta eliminada |

#### Gestión de Detalles de Venta
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `PUT` | `/api/sales/details` | Actualizar un detalle de venta |
| `GET` | `/api/sales/{saleId}/details` | Obtener detalles de una venta |
| `GET` | `/api/sales/details/{id}` | Obtener detalle por ID |
| `DELETE` | `/api/sales/details/{id}/delete` | Eliminar un detalle (soft delete) |

### Ejemplos de Uso

#### Crear una venta con detalles
```bash
curl -X POST http://localhost:2226/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "partnerId": 1,
    "totalAmount": 150.00,
    "saleDetails": [
      {
        "ticketId": 1,
        "amount": 75.00
      },
      {
        "ticketId": 2,
        "amount": 75.00
      }
    ]
  }'
```

#### Obtener ventas paginadas
```bash
curl -X GET "http://localhost:2226/api/sales?page=1&items=10"
```

#### Obtener estadísticas
```bash
curl -X GET http://localhost:2226/api/sales/statistics
```

#### Actualizar un detalle de venta
```bash
curl -X PUT http://localhost:2226/api/sales/details \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "amount": 80.00
  }'
```

#### Health Check
```bash
curl -X GET http://localhost:2226/api/health
```

## 📊 Estructura de la Base de Datos

### Tabla `tbl_sales`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sale_id` | INT | ID único de la venta (AUTO_INCREMENT) |
| `user_id` | INT | ID del usuario (opcional) |
| `partner_id` | INT | ID del partner (opcional) |
| `total_amount` | DECIMAL(10,2) | Monto total de la venta |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |
| `is_active` | TINYINT | Indica si la venta está activa |
| `deleted` | TINYINT | Indica si la venta está eliminada (soft delete) |

### Tabla `tbl_sale_details`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sale_detail_id` | INT | ID único del detalle (AUTO_INCREMENT) |
| `sale_id` | INT | ID de la venta (FK) |
| `ticket_id` | INT | ID del ticket asociado (opcional) |
| `amount` | DECIMAL(10,2) | Monto del detalle |
| `created_at` | DATETIME | Fecha de creación |
| `updated_at` | DATETIME | Fecha de última actualización |
| `is_active` | TINYINT | Indica si el detalle está activo |
| `deleted` | TINYINT | Indica si el detalle está eliminado (soft delete) |

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | localhost |
| `DB_PORT` | Puerto de la base de datos | 3306 |
| `DB_USERNAME` | Usuario de la base de datos | - |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `DB_NAME` | Nombre de la base de datos | soa_sales |
| `PORT` | Puerto del servidor | 2226 |
| `SWAGGER_SERVER_URL` | URL del servidor para Swagger | http://localhost:2226/api |

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
http://localhost:2226/api-docs
```

### Esquemas de Datos

#### CreateSaleDto
```typescript
{
  userId?: number;           // ID del usuario (opcional)
  partnerId?: number;        // ID del partner (opcional)
  totalAmount: number;       // Monto total de la venta
  saleDetails: CreateSaleDetailDto[]; // Array de detalles
}
```

#### CreateSaleDetailDto
```typescript
{
  ticketId?: number;         // ID del ticket (opcional)
  amount: number;            // Monto del detalle
}
```

#### UpdateSaleDto
```typescript
{
  id: number;                // ID de la venta
  userId?: number;           // ID del usuario
  partnerId?: number;        // ID del partner
  totalAmount?: number;      // Monto total
  isActive?: boolean;        // Estado activo
}
```

#### UpdateSaleDetailDto
```typescript
{
  id: number;                // ID del detalle
  ticketId?: number;         // ID del ticket
  amount?: number;           // Monto del detalle
  isActive?: boolean;        // Estado activo
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

### Docker
```bash
docker build -t soa-sales .
docker run -p 2226:2226 soa-sales
```

## 📝 Notas Importantes

1. **Soft Delete**: Las ventas y detalles no se eliminan físicamente, se marcan como eliminados
2. **Validaciones**: El sistema valida todos los datos de entrada con class-validator
3. **Relaciones**: Las ventas pueden tener múltiples detalles asociados
4. **Paginación**: Las consultas de listado incluyen paginación por defecto
5. **Estadísticas**: El sistema proporciona métricas en tiempo real
6. **Arquitectura SOA**: Este servicio es independiente y se integra con otros servicios

## 🔄 Integración SOA

Este servicio se integra con otros servicios de la arquitectura SOA:

- **Servicio de Usuarios**: Referencia por `userId`
- **Servicio de Partners**: Referencia por `partnerId`
- **Servicio de Tickets**: Referencia por `ticketId` en detalles

## 📖 Documentación Adicional

- **Guía Completa**: `SALES_SERVICE_SUMMARY.md`
- **Ejemplos Prácticos**: `SALES_SERVICE_EXAMPLES.md`
- **Guía para Desarrolladores**: `DEVELOPER_GUIDE.md`

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

**Desarrollado con ❤️ para la gestión eficiente de ventas en arquitectura SOA**
