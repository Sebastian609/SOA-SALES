import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Sale } from "./sales.entity";

@Entity("tbl_sale_details")
export class SaleDetail {
  @PrimaryGeneratedColumn({ name: "sale_detail_id" })
  id: number;

  @Column({ name: "ticket_id", nullable: true })
  ticketId: number;

  @Column({ name: "sale_id", nullable: true })
  saleId: number;

  @Column({ name: "amount", nullable: true })
  amount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "deleted", default: false })
  deleted: boolean;

  // Relationship with Sale entity
  @ManyToOne(() => Sale)
  @JoinColumn({ name: "sale_id" })
  sale: Sale;
} 