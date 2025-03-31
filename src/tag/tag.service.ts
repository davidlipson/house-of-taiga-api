import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTagDto: CreateTagDto,
    transactionalEntityManager?: EntityManager,
  ) {
    this.logger.log('Creating or finding tag...');
    const transaction = transactionalEntityManager || this.dataSource.manager;
    const tag = await transaction.findOneBy(Tag, {
      name: createTagDto.name,
    });
    if (!tag) {
      this.logger.log('Tag not found, creating...');
      return transaction.save(Tag, createTagDto);
    }
    this.logger.log('Tag found, returning...');
    return tag;
  }

  findAll() {
    return this.tagRepository.find();
  }

  findOne(id: number) {
    return this.tagRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
