import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent { }
