import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteLoginService } from '../../../../shared/services/cliente-login.service';
import { usuario } from '../../../../shared/interfaces/usuario';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.sass']
})
export class PageProfileComponent implements OnInit {
    Formregistrar: FormGroup;
    cliente: usuario | undefined;
    Departamento_cliente: any = [];
    Provincia_cliente: any = [];
    registerInProgress = false;

    constructor(
        private fb: FormBuilder,
        private api_cliente: ClienteLoginService,
        private toastr: ToastrService
    ) {
        this.cliente = this.api_cliente.TraerUsuario();
        this.Formregistrar = this.fb.group({
            id_cliente: [this.cliente?.id_cliente],
            nombre_cliente: [this.cliente?.nombre_cliente, [Validators.required]],
            apellidos_cliente: [this.cliente?.apellidopaterno_cliente + ' ' + this.cliente?.apellidomaterno_cliente, [Validators.required]],
            e_mail_cliente: [this.cliente?.e_mail_cliente, [Validators.required, Validators.email]],
            telefono_cliente: [this.cliente?.telefono_cliente],
            crearcuenta: [true],
            idDepartamento: [this.cliente?.idDepartamento, [Validators.required]],
            idProvincia: [this.cliente?.idProvincia, [Validators.required]],
            celular_cliente: [this.cliente?.celular_cliente, [Validators.required]],
            direccion_cliente: [this.cliente?.direccion_cliente, [Validators.required]],
            dni_cliente: [this.cliente?.dni_cliente, [Validators.required]],
            dv_cliente: [this.cliente?.dv_cliente, [Validators.required]]
        }

        );
    }

    ngOnInit(): void {
        this.api_cliente.TraerDepartamentoCliente().pipe(finalize(() => {
            // this.Formregistrar.get('idProvincia')?.setValue(this.cliente?.idProvincia);
            this.Provincias(this.cliente?.idDepartamento);
        })).subscribe({
            next: (res) => {
                this.Departamento_cliente = res;
            },
            error: (error) => {
                alert("Error al Cargar el Departamento");
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
    ActualizarClienteRegistro() {
        this.Formregistrar.markAllAsTouched()
        if (this.Formregistrar.invalid) {
            return;
        }
        this.registerInProgress = true;
        this.api_cliente.GuardarClienteRegistro(this.Formregistrar.value).pipe(finalize(() => {
            this.toastr.success(`Actualizado exitosamente.`, 'Cliente!', {
                timeOut: 5000,
            });
            this.registerInProgress = false;

        })).subscribe({
            next: (res) => {
                this.api_cliente.GuardarUsuario(res.datos);
            },
            error: (error) => {
                this.toastr.error(`N° de documento ya existe.`, 'Cliente!', {
                    timeOut: 5000,
                });
            }
        })
    }


}
