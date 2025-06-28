import { Request, Response } from "express";
import { CreateSaleDto, UpdateSaleDto, UpdateSaleDetailDto } from "../dto/sales.dto";
import { SalesService } from "../../service/sales.service";
import { plainToInstance } from "class-transformer";

export class SalesController {
  private readonly salesService: SalesService;

  constructor(service: SalesService) {
    this.salesService = service;
  }

  async createSale(req: Request, res: Response) {
    try {
      const data = plainToInstance(CreateSaleDto, req.body, {
        excludeExtraneousValues: true
      });
      const newSale = await this.salesService.createSale(data);
      res.status(201).json(newSale);
    } catch (error) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async updateSale(req: Request, res: Response) {
    try {
      const data: UpdateSaleDto = plainToInstance(UpdateSaleDto, req.body, {
        excludeExtraneousValues: true 
      });
      const updatedSale = await this.salesService.updateSale(data);
      res.status(200).json(updatedSale);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateSaleDetail(req: Request, res: Response) {
    try {
      const data: UpdateSaleDetailDto = plainToInstance(UpdateSaleDetailDto, req.body, {
        excludeExtraneousValues: true 
      });
      const updatedDetail = await this.salesService.updateSaleDetail(data);
      res.status(200).json(updatedDetail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSaleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleId = parseInt(id);
      const sale = await this.salesService.getSaleById(saleId);
      res.status(200).json(sale);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSaleDetailById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detailId = parseInt(id);
      const detail = await this.salesService.getSaleDetailById(detailId);
      res.status(200).json(detail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSaleDetailsBySaleId(req: Request, res: Response) {
    try {
      const { saleId } = req.params;
      const id = parseInt(saleId);
      const details = await this.salesService.getSaleDetailsBySaleId(id);
      res.status(200).json(details);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSalesByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const id = parseInt(userId);
      const sales = await this.salesService.getSalesByUserId(id);
      res.status(200).json(sales);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSalesByPartnerId(req: Request, res: Response) {
    try {
      const { partnerId } = req.params;
      const id = parseInt(partnerId);
      const sales = await this.salesService.getSalesByPartnerId(id);
      res.status(200).json(sales);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getActiveSales(req: Request, res: Response) {
    try {
      const sales = await this.salesService.getActiveSales();
      res.status(200).json(sales);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllSales(req: Request, res: Response) {
    try {
      const sales = await this.salesService.getAllSales();
      res.status(200).json(sales);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const { page, items } = req.query;
      const parsedPage = Number(page) - 1;
      const parsedItems = Number(items);

      if (parsedPage < 0) {
        throw new Error("Page number must be greater than 0");
      }

      const result = await this.salesService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSalesStatistics(req: Request, res: Response) {
    try {
      const statistics = await this.salesService.getSalesStatistics();
      res.status(200).json(statistics);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async softDeleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleId = parseInt(id);
      const result = await this.salesService.softDeleteSale(saleId);
      res.status(200).json({
        message: "Sale deleted successfully",
        result: result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async softDeleteSaleDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detailId = parseInt(id);
      const result = await this.salesService.softDeleteSaleDetail(detailId);
      res.status(200).json({
        message: "Sale detail deleted successfully",
        result: result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async activateSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleId = parseInt(id);
      await this.salesService.activateSale(saleId);
      res.status(200).json({
        message: "Sale activated successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deactivateSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleId = parseInt(id);
      await this.salesService.deactivateSale(saleId);
      res.status(200).json({
        message: "Sale deactivated successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async restoreSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleId = parseInt(id);
      const result = await this.salesService.restoreSale(saleId);
      res.status(200).json({
        message: "Sale restored successfully",
        result: result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
} 