import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { orders } from '../../../../../data/account-orders';
import { Address } from '../../../../shared/interfaces/address';
import { addresses } from '../../../../../data/account-addresses';
import { usuario } from '../../../../shared/interfaces/usuario';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';

@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.sass']
})
export class PageDashboardComponent {
    address: Address = addresses[0];
    orders: Partial<Order>[] = orders.slice(0, 3);
    cliente: usuario | undefined;

    constructor(
        private api_cliente: ClienteLoginService,

    ) {
        this.cliente = this.api_cliente.TraerUsuario();

     }
}
