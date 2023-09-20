import { Module } from '@nestjs/common';
import { JeepController } from './jeep.controller';
import { JeepService } from './jeep.service';

const mockJeepsService = {};

@Module({
  providers: [
    {
      provide: JeepService,
      useValue: mockJeepsService,
    },
  ],
  controllers: [JeepController],
})
export class JeepModule {}
