# 🛒 SOA Sales Service - Resumen de Implementación

## 📋 Descripción General
Servicio especializado en la gestión de ventas y sus detalles para una arquitectura SOA. Este servicio maneja únicamente las operaciones relacionadas con ventas, incluyendo la creación, actualización, consulta y eliminación de ventas y sus detalles asociados.

## 🏗️ Arquitectura del Servicio

### 1. **Entidades** 
- **Sale** (`src/infrastructure/entity/sales.entity.ts`): Mapeo completo de la tabla `tbl_sales`
- **SaleDetail** (`src/infrastructure/entity/sale-details.entity.ts`): Mapeo completo de la tabla `tbl_sale_details`

### 2. **DTOs** (`src/infrastructure/dto/sales.dto.ts`)
- `CreateSaleDto`: Para crear ventas con detalles
- `CreateSaleDetailDto`: Para crear detalles de venta
- `UpdateSaleDto`: Para actualizar ventas existentes
- `UpdateSaleDetailDto`: Para actualizar detalles de venta

### 3. **Repositorio** (`src/repository/sales.repository.ts`)
- Implementa `IBaseRepository<Sale>`
- Métodos específicos para ventas:
  - `findByUserId()` / `findByPartnerId()`: Buscar ventas por usuario o partner
  - `findActiveSales()`: Obtener ventas activas
  - `getSalesStatistics()`: Estadísticas de ventas
  - Métodos para `SaleDetail`: CRUD completo para detalles

### 4. **Servicio** (`src/service/sales.service.ts`)
- Lógica de negocio para ventas
- Validaciones y transformaciones
- Gestión de transacciones
- Estadísticas de ventas

### 5. **Controlador** (`src/infrastructure/controller/sales.controller.ts`)
- Manejo de requests HTTP
- Validación de datos de entrada
- Respuestas estructuradas

### 6. **Rutas** (`src/routes/sales.routes.ts`)
- Definición de endpoints REST
- Documentación Swagger integrada

### 7. **Configuración**
- **Swagger** (`src/config/swagger.ts`): Solo esquemas de ventas
- **Servidor** (`src/server.ts`): Solo servicio de ventas

## 🚀 Endpoints Disponibles

### Gestión de Ventas
```
POST   /api/sales                    # Crear venta con detalles
PUT    /api/sales                    # Actualizar venta
GET    /api/sales                    # Lista paginada
GET    /api/sales/all                # Todas las ventas
GET    /api/sales/active             # Ventas activas
GET    /api/sales/statistics         # Estadísticas
GET    /api/sales/{id}               # Venta por ID
GET    /api/sales/user/{userId}      # Ventas por usuario
GET    /api/sales/partner/{partnerId} # Ventas por partner
DELETE /api/sales/{id}/delete        # Eliminar venta (soft delete)
POST   /api/sales/{id}/activate      # Activar venta
POST   /api/sales/{id}/deactivate    # Desactivar venta
POST   /api/sales/{id}/restore       # Restaurar venta
```

### Gestión de Detalles de Venta
```
PUT    /api/sales/details            # Actualizar detalle de venta
GET    /api/sales/{saleId}/details   # Detalles de una venta
GET    /api/sales/details/{id}       # Detalle por ID
DELETE /api/sales/details/{id}/delete # Eliminar detalle (soft delete)
```

## 🔧 Características Técnicas

### Validaciones
- ✅ Validación de DTOs con class-validator
- ✅ Transformación de datos con class-transformer
- ✅ Validación de paginación
- ✅ Verificación de existencia antes de operaciones

### Seguridad
- ✅ Soft delete para preservar datos
- ✅ Validación de parámetros de entrada
- ✅ Manejo de errores estructurado

### Base de Datos
- **Tabla**: `tbl_sales`
- **Tabla**: `tbl_sale_details`
- ✅ Relaciones entre entidades
- ✅ Índices optimizados
- ✅ Transacciones ACID

## 📊 Ejemplos de Uso

### 1. Crear una Venta
```bash
curl -X POST http://localhost:2226/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "partnerId": 1,
    "totalAmount": 100.00,
    "saleDetails": [
      {
        "ticketId": 1,
        "amount": 50.00
      },
      {
        "ticketId": 2,
        "amount": 50.00
      }
    ]
  }'
```

