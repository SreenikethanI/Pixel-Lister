"use strict";
import * as DOM from './constants_dom.js';

/** Try to load an image from the selected files list.
 * @param {HTMLInputElement} filePicker The file picker to get the items from.
 */
export async function loadImageFromFilePicker(filePicker) {
    const files = filePicker.files;
    if (files.length != 1) {return;}
    try {return await createImageBitmap(files[0]);}
    catch (error) {return;}
}
