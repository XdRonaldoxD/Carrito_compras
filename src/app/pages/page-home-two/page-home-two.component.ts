import { Component, OnDestroy, OnInit } from '@angular/core';
import { posts } from '../../../data/blog-posts';
import { ShopService } from '../../shared/api/shop.service';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { Brand } from '../../shared/interfaces/brand';
import { Product } from '../../shared/interfaces/product';
import { Category } from '../../shared/interfaces/category';
import { BlockHeaderGroup } from '../../shared/interfaces/block-header-group';
import { ProductosService } from '../../shared/services/productos.service';

interface ProductsCarouselGroup extends BlockHeaderGroup {
    products$: Observable<Product[]>;
}

interface ProductsCarouselData {
    abort$: Subject<void>;
    loading: boolean;
    products: Product[];
    groups: ProductsCarouselGroup[];
}

@Component({
    selector: 'app-page-home-two',
    templateUrl: './page-home-two.component.html',
    styleUrls: ['./page-home-two.component.scss']
})
export class PageHomeTwoComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();
    bestsellers$!: any;
    brands$!: Observable<Brand[]>;
    popularCategories$!: Observable<Category[]>;

    columnTopRated$!: Observable<Product[]>;
    columnSpecialOffers$!: Observable<Product[]>;
    columnBestsellers$!: Observable<Product[]>;

    posts = posts;

    featuredProducts!: ProductsCarouselData;
    latestProducts!: ProductsCarouselData;

    constructor(
        private shop: ShopService,
        private ProductoService: ProductosService
    ) { }

    ngOnInit(): void {



        // this.bestsellers$ = this.shop.getBestsellers(7);
        // console.log("lo mas vendidos",this.bestsellers$)
        // return;
        this.brands$ = this.shop.getPopularBrands();
        this.popularCategories$ = this.shop.getCategoriesBySlug([
            'power-tools',
            'hand-tools',
            'machine-tools',
            'power-machinery',
            'measurement',
            'clothes-and-ppe',
        ], 1);
        this.columnTopRated$ = this.shop.getTopRated(3);
        this.columnSpecialOffers$ = this.shop.getSpecialOffers(3);
        this.columnBestsellers$ = this.shop.getBestsellers(3);

        //PRODUCTOS DESCTACATOS---------------------------
        this.featuredProducts = {
            abort$: new Subject<void>(),
            loading: true,
            products: [],
            groups: [
                {
                    name: 'Nuevos',
                    current: true,
                    products$: this.shop.getFeaturedProducts(null, 10),
                }
                ,
                {
                    name: 'Lo mas vendidos',
                    current: false,
                    products$: this.shop.getFeaturedProducts('power-tools', 10),
                },
                // {
                //     name: 'Hand Tools',
                //     current: false,
                //     products$: this.shop.getFeaturedProducts('hand-tools', 10),
                // },
                // {
                //     name: 'Plumbing',
                //     current: false,
                //     products$: this.shop.getFeaturedProducts('plumbing', 10),
                // },
            ],
        };
        this.ProductoService.GetDatosProductos().pipe(finalize(() => {
            // this.groupChange(this.featuredProducts, this.featuredProducts.groups[0]);
            // console.log('featuredProducts',this.featuredProducts);
            this.featuredProducts.loading = false;
        })).subscribe({
            next: (resp) => {
                this.featuredProducts.products = resp;
            },
            error: (error) => {

            }
        })

        //-------------------------------


        this.latestProducts = {
            abort$: new Subject<void>(),
            loading: false,
            products: [],
            groups: [
                {
                    name: 'All',
                    current: true,
                    products$: this.shop.getLatestProducts(null, 8),
                },
                {
                    name: 'Power Tools',
                    current: false,
                    products$: this.shop.getLatestProducts('power-tools', 8),
                },
                {
                    name: 'Hand Tools',
                    current: false,
                    products$: this.shop.getLatestProducts('hand-tools', 8),
                },
                {
                    name: 'Plumbing',
                    current: false,
                    products$: this.shop.getLatestProducts('plumbing', 8),
                },
            ],
        };


        this.groupChange(this.latestProducts, this.latestProducts.groups[0]);

        this.ProductoService.GetDatosProductosMasVendido().pipe(finalize(() => {
        })).subscribe({
            next: (resp) => {
                this.bestsellers$ = resp;
            },
            error: (error) => {

            }
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    groupChange(carousel: ProductsCarouselData, group: BlockHeaderGroup): void {
        carousel.loading = true;
        carousel.abort$.next();
        switch (group.name) {
            case "Nuevos":
                this.ProductoService.GetDatosProductos().pipe(finalize(() => {
                    carousel.loading = false;
                })).subscribe({
                    next: (resp) => {
                        carousel.products = resp;
                    },
                    error: (error) => {
                        alert("Error");
                    }
                });
                break;
            case "Lo mas vendidos":
                this.ProductoService.GetDatosProductosMasVendido().pipe(finalize(() => {
                    carousel.loading = false;
                })).subscribe({
                    next: (resp) => {
                        carousel.products = resp;
                    },
                    error: (error) => {
                        alert("Error");
                    }
                })
                break;
            default:
                (group as ProductsCarouselGroup).products$.pipe(
                    tap(() => carousel.loading = false),
                    takeUntil(merge(this.destroy$, carousel.abort$)),
                ).subscribe(x => carousel.products = x);
                break;
        }

    }
}
