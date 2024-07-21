import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiKey: string = environment.apiGPT;
  private apiUrl: string = 'https://api.openai.com/v1/chat/';

  constructor(private http: HttpClient) { }
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
  }

  sendPrompt(messages: any): Observable<any> {
    const data = {
      model: 'gpt-3.5-turbo', // Cambia esto si estás utilizando otro modelo
      messages: messages,
      top_p:1,//PARAMETROS PARA FILTRAR SIGUIENTE PALABRAS
      frequency_penalty:2, //PERSONALIZA LA FRECUENCIA DE PALABRAS
      presence_penalty:2 //PERSONALIZA LA FRECUENCIA DE PALABRAS
      // max_tokens: 100, // Puedes ajustar el número de tokens que desees
    };

    return this.http.post(`${this.apiUrl}completions`, data, {
      headers: this.getHttpHeaders(),
    });
  }
}
