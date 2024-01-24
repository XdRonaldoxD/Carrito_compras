import { Component } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
    selector: 'app-contact-us',
    templateUrl: './page-contact-us.component.html',
    styleUrls: ['./page-contact-us.component.scss']
})
export class PageContactUsComponent {
    constructor(public store: StoreService) { }
}
