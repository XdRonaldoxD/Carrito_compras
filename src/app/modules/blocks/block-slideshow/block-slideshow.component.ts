import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectionService } from '../../../shared/services/direction.service';

@Component({
    selector: 'app-block-slideshow',
    templateUrl: './block-slideshow.component.html',
    styleUrls: ['./block-slideshow.component.scss']
})
export class BlockSlideshowComponent {
    @Input() withDepartments = false;

    options = {
        nav: false,
        dots: true,
        loop: true,
        responsive: {
            0: {items: 1}
        },
        rtl: this.direction.isRTL()
    };

    slides = [
        {
            title: 'GRAN VARIDAD <br>PARA LOS CHICOS',
            text: '',
            image_classic: 'assets/images/slides/slide-1.jpg',
            image_full: 'assets/images/slides/primero_fondo.png',
            image_mobile: 'assets/images/slides/slide-1-mobile.jpg'
            
        },
        {
            title: 'GRAN VARIDAD <br>PARA LOS ADULTOS',
            text: '',
            image_classic: 'assets/images/slides/slide-2.jpg',
            image_full: 'assets/images/slides/segundo_fondo.png',
            image_mobile: 'assets/images/slides/slide-2-mobile.jpg'
        },
        {
            title: 'GRAN VARIDAD <br>PARA LOS BEBES',
            text: '',
            image_classic: 'assets/images/slides/slide-3.jpg',
            image_full: 'assets/images/slides/tercer_fondo.png',
            image_mobile: 'assets/images/slides/slide-3-mobile.jpg'
        }
    ];

    constructor(
        public sanitizer: DomSanitizer,
        private direction: DirectionService
    ) { }
}
