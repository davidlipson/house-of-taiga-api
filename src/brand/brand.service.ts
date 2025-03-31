import { Injectable, Logger } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    transactionalEntityManager?: EntityManager,
  ) {
    this.logger.log('Creating or finding brand...');
    const transaction = transactionalEntityManager || this.dataSource.manager;
    const brand = await transaction.findOneBy(Brand, {
      name: createBrandDto.name,
    });
    if (!brand) {
      this.logger.log('Brand not found, creating...');
      return transaction.save(Brand, createBrandDto);
    }
    this.logger.log('Brand found, returning...');
    return brand;
  }

  findAll() {
    return this.brandRepository.find();
  }

  findOne(id: number) {
    return this.brandRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.brandRepository.delete(id);
  }
}
