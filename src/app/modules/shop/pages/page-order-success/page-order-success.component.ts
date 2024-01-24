import { Component, OnDestroy } from '@angular/core';
import { order } from '../../../../../data/account-order-details';
import { Order } from '../../../../shared/interfaces/order';
import { RootService } from '../../../../shared/services/root.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent implements OnDestroy{
    order: any=null;
    // order: any = [];
    Formregistrar: any;
    Unsuscribe: any = new Subject();

    constructor(
        public root: RootService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private api_cliente: ClienteLoginService,
        public cart: CartService

    ) {
        this.order = this.api_cliente.TraerPedido();
        if (this.order) {
            let items: any = [];
            let cantidad = 0;
            this.order.datos_detalle_pedido.forEach((element: any) => {
                cantidad += element.product.quantity;
                let item = {
                    id: element.product.id,
                    slug: element.product.slug,
                    name: element.product.name,
                    image: element.product.images[0],
                    options: element.options,
                    price: element.product.price,
                    quantity: element.quantity,
                    total: element.product.price * element.quantity,
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
                quantity: cantidad,
                subtotal: this.order.datos_pedido.valorneto_pedido,
                total: this.order.datos_pedido.valortotal_pedido,
                paymentMethod: 'PayPal',
                shippingAddress: {
                    firstName: this.order.cliente.nombre_cliente,
                    lastName: this.order.cliente.apellidopaterno_cliente + '' + this.order.cliente.apellidomaterno_cliente,
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
        } else {
            this.Formregistrar = this.cart.ObtenerClienteMercadoPago();
            let total: any = this.cart.total$.source;
            let subtotal: any = this.cart.subtotal$.source;
            let igv: any = this.cart.totals$.source;
            let totales_productos = {
                subtotal: subtotal._value,
                igv: igv._value[1].price,
                total: total._value
            };
            let items: any = [];
            this.api_cliente.EnviarDatosPedidosCliente(this.Formregistrar, null, this.cart.items, totales_productos, this.Formregistrar.metodo_pago).pipe(takeUntil(this.Unsuscribe)).subscribe({
                next: (res: any) => {
                    if (res.respuesta == "ok") {
                        this.toastr.success(`Pedido realizado con exito.`, 'Exitoso ✔️', {
                            timeOut: 5000,
                        });
                        let cantidad = 0;
                        res.datos_detalle_pedido.forEach((element: any) => {
                            cantidad += element.product.quantity;
                            let item = {
                                id: element.product.id,
                                slug: element.product.slug,
                                name: element.product.name,
                                image: element.product.images[0],
                                options: element.options,
                                price: element.product.price,
                                quantity: element.quantity,
                                total: element.product.price * element.quantity,
                            };
                            items.push(item);
                        });

                        this.order = {
                            id: res.datos_pedido.numero_pedido,
                            date: res.datos_pedido.fechacreacion_pedido,
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
                            quantity: cantidad,
                            subtotal: res.datos_pedido.valorneto_pedido,
                            total: res.datos_pedido.valortotal_pedido,
                            paymentMethod: 'Tarjeta De Crédito',
                            shippingAddress: {
                                firstName: res.cliente.nombre_cliente,
                                lastName: res.cliente.apellidopaterno_cliente + '' + res.cliente.apellidomaterno_cliente,
                                email: res.cliente.e_mail_cliente,
                                phone: res.cliente.celular_cliente,
                                country: 'Perú',
                                city: res.cliente.provincia,
                                postcode: res.cliente.departamento,
                                address: res.cliente.direccion_cliente,
                            },
                     
                        };
                    }

                },
                error: (error) => {
                    this.toastr.error(`Imagen incorrecta subido.`, 'Imagen 🙁', {
                        timeOut: 5000,
                    });
                }
            })
        }


    }

    ngOnDestroy(): void {
        this.Unsuscribe.unsubscribe();
      }
}
