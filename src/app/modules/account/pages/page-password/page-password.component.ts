import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { finalize, takeUntil } from 'rxjs/operators';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { usuario } from '../../../../shared/interfaces/usuario';

@Component({
    selector: 'app-page-password',
    templateUrl: './page-password.component.html',
    styleUrls: ['./page-password.component.sass']
})
export class PagePasswordComponent {
    private destroy$: Subject<void> = new Subject<void>();
    form!: FormGroup;
    saveInProgress = false;
    datousuario: usuario | undefined ;
    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        private api_cliente: ClienteLoginService,
    ) {}

    ngOnInit(): void {
        this.datousuario = this.api_cliente.TraerUsuario();
        this.form = this.fb.group(
            {
                currentPassword: ['', [Validators.required]],
                newPassword: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]],
            },
            {
                validators: [
                    mustMatchValidator('newPassword', 'confirmPassword'),
                ],
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    save(): void {
        this.form.markAllAsTouched();
        if (this.saveInProgress || this.form.invalid) {
            return;
        }
        this.saveInProgress = true;
        this.api_cliente
            .ActualizarContraseniaUsuario(
                this.datousuario?.id_cliente,
                this.form.value.currentPassword,
                this.form.value.newPassword
            ).pipe(
                finalize(() => (this.saveInProgress = false)),
                takeUntil(this.destroy$)
                )
            .subscribe({
                next: (res) => {
                    this.toastr.success(`Contraseña actualizada.`, 'Exito 😊', {
                        timeOut: 5000,
                    });
                },
                error: (error) => {
                    this.toastr.error(`No es su contraseña anterior.`, 'Verficar 🙁!', {
                        timeOut: 5000,
                    });
                }
            });


    }
}
