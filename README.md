# hickup
Tiny utility that wraps any command/process and reruns/restarts it when given a HUP signal.
Its purpose is to aid in the construction of custom livereload-like workflows.

## Usage
    hickup [-t timeout] command [arguments]

## Examples
    $ hickup echo hick
    hick
    (HUP) hick
    (HUP) hick
    ^C
    $

[This gist][gist]

[gist]: https://gist.github.com/daniel-pedersen/2bb9ced4e48b49e09103
