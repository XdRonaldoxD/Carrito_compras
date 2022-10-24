import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { usuario } from '../../../../shared/interfaces/usuario';
import { Observable } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit {
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
    loginForm: FormGroup;
    mostrardatos = false;
    usuario: usuario | undefined;
    loginInProgress = false;
    constructor(
        private api_cliente: ClienteLoginService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private route: Router

    ) {
        this.loginForm = this.fb.group({
            e_mail_cliente: ['', [Validators.required, Validators.email]],
            password_usuario: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        let obs = new Observable((observer) => {
            let contado = 1;
            let intervalo = setInterval(() => {
                contado += 1;
                observer.next(contado);
                this.usuario = this.api_cliente.TraerUsuario();
                if (this.usuario) {
                    this.mostrardatos = true;
                } else {
                    this.mostrardatos = false;
                }
            }, 1000);
        });
        obs.subscribe(
            (nume) => {
                //Se dispara el next q muestra el numero
                // console.log(nume);
            },
            (error) => {
                console.error("Error", error);
            },
            () => {
                console.log("El observador termino");
            }
        );

    }

    IngresarCliente() {
        this.loginForm.markAllAsTouched()
        if (this.loginForm.invalid) {
            return;
        }
        this.loginInProgress = true;
        this.api_cliente.LoginCliente(this.loginForm.value).pipe(finalize(() => {
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
                this.toastr.error(`Cliente Incorrecto .`, 'Cliente!', {
                    timeOut: 5000,
                });
            }
        })
    }

    SalirSession() {
        localStorage.removeItem('usuario');
    }
}
