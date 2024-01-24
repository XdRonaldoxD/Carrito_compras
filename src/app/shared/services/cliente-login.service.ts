import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class ClienteLoginService {
  api = `${environment.apiredParts}`;
  token = environment.key_token;
  constructor(private httpCliente: HttpClient) { }
  GuardarClienteRegistro($formulario: any): Observable<any> {
    const formData = new FormData();
    formData.append("formulario", JSON.stringify($formulario));
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Cliente&action=GuardarCliente`, formData, { headers: headers });
  }

  LoginCliente($formulario: any): Observable<any> {
    const formData = new FormData();
    formData.append("password_usuario", $formulario.password_usuario);
    formData.append("e_mail_cliente", $formulario.e_mail_cliente);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Cliente&action=LoginCliente`, formData, { headers: headers });
  }
  TraerDepartamentoCliente(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=TraerDepartamentoCliente`, { headers: headers });
  }

  TraerProvinciaCliente(id_departamento: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=TraerProvinciaCliente&id_departamento=${id_departamento}`, { headers: headers });
  }

  TraerDistrito(id_provincia: any): Observable<any> {
    let Params = new HttpParams();
    Params = Params.append('id_provincia', id_provincia);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&controller=NotaVenta&action=TraerDistrito`, { headers: headers, params: Params });
  }

  ActualizarContraseniaUsuario(id_cliente: any, password_anterior: any, password_actual: any) {
    const formData = new FormData();
    formData.append("id_cliente", id_cliente);
    formData.append("password_anterior", password_anterior);
    formData.append("password_actual", password_actual);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Cliente&action=ActualizarPasswordCliente`, formData, { headers: headers });
  }

  GuardarUsuario(usuario: usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  TraerUsuario() {
    let usuario: any = localStorage.getItem('usuario');
    return JSON.parse(usuario);
  }
  GuardarPedido(pedidos_datos: any) {
    localStorage.setItem("pedidos_datos", JSON.stringify(pedidos_datos));
  }
  TraerPedido() {
    let pedidos_datos: any = localStorage.getItem('pedidos_datos');
    return JSON.parse(pedidos_datos);
  }

  listarPedidosCliente(id_cliente: any): Observable<any> {
    let Params = new HttpParams();
    Params = Params.append('id_cliente', id_cliente);
    Params = Params.append('consultaquery', true);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=listarPedidosCliente`, { headers: headers, params: Params });
  }

  TraerPedidoDetalle(id_pedido: any): Observable<any> {
    let Params = new HttpParams();
    Params = Params.append('id_pedido', id_pedido);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=TraerPedidoDetalle`, { headers: headers, params: Params });
  }

  TraerDniApiCliente(Dni_cliente: number) {
    return this.httpCliente.get(`https://dniruc.apisperu.com/api/v1/dni/${Dni_cliente}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNtaXRoeGQxMThAZ21haWwuY29tIn0.24c7XETuRuTQLUqSjOH7BsKM19n6kKMOtY06qeUYX40`);
  }

  EnviarDatosPedidosCliente(Formregistrar: any, Imagen: any, productos: any, totales_productos: any, tipo_pago: any) {
    const formData = new FormData();
    formData.append("formulario", JSON.stringify(Formregistrar));
    formData.append("productos", JSON.stringify(productos));
    formData.append("totales_productos", JSON.stringify(totales_productos));
    formData.append("tipo_pago", tipo_pago);
    if (Imagen) {
      formData.append("Imagen", Imagen, Imagen.name);
    }
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Cliente&action=EnviarDatosPedidosCliente`, formData, { headers: headers });
  }

  correoUsuarioEnUso(e_mail_cliente:string,id_usuario:any=null): Observable<any> {
    let Params = new HttpParams();
    Params = Params.append('e_mail_cliente', e_mail_cliente);
    Params = Params.append('id_usuario', id_usuario);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=correoUsuarioEnUso`, { headers: headers, params: Params });
  }

  validarDNICliente(dni_cliente:string,id_usuario:any=null): Observable<any> {
    let Params = new HttpParams();
    Params = Params.append('dni_cliente', dni_cliente);
    Params = Params.append('id_usuario', id_usuario);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Cliente&action=validarDNICliente`, { headers: headers, params: Params });
  }

  TraerUUID(): Observable<any> {
    let identity = localStorage.getItem('cliente_identificado');
    let UserIdentificado;
    if (identity && identity != 'undefined') {
      UserIdentificado = JSON.parse(identity);
    } else {
      UserIdentificado = null;
    }
    return UserIdentificado;
  }

  saveTiempoExpiracion() {
    let fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + 15);
    localStorage.setItem('tiempo_expiracion', JSON.stringify(fecha.getTime() / 1000));

  }

  saveMensaje(mensaje: string) {
    let mensage: any = localStorage.getItem('mensaje_identificado');
    let mensaje_guardado: any;
    if (mensage) {
      mensaje_guardado = JSON.parse(mensage);
      mensaje_guardado.push(mensaje);
    } else {
      mensaje_guardado = [];
      mensaje_guardado.push(mensaje);
    }
    localStorage.setItem('mensaje_identificado', JSON.stringify(mensaje_guardado));

    return mensaje_guardado;
  }

  CargarMensaje() {
    let mensajes = localStorage.getItem('mensaje_identificado');
    let mensajeIdentificado;
    if (mensajes) {
      mensajeIdentificado = JSON.parse(mensajes);
    } else {
      mensajeIdentificado = null;
    }
    return mensajeIdentificado;
  }

  savenombre_admin(nombre_admin: any) {
    let nombre_adm: any = localStorage.getItem('nombre_admin');
    let admin_guardado: any;
    if (nombre_adm) {
      admin_guardado = JSON.parse(nombre_adm);
      admin_guardado.push(nombre_admin);
    } else {
      admin_guardado = [];
      admin_guardado.push(nombre_admin);
    }
    localStorage.setItem('nombre_admin', JSON.stringify(admin_guardado));

    return admin_guardado;
  }

  //ENVIAMOS LOS ESCRITO DESDE MENSAJE AL API
  EnviarMensajeChatbox(message: any, cliente_identificado: string, mensaje_global: any): Observable<any> {
    const formData = new FormData();
    formData.append('mensaje_texto', message);
    formData.append('cliente_identificado', cliente_identificado);
    formData.append('conversacion', JSON.stringify(mensaje_global));
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Pusher&action=ChatBoxApi`, formData, { headers: headers });
  }

  saveUUID(cliente_identificado: string) {
    localStorage.setItem('cliente_identificado', JSON.stringify(cliente_identificado));
  }
  savenombre_cliente(nombre_cliente: string) {
    localStorage.setItem('nombre_cliente', JSON.stringify(nombre_cliente));
  }

  Traernombre_admin() {
    let mensajes = localStorage.getItem('nombre_admin');
    let admin;
    if (mensajes) {
      admin = JSON.parse(mensajes);
    } else {
      admin = null;
    }
    return admin;
  }

  EnviarDatoChatbox(datos: any, cliente_identificado: string): Observable<any> {
    const formData = new FormData();
    formData.append('nombre_usuario', datos.nombre);
    formData.append('correo_usuario', datos.correo);
    formData.append('telefono_log_chat', datos.telefono);
    formData.append('cliente_identificado', cliente_identificado);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Pusher&action=ChatBoxDatoClienteApi`, formData, { headers: headers });
  }

  ClienteDesconetadoChatbox(cliente_identificado: string): Observable<any> {
    const formData = new FormData();
    formData.append('cliente_identificado', cliente_identificado);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.post(`${this.api}&Apicontroller=Pusher&action=ChatBoxDatoClienteDesconectadoApi`, formData, { headers: headers });
  }

  Traernombre_cliente(): Observable<any> {
    let identity = localStorage.getItem('nombre_cliente');
    let UserIdentificado;
    if (identity && identity != 'undefined') {
      UserIdentificado = JSON.parse(identity);
    } else {
      UserIdentificado = null;
    }
    return UserIdentificado;
  }

  TraerDatosEmpresa(): Observable<any> {
    let Params = new HttpParams();
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const dominio = url.hostname;
    Params = Params.append('dominio_empresa_venta_online', dominio);
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    return this.httpCliente.get(`${this.api}&Apicontroller=Empresa&action=traerDatosEmpresa`, { headers: headers, params: Params });
  }



  






}
