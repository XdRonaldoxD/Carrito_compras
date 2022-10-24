import { Component } from '@angular/core';
import { order } from '../../../../../data/account-order-details';
import { Order } from '../../../../shared/interfaces/order';
import { RootService } from '../../../../shared/services/root.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent {
    order: any ;
    // order: any = [];

    constructor(
        public root: RootService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private api_cliente: ClienteLoginService,


    ) {
        this.order = this.api_cliente.TraerPedido();
        let items:any=[];
        let cantidad=0;
        this.order.datos_detalle_pedido.forEach((element:any) => {
            cantidad+=element.product.quantity;
            let item={
                id: element.product.id,
                slug: element.product.slug,
                name: element.product.name,
                image: element.product.images[0],
                options: [
                    {
                        label: 'Color',
                        value: 'Yellow',
                    },
                    {
                        label: 'Material',
                        value: 'Aluminium',
                    },
                ],
                price: element.product.price,
                quantity: element.quantity,
                total: element.product.price*element.quantity,
            };
            items.push(item);
        });
        this.order = {
            id: this.order.datos_pedido.numero_pedido,
            date: this.order.datos_pedido.fechacreacion_pedido,
            status: 'On hold',
            items: items,
            additionalLines: [
                // {
                //     label: 'Store Credit',
                //     total: -20,
                // },
                {
                    label: 'Shipping',
                    total: 0,
                },
            ],
            quantity:cantidad,
            subtotal: this.order.datos_pedido.valorneto_pedido,
            total: this.order.datos_pedido.valortotal_pedido,
            paymentMethod: 'PayPal',
            shippingAddress: {
                firstName:  this.order.cliente.nombre_cliente,
                lastName: this.order.cliente.apellidopaterno_cliente+''+this.order.cliente.apellidomaterno_cliente,
                email: this.order.cliente.e_mail_cliente,
                phone: this.order.cliente.celular_cliente,
                country: 'Perú',
                city: this.order.cliente.provincia,
                postcode: this.order.cliente.departamento,
                address: this.order.cliente.direccion_cliente,
                
            },
            // billingAddress: {
            //     firstName: 'Jupiter',
            //     lastName: 'Saturnov',
            //     email: 'stroyka@example.com',
            //     phone: 'ZX 971 972-57-26',
            //     country: 'RandomLand',
            //     city: 'MarsGrad',
            //     postcode: '4b4f53',
            //     address: 'Sun Orbit, 43.3241-85.239'
            // },
        };
        console.log(this.order);
    }
}
