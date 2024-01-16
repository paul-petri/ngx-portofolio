import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BET20map } from 'src/app/data/bet20map';
import { Stock } from 'src/app/models/stock';

@Component({
    selector: 'app-index-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
    ],
    templateUrl: './index-modal.component.html',
    styleUrl: './index-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexModalComponent { 
    stocks = new Array<Stock>();

    constructor() {
        this.stocks= Array.from(BET20map.values());
    }
}
