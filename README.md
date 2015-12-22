# hickup
A simple little utility that wraps any command/process and reruns/restarts it when given a HUP (*hickup*). Its purpose is to aid in the construction of custom livereload-like workflows. Useful during development for things running in docker containers.

## Usage
    hickup command [arguments]

## Example
    $ hickup echo hick
    hick
    (HUP) hick
    (HUP) hick
    ^C
    $
