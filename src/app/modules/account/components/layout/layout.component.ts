import { Component } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.sass']
})
export class LayoutComponent {
    links: {label: string; url: string}[] = [
        {label: 'Panel', url: './dashboard'},
        {label: 'Editar perfil', url: './profile'},
        {label: 'Historial de pedidos', url: './orders'},
        // {label: 'Detalles del pedido', url: './orders/5'},
        // {label: 'Direcciones', url: './addresses'},
        // {label: 'Editar dirección', url: './addresses/5'},
        {label: 'Contraseña', url: './password'},
        {label: 'Salir', url: './login'}
    ];

    constructor() { }
}
