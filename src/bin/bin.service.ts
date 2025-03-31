import { Injectable, Logger } from '@nestjs/common';
import { Bin } from './entities/bin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class BinService {
  private readonly logger = new Logger(BinService.name);

  constructor(
    @InjectRepository(Bin)
    private readonly binRepository: Repository<Bin>,
  ) {}

  async assignBin(entityTransactionManager: EntityManager) {
    // find available bin, for now just return first bin
    this.logger.log('Finding available bin...');
    const bin = await entityTransactionManager.findOne(Bin, {
      where: {},
    });
    if (!bin) {
      throw new Error('No available bin');
    }
    this.logger.log('Found available bin...', bin);
    return bin;
  }

  async findAll() {
    this.logger.log('Finding all bins...');
    const bins = await this.binRepository.find();
    this.logger.log(`Found ${bins.length} bins:`, bins);
    return bins;
  }

  findOne(id: number) {
    return this.binRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.binRepository.delete(id);
  }
}
