import { Component, Input } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() layout: 'classic'|'compact' = 'classic';
    @Input() img_logo:string="";
    constructor(public store: StoreService) { }
}
