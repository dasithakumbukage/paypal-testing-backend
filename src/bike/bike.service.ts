import { Injectable } from '@nestjs/common';

@Injectable()
export class BikeService {
  private bikeArray = [
    { id: 0, name: 'bike 0' },
    { id: 1, name: 'bike 1' },
    { id: 2, name: 'bike 2' },
    { id: 3, name: 'bike 3' },
    { id: 4, name: 'bike 4' },
  ];

  getBikes(id: number) {
    return this.bikeArray.filter((bike) => bike.id === id);
  }
}
