import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RootService } from '../../../../shared/services/root.service';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { usuario } from '../../../../shared/interfaces/usuario';
import { MercadopagoService } from 'src/app/shared/services/mercadopago.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './page-checkout.component.html',
    styleUrls: ['./page-checkout.component.scss']
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
    @ViewChild('CrearCuenta') CrearCuenta: ElementRef | undefined;
    @ViewChild('listaPago') listaPago: ElementRef | undefined;
    private destroy$: Subject<void> = new Subject();
    Departamento_cliente: any = [];
    Provincia_cliente: any = [];
    Formregistrar: FormGroup;
    buscardni = false;
    modalRef: BsModalRef | undefined;
    modalRefSiguiente: BsModalRef | undefined;
    Imagen: File | undefined;
    ImagenTemp: any;
    nombreimagen: string | undefined = 'Seleccione la Imagen';
    saveInProgress: boolean = false;
    cliente: usuario | undefined;
    loginInProgress = false;
    distritos: any = [];
    //CONFIGURACION PARA EL MODAL
    config: ModalOptions = {
        backdrop: 'static',
        keyboard: false,
        animated: true,
        ignoreBackdropClick: true,
        class: 'gray modal-md modal-dialog-centered',

    };
    //
    constructor(
        private fb: FormBuilder,
        public root: RootService,
        public cart: CartService,
        private route: ActivatedRoute,
        private router: Router,
        private api_cliente: ClienteLoginService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private mercadopago: MercadopagoService

    ) {
        this.cliente = api_cliente.TraerUsuario();
        let apellidos_cliente = '';
        if (this.cliente) {
            apellidos_cliente = (this.cliente.apellidopaterno_cliente ?? '') + ' ' + (this.cliente.apellidomaterno_cliente ?? '');
        }
        this.Formregistrar = this.fb.group({
            nombre_cliente: [this.cliente?.nombre_cliente, [Validators.required]],
            apellidos_cliente: [apellidos_cliente, [Validators.required]],
            e_mail_cliente: [this.cliente?.e_mail_cliente, [Validators.required, Validators.email]],
            telefono_cliente: [this.cliente?.telefono_cliente],
            crearcuenta: [false],
            idDepartamento: [(this.cliente?.idDepartamento) ? this.cliente?.idDepartamento : '', [Validators.required]],
            idProvincia: [(this.cliente?.idProvincia) ?  this.cliente?.idProvincia: '', [Validators.required]],
            idDistrito: [(this.cliente?.idDistrito) ? this.cliente?.idDistrito : '' , [Validators.required]],
            celular_cliente: [this.cliente?.celular_cliente, [Validators.required]],
            direccion_cliente: [this.cliente?.direccion_cliente],
            password: [''],
            confirmPassword: [''],
            metodo_pago: [1],
            dni_cliente: [this.cliente?.dni_cliente, [Validators.required]],
            dv_cliente: [this.cliente?.dv_cliente],
            id_cliente: [this.cliente?.id_cliente],
            id_usuario: [this.cliente?.id_usuario],

        },
            { validators: [mustMatchValidator('password', 'confirmPassword')] }
        );
        //LO PONEMOS ESTATICO EL MODAL
        if (this.cliente) {
            this.Departamentos(this.Formregistrar.value.idDepartamento);
            this.SeleccionarProvincia(this.Formregistrar.value.idProvincia);
        } else {
            this.Formregistrar.get('idDepartamento')?.setValue('');
            this.Formregistrar.get('idProvincia')?.setValue('');
        }
    }

    // INICIALIZA EL MODAL
    openModalWithClass(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.config);
    }
    //

    ngOnInit(): void {
        localStorage.removeItem('datos_cliente_compra');
        this.cart.quantity$.pipe(takeUntil(this.destroy$)).subscribe(quantity => {
            if (!quantity) {
                this.router.navigate(['../cart'], { relativeTo: this.route }).then();
            }
        });

        this.api_cliente.TraerDepartamentoCliente().subscribe({
            next: (res) => {
                this.Departamento_cliente = res;
            },
            error: (error) => {
                alert("Error al Cargar el Departamento");
            }
        })
    }




    valideKey(evt: any) {
        var code = (evt.which) ? evt.which : evt.keyCode;
        if (code == 8) { // backspace.
            return true;
        } else if (code >= 48 && code <= 57) { // is a number.
            return true;
        } else { // other keys.
            return false;
        }
    }

    Departamentos(departamento: any) {
        this.api_cliente.TraerProvinciaCliente(departamento).subscribe({
            next: (res) => {
                this.Provincia_cliente = res;
            },
            error: (error) => {
                alert("Error al Cargar las Departamentos");

            }
        })
    }

    SeleccionarProvincia(id_distrito: any) {
        this.api_cliente.TraerDistrito(id_distrito).pipe(takeUntil(this.destroy$)).subscribe({
            next: resp => {
                this.distritos = resp;
            }, error: error => {
                this.Departamento_cliente = [];
                this.toastr.error(`Error verificar el distrito.`, 'Provincia!', {
                    timeOut: 5000,
                });
            }
        });
    }

    BuscarDni() {
        this.buscardni = true;
        this.api_cliente.TraerDniApiCliente(this.Formregistrar.value.dni_cliente).pipe(finalize(() => {
            this.buscardni = false;
        })).subscribe({
            next: (res: any) => {
                this.Formregistrar.get('apellidos_cliente')?.setValue(res.apellidoPaterno + ' ' + res.apellidoMaterno);
                this.Formregistrar.get('nombre_cliente')?.setValue(res.nombres);
                this.Formregistrar.get('dv_cliente')?.setValue(res.codVerifica);
                this.toastr.success(`Se encontro Información.`, 'DNI 😊', {
                    timeOut: 5000,
                });
            },
            error: (error) => {
                this.toastr.error(`No se encontro Información.`, 'DNI! 🙁', {
                    timeOut: 5000,
                });
            }
        })
    }

    mostracontra() {
        if (this.Formregistrar.value.crearcuenta) {
            this.CrearCuenta?.nativeElement.classList.remove('d-none');
            // this.Formregistrar.patchValue({
            //     password: ['123'],
            //     confirmPassword: ['123'],
            // });

        } else {
            this.CrearCuenta?.nativeElement.classList.add('d-none');
            // this.Formregistrar.patchValue({
            //     password: [''],
            //     confirmPassword: [''],
            // });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    Pago1() {
        this.listaPago?.nativeElement.children[0].classList.add('payment-methods__item--active');
        this.listaPago?.nativeElement.children[1].classList.remove('payment-methods__item--active');
        this.listaPago?.nativeElement.children[2].classList.remove('payment-methods__item--active');
    }
    Pago2() {
        this.listaPago?.nativeElement.children[0].classList.remove('payment-methods__item--active');
        this.listaPago?.nativeElement.children[1].classList.add('payment-methods__item--active');
        this.listaPago?.nativeElement.children[2].classList.remove('payment-methods__item--active');


    }
    Pago3() {
        this.listaPago?.nativeElement.children[0].classList.remove('payment-methods__item--active');
        this.listaPago?.nativeElement.children[1].classList.remove('payment-methods__item--active');
        this.listaPago?.nativeElement.children[2].classList.add('payment-methods__item--active');
    }
    GuardarYape(ElementoModalSiguiente: TemplateRef<any>) {
        this.modalRef?.hide();
        this.modalRefSiguiente = this.modalService.show(ElementoModalSiguiente, this.config);
    }
    ProcesarPago() {
        if (this.Formregistrar.value.metodo_pago == 3) {
            this.cart.SaveClienteMercadoPago(this.Formregistrar.value);
            let itemMercadoPago: any = [];
            this.cart.items.forEach(item => {
                let elemento = {
                    "title": item.product.name,
                    "description": '',
                    "picture_url": item.product.images[0],
                    "category_id": "",
                    "quantity": item.quantity,
                    "currency_id": "PEN",
                    "unit_price": item.product.price
                }
                itemMercadoPago.push(elemento);
            });
            let arregloMercadoPago = {
                "items": itemMercadoPago,
                "notification_url": "https://sistemasdurand.com/?Apicontroller=Notificatation&action=NotificarMercadoPago"
                ,
                "payer": {
                    "phone": {},
                    "identification": {},
                    "address": {}
                },
                "payment_methods": {
                    "excluded_payment_methods": [
                        {}
                    ],
                    "excluded_payment_types": [
                        {}
                    ]
                },
                "shipments": {
                    "free_methods": [
                        {}
                    ],
                    "receiver_address": {}
                },
                "back_urls": {
                    "failure": "http://localhost:4200/shop/cart/checkout",
                    "pending": "https://boticas.sistemasdurand.com/",
                    "success": "https://sistemasdurand.com/?Apicontroller=Notificatation&action=SuccessMercadoPago"
                },
                "differential_pricing": {},
                "tracks": [],
                "metadata": {}
            }
            this.mercadopago.GenerarUrlMercadoPago(arregloMercadoPago).subscribe({
                next: (resp) => {
                    console.log(resp);
                    window.location.href = resp.init_point;
                }, error: (error) => {
                    console.log(error);
                }
            })
        } else {
            let total: any = this.cart.total$.source;
            let subtotal: any = this.cart.subtotal$.source;
            let igv: any = this.cart.totals$.source;
            this.saveInProgress = true;
            let totales_productos = {
                subtotal: subtotal._value,
                igv: igv._value[1].price,
                total: total._value
            };

            this.api_cliente.EnviarDatosPedidosCliente(this.Formregistrar.value, this.Imagen, this.cart.items, totales_productos, this.Formregistrar.value.metodo_pago).pipe(finalize(() => {
                this.saveInProgress = false;
                this.loginInProgress = false;
            })).subscribe({
                next: (res: any) => {
                    if (this.Formregistrar.value.metodo_pago == 2) {
                        this.toastr.success(`Imagen valida subido.`, 'Imagen 😊', {
                            timeOut: 5000,
                        });
                    }
                    if (res.respuesta == "ok") {
                        this.toastr.success(`Pedido realizado con exito.`, 'Exitoso ✔️', {
                            timeOut: 5000,
                        });

                        this.api_cliente.GuardarPedido(res);
                        this.router.navigateByUrl("/shop/cart/checkout/success").then();
                    }

                    // this.modalRefSiguiente?.hide();
                },
                error: (error) => {
                    this.toastr.error(`Imagen incorrecta subido.`, 'Imagen 🙁', {
                        timeOut: 5000,
                    });
                }
            })

        }


    }

    EnviarDatosPaga(ElementoModal: TemplateRef<any>) {
        this.Formregistrar.markAllAsTouched()
        if (this.Formregistrar.invalid) {
            return;
        }
        if (this.Formregistrar.value.crearcuenta) {
            if (this.Formregistrar.value.password == "" || this.Formregistrar.value.confirmPassword == '') {
                this.toastr.error(`Verificar contraseña.`, 'Contraseña 🙁', {
                    timeOut: 5000,
                });
                return;
            }
        }
        if (this.Formregistrar.value.metodo_pago !== 2) {
            this.loginInProgress = true;
            this.ProcesarPago();
        } else {
            this.openModalWithClass(ElementoModal);

        }

    }
    DetectarImagen($evento: any) {
        let archivo: File = $evento.target.files[0];
        if (!archivo) {
            this.Imagen = undefined;
            this.nombreimagen = 'Seleccione la Imagen';
            this.ImagenTemp = null;
            return
        }
        this.Imagen = archivo;
        this.nombreimagen = archivo.name;

        let fileReader = new FileReader();
        let ulrimagen = fileReader.readAsDataURL(archivo);
        fileReader.onload = () => {
            this.ImagenTemp = fileReader.result;
        }

    }



}
