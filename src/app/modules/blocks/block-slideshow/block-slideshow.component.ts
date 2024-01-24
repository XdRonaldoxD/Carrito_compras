import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SliderService } from 'src/app/shared/services/slider.service';
import { DirectionService } from '../../../shared/services/direction.service';

@Component({
    selector: 'app-block-slideshow',
    templateUrl: './block-slideshow.component.html',
    styleUrls: ['./block-slideshow.component.scss']
})
export class BlockSlideshowComponent {
    @Input() withDepartments = false;
    @Input() slides:any = [];

    options = {
        nav: false,
        dots: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 20000,
        responsive: {
            0: { items: 1 }
        },
        rtl: this.direction.isRTL()
    };
    constructor(
        public sanitizer: DomSanitizer,
        private direction: DirectionService
    ) {
     

    }
}
