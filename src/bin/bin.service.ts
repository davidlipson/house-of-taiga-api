import { Injectable, Logger } from '@nestjs/common';
import { Bin } from './entities/bin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BinService {
  private readonly logger = new Logger(BinService.name);

  constructor(
    @InjectRepository(Bin)
    private readonly binRepository: Repository<Bin>,
  ) {}

  async assignBin(): Promise<Bin> {
    // find available bin, for now just return first bin
    this.logger.log('Finding available bin...');
    const binId = (await this.binRepository.query(
      'SELECT b.id FROM bin b LEFT JOIN inventory i ON b.id = i."binId" GROUP BY b.id ORDER BY COALESCE(SUM(i.quantity), 0) asc, b.name ASC LIMIT 1',
    )) as { id: number }[];
    if (binId?.length === 0) {
      throw new Error('No available bin');
    }
    const bin = await this.findOne(binId[0].id);
    if (!bin) {
      throw new Error('No available bin');
    }
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
