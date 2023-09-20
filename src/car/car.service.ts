import { Injectable } from '@nestjs/common';

@Injectable()
export class CarService {
  private carArray = [
    { id: 0, name: 'toyota' },
    { id: 1, name: 'corolla' },
    { id: 2, name: 'alto' },
    { id: 3, name: 'nissan' },
    { id: 4, name: 'sunny' },
  ];

  getCars(id: number) {
    return this.carArray.filter((car) => car.id === id);
  }
}
