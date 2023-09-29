# 👾📃 Pixel Lister
Lists the pixels in a given image.

## Using the app

You have (at least) two choices:
- Open the link [https://sreenikethani.github.io/PixelLister/](https://sreenikethani.github.io/PixelLister/)
- Clone this repo, and run a server on the root folder

This project does not use any frameworks or anything fancy like that, just plain
old HTML, JS, CSS 😅

## What?
This app takes an image from you, then if you want:
- *color output:* it'll give you the list of coordinates of the pixels, for each
color separately.
- *black-and-white output:* it'll give you the list of coordinates of the white
pixels.

### Features/Capabilities
- Dithering using Floyd-Steinberg algorithm, or just a threshold filter
- Inverting image before processing, if the image has more white pixels than black
- Restrict output to a fixed **number of pixels** rather than fixed dimensions
- Works locally, no data is sent anywhere (and I can't pay for a server anyway)

## Why?
Why not? 😎

You can use the resulting CSV file to create an X-Y Scatter Plot, and now you
can troll your friends (if any) with an unexpected image.

## How?
Roughly, this is the process:
1. You supply the image
2. It is resized to a given size / given number of white pixels
3. The color depth of the image is reduced (either with Floyd-Steinberg dithering,
or for black-and-white images, just a simple threshold filter)
4. The list of coordinates is generated
5. This list can be copied or exported to a CSV file, TSV file, or text file.

## Author
This project has been conceptualized and brought to life by Sreenikethan Iyer.

The package [Color Thief](https://github.com/lokesh/color-thief) is used to
extract the optimum colors for dithering.
