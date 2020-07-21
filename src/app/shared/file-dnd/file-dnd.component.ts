import { Component, OnInit, Input } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-file-dnd',
  templateUrl: './file-dnd.component.html',
  styleUrls: ['./file-dnd.component.scss']
})
export class FileDndComponent implements OnInit {

  @Input() multiple: boolean;

  faTrash = faTrash;

  showFileOption = true;

  files: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      this.showFileOption = true;
      this.multiple = false;
    }
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      // Check for file duplication
      if (this.files.filter(f => f.name === item.name).length === 0) {
        item.progress = 0;
        item.progressType = 'info';
        this.files.push(item);
        this.uploadFilesSimulator(item);
      }
    }

    if (this.files.length > 1) {
      this.showFileOption = true;
      this.multiple = true;
    } else {
      this.showFileOption = this.multiple ? true : false;
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(file) {
    setTimeout(() => {
        const progressInterval = setInterval(() => {
          if (file.progress === 100) {
            clearInterval(progressInterval);
            file.progressType = 'success';
          } else {
            file.progress += 5;
          }
        }, 200);
    }, 500);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
