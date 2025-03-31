import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { BinService } from './bin.service';
import { BinController } from './bin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bin])],
  controllers: [BinController],
  providers: [BinService],
  exports: [BinService],
})
export class BinModule {}
