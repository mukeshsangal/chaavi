import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import * as JSZip from 'jszip';



/**
 * Emulates the Cordova Zip plugin in browser.
 */
@Injectable()

//Originally included to Unzip H5P files before they can be displayed.
//Currently not used. Kept for later reference if needed.
export class ZipService {

    constructor(private file: File) {
        //super();
    }

    /**
     * Create a directory. It creates all the foldes in dirPath 1 by 1 to prevent errors.
     *
     * @param destination Destination parent folder.
     * @param dirPath Relative path to the folder.
     * @return Promise resolved when done.
     */
    protected async createDir(destination: string, dirPath: string): Promise<void> {
        // Create all the folders 1 by 1 in order, otherwise it fails.
        const folders = dirPath.split('/');

        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];

            await this.file.createDir(destination, folder, true);

            // Folder created, add it to the destination path.
            destination = this.concatenatePaths(destination, folder);
        }
    }

    /**
     * Extracts files from a ZIP archive.
     *
     * @param source Path to the source ZIP file.
     * @param destination Destination folder.
     * @param onProgress Optional callback to be called on progress update
     * @return Promise that resolves with a number. 0 is success, -1 is error.
     */
    async unzip(source: string, destination: string, onProgress?: (ev: {loaded: number; total: number}) => void): Promise<number> {

        // Replace all %20 with spaces.
        source = source.replace(/%20/g, ' ');
        destination = destination.replace(/%20/g, ' ');

        const sourceDir = source.substring(0, source.lastIndexOf('/'));
        const sourceName = source.substr(source.lastIndexOf('/') + 1);
        const zip = new JSZip();
        console.log("0", sourceDir, " " , sourceName);
        try {
            // Read the file first.
            const check = await this.file.checkFile(this.file.dataDirectory+"files", sourceName);
            console.log("0.5 ", check);
            const data = await this.file.readAsArrayBuffer(sourceDir, sourceName);
            console.log("1");
            // Now load the file using the JSZip library.
            await zip.loadAsync(data);
            console.log("2");
            if (!zip.files || !Object.keys(zip.files).length) {
                // Nothing to extract.
                return 0;
            }

            // First of all, create the directory where the files will be unzipped.
            const destParent = destination.substring(0, destination.lastIndexOf('/'));
            const destFolderName = destination.substr(destination.lastIndexOf('/') + 1);
            
            await this.file.createDir(destParent, destFolderName, true);
            console.log("3");
            const total = Object.keys(zip.files).length;
            let loaded = 0;

            await Promise.all(Object.keys(zip.files).map(async (name) => {
                const file = zip.files[name];

                if (!file.dir) {
                    // It's a file.
                    const fileDir = name.substring(0, name.lastIndexOf('/'));
                    const fileName = name.substr(name.lastIndexOf('/') + 1);

                    if (fileDir) {
                        // The file is in a subfolder, create it first.
                        await this.createDir(destination, fileDir);
                    }

                    // Read the file contents as a Blob.
                    const fileData = await file.async('blob');

                    // File read and parent folder created, now write the file.
                    const parentFolder = this.concatenatePaths(destination, fileDir);

                    await this.file.writeFile(parentFolder, fileName, fileData, { replace: true });
                } else {
                    // It's a folder, create it if it doesn't exist.
                    await this.createDir(destination, name);
                }

                // File unzipped, call the progress.
                loaded++;
                onProgress && onProgress({ loaded: loaded, total: total });
            }));

            return 0;
        } catch (error) {
            // Error.
            return -1;
        }
    }

    concatenatePaths(leftPath: string, rightPath: string): string {
      if (!leftPath) {
          return rightPath;
      } else if (!rightPath) {
          return leftPath;
      }

      const lastCharLeft = leftPath.slice(-1);
      const firstCharRight = rightPath.charAt(0);

      if (lastCharLeft === '/' && firstCharRight === '/') {
          return leftPath + rightPath.substr(1);
      } else if (lastCharLeft !== '/' && firstCharRight !== '/') {
          return leftPath + '/' + rightPath;
      } else {
          return leftPath + rightPath;
      }
  }
}
