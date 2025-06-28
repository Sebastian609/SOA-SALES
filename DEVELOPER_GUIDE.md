# 🛒 SOA Sales Service - Guía para Desarrolladores

## 📋 Introducción
Esta guía está diseñada para desarrolladores que trabajarán con el servicio de ventas y sus detalles. Incluye información técnica, patrones de desarrollo y mejores prácticas.

## 🏗️ Arquitectura del Código

### Estructura de Capas
```
┌─────────────────────────────────────┐
│           Controller Layer          │ ← Manejo de HTTP requests
├─────────────────────────────────────┤
│            Service Layer            │ ← Lógica de negocio
├─────────────────────────────────────┤
│          Repository Layer           │ ← Acceso a datos
├─────────────────────────────────────┤
│           Entity Layer              │ ← Modelos de datos
└─────────────────────────────────────┘
```

### Patrón de Inyección de Dependencias
```typescript
// Ejemplo de cómo se conectan las capas
const salesRepository = new SalesRepository(
  AppDataSource.getRepository(Sale),
  AppDataSource.getRepository(SaleDetail)
);
const salesService = new SalesService(salesRepository);
const salesController = new SalesController(salesService);
```

## 🔧 Configuración del Entorno

### Requisitos Previos
- Node.js 18+
- TypeScript 5+
- MySQL 8.0+
- Docker (opcional)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd SOA-SALES

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
npm run migration:run

# Iniciar el servicio
npm run dev
```

### Variables de Entorno
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=soa_sales

# Servidor
PORT=2226
NODE_ENV=development

# Swagger
SWAGGER_SERVER_URL=http://localhost:2226/api
```

## 📝 Patrones de Desarrollo

### 1. **DTOs (Data Transfer Objects)**

#### Crear un Nuevo DTO
```typescript
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateSaleDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  @Expose()
  saleDetails: CreateSaleDetailDto[];
}
```

#### Validaciones Disponibles
- `@IsNotEmpty()`: Campo requerido
- `@IsNumber()`: Debe ser número
- `@IsString()`: Debe ser string
- `@IsOptional()`: Campo opcional
- `@IsArray()`: Debe ser array
- `@ValidateNested()`: Validar objetos anidados

### 2. **Entidades**

#### Estructura de Entidad
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("tbl_sales")
export class Sale {
  @PrimaryGeneratedColumn({ name: "sale_id" })
  id: number;

  @Column({ name: "user_id", nullable: true })
  userId: number;

  @Column({ name: "total_amount", type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "deleted", default: false })
  deleted: boolean;
}
```

#### Decoradores de TypeORM
- `@Entity()`: Define la entidad
- `@PrimaryGeneratedColumn()`: ID autoincremental
- `@Column()`: Columna de base de datos
- `@CreateDateColumn()`: Timestamp de creación
- `@UpdateDateColumn()`: Timestamp de actualización
- `@OneToMany()`: Relación uno a muchos
- `@ManyToOne()`: Relación muchos a uno

### 3. **Repositorio**

#### Implementar Método Personalizado
```typescript
export class SalesRepository implements IBaseRepository<Sale> {
  // Método base
  async findById(id: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id, deleted: false },
      relations: ["saleDetails"]
    });
    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  // Método personalizado
  async findByUserId(userId: number): Promise<Sale[]> {
    return this.salesRepository.find({
      where: { userId, deleted: false },
      relations: ["saleDetails"],
      order: { createdAt: "DESC" }
    });
  }
}
```

#### Consultas Avanzadas
```typescript
// Consulta con QueryBuilder
async getSalesStatistics(): Promise<any> {
  const totalRevenue = await this.salesRepository
    .createQueryBuilder("sale")
    .select("SUM(sale.totalAmount)", "total")
    .where("sale.deleted = :deleted", { deleted: false })
    .getRawOne();

  return {
    totalRevenue: totalRevenue?.total || 0
  };
}
```

### 4. **Servicio**

#### Implementar Lógica de Negocio
```typescript
export class SalesService {
  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    // 1. Validar datos
    const sale = plainToInstance(Sale, {
      userId: saleData.userId,
      totalAmount: saleData.totalAmount,
      isActive: true,
      deleted: false
    });
    
    // 2. Crear venta principal
    const createdSale = await this.salesRepository.create(sale);
    
    // 3. Crear detalles
    if (saleData.saleDetails?.length > 0) {
      for (const detailData of saleData.saleDetails) {
        await this.salesRepository.createSaleDetail({
          saleId: createdSale.id,
          ticketId: detailData.ticketId,
          amount: detailData.amount,
          isActive: true,
          deleted: false
        });
      }
    }
    
