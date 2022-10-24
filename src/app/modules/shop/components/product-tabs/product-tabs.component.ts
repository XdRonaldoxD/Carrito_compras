import { Component, Input, OnInit } from '@angular/core';
import { ProductFeaturesSection, Product } from '../../../../shared/interfaces/product';
import { specification } from '../../../../../data/shop-product-spec';
import { reviews } from '../../../../../data/shop-product-reviews';
import { Review } from '../../../../shared/interfaces/review';

@Component({
    selector: 'app-product-tabs',
    templateUrl: './product-tabs.component.html',
    styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit {
    @Input() product!: Product;
    @Input() withSidebar = false;
    @Input() tab: 'description' | 'specification' | 'reviews' = 'description';

    specification: ProductFeaturesSection[] = [] //specification;
    reviews: Review[] = reviews;

    constructor() { 
       
    }

    ngOnInit(): void {
      
        // setTimeout(() => {
        // // console.log("aca",this.product.especificaciones);
        // this.specification[0].features = this.product.especificaciones;
        // }, 2500);
     
 
    }
}
