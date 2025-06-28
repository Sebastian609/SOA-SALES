import { SalesService } from "../service/sales.service";
import { SalesRepository } from "../repository/sales.repository";
import { CreateSaleDto, UpdateSaleDto, UpdateSaleDetailDto } from "../infrastructure/dto/sales.dto";

const mockSalesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  findActiveSales: jest.fn(),
  findByUserId: jest.fn(),
  findByPartnerId: jest.fn(),
  createSaleDetail: jest.fn(),
  updateSaleDetail: jest.fn(),
  findSaleDetailById: jest.fn(),
  findSaleDetailsBySaleId: jest.fn(),
  softDeleteSaleDetail: jest.fn(),
  getSalesStatistics: jest.fn(),
  getPaginated: jest.fn(),
  restore: jest.fn(),
};

describe("SalesService", () => {
  let salesService: SalesService;

  beforeEach(() => {
    salesService = new SalesService(mockSalesRepository as any);
  });

  describe("createSale", () => {
    it("should create a sale with details", async () => {
      const createDto: CreateSaleDto = {
        userId: 1,
        partnerId: 1,
        totalAmount: 100.00,
        saleDetails: [
          { ticketId: 1, amount: 50.00 },
          { ticketId: 2, amount: 50.00 }
        ]
      };

      const mockSale = {
        id: 1,
        userId: 1,
        partnerId: 1,
        totalAmount: 100.00,
        isActive: true,
        deleted: false,
        saleDetails: [
          { id: 1, saleId: 1, ticketId: 1, amount: 50.00 },
          { id: 2, saleId: 1, ticketId: 2, amount: 50.00 }
        ]
      };

      mockSalesRepository.create.mockResolvedValue(mockSale);
      mockSalesRepository.findById.mockResolvedValue(mockSale);
      mockSalesRepository.createSaleDetail.mockResolvedValue({});

      const result = await salesService.createSale(createDto);

      expect(result).toEqual(mockSale);
      expect(mockSalesRepository.create).toHaveBeenCalled();
      expect(mockSalesRepository.createSaleDetail).toHaveBeenCalledTimes(2);
    });
  });

  describe("getSaleById", () => {
    it("should return a sale by ID", async () => {
      const mockSale = {
        id: 1,
        userId: 1,
        totalAmount: 100.00,
        saleDetails: []
      };

      mockSalesRepository.findById.mockResolvedValue(mockSale);

      const result = await salesService.getSaleById(1);

      expect(result).toEqual(mockSale);
      expect(mockSalesRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("updateSale", () => {
    it("should update a sale", async () => {
      const updateDto: UpdateSaleDto = {
        id: 1,
        totalAmount: 150.00,
        isActive: true
      };

      const mockUpdatedSale = {
        id: 1,
        totalAmount: 150.00,
        isActive: true
      };

      mockSalesRepository.update.mockResolvedValue(mockUpdatedSale);

      const result = await salesService.updateSale(updateDto);

      expect(result).toEqual(mockUpdatedSale);
      expect(mockSalesRepository.update).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  describe("getSalesStatistics", () => {
    it("should return sales statistics", async () => {
      const mockStats = {
        totalSales: 100,
        activeSales: 95,
        totalRevenue: 5000.00,
        averageSaleAmount: 50.00
      };

      mockSalesRepository.getSalesStatistics.mockResolvedValue(mockStats);

      const result = await salesService.getSalesStatistics();

      expect(result).toEqual(mockStats);
      expect(mockSalesRepository.getSalesStatistics).toHaveBeenCalled();
    });
  });

  describe("softDeleteSale", () => {
    it("should soft delete a sale", async () => {
      const mockSale = { id: 1, deleted: false };
      const mockResult = { affected: 1 };

      mockSalesRepository.findById.mockResolvedValue(mockSale);
      mockSalesRepository.softDelete.mockResolvedValue(mockResult);

      const result = await salesService.softDeleteSale(1);

      expect(result).toEqual(mockResult);
      expect(mockSalesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSalesRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it("should throw error if sale does not exist", async () => {
      mockSalesRepository.findById.mockRejectedValue(new Error("Sale does not exist"));

      await expect(salesService.softDeleteSale(999)).rejects.toThrow("Sale does not exist");
    });
  });

  describe("getPaginated", () => {
    it("should return paginated sales", async () => {
      const mockPaginatedResult = {
        sales: [{ id: 1 }, { id: 2 }],
        count: 2
      };

      mockSalesRepository.getPaginated.mockResolvedValue(mockPaginatedResult);

      const result = await salesService.getPaginated(0, 10);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSalesRepository.getPaginated).toHaveBeenCalledWith(10, 0);
    });

    it("should throw error for invalid pagination parameters", async () => {
      await expect(salesService.getPaginated(-1, 10)).rejects.toThrow("Invalid pagination parameters");
      await expect(salesService.getPaginated(0, 0)).rejects.toThrow("Invalid pagination parameters");
    });
  });
}); 