import { Sale } from "../infrastructure/entity/sales.entity";
import { SaleDetail } from "../infrastructure/entity/sale-details.entity";
import { SalesRepository } from "../repository/sales.repository";
import { CreateSaleDto, UpdateSaleDto, UpdateSaleDetailDto } from "../infrastructure/dto/sales.dto";
import { plainToInstance } from "class-transformer";

export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  /**
   * Get all Sales
   */
  async getAllSales(): Promise<Sale[]> {
    return this.salesRepository.findAll();
  }

  /**
   * Get active Sales only
   */
  async getActiveSales(): Promise<Sale[]> {
    return this.salesRepository.findActiveSales();
  }

  /**
   * Get Sale by ID
   * @param id Sale ID
   */
  async getSaleById(id: number): Promise<Sale> {
    return this.salesRepository.findById(id);
  }

  /**
   * Get Sales by user ID
   * @param userId User ID
   */
  async getSalesByUserId(userId: number): Promise<Sale[]> {
    return this.salesRepository.findByUserId(userId);
  }

  /**
   * Get Sales by partner ID
   * @param partnerId Partner ID
   */
  async getSalesByPartnerId(partnerId: number): Promise<Sale[]> {
    return this.salesRepository.findByPartnerId(partnerId);
  }

  /**
   * Get Sales by date range
   * @param startDate Start date
   * @param endDate End date
   */
  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.salesRepository.findSalesByDateRange(startDate, endDate);
  }

  /**
   * Create a new Sale with details
   * @param saleData Sale data with details
   */
  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const sale = plainToInstance(Sale, {
      userId: saleData.userId,
      partnerId: saleData.partnerId,
      totalAmount: saleData.totalAmount,
      isActive: true,
      deleted: false
    });
    
    // Create the sale first
    const createdSale = await this.salesRepository.create(sale);
    
    // Create sale details
    if (saleData.saleDetails && saleData.saleDetails.length > 0) {
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
    
    // Return the complete sale with details
    return this.salesRepository.findById(createdSale.id);
  }

  /**
   * Update a sale
   * @param saleData Sale data to update
   */
  async updateSale(saleData: UpdateSaleDto): Promise<Sale> {
    const sale = plainToInstance(Sale, saleData);
    return this.salesRepository.update(saleData.id, sale);
  }

  /**
   * Update a sale detail
   * @param detailData Sale detail data to update
   */
  async updateSaleDetail(detailData: UpdateSaleDetailDto): Promise<SaleDetail> {
    const detail = plainToInstance(SaleDetail, detailData);
    return this.salesRepository.updateSaleDetail(detailData.id, detail);
  }

  /**
   * Get sale detail by ID
   * @param id Sale detail ID
   */
  async getSaleDetailById(id: number): Promise<SaleDetail> {
    return this.salesRepository.findSaleDetailById(id);
  }

  /**
   * Get sale details by sale ID
   * @param saleId Sale ID
   */
  async getSaleDetailsBySaleId(saleId: number): Promise<SaleDetail[]> {
    return this.salesRepository.findSaleDetailsBySaleId(saleId);
  }

  /**
   * Soft delete a sale
   * @param id Sale ID
   */
  async softDeleteSale(id: number): Promise<any> {
    const exists = await this.salesRepository.findById(id);
    if (!exists) {
      throw new Error("Sale does not exist");
    }
    return await this.salesRepository.softDelete(id);
  }

  /**
   * Soft delete a sale detail
   * @param id Sale detail ID
   */
  async softDeleteSaleDetail(id: number): Promise<any> {
    const exists = await this.salesRepository.findSaleDetailById(id);
    if (!exists) {
      throw new Error("Sale detail does not exist");
    }
    return await this.salesRepository.softDeleteSaleDetail(id);
  }

  /**
   * Activate a sale
   * @param id Sale ID
   */
  async activateSale(id: number): Promise<void> {
    await this.salesRepository.findById(id); // Verify sale exists
    await this.salesRepository.update(id, { isActive: true });
  }

  /**
   * Deactivate a sale
   * @param id Sale ID
   */
  async deactivateSale(id: number): Promise<void> {
    await this.salesRepository.findById(id); // Verify sale exists
    await this.salesRepository.update(id, { isActive: false });
  }

  /**
   * Get paginated sales
   * @param page Page number
   * @param itemsPerPage Items per page
   */
  async getPaginated(page: number, itemsPerPage: number): Promise<any> {
    if (page < 0 || itemsPerPage < 1) {
      throw new Error("Invalid pagination parameters");
    }

    const offset = page * itemsPerPage;
    return this.salesRepository.getPaginated(itemsPerPage, offset);
  }

  /**
   * Get sales statistics
   */
  async getSalesStatistics(): Promise<any> {
    return this.salesRepository.getSalesStatistics();
  }

  /**
   * Restore a deleted sale
   * @param id Sale ID
   */
  async restoreSale(id: number): Promise<any> {
    const exists = await this.salesRepository.findById(id);
    if (!exists) {
      throw new Error("Sale does not exist");
    }
    return await this.salesRepository.restore(id);
  }
} 