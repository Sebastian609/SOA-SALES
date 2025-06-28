import { Router } from "express";
import { SalesController } from "../infrastructure/controller/sales.controller";

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API para la gestión de ventas y sus detalles
 */
export class SalesRoutes {
  private router: Router;
  private controller: SalesController;

  constructor(salesController: SalesController) {
    this.router = Router();
    this.controller = salesController;

    /**
     * @swagger
     * /sales:
     *   post:
     *     summary: Crear una nueva venta con detalles
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
     *       400:
     *         description: Error en la solicitud
     */
    this.router.post("/", this.controller.createSale.bind(this.controller));

    /**
     * @swagger
     * /sales:
     *   put:
     *     summary: Actualizar una venta existente
     *     tags: [Sales]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateSaleDto'
     *     responses:
     *       200:
     *         description: Venta actualizada correctamente
     *       400:
     *         description: Error en la solicitud
     */
    this.router.put("/", this.controller.updateSale.bind(this.controller));

    /**
     * @swagger
     * /sales/details:
     *   put:
     *     summary: Actualizar un detalle de venta
     *     tags: [Sales]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateSaleDetailDto'
     *     responses:
     *       200:
     *         description: Detalle de venta actualizado correctamente
     *       400:
     *         description: Error en la solicitud
     */
    this.router.put("/details", this.controller.updateSaleDetail.bind(this.controller));

    /**
     * @swagger
     * /sales:
     *   get:
     *     summary: Obtener lista paginada de ventas
     *     tags: [Sales]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Página a obtener
     *       - in: query
     *         name: items
     *         schema:
     *           type: integer
     *           example: 10
     *         description: Cantidad de ventas por página
     *     responses:
     *       200:
     *         description: Lista paginada de ventas
     *       400:
     *         description: Error en los parámetros
     */
    this.router.get("/", this.controller.getPaginated.bind(this.controller));

    /**
     * @swagger
     * /sales/all:
     *   get:
     *     summary: Obtener todas las ventas
     *     tags: [Sales]
     *     responses:
     *       200:
     *         description: Lista de todas las ventas
     *       400:
     *         description: Error al obtener las ventas
     */
    this.router.get("/all", this.controller.getAllSales.bind(this.controller));

    /**
     * @swagger
     * /sales/active:
     *   get:
     *     summary: Obtener ventas activas
     *     tags: [Sales]
     *     responses:
     *       200:
     *         description: Lista de ventas activas
     *       400:
     *         description: Error al obtener las ventas
     */
    this.router.get("/active", this.controller.getActiveSales.bind(this.controller));

    /**
     * @swagger
     * /sales/statistics:
     *   get:
     *     summary: Obtener estadísticas de ventas
     *     tags: [Sales]
     *     responses:
     *       200:
     *         description: Estadísticas de ventas
     *       400:
     *         description: Error al obtener estadísticas
     */
    this.router.get("/statistics", this.controller.getSalesStatistics.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}:
     *   get:
     *     summary: Obtener venta por ID
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Venta encontrada
     *       400:
     *         description: Error al obtener la venta
     */
    this.router.get("/:id", this.controller.getSaleById.bind(this.controller));

    /**
     * @swagger
     * /sales/user/{userId}:
     *   get:
     *     summary: Obtener ventas por ID de usuario
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ventas del usuario
     *       400:
     *         description: Error al obtener las ventas
     */
    this.router.get("/user/:userId", this.controller.getSalesByUserId.bind(this.controller));

    /**
     * @swagger
     * /sales/partner/{partnerId}:
     *   get:
     *     summary: Obtener ventas por ID de partner
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: partnerId
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Ventas del partner
     *       400:
     *         description: Error al obtener las ventas
     */
    this.router.get("/partner/:partnerId", this.controller.getSalesByPartnerId.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}/details:
     *   get:
     *     summary: Obtener detalles de una venta
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Detalles de la venta
     *       400:
     *         description: Error al obtener los detalles
     */
    this.router.get("/:saleId/details", this.controller.getSaleDetailsBySaleId.bind(this.controller));

    /**
     * @swagger
     * /sales/details/{id}:
     *   get:
     *     summary: Obtener detalle de venta por ID
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Detalle de venta encontrado
     *       400:
     *         description: Error al obtener el detalle
     */
    this.router.get("/details/:id", this.controller.getSaleDetailById.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}/delete:
     *   delete:
     *     summary: Eliminar una venta (soft delete)
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Venta eliminada correctamente
     *       400:
     *         description: Error al eliminar la venta
     */
    this.router.delete("/:id/delete", this.controller.softDeleteSale.bind(this.controller));

    /**
     * @swagger
     * /sales/details/{id}/delete:
     *   delete:
     *     summary: Eliminar un detalle de venta (soft delete)
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Detalle de venta eliminado correctamente
     *       400:
     *         description: Error al eliminar el detalle
     */
    this.router.delete("/details/:id/delete", this.controller.softDeleteSaleDetail.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}/activate:
     *   post:
     *     summary: Activar una venta
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Venta activada correctamente
     *       400:
     *         description: Error al activar la venta
     */
    this.router.post("/:id/activate", this.controller.activateSale.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}/deactivate:
     *   post:
     *     summary: Desactivar una venta
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Venta desactivada correctamente
     *       400:
     *         description: Error al desactivar la venta
     */
    this.router.post("/:id/deactivate", this.controller.deactivateSale.bind(this.controller));

    /**
     * @swagger
     * /sales/{id}/restore:
     *   post:
     *     summary: Restaurar una venta eliminada
     *     tags: [Sales]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Venta restaurada correctamente
     *       400:
     *         description: Error al restaurar la venta
     */
    this.router.post("/:id/restore", this.controller.restoreSale.bind(this.controller));
  }

  public getRoutes(): Router {
    return this.router;
  }
} 