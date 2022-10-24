import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { orders } from '../../../../../data/account-orders';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';

@Component({
    selector: 'app-page-orders-list',
    templateUrl: './page-orders-list.component.html',
    styleUrls: ['./page-orders-list.component.sass']
})
export class PageOrdersListComponent {
    orders: Partial<Order>[] = orders;
    listarPedido:any=[];
    pageActual: number = 1;
    numrows: any;
    paginas: any;
    constructor(
        private api_cliente: ClienteLoginService,

    ) { 
        let cliente=this.api_cliente.TraerUsuario();
        this.api_cliente.listarPedidosCliente(cliente.id_cliente).subscribe(resp=>{
            this.listarPedido=resp;
            this.limpiar();
        });
     }

    limpiar() {
        this.paginas = 5;
        this.numrows = this.paginas;
      }
      cambio(evento:any) {
        this.numrows = evento.value;
      }
}
