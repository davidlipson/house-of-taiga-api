import { Controller, Get, Param, Delete } from '@nestjs/common';
import { BinService } from './bin.service';

@Controller('bin')
export class BinController {
  constructor(private readonly binService: BinService) {}

  @Get()
  async findAll() {
    return await this.binService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.binService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.binService.remove(+id);
  }
}
