var _result;
  var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser());


app.get('/', function (req, res) {
res.send(`APIs: <div></div>
/interpretJS`)
})

app.post('/interpretJS', function (req, rees) {
  console.log=function(a){rees.json({result: a})}
            function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

const util = require("util");
const repl = require("repl");
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const rl = require("./readline-sync.js");
const Module = require("module");

let r;

// Red errors.
function logError(msg) {
  process.stdout.write("\u001b[0m\u001b[31m" + msg + "\u001b[0m");
}

// The nodejs repl operates in raw mode and does some funky stuff to
// the terminal. This ns the repl and forces non-raw mode.
function pauseRepl() {
  if (!r) return;

  r.pause();
  process.stdin.setRawMode(false);
}

// Forces raw mode and resumes the repl.
function resumeRepl() {
  if (!r) return;

  process.stdin.setRawMode(true);
  r.resume();
}

// Clear the line if it has anything on it.
function clearLine() {
  if (r && r.line) r.clearLine();
}

// Adapted from the internal node repl code just a lot simpler and adds
// red errors (see https://bit.ly/2FRM86S)
function handleError(e) {
  if (r) {
    r.lastError = e;
  }

  if (e && typeof e === "object" && e.stack && e.name) {
    if (e.name === "SyntaxError") {
      e.stack = e.stack
        .replace(/^repl:\d+\r?\n/, "")
        .replace(/^\s+at\s.*\n?/gm, "");
    }

    logError(e.stack);
  } else {
    // For some reason needs a newline to flush.
    logError("Thrown: " + r.writer(e) + "\n");
  }

  if (r) {
    r.clearBufferedCommand();
    r.lines.level = [];
    r.displayPrompt();
  }
}

function start(context) {
  r = repl.start({
    prompt: process.env.PRYBAR_PS1,
    useGlobal: true,
  });

  // remove the internal error and ours for red etc.
  r._domain.removeListener("error", r._domain.listeners("error")[0]);
  r._domain.on("error", handleError);
  process.on("uncaughtException", handleError);
}

global.alert = console.log;
global.prompt = (p) => {
  pauseRepl();
  clearLine();

  let ret = rl.question(`${p}> `, {
    hideEchoBack: false,
  });

  resumeRepl();

  // Display prompt on the next turn.
  if (r) setImmediate(() => r.displayPrompt());

  return ret;
};

global.confirm = (q) => {
  pauseRepl();
  clearLine();

  const ret = rl.keyInYNStrict(q);

  resumeRepl();

  // Display prompt on the next turn.
  if (r) setImmediate(() => r.displayPrompt());
  return ret;
};

if (req.body.code) {
  vm.runInThisContext(req.body.code);
  if (process.env.PRYBAR_INTERACTIVE) {
    start();
  }
} else if (process.env.PRYBAR_EXP) {
 console.log(vm.runInThisContext(process.env.PRYBAR_EXP));
  if (process.env.PRYBAR_INTERACTIVE) {
    start();
  }
} else if (process.env.PRYBAR_FILE) {
  const mainPath = path.resolve(process.env.PRYBAR_FILE);
  const main = fs.readFileSync(mainPath, "utf-8");
  const module = new Module(mainPath, null);

  module.id = ".";
  module.filename = mainPath;
  module.paths = Module._nodeModulePaths(path.dirname(mainPath));

  process.mainModule = module;

  global.module = module;
  global.require = module.require.bind(module);
  global.__dirname = path.dirname(mainPath);
  global.__filename = mainPath;

  console.log(
    "\u001b[0m\u001b[90mHint: hit control+c anytime to enter REPL.\u001b[0m"
  );

  let script;
  try {
    script = vm.createScript(req.body.code, {
      filename: mainPath,
      displayErrors: false,
    });
  } catch (e) {
    handleError(e);
  }

  if (script) {
    let res;
    try {
      res = script.runInThisContext({
        displayErrors: false,
      });
     } catch (e) {
      handleError(e);
    }

    module.loaded = true;

    if (typeof res !== "undefined") {
      console.log(util.inspect(res, { colors: true }));
    }
  }

  if (process.env.PRYBAR_INTERACTIVE) {
    process.once("SIGINT", () => start());
    process.once("beforeExit", () => start());
  }
} else if (process.env.PRYBAR_INTERACTIVE) {
  start();
}

});


var server = app.listen(8000, function () {  
  var host = server.address().address  
  var port = server.address().port  
  console.log("listening at http://%s:%s", host, port)  
})  
