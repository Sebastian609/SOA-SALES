// src/database/data-source.ts
import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { Sale } from "../entity/sales.entity";
import { SaleDetail } from "../entity/sale-details.entity";

config(); // Cargar variables del archivo .env

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "SOA",
  synchronize: false, // Cambiar a false en producción
  entities: [Sale, SaleDetail],
  migrations: [],
  subscribers: [],
});

// Inicializar la conexión
AppDataSource.initialize()
  .then(() => console.log("✅ Conexión a la base de datos establecida"))
  .catch((error) => console.log("❌ Error de conexión:", error));
