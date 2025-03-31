import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('color')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  h: number;

  @Column({ type: 'float', nullable: true })
  s: number;

  @Column({ type: 'float', nullable: true })
  v: number;

  @Column({ type: 'float', nullable: true })
  a: number;

  @OneToOne(() => Inventory, (inventory) => inventory.colour)
  @JoinColumn()
  inventory: Inventory;
}
