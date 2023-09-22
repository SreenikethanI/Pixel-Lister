"use strict";
import * as DOM from './constants_dom.js';
import * as Helper from './helper.js';


//=| TESTING |================================================================//
DOM.loadReferences();
DOM.TEMP_FILE_CHOOSER.addEventListener("input", async (ev) => {
    const bitmap = await Helper.loadImageFromFilePicker(DOM.TEMP_FILE_CHOOSER);
    console.log(bitmap || "load failed");
});

console.log(DOM.TEMP_FILE_CHOOSER);
console.log("bruh");
