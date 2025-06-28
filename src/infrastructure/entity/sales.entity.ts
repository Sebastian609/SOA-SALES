import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { SaleDetail } from "./sale-details.entity";

@Entity("tbl_sales")
export class Sale {
  @PrimaryGeneratedColumn({ name: "sale_id" })
  id: number;

  @Column({ name: "user_id", nullable: true })
  userId: number;

  @Column({ name: "partner_id", nullable: true })
  partnerId: number;

  @Column({ name: "total_amount", type: "decimal", precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "deleted", default: false })
  deleted: boolean;

  // Relationship with SaleDetail entity
  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  saleDetails: SaleDetail[];
} 