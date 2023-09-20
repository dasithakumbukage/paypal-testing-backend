import { Injectable } from '@nestjs/common';

@Injectable()
export class VanService {
  private vanArray = [
    { id: 0, name: 'van 0' },
    { id: 1, name: 'van 1' },
    { id: 2, name: 'van 2' },
    { id: 3, name: 'van 3' },
    { id: 4, name: 'van 4' },
  ];

  getVans(id: number) {
    return this.vanArray.filter((van) => van.id === id);
  }
}
