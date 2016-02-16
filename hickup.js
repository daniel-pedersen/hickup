#!/usr/bin/env node
import { spawn } from "child_process"
import parseArgs from "minimist"

const usage = [
  "Usage: hickup [options] command [arguments]",
  "",
  "Options:",
  "  -t, --timeout ms  time to wait before SIGKILL (default 10000)"
].join("\n")

const { timeout, _: [command, ...args] } = parseArgs(process.argv.slice(2), {
  alias: { timeout: "t" },
  default: { timeout: 1e4 },
  stopEarly: true
})

if (command == null) {
  console.log(usage)
  process.exit()
}

let child

function killSelf() {
  if (child == null) {
    process.exit()
  } else {
    killChild(process.exit)
  }
}

function killChild(cb) {
  if (child != null) {
    let tid = setTimeout(forceKillChild, timeout)
    child.once("exit", () => {
      clearTimeout(tid)
      cb()
    })
    child.kill()
  }
}

function forceKillChild() {
  if (child != null) {
    child.kill("SIGKILL")
  }
}

function spawnChild() {
  if (child == null) {
    child = spawn(command, args, { stdio: "inherit" })
    child.on("exit", onExit).on("error", onError)
  } else {
    killChild(spawnChild)
  }
}

function onExit(code, signal) {
  child.removeAllListeners()
  child = null
}

function onError(err) {
  throw err
}

process
  .on("SIGHUP", spawnChild)
  .on("SIGTERM", killSelf)
  .on("SIGINT", killSelf)
  .on("SIGQUIT", killSelf)

;[
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGIOT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
  "SIGSEGV",
  "SIGUSR2",
  "SIGPIPE",
  "SIGALRM",
  "SIGCHLD",
  "SIGSTKFLT",
  "SIGCONT",
  "SIGTSTP",
  "SIGBREAK",
  "SIGTTIN",
  "SIGTTOU",
  "SIGURG",
  "SIGXCPU",
  "SIGXFSZ",
  "SIGVTALRM",
  "SIGPROF",
  "SIGWINCH",
  "SIGIO",
  "SIGPOLL",
  "SIGLOST",
  "SIGPWR",
  "SIGSYS",
  "SIGUNUSED"
].forEach(signal => {
  process.on(signal, () => {
    if (child != null) {
      child.kill(signal)
    }
  })
})

spawnChild()
setInterval(() => {}, -1 >>> 1)
