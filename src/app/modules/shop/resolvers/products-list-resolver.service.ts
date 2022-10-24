import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { ProductsList } from '../../../shared/interfaces/list';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { RootService } from '../../../shared/services/root.service';
import { ListOptions, ShopService } from '../../../shared/api/shop.service';
import { ProductosService } from 'src/app/shared/services/productos.service';

export function parseProductsListParams(params: Params): ListOptions {


    const options: ListOptions = {};
    if (params.page) {
        options.page = parseFloat(params.page);
    }
    if (params.limit) {
        options.limit = parseFloat(params.limit);
    }
    if (params.sort) {
        options.sort = params.sort;
    }

    for (const param of Object.keys(params)) {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            continue;
        }

        const filterSlug = mr[1];

        if (!options.filterValues) {
            options.filterValues = {};
        }

        options.filterValues[filterSlug] = params[param];
    }
    return options;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsListResolverService implements Resolve<ProductsList> {
    constructor(
        private root: RootService,
        private router: Router,
        private shop: ShopService,
        private producto: ProductosService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        //SE PUEDE TRAER AL ID_CATEGORIA POR LA RUTA AL IGUAL QUE OKA ->VERIFICAR EN OKA
        const categorySlug = route.params.categorySlug || route.data.categorySlug || null;
        //NOTA EN ESTE CASO SE TRAEMOS LOS DATOS DESDE UN OBSEVABLE Y LOS PASAMOS LOS PARAMETROS
        //PARA QUE CARGUE LA PAGINA CORRECTAMENTE
        //NOTA IMPORTANTE CREAR OTRO RELOSEVER PARA PASARLE LOS DATOS SIN ERRORES (LA FUNCION PASA DATOS )
        // console.log("route.queryParams", route.queryParams);
        let productos = this.producto.TraerListadoShopList(categorySlug).pipe(map(data => {
            let items = data.data_productos;
            const page = 1;
            const limit = 12;
            const total = items.length;
            const pages = Math.ceil(total / limit);
            const start = (page - 1) * limit;
            const end = start + limit;
            items = items.slice(start, end);
            const from = (page - 1) * limit + 1;
            const to = Math.max(Math.min(page * limit, total), from);
            let datos = {
                "items": data.data_productos,
                "page": page,
                "limit": limit,
                "total": total,
                "pages": pages,
                "from": from,
                "to": to,
                "sort": "default",
                "filters": data.filters,
                "filterValues": {}
            }
            console.log(datos);
            return datos;
        }));

        // return this.shop.getProductsList(categorySlug, parseProductsListParams(route.queryParams),this.producto.TraerListadoShopList(categorySlug)).pipe(
        //     catchError(error => {
        //         if (error instanceof HttpErrorResponse && error.status === 404) {
        //             this.router.navigate([this.root.notFound()]).then();
        //         }
        //         return EMPTY;
        //     })
        // )
        return productos;


    }
}