### 2. Obtener Estadísticas
```bash
curl -X GET http://localhost:2226/api/sales/statistics
```

### 3. Obtener Ventas por Usuario
```bash
curl -X GET http://localhost:2226/api/sales/user/1
```

## 🏥 Health Check
```bash
curl -X GET http://localhost:2226/api/health
```

Respuesta:
```json
{
  "status": "OK",
  "message": "SOA Sales API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗄️ Estructura de Base de Datos

### Tabla `tbl_sales`
```sql
CREATE TABLE `tbl_sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `partner_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`sale_id`)
);
```

### Tabla `tbl_sale_details`
```sql
CREATE TABLE `tbl_sale_details` (
  `sale_detail_id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`sale_detail_id`),
  KEY `fk_sale_details_sale` (`sale_id`),
  CONSTRAINT `fk_sale_details_sale` FOREIGN KEY (`sale_id`) REFERENCES `tbl_sales` (`sale_id`)
);
```

## 📁 Estructura de Archivos
```
src/
├── config/
│   └── swagger.ts                    # Configuración de Swagger
├── infrastructure/
│   ├── controller/
│   │   └── sales.controller.ts       # Controlador de ventas
│   ├── database/
│   │   └── database.ts               # Configuración de base de datos
│   ├── dto/
│   │   └── sales.dto.ts              # DTOs para ventas
│   ├── entity/
│   │   ├── sales.entity.ts           # Entidad Sale
│   │   └── sale-details.entity.ts    # Entidad SaleDetail
│   └── interfaces/
│       └── pagination.interface.ts   # Interfaz de paginación
├── repository/
│   ├── base-repository.interface.ts  # Interfaz base del repositorio
│   └── sales.repository.ts           # Repositorio de ventas
├── routes/
│   └── sales.routes.ts               # Rutas de ventas
├── service/
│   └── sales.service.ts              # Servicio de ventas
├── test/
│   └── sales.test.ts                 # Pruebas unitarias
├── utils/
│   └── getPaginated.ts               # Utilidad de paginación
└── server.ts                         # Servidor principal
```

## ✅ Estado de Implementación

### ✅ Completado
- ✅ **Entidad Sale**: Completamente implementada
- ✅ **Entidad SaleDetail**: Completamente implementada
- ✅ **DTOs**: Todos los DTOs necesarios
- ✅ **Repositorio**: CRUD completo con métodos específicos
- ✅ **Servicio**: Lógica de negocio completa
- ✅ **Controlador**: Manejo de requests HTTP
- ✅ **Rutas**: Todos los endpoints necesarios
- ✅ **Swagger**: Documentación completa
- ✅ **Pruebas**: Pruebas unitarias básicas
- ✅ **Validaciones**: Validación de datos completa
- ✅ **Manejo de Errores**: Estructurado y consistente
- ✅ **Paginación**: Implementada correctamente
- ✅ **Soft Delete**: Preservación de datos
- ✅ **Estadísticas**: Métricas de ventas
- ✅ **Relaciones**: Entre Sale y SaleDetail
- ✅ **Servicio Único**: Solo maneja ventas, sin usuarios/roles/sockets

### 🎯 Características Principales
- ✅ Gestión completa de ventas y detalles.
- ✅ API RESTful bien documentada
- ✅ Validación robusta de datos
- ✅ Manejo de errores consistente
- ✅ Paginación eficiente
- ✅ Estadísticas en tiempo real
- ✅ Soft delete para preservar datos
- ✅ Relaciones entre entidades
- ✅ Documentación Swagger completa
- ✅ Pruebas unitarias
- ✅ Arquitectura SOA optimizada

## 🎉 Resumen
**🎉 El servicio de ventas está completamente implementado y optimizado para manejar únicamente ventas y sus detalles en una arquitectura SOA!**

### Puerto de Ejecución
- **Puerto**: 2226
- **URL Base**: `http://localhost:2226`
- **Documentación**: `http://localhost:2226/api-docs`
- **Health Check**: `http://localhost:2226/api/health` 