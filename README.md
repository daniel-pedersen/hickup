# hickup
A simple little utility that wraps any command/process and reruns/restarts it when given a HUP (*hickup*). Its purpose is to aid in the construction of custom livereload-like workflows. Useful during development for things running in [docker containers][gist].

## Usage
    hickup command [arguments]

## Examples
    $ hickup echo hick
    hick
    (HUP) hick
    (HUP) hick
    ^C
    $

[This gist][gist]

[gist]: https://gist.github.com/daniel-pedersen/2bb9ced4e48b49e09103
