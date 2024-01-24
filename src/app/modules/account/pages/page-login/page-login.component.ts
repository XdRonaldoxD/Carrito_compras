import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';


declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit, OnDestroy {
    Formregistrar: FormGroup;
    loginForm: FormGroup;
    Departamento_cliente: any = [];
    Provincia_cliente: any = [];
    distritos: any = [];
    loginInProgress:boolean=false;
    private unsubscribe$ = new Subject<void>();
    constructor(
        private fb: FormBuilder,
        private api_cliente: ClienteLoginService,
        private toastr: ToastrService,
        private route: Router
    ) {
        this.loginForm = this.fb.group({
            e_mail_cliente: ['', [Validators.required, Validators.email]],
            password_usuario: ['', [Validators.required]]
        });
        this.Formregistrar = this.fb.group({
            nombre_cliente: ['', [Validators.required]],
            apellidos_cliente: ['', [Validators.required]],
            e_mail_cliente: ['', [Validators.required, Validators.email],this.CorreoUsuarioEnUso.bind(this)],
            telefono_cliente: [''],
            crearcuenta: [true],
            idDepartamento: ['', [Validators.required]],
            idProvincia: ['', [Validators.required]],
            idDistrito: ['', [Validators.required]],
            celular_cliente: ['', [Validators.required]],
            direccion_cliente: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
            dni_cliente: ['', [Validators.required],this.validarDNICliente.bind(this)]
        },
            { validators: [mustMatchValidator('password', 'confirmPassword')] }
        );
    }

    ngOnInit(): void {
        this.api_cliente.TraerDepartamentoCliente().subscribe({
            next: (res) => {
                this.Departamento_cliente = res;
            },
            error: (error) => {
                alert("Error al Cargar el Departamento");
            }
        })

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });

        $(".digito_veriticador").hover(function () {
            $(".mostrar_imagen").removeClass("d-none");
        }, function () {
            $(".mostrar_imagen").addClass("d-none");

        });
    }
    ngOnDestroy(): void {
        this.unsubscribe$.unsubscribe();
    }

    CorreoUsuarioEnUso(control: AbstractControl): Promise<any> | Observable<any> {
        const response = new Promise((resolve, reject) => {
          this.api_cliente.correoUsuarioEnUso(control.value)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (resp) => {
                if (resp) {
                  resolve({ correoEnUso: true });
                } else {
                  resolve(null);
                }
              },
              error: () => {
                resolve({ correoEnUso: true });
              },
            });
        });
        return response;
      }

    validarDNICliente(control: AbstractControl): Promise<any> | Observable<any> {
        const response = new Promise((resolve, reject) => {
          this.api_cliente
            .validarDNICliente(control.value)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (resp) => {
                if (resp) {
                  resolve({ dniEnUso: true });
                } else {
                  resolve(null);
                }
              },
              error: () => {
                resolve({ dniEnUso: true });
              },
            });
        });
        return response;
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

    GuardarClienteRegistro() {
        this.Formregistrar.markAllAsTouched()
        if (this.Formregistrar.invalid) {
            return;
        }

        this.api_cliente.GuardarClienteRegistro(this.Formregistrar.value).pipe(finalize(() => {
            this.Formregistrar.reset();
            this.route.navigateByUrl("/account/dashboard").then();
        })).subscribe({
            next: (res) => {
                this.toastr.success(`Creado exitosamente.`, 'Cliente!', {
                    timeOut: 5000,
                });
                this.api_cliente.GuardarUsuario(res.datos);
            },
            error: (error) => {
                this.toastr.error(`N° de documento ya existe.`, 'Cliente!', {
                    timeOut: 5000,
                });
            }
        })
    }

    Provincias(departamento: any) {
        this.api_cliente.TraerProvinciaCliente(departamento).subscribe({
            next: (res) => {
                this.Provincia_cliente = res;
            },
            error: (error) => {
                alert("Error al Cargar las provincias");

            }
        })
    }

    SeleccionarProvincia(id_distrito: any) {
        this.api_cliente.TraerDistrito(id_distrito).pipe(takeUntil(this.unsubscribe$)).subscribe({
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

    IngresarCliente() {
        this.loginForm.markAllAsTouched()
        if (this.loginForm.invalid) {
            return;
        }
           this.loginInProgress = true;
        this.api_cliente.LoginCliente(this.loginForm.value).pipe(takeUntil(this.unsubscribe$), finalize(() => {
                 this.loginInProgress = false;
        })).subscribe({
            next: (res) => {
                this.toastr.success(`Bienvenido`, res.nombre_cliente, {
                    timeOut: 5000,
                });
                this.api_cliente.GuardarUsuario(res);
                this.route.navigateByUrl("/account/dashboard").then();
            },
            error: (error) => {
                this.toastr.error(error.error, 'Cliente!', {
                    timeOut: 5000,
                });
            }
        })
    }



}
