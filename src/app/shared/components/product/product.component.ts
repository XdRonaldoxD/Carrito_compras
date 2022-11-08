import { Component, Inject, Input, PLATFORM_ID, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { RootService } from '../../services/root.service';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ToastrService } from 'ngx-toastr';

export type ProductLayout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent {
    @Input() layout: ProductLayout = 'standard';

    @Input() product?: Product;

    quantity: FormControl = new FormControl(1);

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    id_producto_color: string = '';
    id_atributo_producto: string = '';
    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cart: CartService,
        private wishlist: WishlistService,
        private compare: CompareService,
        public root: RootService,
        private route: ActivatedRoute,
        private api_producto: ProductosService,
        private toastr: ToastrService,

    ) {
    
    }



    addToCart(): void {
        let id_producto_color=this.id_producto_color;
        let id_atributo_producto=this.id_atributo_producto;
        console.log(this.id_atributo_producto);
        if (this.id_producto_color == "") {
            this.toastr.error(`Debe seleccionar el color del producto.`, 'Color!', {
                timeOut: 5000,
            });
            return;
        }
        if (this.id_atributo_producto == "") {
            this.toastr.error(`Debe seleccionar la talla del producto.`, 'Talla!', {
                timeOut: 5000,
            });
            return;
        }
        if (!this.addingToCart && this.product && this.quantity.value > 0) {
            this.addingToCart = true;
          
            this.cart.add(this.product, this.quantity.value,[],id_producto_color,id_atributo_producto).subscribe({ complete: () => this.addingToCart = false });
        }
    }

    addToWishlist(): void {

        if (!this.addingToWishlist && this.product) {
            this.addingToWishlist = true;

            this.wishlist.add(this.product).subscribe({ complete: () => this.addingToWishlist = false });
        }
    }

    addToCompare(): void {
        if (!this.addingToCompare && this.product) {

            this.addingToCompare = true;
            this.compare.add(this.product).subscribe({ complete: () => this.addingToCompare = false });
        }
    }
}
