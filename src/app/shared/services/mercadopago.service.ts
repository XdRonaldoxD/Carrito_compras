import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  api = `${environment.apiredParts}`;
  token = 'Bearer APP_USR-7035215183567580-122102-a417d9527fc599d500d0e9881447221e-1268863445';
  constructor(private httpCliente: HttpClient) { }
  GenerarUrlMercadoPago($arreglo_mercado_pago: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`https://api.mercadopago.com/checkout/preferences`, JSON.stringify($arreglo_mercado_pago), { headers: headers });
  }
}
