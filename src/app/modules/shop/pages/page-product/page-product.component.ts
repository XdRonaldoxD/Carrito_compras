import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Observable } from 'rxjs';
import { ProductosService } from '../../../../shared/services/productos.service';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
    relatedProducts$!: Observable<Product[]>;

    product!: Product;
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    producto_relacionado: any = [];
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        private api_producto: ProductosService
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            setTimeout(() => {
                console.log("product", this.product);

            }, 2000);
            this.layout = data.layout || this.layout;
            this.sidebarPosition = data.sidebarPosition || this.sidebarPosition;
            // this.product = data.product;
            this.relatedProducts$ = this.shop.getRelatedProducts(data.product);

        });

        this.route.params.subscribe((parametro) => {
            this.api_producto.GetDatosProductosUrlAmigable(parametro.productSlug).subscribe({
                next: (res) => {
                    this.product = res;
                    this.producto_relacionado =  res.producto_relacionado;
                }
            })

        });
    }
}
