import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  /* orden de servicio */
  api = `${environment.apiredParts}`;
  //token
  token = environment.key_token;
  constructor(private httpCliente: HttpClient) { }

  TraerSlider(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Slider&action=ListarSlider`, { headers: headers });
  }
}
