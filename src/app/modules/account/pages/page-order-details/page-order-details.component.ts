import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { order } from '../../../../../data/account-order-details';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-page-order-details',
    templateUrl: './page-order-details.component.html',
    styleUrls: ['./page-order-details.component.scss']
})
export class PageOrderDetailsComponent implements OnInit {
    order: any = [];
    // order: Order = order;
    mostrar=false;

    constructor(
        protected cliente_api:ClienteLoginService,
        private route: ActivatedRoute

    ) {
        this.route.params.subscribe((parametro) => {
            this.cliente_api.TraerPedidoDetalle(parametro.orderId).pipe(finalize(()=>{
                if (Object.keys(this.order).length > 1) {
                    this.mostrar=true;
                }
            })) .subscribe({
                next: (res)=>{
                    this.order=res;
                  
                }
            })

        });  
     }

     ngOnInit(): void {
   
     }
}
