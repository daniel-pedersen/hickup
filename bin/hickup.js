#!/usr/bin/env node
"use strict";

var _child_process = require("child_process");

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var usage = ["Usage: hickup [options] command [arguments]", "", "Options:", "  -t, --timeout ms  time to wait before SIGKILL (default 10000)"].join("\n");

var _parseArgs = (0, _minimist2.default)(process.argv.slice(2), {
  alias: { timeout: "t" },
  default: { timeout: 1e4 },
  stopEarly: true
});

var timeout = _parseArgs.timeout;

var _parseArgs$_ = _toArray(_parseArgs._);

var command = _parseArgs$_[0];

var args = _parseArgs$_.slice(1);

if (command == null) {
  console.log(usage);
  process.exit();
}

var child = undefined;

function killSelf() {
  if (child == null) {
    process.exit();
  } else {
    killChild(process.exit);
  }
}

function killChild(cb) {
  if (child != null) {
    (function () {
      var tid = setTimeout(forceKillChild, timeout);
      child.once("exit", function () {
        clearTimeout(tid);
        cb();
      });
      child.kill();
    })();
  }
}

function forceKillChild() {
  if (child != null) {
    child.kill("SIGKILL");
  }
}

function spawnChild() {
  if (child == null) {
    child = (0, _child_process.spawn)(command, args, { stdio: "inherit" });
    child.on("exit", onExit).on("error", onError);
  } else {
    killChild(spawnChild);
  }
}

function onExit(code, signal) {
  child.removeAllListeners();
  child = null;
}

function onError(err) {
  throw err;
}

process.on("SIGHUP", spawnChild).on("SIGTERM", killSelf).on("SIGINT", killSelf).on("SIGQUIT", killSelf);["SIGILL", "SIGTRAP", "SIGABRT", "SIGIOT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGPIPE", "SIGALRM", "SIGCHLD", "SIGSTKFLT", "SIGCONT", "SIGTSTP", "SIGBREAK", "SIGTTIN", "SIGTTOU", "SIGURG", "SIGXCPU", "SIGXFSZ", "SIGVTALRM", "SIGPROF", "SIGWINCH", "SIGIO", "SIGPOLL", "SIGLOST", "SIGPWR", "SIGSYS", "SIGUNUSED"].forEach(function (signal) {
  process.on(signal, function () {
    if (child != null) {
      child.kill(signal);
    }
  });
});

spawnChild();
setInterval(function () {}, -1 >>> 1);
