import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { AppStore } from 'src/app/services/app.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IndexModalComponent } from '../index-modal/index-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule, MatDialogModule, IndexModalComponent],
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) marketCap!: number;

  @Input() chartView!: boolean;
  @Output() chartViewChange = new EventEmitter<boolean>();

  appState = inject(AppStore);
  dialog = inject(MatDialog);

  swirchView(): void {
    this.chartView = !this.chartView;
    this.chartViewChange.emit(this.chartView);
  }

  editIndex(): void {
    this.dialog.open(IndexModalComponent);
  }

  logOut(): void {
    this.appState.logOut();
  }
}
