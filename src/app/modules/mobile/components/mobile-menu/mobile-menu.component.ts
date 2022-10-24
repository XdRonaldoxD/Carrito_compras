import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { mobileMenu } from '../../../../../data/mobile-menu';
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';
import { ProductosService } from '../../../../shared/services/productos.service';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnDestroy, OnInit {
    private destroy$: Subject<any> = new Subject();

    isOpen = false;
    links: any[] = [];

    constructor(
        public mobilemenu: MobileMenuService,
        private producto:ProductosService
        ) { }

    ngOnInit(): void {
        this.mobilemenu.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => this.isOpen = isOpen);
        this.producto.MegaMenuProductosMobile().subscribe(respuesta=>{
            this.links=respuesta;
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onItemClick(event: MobileMenuItem): void {
        if (event.type === 'link') {
            this.mobilemenu.close();
        }

        // if (event.data && event.data.language) {
        //     console.log(event.data.language); // change language
        // }
    }
}
