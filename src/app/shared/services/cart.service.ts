import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Product } from '../interfaces/product';
import { CartItem } from '../interfaces/cart-item';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface CartTotal {
    title: string;
    price: number;
    type: 'shipping' | 'fee' | 'tax' | 'other';
}

interface CartData {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    totals: CartTotal[];
    total: number;
    id_producto_color: any;
    id_atributo_producto: any;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private data: CartData = {
        items: [],
        quantity: 0,
        subtotal: 0,
        totals: [],
        total: 0,
        id_producto_color: [],
        id_atributo_producto: []
    };

    private itemsSubject$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.data.items);
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.quantity);
    private subtotalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private totalsSubject$: BehaviorSubject<CartTotal[]> = new BehaviorSubject(this.data.totals);
    private totalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.total);
    private onAddingSubject$: Subject<Product> = new Subject();

    get items(): ReadonlyArray<CartItem> {
        return this.data.items;
    }

    get quantity(): number {
        return this.data.quantity;
    }

    readonly items$: Observable<CartItem[]> = this.itemsSubject$.asObservable();
    readonly quantity$: Observable<number> = this.quantitySubject$.asObservable();
    readonly subtotal$: Observable<number> = this.subtotalSubject$.asObservable();
    readonly totals$: Observable<CartTotal[]> = this.totalsSubject$.asObservable();
    readonly total$: Observable<number> = this.totalSubject$.asObservable();

    readonly onAdding$: Observable<Product> = this.onAddingSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: any
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
            this.calc();
        }
    }

    add(product: Product, quantity: number, options: { name: string; value: string }[] = [], id_producto_color: any = null, id_atributo_producto: any = null): Observable<any> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.onAddingSubject$.next(product);
            let item: any = this.items.find(eachItem => {
                if (eachItem.product.id !== product.id) {
                    return false;
                }
                if (eachItem.options.length) {
                    for (const option of options) {
                        if (!eachItem.options.find(itemOption => itemOption.name === option.name && itemOption.value === option.value)) {
                            return false;
                        }
                    }
                }
                return true;
            });
            if (item) {
                item.quantity += quantity;
                let mismo_atributo = false;
                item.atributo_producto.forEach((element: any) => {
                    if (element.id_producto_color === id_producto_color && element.id_atributo_producto === id_atributo_producto) {
                        element.cantidad += quantity;
                        mismo_atributo = true
                    }
                });
                if (!mismo_atributo) {
                    let atributo_producto = {
                        id_producto_color: id_producto_color,
                        id_atributo_producto: id_atributo_producto,
                        cantidad: quantity
                    }
                    item.atributo_producto.push(atributo_producto)
                }

            } else {
                const atributo_producto = [{
                    id_producto_color: id_producto_color,
                    id_atributo_producto: id_atributo_producto,
                    cantidad: quantity
                }];
                
                item = { product, quantity, options, atributo_producto };
                this.data.items.push(item);
            }

            this.save();
            this.calc();

            return item;
        }));
    }

    update(updates: { item: CartItem, quantity: number }[]): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            updates.forEach(update => {
                const item = this.items.find(eachItem => eachItem === update.item);

                if (item) {
                    item.quantity = update.quantity;
                }
            });

            this.save();
            this.calc();
        }));
    }

    remove(item: CartItem): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.data.items = this.data.items.filter(eachItem => eachItem !== item);

            this.save();
            this.calc();
        }));
    }

    private calc(): void {
        let quantity = 0;
        let subtotal = 0;

        this.data.items.forEach(item => {
            quantity += item.quantity;
            subtotal += item.product.price * item.quantity;
        });

        let base = subtotal / 1.18;
        base = parseFloat(base.toFixed(2));
        console.log(base);
        let igv = subtotal - base;
        const totals: CartTotal[] = [];

        totals.push({
            title: 'Envio',
            price: 0,
            type: 'shipping'
        });
        totals.push({
            title: 'IGV',
            price: igv,
            type: 'tax'
        });
        subtotal = subtotal - igv;
        const total = subtotal + totals.reduce((acc, eachTotal) => acc + eachTotal.price, 0);

        this.data.quantity = quantity;
        this.data.subtotal = subtotal;
        this.data.totals = totals;
        this.data.total = total;

        this.itemsSubject$.next(this.data.items);
        this.quantitySubject$.next(this.data.quantity);
        this.subtotalSubject$.next(this.data.subtotal);
        this.totalsSubject$.next(this.data.totals);
        this.totalSubject$.next(this.data.total);
    }

    private save(): void {
        localStorage.setItem('cartItems', JSON.stringify(this.data.items));
    }

    private load(): void {
        const items = localStorage.getItem('cartItems');

        if (items) {
            this.data.items = JSON.parse(items);
        }
    }
}
