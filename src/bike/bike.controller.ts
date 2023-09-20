import { Controller, Get, Inject } from '@nestjs/common';
import { BikeService } from './bike.service';

@Controller('bike')
export class BikeController {
  constructor(@Inject('Bikes') private bikeService: BikeService) {}

  @Get()
  getHello(): any {
    return this.bikeService.getBikes(2);
  }
}
