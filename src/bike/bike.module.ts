import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';

@Module({
  providers: [
    {
      provide: 'Bikes',
      useClass: BikeService,
    },
  ],
  controllers: [BikeController],
})
export class BikeModule {}
