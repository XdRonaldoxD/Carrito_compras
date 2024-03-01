import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Observable, Subject } from 'rxjs';
import { ProductosService } from '../../../../shared/services/productos.service';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit,OnDestroy,AfterViewInit {
    relatedProducts$!: Observable<Product[]>;
    private destroy$: Subject<void> = new Subject<void>();
    product!: Product;
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    producto_relacionado: any = [];
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        private api_producto: ProductosService
    ) { }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
    ngOnInit(): void {
        this.route.data.subscribe(data => {
   
            this.layout = data.layout || this.layout;
            this.sidebarPosition = data.sidebarPosition || this.sidebarPosition;
            // this.product = data.product;
            this.relatedProducts$ = this.shop.getRelatedProducts(data.product);

        });

   

    }
    ngAfterViewInit(): void {
        this.route.params.pipe(
            switchMap((parametro) => this.api_producto.GetDatosProductosUrlAmigable(parametro.productSlug))
        ).subscribe({
            next: (res) => {
                this.product = res;
                this.producto_relacionado = res.producto_relacionado;
            }
        });
    }
}
