"use strict";
import * as DOM from './constants_dom.js';
import * as Helper from './helper.js';
import ColorThief from './color-thief.mjs';

//=| TESTING |================================================================//
DOM.loadReferences();
DOM.TEMP_FILE_CHOOSER.addEventListener("input", async (ev) => {
    const bitmap = await Helper.loadImageFromFilePicker(DOM.TEMP_FILE_CHOOSER);
    console.log(bitmap || "load failed");
    if (!bitmap) {return;}

    const ct = new ColorThief();
    const palette = ct.getPalette(bitmap, 20);
    console.log(palette);
});

console.log("bruh");
