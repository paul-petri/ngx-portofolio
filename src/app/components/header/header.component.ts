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
import { IndexModalComponent } from '../modals/index-modal/index-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule, RouterModule, MatDialogModule],
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) marketCap!: number;
  @Input() chartView!: boolean;
  @Output() chartViewChange = new EventEmitter<boolean>();

  appState = inject(AppStore);
  dialog = inject(MatDialog);

  menuOpen = false;

  switchView(): void {
    this.chartView = !this.chartView;
    this.chartViewChange.emit(this.chartView);
  }

  editIndex(): void {
    this.toggleMenu();
    this.dialog.open(IndexModalComponent);
  }

  logOut(): void {
    this.appState.logOut();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
