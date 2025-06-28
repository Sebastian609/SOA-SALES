import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Sale } from "../infrastructure/entity/sales.entity";
import { SaleDetail } from "../infrastructure/entity/sale-details.entity";
import { IBaseRepository } from "./base-repository.interface";

export class SalesRepository implements IBaseRepository<Sale> {
  public constructor(
    private salesRepository: Repository<Sale>,
    private saleDetailsRepository: Repository<SaleDetail>
  ) {}

  async getPaginated(limit: number, offset: number): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }

    const [data] = await this.salesRepository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: "DESC",
      },
      where: {
        deleted: false,
      },
      relations: ["saleDetails"],
    });
    
    const count = await this.salesRepository.count({
      where: {
        deleted: false,
      },
    });

    const response = {
      sales: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<Sale[]> {
    return this.salesRepository.find({
      relations: ["saleDetails"],
      where: { deleted: false }
    });
  }

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

  async findByCriteria(criteria: Partial<Sale>): Promise<Sale[]> {
    return this.salesRepository.find({ 
      where: { ...criteria, deleted: false },
      relations: ["saleDetails"]
    });
  }

  async create(entity: Sale): Promise<Sale> {
    const sale = this.salesRepository.create(entity);
    return this.salesRepository.save(sale);
  }

  async update(id: number, entity: Partial<Sale>): Promise<Sale> {
    await this.salesRepository.update(id, entity);
    const updatedSale = await this.salesRepository.findOne({
      where: { id },
      relations: ["saleDetails"]
    });
    return updatedSale;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.salesRepository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.salesRepository.update(id, {
      deleted: true,
    });
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.salesRepository.update(id, { deleted: false });
  }

  async count(criteria?: Partial<Sale>): Promise<number> {
    return this.salesRepository.count({ 
      where: { ...criteria, deleted: false } 
    });
  }

  // Métodos específicos para Sales
  async findByUserId(userId: number): Promise<Sale[]> {
    return this.salesRepository.find({ 
      where: { 
        userId: userId, 
        deleted: false 
      },
      relations: ["saleDetails"]
    });
  }

  async findByPartnerId(partnerId: number): Promise<Sale[]> {
    return this.salesRepository.find({ 
      where: { 
        partnerId: partnerId, 
        deleted: false 
      },
      relations: ["saleDetails"]
    });
  }

  async findActiveSales(): Promise<Sale[]> {
    return this.salesRepository.find({ 
      where: { 
        isActive: true, 
        deleted: false 
      },
      relations: ["saleDetails"]
    });
  }

  async findSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.salesRepository.find({
      where: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        } as any,
        deleted: false
      },
      relations: ["saleDetails"]
    });
  }

  // Métodos para SaleDetails
  async createSaleDetail(saleDetail: Partial<SaleDetail>): Promise<SaleDetail> {
    const detail = this.saleDetailsRepository.create(saleDetail);
    return this.saleDetailsRepository.save(detail);
  }

  async updateSaleDetail(id: number, entity: Partial<SaleDetail>): Promise<SaleDetail> {
    await this.saleDetailsRepository.update(id, entity);
    const updatedDetail = await this.saleDetailsRepository.findOne({
      where: { id }
    });
    return updatedDetail;
  }

  async findSaleDetailById(id: number): Promise<SaleDetail> {
    const detail = await this.saleDetailsRepository.findOne({
      where: { id, deleted: false },
      relations: ["sale"]
    });
    if (!detail) {
      throw new Error(`Sale detail with ID ${id} not found`);
    }
    return detail;
  }

  async findSaleDetailsBySaleId(saleId: number): Promise<SaleDetail[]> {
    return this.saleDetailsRepository.find({
      where: { saleId, deleted: false }
    });
  }

  async softDeleteSaleDetail(id: number): Promise<UpdateResult> {
    return this.saleDetailsRepository.update(id, {
      deleted: true,
    });
  }

  async getSalesStatistics(): Promise<any> {
    const totalSales = await this.salesRepository.count({
      where: { deleted: false }
    });

    const activeSales = await this.salesRepository.count({
      where: { isActive: true, deleted: false }
    });

    const totalRevenue = await this.salesRepository
      .createQueryBuilder("sale")
      .select("SUM(sale.totalAmount)", "total")
      .where("sale.deleted = :deleted", { deleted: false })
      .getRawOne();

    const averageSaleAmount = await this.salesRepository
      .createQueryBuilder("sale")
      .select("AVG(sale.totalAmount)", "average")
      .where("sale.deleted = :deleted", { deleted: false })
      .getRawOne();

    return {
      totalSales,
      activeSales,
      totalRevenue: totalRevenue?.total || 0,
      averageSaleAmount: averageSaleAmount?.average || 0
    };
  }
} 