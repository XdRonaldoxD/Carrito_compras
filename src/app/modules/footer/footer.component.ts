import { Component, OnInit } from '@angular/core';
import { theme } from '../../../data/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ClienteLoginService } from '../../shared/services/cliente-login.service';
import { OpenaiService } from 'src/app/shared/services/openai.service';

declare var Pusher: any;
declare var $: any;
declare var Swal: any;
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    theme = theme;
    messages: any;
    formwebsocket: FormGroup;
    formdatoscliente: FormGroup;
    cliente_identificado: any;
    nombre_cliente: any;
    enviar_mensaje: boolean = false;
    response: string = '';
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private cliente: ClienteLoginService,
        private openaiService: OpenaiService

    ) {
        this.cliente_identificado = this.cliente.TraerUUID();
        this.nombre_cliente = this.cliente.Traernombre_cliente();
        this.formwebsocket = this.fb.group({
            mensaje: ['', [Validators.required]]
        });
        this.formdatoscliente = this.fb.group({
            nombre: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            telefono: [''],

        });
    }

    ngOnInit(): void {

        // this.webSocketPhp();
        // if (this.cliente_identificado) {
        //     $(".formdatoscliente").addClass('d-none');
        //     $(".formwebsocket").removeClass('d-none');
        // }
        // this.InciarObservable().subscribe(
        //     (nume) => {
        //         //Se dispara el next q muestra el numero
        //         // console.log(nume);
        //     },
        //     (error) => {
        //         console.error("Error", error);
        //     },
        //     () => {
        //         console.log("El observador termino");
        //     }
        // );
        // this.CargarMensajeChatBox();
        this.CargarMensajeChatBoxApi()

    }



    webSocketPhp() {
        Pusher.logToConsole = true;
        const pusher = new Pusher('0900f1535d671035b532', {
            cluster: 'us2'
        });
        const channel = pusher.subscribe('ChatboxWoocommerce');
        channel.bind('pusher:subscription_succeeded', function (members: any) {
            // alert('successfully subscribed!');
        });
        channel.bind('ChatboxEventEnviado', (data: any) => {
            if (this.cliente_identificado === data.datos_mensaje.cliente_identificado) {
                let li = `<div class="wc-message-wrapper list">
                    <div class="wc-message wc-message-from-bot">
                        <div class="wc-message-content">
                                <div class="format-markdown">
                                    <p>${data.datos_mensaje.mensaje}</p>
                                </div>
                        </div>
                    </div>
                    <div class="wc-message-from wc-message-from-bot"><span>${data.datos_mensaje.administrador}</span></div>
                </div>`;
                $(".Messages_list").append(li);
                this.cliente.saveMensaje(data.datos_mensaje.mensaje);
                this.cliente.savenombre_admin(data.datos_mensaje.administrador);
                $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            }
        });
        // DESCONETANDO EL CLIENTE DESDEE EL OTRO LADO
        channel.bind('DesconectaCliente', (data: any) => {
            if (this.cliente_identificado === data.datos_cliente.cliente_identificado) {
                this.toastr.success("Cliente desconectado.");
                $(".Layout").hide();
                $(".chat_on").show(300);
                localStorage.removeItem("cliente_identificado");
                localStorage.removeItem("mensaje_identificado");
                localStorage.removeItem("tiempo_expiracion");
                $(".formdatoscliente").removeClass('d-none');
                $(".formwebsocket").addClass('d-none');
                $(".Messages_list").html('');
            }
        });
        channel.bind('ChatboxDesconetarClienteEvent', (data: any) => {
            if (this.cliente_identificado === data.datos_cliente.cliente_identificado) {
                this.toastr.success("Cliente desconectado.");
                $(".Layout").hide();
                $(".chat_on").show(300);
                localStorage.removeItem("cliente_identificado");
                localStorage.removeItem("mensaje_identificado");
                localStorage.removeItem("tiempo_expiracion");
                localStorage.removeItem("nombre_admin");
                $(".formdatoscliente").removeClass('d-none');
                $(".formwebsocket").addClass('d-none');
                $(".Messages_list").html('');
            }

        });
        channel.bind('ChatboxCerrarGlobalEvent', (data: any) => {
            if (this.cliente_identificado === data.cliente_identificado) {
                this.toastr.success("Cliente desconectado.");
                $(".Layout").hide();
                $(".chat_on").show(300);
                localStorage.removeItem("cliente_identificado");
                localStorage.removeItem("mensaje_identificado");
                localStorage.removeItem("tiempo_expiracion");
                localStorage.removeItem("nombre_admin");
                $(".formdatoscliente").removeClass('d-none');
                $(".formwebsocket").addClass('d-none');
                $(".Messages_list").html('');
            }
        });
        channel.bind('ChatboxEventAdministrador', (data: any) => {
            if (this.cliente_identificado === data.cliente_identificado) {
                let li = `<div class="wc-message-wrapper list">
                    <div class="wc-message wc-message-from-bot">
                        <div class="wc-message-content">
                                <div class="format-markdown">
                                    <p>${data.mensaje}</p>
                                </div>
                        </div>
                    </div>
                    <div class="wc-message-from wc-message-from-bot"><span>${data.administrador}</span></div>
                </div>`;
                $(".Messages_list").append(li);
                this.cliente.saveMensaje(data.mensaje);
                this.cliente.savenombre_admin(data.administrador);
                $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            }
        });
    }

    CerrarConversacion() {
        $(".Layout").hide();
        $(".chat_on").show(300);
        if (this.cliente_identificado) {
            Swal.fire({
                title: '¿Terminar la conversación ?',
                text: "Si lo haces, perderás la conveción actual.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result: any) => {
                if (result.isConfirmed) {
                    this.cliente.ClienteDesconetadoChatbox(this.cliente_identificado).pipe(finalize(() => {
                        localStorage.removeItem("cliente_identificado");
                        localStorage.removeItem("mensaje_identificado");
                        localStorage.removeItem("tiempo_expiracion");
                        localStorage.removeItem("nombre_admin");

                        $(".formdatoscliente").removeClass('d-none');
                        $(".formwebsocket").addClass('d-none');
                        $(".Messages_list").html('');
                    })).subscribe(res => {
                        if (res) {
                            this.toastr.success("Cliente desconectado.");
                            $(".Layout").hide();
                            $(".chat_on").show(300);
                        }
                    });
                    Swal.fire(
                        'Terminado',
                        '',
                        'success'
                    )

                }
            })
        } else {
            $(".Layout").hide();
            $(".chat_on").show(300);
        }

    }

    EnviandoMensaje(event: any) {
        if (this.formwebsocket.invalid) {
            return;
        }
        if (event.keyCode === 13 || event == 'true') {
            this.enviar_mensaje = true
            let mensaje_global = this.cliente.saveMensaje(`cliente:${this.formwebsocket.value.mensaje}`);
            this.cliente.savenombre_admin(null);
            this.cliente.EnviarMensajeChatbox(this.formwebsocket.value.mensaje, this.cliente_identificado, mensaje_global).pipe(finalize(() => {
                this.formwebsocket.get('mensaje')?.setValue('');
                this.enviar_mensaje = false;
                this.cliente.saveTiempoExpiracion();
            })).subscribe(res => {
                let li = `<div class="wc-message-wrapper list">
                                                <div class="wc-message wc-message-from-me">
                                                    <div class="wc-message-content">
                                                            <span class="format-plain">${this.formwebsocket.value.mensaje}</span>
                                                    </div>
                                                </div>
                                                <div class="wc-message-from wc-message-from-me"><span>Usuario ${this.nombre_cliente}</span>
                                                </div>
                                            </div>`;
                $(".Messages_list").append(li);
                $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            });
        }
    }

    EnviandoDatosCliente() {
        this.formdatoscliente.markAllAsTouched();
        if (this.formdatoscliente.invalid) {
            return;
        }
        let id_cliente: any = localStorage.getItem('cliente_identificado');
        if (!id_cliente) {
            this.cliente_identificado = this.createUUID();
            this.cliente.saveUUID(this.cliente_identificado);
            this.cliente.savenombre_cliente(this.formdatoscliente.value.nombre);
            this.cliente.saveTiempoExpiracion();
        }
        this.cliente.EnviarDatoChatbox(this.formdatoscliente.value, this.cliente_identificado).pipe(finalize(() => {
            $(".formdatoscliente").addClass('d-none');
            $(".formwebsocket").removeClass('d-none');
            this.formdatoscliente.reset();
        })).subscribe(res => {
            if (res) {
                this.toastr.success("Información recibido correctamente.");
            }
        });

    }

    createUUID() {
        var s: any = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    CargarMensajeChatBox() {
        let mensajes = this.cliente.CargarMensaje();
        let admin = this.cliente.Traernombre_admin();
        if (mensajes) {
            mensajes.forEach((element: string, indice: any) => {
                let li = '';
                // alert(indice);
                if (element.includes('cliente:')) {
                    li += `<div    class="wc-message-wrapper list">
                                            <div   class="wc-message wc-message-from-me">
                                                <div   class="wc-message-content">
                                                        <span  class="format-plain">${element.replace('cliente:', '')}</span>
                                                </div>
                                            </div>
                                            <div   class="wc-message-from wc-message-from-me"><span>Usuario ${this.nombre_cliente}</span>
                                            </div>
                                        </div>
                    `;

                } else {
                    li += `<div  class="wc-message-wrapper list">
                    <div  class="wc-message wc-message-from-bot">
                        <div  class="wc-message-content">
                                <div  class="format-markdown">
                                    <p >${element}</p>
                                </div>
                        </div>
                    </div>
                    <div  class="wc-message-from wc-message-from-bot"><span>${admin[indice]}</span></div>
                </div>`;
                }
                $(".wc-message-group-content").append(li);
                $(".wc-message-group-content").scrollTop(document.getElementById('Messages')?.scrollHeight);

            });

        }

    }

    expirado(fechaExp: number): boolean {
        let ahora = new Date().getTime() / 1000;
        if (fechaExp < ahora) {
            return true;
        } else {
            return false;
        }
    }

    SessionChatboxExpirado() {
        this.cliente.ClienteDesconetadoChatbox(this.cliente_identificado).pipe(finalize(() => {
            localStorage.removeItem("cliente_identificado");
            localStorage.removeItem("mensaje_identificado");
            localStorage.removeItem("tiempo_expiracion");
            localStorage.removeItem("nombre_admin");
            localStorage.removeItem("nombre_cliente");
            $(".formdatoscliente").removeClass('d-none');
            $(".formwebsocket").addClass('d-none');
            $(".Messages_list").html('');
        })).subscribe(res => {
            if (res) {
                this.toastr.success("Cliente desconectado.");
            }
        });
    }

    InciarObservable() {
        let obs = new Observable((observer) => {
            let contado = 1;
            setInterval(() => {
                contado += 1;
                observer.next(contado);
                let tiempo: any = localStorage.getItem("tiempo_expiracion")
                this.cliente_identificado = this.cliente.TraerUUID()
                this.nombre_cliente = this.cliente.Traernombre_cliente()
                if (tiempo !== null) {
                    if (this.expirado(tiempo)) {
                        observer.complete();
                        this.SessionChatboxExpirado();
                    }
                }
            }, 1000);
        });

        return obs;
    }


    // CHAT GPT---------------------------------------------------------------------------------------------------------------
    EnviandoChatGPT(event: any) {
        if (this.formwebsocket.invalid) {
            return;
        }
        if (event.keyCode === 13 || event == 'true') {
            this.enviar_mensaje = true
            const cliente = {
                'role': 'user',
                'content': `${this.formwebsocket.value.mensaje} !Descripción corta que no sea largo!`
            };
            let mensajeGlobal = this.cliente.saveMensaje(cliente);
            let li = `<div    class="wc-message-wrapper list">
                                            <div   class="wc-message wc-message-from-me">
                                                <div   class="wc-message-content">
                                                        <span  class="format-plain">${this.formwebsocket.value.mensaje}</span>
                                                </div>
                                            </div>
                                            <div   class="wc-message-from wc-message-from-me"><span>Cliente</span>
                                            </div>
                                        </div>`;
            $(".Messages_list").append(li);
            $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            this.askChatGPT(mensajeGlobal).pipe(finalize(() => {
                this.formwebsocket.get('mensaje')?.setValue('');
                this.enviar_mensaje = false;
            })).subscribe(data => {
                const ChatApi = {
                    'role': 'assistant',
                    'content': data.choices[0].message.content
                };
                this.cliente.saveMensaje(ChatApi);
                let li = `<div  class="wc-message-wrapper list">
                        <div  class="wc-message wc-message-from-bot">
                            <div  class="wc-message-content">
                                    <div  class="format-markdown">
                                        <p>${data.choices[0].message.content}</p>
                                    </div>
                            </div>
                        </div>
                        <div  class="wc-message-from wc-message-from-bot"><span>Asistente</span></div>
                    </div>`;
                $(".wc-message-group-content").append(li);
                $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            },
                error => {
                    console.log(error);
                    this.toastr.error("Error con ChatBox");

                }
            );
        }
    }
    askChatGPT(prompt: any): Observable<any> {
        return this.openaiService.sendPrompt(prompt);
    }

    MinimisarConversacion() {
        $(".Layout").hide();
        $(".chat_on").show(300);
    }
    LevantarChat() {
        $(".Layout").toggle();
        $(".chat_on").hide(300);
        $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
        //VERIFICAMOS QUE SEA LA MISMA FECHA
        let ultimaFechaGuardada = localStorage.getItem('mensaje_fecha');
        if (!ultimaFechaGuardada) {
            this.guardarFechaMensaje();
        } else {
            let fechaActual = new Date();
            let fechaActualFormateada = fechaActual.toISOString().split('T')[0];
            ultimaFechaGuardada = ultimaFechaGuardada.replace(/"/g, '');
            if (fechaActualFormateada !== ultimaFechaGuardada) {
                localStorage.removeItem("mensaje_identificado"); //ELIMINAMOS SI NO ES DE LA MISMA FECHA
                localStorage.removeItem("mensaje_fecha"); //ELIMINAMOS LA FECHA
                $(".Messages_list").html('');
                this.guardarFechaMensaje();
            }
        }
        //
        let mensage: any = localStorage.getItem('mensaje_identificado');
        if (!mensage) {
            let inicio = {
                'role': 'assistant',
                'content': 'Hola, ¿puedo ayudarte con algún medicamento? Por favor, dime qué malestar estás experimentando.'
            };
            this.cliente.saveMensaje(inicio);
            let li = `<div  class="wc-message-wrapper list">
                        <div  class="wc-message wc-message-from-bot">
                            <div  class="wc-message-content">
                                    <div  class="format-markdown">
                                        <p>Hola, ¿puedo ayudarte con algún medicamento? Por favor, dime qué malestar estás experimentando.'</p>
                                    </div>
                            </div>
                        </div>
                        <div  class="wc-message-from wc-message-from-bot"><span>Asistente</span></div>
                    </div>`;
            $(".wc-message-group-content").append(li);
        }
    }
    eliminarDescripcionCorta(obj: any) {
        // Itera sobre las propiedades del objeto
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Verifica si la propiedad tiene un objeto con 'content'
                if (obj[key] && typeof obj[key].content === 'string') {
                    // Si el 'content' contiene '!Descripción corta que no sea largo!', elimínalo
                    if (obj[key].content.includes('!Descripción corta que no sea largo!')) {
                        obj[key].content = obj[key].content.replace('!Descripción corta que no sea largo!', '');
                    }
                    obj[key].content = obj[key].content.trim();
                }
            }
        }
        // Retorna el objeto modificado
        return obj;
    }
    CargarMensajeChatBoxApi() {
        let mensajes = this.cliente.CargarMensaje();
        mensajes = this.eliminarDescripcionCorta(mensajes);
        console.log(mensajes);
        if (mensajes) {
            mensajes.forEach((element: any, indice: any) => {
                let li = '';
                if (element.role == "assistant") {
                    li += `<div  class="wc-message-wrapper list">
                        <div  class="wc-message wc-message-from-bot">
                            <div  class="wc-message-content">
                                    <div  class="format-markdown">
                                        <p>${element.content}</p>
                                    </div>
                            </div>
                        </div>
                        <div  class="wc-message-from wc-message-from-bot"><span>Asistente</span></div>
                    </div>`;
                } else {
                    li += `<div    class="wc-message-wrapper list">
                        <div   class="wc-message wc-message-from-me">
                            <div   class="wc-message-content">
                                    <span  class="format-plain">${element.content}</span>
                            </div>
                        </div>
                        <div   class="wc-message-from wc-message-from-me"><span>Cliente</span>
                        </div>
                    </div>`;
                }
                $(".wc-message-group-content").append(li);
                $("#Messages").scrollTop(document.getElementById('Messages')?.scrollHeight);
            });

        }
    }
    cerrarChatBox() {
        let mensajes = this.cliente.CargarMensaje();
        $(".Layout").hide();
        $(".chat_on").show(300);
        $(".texto_flotante").show(300);
        if (mensajes.length > 1) {
            Swal.fire({
                title: '¿Deseas terminar la conversación?',
                text: "Si lo haces, perderás la conveción actual.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result: any) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("mensaje_identificado");
                    localStorage.removeItem("mensaje_fecha");
                    $(".Messages_list").html('');
                    $(".Layout").hide();
                    $(".chat_on").show(300);
                    $(".texto_flotante").show(300);
                    this.toastr.success("Conversacion finalizada.");
                }else{
                    $(".Layout").toggle();

                }
            })
        }


    }
    guardarFechaMensaje() {
        let fechaActual = new Date();
        let fechaActualFormateada = fechaActual.toISOString().split('T')[0];
        localStorage.setItem('mensaje_fecha', JSON.stringify(fechaActualFormateada));
    }

    //-----------------------

}
