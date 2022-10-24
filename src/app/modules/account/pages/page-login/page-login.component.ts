import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit {
    Formregistrar: FormGroup;
    loginForm: FormGroup;
    Departamento_cliente: any = [];
    Provincia_cliente: any = [];
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
            e_mail_cliente: ['', [Validators.required, Validators.email]],
            telefono_cliente: [''],
            crearcuenta: [true],
            idDepartamento: ['', [Validators.required]],
            idProvincia: ['', [Validators.required]],
            celular_cliente: ['', [Validators.required]],
            direccion_cliente: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
            dni_cliente: ['', [Validators.required]],
            dv_cliente: ['', [Validators.required]]
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

    IngresarCliente() {
        this.loginForm.markAllAsTouched()
        if (this.loginForm.invalid) {
            return;
        }
        this.api_cliente.LoginCliente(this.loginForm.value).pipe(finalize(() => {
            this.route.navigateByUrl("/account/dashboard").then();
        })).subscribe({
            next: (res) => {
                this.toastr.success(`Bienvenido`, res.nombre_cliente, {
                    timeOut: 5000,
                });
                this.api_cliente.GuardarUsuario(res);
            },
            error: (error) => {
                this.toastr.error(`Usuario Incorrecto .`, 'Cliente!', {
                    timeOut: 5000,
                });
            }
        })
    }



}
