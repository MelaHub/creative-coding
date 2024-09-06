🎨🖼️🖌️👩🏻‍🎨 

This repo holds the code for [Creating Coding 2.0](https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14951-skewing). You can see all final sketches [here](melahub.github.io/creative-coding/).

## Create a new sketch
To get creative with a single js file, run `canvas-sketch canvas-sketch/[js-file-name-withou-extension] --new --open`, `canvas-sketch` will bring up a server the renders all changes without the need of reloading the page at every save.

To bring back up an existing sketch, run `canvas-sketch canvas-sketch/[js-file-name-withou-extension]`.

## To update the website with a new sketch

As I haven't set up github actions yet, nor automated anything so far, to have the github page available just remember to add any new script in the webpack config file,  run `npm build`, and add any new js script before pushing to the repo.