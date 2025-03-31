import { Injectable, Logger } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { DataSource, In, Like, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import { TagService } from 'src/tag/tag.service';
import { BinService } from 'src/bin/bin.service';
import { FindAllInventoryDto } from './dto/find-all-inventory.dto';
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

  async findAll(findAllDto: FindAllInventoryDto) {
    const tags = findAllDto['tags[]' as keyof FindAllInventoryDto] as
      | string[]
      | string;

    const tagCondition = {
      tags: {
        name: tags ? (Array.isArray(tags) ? In(tags) : tags) : undefined,
      },
    };

    const foundInventory = await this.inventoryRepository.find({
      where: [
        {
          name: findAllDto.query ? Like(`%${findAllDto.query}%`) : undefined,
          ...tagCondition,
        },
        {
          ...tagCondition,
          brand: {
            name: findAllDto.query ? Like(`%${findAllDto.query}%`) : undefined,
          },
        },
      ],
    });

    return await this.inventoryRepository.find({
      relations: ['brand', 'tags', 'bin'],
      where: {
        id: In(foundInventory.map((inventory) => inventory.id)),
      },
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.inventoryRepository.findOne({
      where: { id },
      relations: ['brand', 'tags', 'bin'],
    });
  }

  async update(id: number, updateInventoryDto: CreateInventoryDto) {
    await this.inventoryRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const existingInventory = await this.findOne(id);

        if (!existingInventory) {
          throw new Error('Inventory not found');
        }

        const brand = await this.brandService.create(
          { name: updateInventoryDto.brand },
          transactionalEntityManager,
        );

        this.logger.log('Brand created or found...', brand);

        const tags = await Promise.all(
          updateInventoryDto.tags.map((tag) =>
            this.tagService.create({ name: tag }, transactionalEntityManager),
          ),
        );

        this.logger.log('Tags created or found...', tags);

        if (tags.length !== updateInventoryDto.tags.length) {
          throw new Error('One or more tags not found');
        }

        existingInventory.name = updateInventoryDto.name;
        existingInventory.brand = brand;
        existingInventory.colour = updateInventoryDto.colour;
        existingInventory.cost = updateInventoryDto.cost;
        existingInventory.quantity = updateInventoryDto.quantity;
        existingInventory.tags = tags;

        this.logger.log('Inventory updated...', existingInventory);

        return await transactionalEntityManager.save(existingInventory);
      },
    );
  }

  remove(id: number) {
    return this.inventoryRepository.delete(id);
  }
}
