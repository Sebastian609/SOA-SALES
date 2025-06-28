import express from "express";
import { createServer } from "http";
import { SalesController } from "./infrastructure/controller/sales.controller";
import { SalesRoutes } from "./routes/sales.routes";
import { SalesService } from "./service/sales.service";
import { SalesRepository } from "./repository/sales.repository";
import { Sale } from "./infrastructure/entity/sales.entity";
import { SaleDetail } from "./infrastructure/entity/sale-details.entity";
import { AppDataSource } from "./infrastructure/database/database";
import { setupSwagger } from "./config/swagger";

const PORT = 2226;
const app = express();
const httpServer = createServer(app);
setupSwagger(app);

// Initialize sales repository and service
const salesRepository = new SalesRepository(
  AppDataSource.getRepository(Sale),
  AppDataSource.getRepository(SaleDetail)
);
const salesService = new SalesService(salesRepository);

// Initialize sales controller and routes
const salesController = new SalesController(salesService);
const salesRoutes = new SalesRoutes(salesController);

app.use(express.json());

// API Routes - Only sales
app.use("/api/sales", salesRoutes.getRoutes());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SOA Sales API is running",
    timestamp: new Date().toISOString()
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SOA Sales API running on port ${PORT}`);
  console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
