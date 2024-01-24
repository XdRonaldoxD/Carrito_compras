import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Megamenu } from '../../../../shared/interfaces/megamenu';
import { NestedLink } from '../../../../shared/interfaces/nested-link';

@Component({
    selector: 'app-header-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss']
})
export class MegamenuComponent implements OnInit {
    @Input() menu!: Megamenu;

    @Output() itemClick: EventEmitter<NestedLink> = new EventEmitter<NestedLink>();

    constructor() { }

    ngOnInit(): void {
       
    }
}
