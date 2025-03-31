import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory/entities/inventory.entity';
import { Bin } from './bin/entities/bin.entity';
import { Tag } from './tag/entities/tag.entity';
import { Brand } from './brand/entities/brand.entity';
import { BinModule } from './bin/bin.module';
import { BrandModule } from './brand/brand.module';
import { TagModule } from './tag/tag.module';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configService.getOrThrow<string>('DATABASE_HOST'),
      port: configService.getOrThrow<number>('DATABASE_PORT'),
      password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
      username: configService.getOrThrow<string>('DATABASE_USER'),
      entities: [Brand, Tag, Bin, Inventory],
      database: configService.getOrThrow<string>('DATABASE_NAME'),
      synchronize: true,
      logging: true,
    }),
    BinModule,
    BrandModule,
    TagModule,
    InventoryModule,
  ],
})
export class AppModule {}
