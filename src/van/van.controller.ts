import { Controller, Get } from '@nestjs/common';
import { VanService } from './van.service';

@Controller('van')
export class VanController {
  constructor(private vanService: VanService) {}

  @Get()
  getHello(): any {
    return this.vanService.getVans(2);
  }
}
