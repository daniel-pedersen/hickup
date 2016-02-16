# hickup
Tiny utility that wraps any command/process and reruns/restarts it when given a HUP signal.
Its purpose is to aid in the construction of custom livereload-like workflows.

## Usage
    hickup [-t timeout] command [arguments]
