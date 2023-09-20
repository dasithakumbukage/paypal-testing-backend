import { Module } from '@nestjs/common';
import { VanController } from './van.controller';
import { VanService } from './van.service';

@Module({
  providers: [
    {
      provide: VanService,
      useClass: VanService,
    },
  ],
  controllers: [VanController],
})
export class VanModule {}
