import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AppStore } from 'src/app/services/app.store';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, NgxFileDropModule, MatDialogModule],
  styleUrl: './upload-modal.component.scss',
  templateUrl: './upload-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadModalComponent {
  appState = inject(AppStore);

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
            this.appState.mapCSVToStocks(file);
        });
      }
    }
  }
}
