# 👾📃 Pixel Lister
Lists the active/bright/high/white pixels in a given image.

To use the app, you can open this link: [https://sreenikethani.github.io/PixelLister/](https://sreenikethani.github.io/PixelLister/)

Alternatively, you can clone this repo

## What?
This app takes an image from you, and gives you the list of coordinates of those
pixels which are white in color / bright.

## Features/Capabilities
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
3. It is converted to pure black-and-white (either with Floyd-Steinberg
dithering or just a simple threshold filter)
4. The list of white pixels is generated
5. This list can be copied or exported to a CSV file, TSV file, or text file.

## Author
This project is conceptualized and brought to life by Sreenikethan Iyer.
