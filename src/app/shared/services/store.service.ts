import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    address = 'Cruz de Cano 101, Hualmay 15137, Peru';
    email = 'lunaabanyovanna@gmail.com';
    phone = ['989 656 783'];
    hours = 'Lunes-Sabado 8:00am - 6:00pm';

    get primaryPhone(): string|null {
        return this.phone.length > 0 ? this.phone[0] : null;
    }

    constructor() { }
}