    // 4. Retornar venta completa
    return this.salesRepository.findById(createdSale.id);
  }
}
```

#### Manejo de Errores
```typescript
async softDeleteSale(id: number): Promise<any> {
  try {
    const exists = await this.salesRepository.findById(id);
    if (!exists) {
      throw new Error("Sale does not exist");
    }
    return await this.salesRepository.softDelete(id);
  } catch (error) {
    // Log del error para debugging
    console.error(`Error deleting sale ${id}:`, error);
    throw error;
  }
}
```

### 5. **Controlador**

#### Estructura de Método
```typescript
export class SalesController {
  async createSale(req: Request, res: Response) {
    try {
      // 1. Transformar y validar datos
      const data = plainToInstance(CreateSaleDto, req.body, {
        excludeExtraneousValues: true
      });
      
      // 2. Procesar con el servicio
      const newSale = await this.salesService.createSale(data);
      
      // 3. Retornar respuesta
      res.status(201).json(newSale);
    } catch (error) {
      // 4. Manejar errores
      if (error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
```

#### Códigos de Estado HTTP
- `200`: OK - Operación exitosa
- `201`: Created - Recurso creado
- `400`: Bad Request - Error en datos
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto de datos
- `500`: Internal Server Error - Error del servidor

### 6. **Rutas**

#### Definir Endpoint
```typescript
export class SalesRoutes {
  constructor(salesController: SalesController) {
    // POST /api/sales
    this.router.post("/", this.controller.createSale.bind(this.controller));
    
    // GET /api/sales
    this.router.get("/", this.controller.getPaginated.bind(this.controller));
    
    // GET /api/sales/{id}
    this.router.get("/:id", this.controller.getSaleById.bind(this.controller));
  }
}
```

#### Documentación Swagger
```typescript
/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleDto'
 *     responses:
 *       201:
 *         description: Venta creada correctamente
 */
```

## 🧪 Testing

### Estructura de Pruebas
```typescript
describe("SalesService", () => {
  let salesService: SalesService;
  let mockRepository: jest.Mocked<SalesRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    salesService = new SalesService(mockRepository);
  });

  describe("createSale", () => {
    it("should create a sale with details", async () => {
      // Arrange
      const createDto: CreateSaleDto = {
        userId: 1,
        totalAmount: 100.00,
        saleDetails: [{ ticketId: 1, amount: 100.00 }]
      };

      // Act
      const result = await salesService.createSale(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });
});
```

### Mocking del Repositorio
```typescript
const createMockRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  createSaleDetail: jest.fn(),
  getSalesStatistics: jest.fn(),
} as any);
```

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 🔍 Debugging

### Logs de Desarrollo
```typescript
// En el servicio
console.log("Creating sale with data:", saleData);

// En el controlador
console.log("Request body:", req.body);
console.log("Request params:", req.params);
```

### Herramientas de Debug
```bash
# Ver logs del servidor
npm run dev

# Inspeccionar base de datos
mysql -u root -p soa_sales

# Verificar endpoints
curl -X GET http://localhost:2226/api/health
```

### Errores Comunes

#### Error de Validación
```json
{
  "message": "totalAmount must be a positive number"
}
```
**Solución**: Verificar que el DTO tenga las validaciones correctas.

#### Error de Relación
```json
{
  "message": "Cannot read property 'saleDetails' of undefined"
}
```
**Solución**: Asegurar que las relaciones estén configuradas en el repositorio.

#### Error de Base de Datos
```json
{
  "message": "ER_NO_SUCH_TABLE: Table 'soa_sales.tbl_sales' doesn't exist"
}
```
**Solución**: Ejecutar las migraciones de la base de datos.

## 📊 Monitoreo y Métricas

### Logs Estructurados
```typescript
// Implementar logging estructurado
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// En el servicio
logger.info('Sale created', { saleId: createdSale.id, userId: saleData.userId });
```

### Métricas de Rendimiento
```typescript
// Medir tiempo de respuesta
const startTime = Date.now();
const result = await this.salesRepository.findById(id);
const endTime = Date.now();
console.log(`Query took ${endTime - startTime}ms`);
```

## 🚀 Despliegue

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 2226
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  sales-service:
    build: .
    ports:
      - "2226:2226"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=soa_sales
    ports:
      - "3306:3306"
```

### Variables de Producción
```env
NODE_ENV=production
PORT=2226
DB_HOST=production-db-host
DB_PORT=3306
DB_USERNAME=prod_user
DB_PASSWORD=prod_password
DB_DATABASE=soa_sales_prod
```

## 📚 Recursos Adicionales

### Documentación
- [TypeORM Documentation](https://typeorm.io/)
- [Express.js Documentation](https://expressjs.com/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Swagger Documentation](https://swagger.io/)

### Herramientas Útiles
- **Postman**: Para probar endpoints
- **MySQL Workbench**: Para administrar base de datos
- **VS Code Extensions**: TypeScript, REST Client
- **DBeaver**: Cliente universal de base de datos

### Patrones de Diseño
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer Pattern**: Lógica de negocio centralizada
- **DTO Pattern**: Transferencia de datos tipada
- **Dependency Injection**: Inversión de control

## 🎯 Mejores Prácticas

### Código Limpio
- Usar nombres descriptivos para variables y métodos
- Mantener métodos pequeños y con una sola responsabilidad
- Documentar código complejo
- Seguir convenciones de TypeScript

### Seguridad
- Validar siempre los datos de entrada
- Usar parámetros tipados
- Implementar rate limiting en producción
- Loggear eventos de seguridad

### Rendimiento
- Usar índices en la base de datos
- Implementar paginación para listas grandes
- Cachear consultas frecuentes
- Optimizar consultas N+1

### Mantenibilidad
- Escribir pruebas unitarias
- Usar TypeScript estrictamente
- Seguir principios SOLID
- Documentar APIs con Swagger 