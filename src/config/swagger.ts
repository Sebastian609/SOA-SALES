import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from 'dotenv';
dotenv.config();

import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SOA Sales API - Sistema de Gestión de Ventas",
      version: "1.0.0",
      description: "API para la gestión completa de ventas y sus detalles",
    },
    components: {
      schemas: {
        // Sale DTOs
        CreateSaleDetailDto: {
          type: "object",
          required: ["amount"],
          properties: {
            ticketId: { type: "integer", example: 1, description: "ID del ticket asociado (opcional)" },
            amount: { type: "number", example: 25.50, description: "Monto del detalle de venta" },
          },
        },
        CreateSaleDto: {
          type: "object",
          required: ["totalAmount", "saleDetails"],
          properties: {
            userId: { type: "integer", example: 1, description: "ID del usuario (opcional)" },
            partnerId: { type: "integer", example: 1, description: "ID del partner (opcional)" },
            totalAmount: { type: "number", example: 100.00, description: "Monto total de la venta" },
            saleDetails: { 
              type: "array", 
              items: { $ref: "#/components/schemas/CreateSaleDetailDto" },
              description: "Lista de detalles de la venta"
            },
          },
        },
        UpdateSaleDto: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", example: 1, description: "ID de la venta" },
            userId: { type: "integer", example: 1, description: "ID del usuario" },
            partnerId: { type: "integer", example: 1, description: "ID del partner" },
            totalAmount: { type: "number", example: 100.00, description: "Monto total de la venta" },
            isActive: { type: "boolean", example: true, description: "Indica si la venta está activa" },
          },
        },
        UpdateSaleDetailDto: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", example: 1, description: "ID del detalle de venta" },
            ticketId: { type: "integer", example: 1, description: "ID del ticket asociado" },
            amount: { type: "number", example: 25.50, description: "Monto del detalle de venta" },
            isActive: { type: "boolean", example: true, description: "Indica si el detalle está activo" },
          },
        },
        // Sale Entity
        Sale: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID único de la venta" },
            userId: { type: "integer", example: 1, description: "ID del usuario" },
            partnerId: { type: "integer", example: 1, description: "ID del partner" },
            totalAmount: { type: "number", example: 100.00, description: "Monto total de la venta" },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de creación de la venta" },
            updatedAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de última actualización" },
            isActive: { type: "boolean", example: true, description: "Indica si la venta está activa" },
            deleted: { type: "boolean", example: false, description: "Indica si la venta está eliminada (soft delete)" },
            saleDetails: { 
              type: "array", 
              items: { $ref: "#/components/schemas/SaleDetail" },
              description: "Detalles de la venta"
            },
          },
        },
        // Sale Detail Entity
        SaleDetail: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID único del detalle de venta" },
            saleId: { type: "integer", example: 1, description: "ID de la venta" },
            ticketId: { type: "integer", example: 1, description: "ID del ticket asociado" },
            amount: { type: "number", example: 25.50, description: "Monto del detalle" },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de creación del detalle" },
            updatedAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z", description: "Fecha de última actualización" },
            isActive: { type: "boolean", example: true, description: "Indica si el detalle está activo" },
            deleted: { type: "boolean", example: false, description: "Indica si el detalle está eliminado (soft delete)" },
          },
        },
        // Sales Statistics
        SalesStatistics: {
          type: "object",
          properties: {
            totalSales: { type: "integer", example: 1000, description: "Total de ventas" },
            activeSales: { type: "integer", example: 950, description: "Ventas activas" },
            totalRevenue: { type: "number", example: 50000.00, description: "Ingresos totales" },
            averageSaleAmount: { type: "number", example: 50.00, description: "Monto promedio por venta" },
          },
        },
        // Error Response
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error description", description: "Descripción del error" },
          },
        },
        // Success Response
        SuccessResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation completed successfully", description: "Mensaje de éxito" },
            data: { type: "object", description: "Datos de la respuesta" },
          },
        },
      },
    },
    servers: [
      {
         url: process.env.SWAGGER_SERVER_URL || 'http://localhost:2226/api',
      },
    ],
  },
  apis: ["src/routes/*.ts"], // debe apuntar a donde están tus rutas
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
