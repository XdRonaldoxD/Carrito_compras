import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { orders } from '../../../../../data/account-orders';
import { Address } from '../../../../shared/interfaces/address';
import { addresses } from '../../../../../data/account-addresses';
import { usuario } from '../../../../shared/interfaces/usuario';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.sass']
})
export class PageDashboardComponent {
    address: Address = addresses[0];
    orders: Partial<Order>[] = [];
    cliente: usuario | undefined;
    onDestroy = new Subject<void>();
    constructor(
        private api_cliente: ClienteLoginService,
        private toastr: ToastrService
    ) {
        this.cliente = this.api_cliente.TraerUsuario();
        this.api_cliente.traerlimitePedidoCliente(this.cliente?.id_cliente,3).pipe(takeUntil(this.onDestroy)) .subscribe({
            next: (res)=>{
                this.orders=res;
            },
            error: (err) => {
                this.handleError(err);
            }
        })

     }
     private handleError(error: any): void {
        this.toastr.error(`Error verificar el distrito.`, 'Provincia!', {
            timeOut: 5000,
        });
    }
}
