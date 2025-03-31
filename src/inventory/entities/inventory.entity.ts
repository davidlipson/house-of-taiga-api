import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Bin } from '../../bin/entities/bin.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
// unique name per brand
@Unique(['name', 'brand'])
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.id)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @ManyToOne(() => Bin, (bin) => bin.id)
  @JoinColumn({ name: 'binId' })
  bin: Bin;

  @Column({ type: 'varchar', length: 30, nullable: true })
  colour?: string;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToMany(() => Tag, (tag) => tag.id)
  @JoinTable({ name: 'inventoryTag' })
  tags: Tag[];

  // file url
  @Column({ type: 'varchar', length: 255, nullable: true })
  fileUrl?: string;
}
