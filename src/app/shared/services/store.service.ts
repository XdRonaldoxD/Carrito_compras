import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    address = 'URB. LOS ALISOS Mz.I Lote 4, San Martín de Porres, Peru';
    email = 'stroyka@example.com';
    phone = ['986 504 339'];
    hours = 'Lunes-Sabado 8:00am - 6:00pm';

    get primaryPhone(): string|null {
        return this.phone.length > 0 ? this.phone[0] : null;
    }

    constructor() { }
}
