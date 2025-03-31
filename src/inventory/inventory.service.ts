import { Injectable, Logger } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import { TagService } from 'src/tag/tag.service';
import { BinService } from 'src/bin/bin.service';
@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private dataSource: DataSource,
    private brandService: BrandService,
    private tagService: TagService,
    private binService: BinService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    await this.inventoryRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const brand = await this.brandService.create(
          { name: createInventoryDto.brand },
          transactionalEntityManager,
        );

        this.logger.log('Brand created or found...', brand);

        // create tags if not exists
        const tags = await Promise.all(
          createInventoryDto.tags.map((tag) =>
            this.tagService.create({ name: tag }, transactionalEntityManager),
          ),
        );

        this.logger.log('Tags created or found...', tags);

        if (tags.length !== createInventoryDto.tags.length) {
          throw new Error('One or more tags not found');
        }

        const assignedBin = await this.binService.assignBin(
          transactionalEntityManager,
        );

        this.logger.log('Bin assigned...', assignedBin);

        const inventory = new Inventory();
        inventory.name = createInventoryDto.name;
        inventory.brand = brand;
        inventory.bin = assignedBin;
        inventory.colour = createInventoryDto.colour;
        inventory.cost = createInventoryDto.cost;
        inventory.quantity = createInventoryDto.quantity;
        inventory.tags = tags;

        this.logger.log('Inventory created...', inventory);

        return await transactionalEntityManager.save(inventory);
      },
    );
  }

  findAll() {
    return this.inventoryRepository.find();
  }

  findOne(id: number) {
    return this.inventoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    // transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // remove associated brand and tags
      const inventory = await this.inventoryRepository.findOne({
        where: { id },
        relations: ['brand', 'tags'],
      });
      if (!inventory) {
        throw new Error('Inventory not found');
      }

      // update inventory
      inventory.name = updateInventoryDto.name || inventory.name;
      inventory.brand = await this.brandService.create({
        name: updateInventoryDto.brand,
      });
      inventory.colour = updateInventoryDto.colour || inventory.colour;
      inventory.cost = updateInventoryDto.cost || inventory.cost;
      inventory.quantity = updateInventoryDto.quantity || inventory.quantity;

      // should save to inventory_tag table
      inventory.tags = await Promise.all(
        updateInventoryDto.tags.map((tag) =>
          this.tagService.create({ name: tag }),
        ),
      );

      await queryRunner.manager.save(inventory);
      await queryRunner.commitTransaction();

      return inventory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.inventoryRepository.delete(id);
  }
}
