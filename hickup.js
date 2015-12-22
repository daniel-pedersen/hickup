#!/usr/bin/env node

import { spawn } from "child_process"

const killTimeout = 10000
const relayedSignals = ["SIGILL", "SIGTRAP", "SIGABRT", "SIGIOT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGPIPE", "SIGALRM", "SIGCHLD", "SIGSTKFLT", "SIGCONT", "SIGTSTP", "SIGBREAK", "SIGTTIN", "SIGTTOU", "SIGURG", "SIGXCPU", "SIGXFSZ", "SIGVTALRM", "SIGPROF", "SIGWINCH", "SIGIO", "SIGPOLL", "SIGLOST", "SIGPWR", "SIGSYS", "SIGUNUSED"]

let child, timeout, alive, killed

if (process.argv.length < 3) {
  process.exit(1)
}

process
  .on("SIGHUP", respawnChild)
  .on("SIGTERM", killSelf)
  .on("SIGINT", killSelf)
  .on("SIGQUIT", killSelf)

relayedSignals.forEach(signal => process.on(signal, () => child.kill(signal)))

function killSelf() {
  killChild()
  process.exit(0)
}

function killChild() {
  killed = true
  child.kill()
  if (!timeout) {
    timeout = setTimeout(() => child.kill("SIGKILL"), killTimeout)
  }
}

function spawnChild() {
  if (!alive) {
    child = spawn(process.argv[2], process.argv.slice(3), { stdio: "inherit" })
      .once("error", cleanUp)
      .once("exit", cleanUp)
    alive = true
    killed = false
  }
}

function respawnChild() {
  if (alive) {
    killChild()
  } else {
    spawnChild()
  }
}

function cleanUp() {
  if (alive) {
    alive = false
    if (killed) {
      respawnChild()
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    } else {
      process.stdin.resume()
    }
  }
}

spawnChild()
