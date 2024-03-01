import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropcartType } from '../../modules/header/components/dropcart/dropcart.component';
import { DOCUMENT } from '@angular/common';
import { ClienteLoginService } from 'src/app/shared/services/cliente-login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

interface RouterData {
    headerLayout?: 'classic' | 'compact';
    dropcartType?: DropcartType;
}

@Component({
    selector: 'app-main',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    headerLayout: 'classic' | 'compact' = 'classic';
    dropcartType: DropcartType = 'dropdown';
    destroy$: Subject<void> = new Subject<void>();
    img_logo:string='../../../assets/images/Imagen_no_disponible.png';
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private Login: ClienteLoginService,
        public route: ActivatedRoute,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private titleService: Title
    ) {
        this.route.data.subscribe((data: RouterData) => {
            this.headerLayout = data.headerLayout || 'classic';
            this.dropcartType = data.dropcartType || 'dropdown';
        });
        this.Login.TraerDatosEmpresa().pipe(takeUntil(this.destroy$)).subscribe({
            next: json => {
                if (json.urlicono_empresa_venta_online) {
                    const linkElement: any = document.querySelector('link[rel="icon"]');
                    linkElement.setAttribute('href', json.urlicono_empresa_venta_online);
                }
                if (json.nombre_empresa_venta_online) {
                    this.titleService.setTitle(json.nombre_empresa_venta_online);
                }
                //INICIALIZAMOS EL ICONO
                json.pixelgoogle.forEach((element: any) => {
                    this.addScriptToHead(element);
                });
                json.pixelfacebook.script.forEach((element: any) => {
                    this.addScriptToHead(element);
                });
                json.pixelfacebook.noscript.forEach((element: any) => {
                    this.addNoscriptToHead(element);
                });
                if (json.urllogohorizontal_empresa_venta_online) {
                    this.img_logo=json.urllogohorizontal_empresa_venta_online;
                }
                //-----------------------------
            }, error: error => {
                this.toastr.error(`Hubo un error con la información de la empresa`);
            }
        })
    }

    private addScriptToHead(scriptContent: string) {
        const script = this.renderer.createElement('script');
        script.innerHTML = scriptContent;
        this.renderer.appendChild(this.document.head, script);
    }
    private addNoscriptToHead(noscriptContent: string) {
        const noscript = this.renderer.createElement('noscript');
        noscript.innerHTML = noscriptContent;
        this.renderer.appendChild(this.document.head, noscript);
    }
}
