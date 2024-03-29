import { Component, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { CurrencyService } from './shared/services/currency.service';
import { filter, first } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router,
  
        private toastr: ToastrService,
        private cart: CartService,
        private compare: CompareService,
        private wishlist: WishlistService,
        private zone: NgZone,
        private scroller: ViewportScroller,
        private currency: CurrencyService,
        @Inject(DOCUMENT) private document: Document
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
                    const preloader = document.querySelector('.site-preloader');

                    if (preloader === null) {
                        return;
                    }

                    preloader.addEventListener('transitionend', (event: Event) => {
                        if (event instanceof TransitionEvent && event.propertyName === 'opacity') {
                            preloader.remove();
                        }
                    });
                    preloader.classList.add('site-preloader__fade');

                    // Sometimes, due to unexpected behavior, the browser (in particular Safari) may not play the transition, which leads
                    // to blocking interaction with page elements due to the fact that the preloader is not deleted.
                    // The following block covers this case.
                    if (getComputedStyle(preloader).opacity === '0' && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                });
            });
        }
    }

    ngOnInit(): void {


        // properties of the CurrencyFormatOptions interface fully complies
        // with the arguments of the built-in pipe "currency"
        // https://angular.io/api/common/CurrencyPipe
        this.currency.options = {
            code: 'S/',
            // display: 'symbol',
            // digitsInfo: '1.2-2',
            // locale: 'en-US'
        };

        this.router.events.subscribe((event) => {
            if ((event instanceof NavigationEnd)) {
                this.scroller.scrollToPosition([0, 0]);
            }
        });
        this.cart.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${product.name}" añadida al carrito!`);
        });
        this.compare.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${product.name}" agregado para comparar!`);
        });
        this.wishlist.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${product.name}" añadido a la lista de deseos!`);
        });
    }


}
