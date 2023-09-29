# 👾📃 Pixel Lister
Lists the pixels in a given image.

---
## 💻 Using the app

You have (at least) two choices:
- Open the link [https://sreenikethani.github.io/PixelLister/](https://sreenikethani.github.io/PixelLister/)
- Clone this repo, and run a server on the root folder

This project does not use any frameworks or anything fancy like that, just plain
old HTML, JS, CSS 😅

---
## 😲 What?
This app takes an image from you. Then:
- **For color output,** it'll give you the list of coordinates of the pixels, for each
color separately.
- **For black-and-white output,** it'll give you the list of coordinates of the white
pixels.

---
## 🌟 Features
- Local processing, no data is sent anywhere (and I can't pay for a server anyway 😢)
- Optional dithering using Floyd-Steinberg algorithm, or just nearest-color

### For color output specifically:
- Generating an *optimum* color palette if you don't want to choose your own
colors

### For black-and-white output specifically:
- Restricting output to a fixed **number of white pixels** rather than fixed size
- Inverting image. Useful if the image has more white pixels than black

---
## 🤔 How?
Roughly, this is the process:
1. Load image
2. Resize image as required
3. Reduce color depth
4. Generate list of coordinates
5. Copy, or export to a CSV file, TSV file, or text file

---
## 😎 Why?
Why not? 😎

You can use the resulting CSV file to create an X-Y Scatter Plot, and now you
can troll your friends (if any) with an unexpected image.

---
## Author
This project has been conceptualized and brought to life by Sreenikethan Iyer.

The package [Color Thief](https://github.com/lokesh/color-thief) is used to
extract the optimum colors for dithering.
