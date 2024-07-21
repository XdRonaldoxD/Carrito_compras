import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  /* orden de servicio */
  api = `${environment.apiredParts}`;
  //token
  token = environment.key_token;
  constructor(private httpCliente: HttpClient) { }
  GetDatosProductos(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=listarProductos`, { headers: headers });
  }

  GetDatosProductosUrlAmigable(parametro:any): Observable<any> {
    const formData=new FormData();
    formData.append("urlamigable_producto",parametro);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Producto&action=TraerProductoSlug`, formData,{ headers: headers });
  }

  GetDatosProductosMasVendido(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=ProductosVendidoOferta&eloquent=${true}&limit=20`,{headers:headers});
  }

  MegaMenuProductos(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=MegaMenuProductos&eloquent=${true}`,{headers:headers});
  }

  TodasCategoriaPadre(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=TodasCategoriaPadre&eloquent=${true}`,{headers:headers});
  }

  FiltrarProductoCategoria(category:any,query:any): Observable<any> {
    const formData=new FormData();
    formData.append("id_categoria",category);
    formData.append("query",query);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Producto&action=FiltrarProductoCategoria&eloquent=${true}`,formData,{headers:headers});
  }

  MegaMenuProductosMobile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=MegaMenuProductosMobile&eloquent=${true}`,{headers:headers});
  }

  TraerListadoShopList(urlamigable_categoria:any): Observable<any>{
    let Params = new HttpParams();
    Params = Params.append('urlamigable_categoria', urlamigable_categoria);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=ListarCategoriaProductoApi`,{headers:headers,params: Params});
  }

  CategoriaPopulares(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=CategoriaPopulares`,{headers:headers});
  }

  traerDatosInicialProducto(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Producto&action=traerDatosInicialProducto`,{headers:headers});
  }

}
