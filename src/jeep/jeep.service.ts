import { Injectable } from '@nestjs/common';

@Injectable()
export class JeepService {
  private jeepArray = [
    { id: 0, name: 'jeep 0' },
    { id: 1, name: 'jeep 1' },
    { id: 2, name: 'jeep 2' },
    { id: 3, name: 'jeep 3' },
    { id: 4, name: 'jeep 4' },
  ];

  getJeeps(id: number) {
    return this.jeepArray.filter((jeep) => jeep.id === id);
  }
}
