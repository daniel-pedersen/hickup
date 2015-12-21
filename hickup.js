#!/usr/bin/env node

import { spawn } from "child_process"

const killTimeout = 10000

function spawner() {
  return spawn(process.argv[2], process.argv.slice(3), { stdio: "inherit" })
}

let child = spawner()

process.on("SIGHUP", () => {
  console.log("SIGHUP: Restarting...")
  child.kill()

  let killed = false
  const timeout = setTimeout(() => child.kill("SIGKILL"), killTimeout)

  function cleanUp() {
    if (!killed) {
      killed = true
      clearTimeout(timeout)
      child = spawner()
    }
  }

  child
  .once("error", cleanUp)
  .once("exit", cleanUp)
})

// TODO: signal propagation
