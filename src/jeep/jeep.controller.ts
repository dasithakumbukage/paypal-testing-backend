import { Controller, Get } from '@nestjs/common';
import { JeepService } from './jeep.service';

@Controller('jeep')
export class JeepController {
  constructor(private jeepService: JeepService) {}

  @Get()
  getHello(): any {
    return this.jeepService.getJeeps(2);
  }
}
