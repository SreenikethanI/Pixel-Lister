"use strict";
import * as DOM from './constants_dom.js';

/** Try to load an image from the selected files list.
 * @param {HTMLInputElement} filePicker The file picker to get the items from.
 */
export async function loadImageFromFilePicker(filePicker) {
    const files = filePicker.files;
    if (files.length != 1) {return;}
    var bitmap;
    try {bitmap = await createImageBitmap(files[0]);}
    catch (error) {return;}

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

/** Generates a map from 0 - 255 to 0.0 - 1.0 using the given gamma value.
 * @param {number} [gamma=2.2] */
function generateLinearMap(gamma=2.2){
    return [...Array(256).keys()].map((c) => (c/255)**gamma);
}

/** Get closest color index from the given palette
 * @param {number[]} colorRGB The color as a list of R, G, B.
 * @param {number[][]} paletteRGB The palette as a list of colors of R, G, B.
 */
function getClosestColorIndex(colorRGB, paletteRGB) {
    if (paletteRGB.length == 0) {throw Error("empty palette");}
    if (paletteRGB.length == 1) {return paletteRGB[0];}
    var closestIndex = -1, closestDistanceSq = Number.POSITIVE_INFINITY;

    for (let i = 0; i < paletteRGB.length; i++) {
        const palColor = paletteRGB[i];
        const distanceSq = (
            (colorRGB[0] - palColor[0]) ** 2
            + (colorRGB[1] - palColor[1]) ** 2
            + (colorRGB[2] - palColor[2]) ** 2
        );
        if (distanceSq < closestDistanceSq) {
            closestIndex = i;
            closestDistanceSq = distanceSq;
        }
    }
    return closestIndex;
}

/** Callback for distributing the error
 * @callback ErrorDistCallback
 * @param {ImageData} image
 * @param {number} errorR the `old - new` value for the R channel
 * @param {number} errorG the `old - new` value for the G channel
 * @param {number} errorB the `old - new` value for the B channel
 * @param {number} x the x coordinate of the current pixel
 * @param {number} y the y coordinate of the current pixel
 */

/** Perform dithering on the given image using the given error distribution function
 * @param {ImageData} image The ImageData to work on
 * @param {number[][]} palette The list of colors (each of which are R,G,B lists)
 * @param {ErrorDistCallback} errorDistFn The function that distributes the error
 * @param {number} [gamma=2.2] The gamma value to apply for comparison
 */
function ditherErrorDistTemplate(image, palette, errorDistFn, gamma=2.2) {
    const result = new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
    const w = image.width, h = image.height;
    const linearMap = generateLinearMap(gamma);
    const paletteLinear = palette.map((color) => color.map((component) => linearMap[component]));

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const index = 4 * (y * w + x)
            const cR = image.data[index+1],
                  cG = image.data[index+2],
                  cB = image.data[index+3];
            const cRLin = linearMap[cR],
                  cGLin = linearMap[cG],
                  cBLin = linearMap[cB];

            const newColor = palette[getClosestColorIndex([cRLin, cGLin, cBLin], paletteLinear)];
            result[index+1] = newColor[0];
            result[index+2] = newColor[1];
            result[index+3] = newColor[2];
            errorDistFn(image, cR - newColor[0], cG - newColor[1], cB - newColor[2], x, y);
        }
    }

    return result;
}

/** Perform dithering on the given image using the given error distribution function
 * @param {ImageData} image The ImageData to work on
 * @param {number} nBits The number of bits. Hence, number of colors = 2 ** nBits
 * @param {ErrorDistCallback} errorDistFn The function that distributes the error
 * @param {number} [gamma=2.2] The gamma value to apply for comparison
 */
function ditherErrorDistGrayscaleTemplate(image, nBits, errorDistFn, gamma=2.2) {
    const result = new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
    const w = image.width, h = image.height;
    const linearMap = generateLinearMap(gamma);
    // const paletteLinear = palette.map((color) => color.map((component) => linearMap[component]));

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const index = 4 * (y * w + x)
            const cR = image[index+1],
                  cG = image[index+2],
                  cB = image[index+3];
            const cRLin = palette[cR],
                  cGLin = palette[cG],
                  cBLin = palette[cB];

            const newColor = palette[getClosestColorIndex([cRLin, cGLin, cBLin], paletteLinear)];
            result[index+1] = newColor[0];
            result[index+2] = newColor[1];
            result[index+3] = newColor[2];
            errorDistFn(image, cR - newColor[0], cG - newColor[1], cB - newColor[2], x, y);
        }
    }

    return result;
}

/**
 * @param {ImageData} image
 * @param {number} errorR the `old - new` value for the R channel
 * @param {number} errorG the `old - new` value for the G channel
 * @param {number} errorB the `old - new` value for the B channel
 * @param {number} x the x coordinate of the current pixel
 * @param {number} y the y coordinate of the current pixel
 */
function FSErrorFn(image, errorR, errorG, errorB, x, y) {
    const w = image.w, h = image.h;
    const data = image.data;
    if (x + 1 < w && y     < h) {
        const index = 4*((y    ) * w + (x + 1));
        data[index+1] += errorR * 7/16;
        data[index+2] += errorG * 7/16;
        data[index+3] += errorB * 7/16;
    }
    if (x - 1 < w && y + 1 < h) {
        const index = 4*((y + 1) * w + (x - 1));
        data[index+1] += errorR * 3/16;
        data[index+2] += errorG * 3/16;
        data[index+3] += errorB * 3/16;
    }
    if (x     < w && y + 1 < h) {
        const index = 4*((y + 1) * w + (x    ));
        data[index+1] += errorR * 5/16;
        data[index+2] += errorG * 5/16;
        data[index+3] += errorB * 5/16;
    }
    if (x + 1 < w && y + 1 < h) {
        const index = 4*((y + 1) * w + (x + 1));
        data[index+1] += errorR * 1/16;
        data[index+2] += errorG * 1/16;
        data[index+3] += errorB * 1/16;
    }
}

function ditherFS(image, palette, gamma=2.2) {
    ditherErrorDistTemplate(image, palette, FSErrorFn, gamma);
}

function ditherFSGrayscale(image, nBits, gamma=2.2) {
    ditherErrorDistGrayscaleTemplate(image, nBits, FSErrorFn, gamma);
}
