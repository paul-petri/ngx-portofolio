import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent { }
