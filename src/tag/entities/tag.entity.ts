import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToMany(() => Inventory, (inventory) => inventory.tags)
  inventories: Inventory[];
}
