import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
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
  dialog = inject(MatDialog);
  toastr = inject(ToastrService);

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
            this.appState.mapCSVToStocks(file);
            this.toastr.success('Portofoliul tau a fost incarcat cu succes!', 'Succes', {
              progressBar: true,
              timeOut: 3000,
            });
            this.dialog.closeAll();
        });
      }
    }
  }
}
