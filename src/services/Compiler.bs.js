'use strict';

var Block = require("bs-platform/lib/js/block.js");
var BsBox = require("bs-in-a-box/src/BsBox.bs.js");
var Refmt = require("bs-refmt/src/Refmt.bs.js");
var Acorn = require("acorn");
var Js_exn = require("bs-platform/lib/js/js_exn.js");
var Rebase = require("@glennsl/rebase/src/Rebase.bs.js");
var Template = require("./Template.bs.js");
var Js_primitive = require("bs-platform/lib/js/js_primitive.js");

function fromRefmt(e) {
  return /* record */[
          /* message */e[/* message */0],
          /* from : record */[
            /* line */e[/* from */1][/* line */0] - 2 | 0,
            /* column */e[/* from */1][/* column */1] - 1 | 0
          ],
          /* until : record */[
            /* line */e[/* until */2][/* line */0] - 2 | 0,
            /* column */e[/* until */2][/* column */1]
          ]
        ];
}

function fromAcorn(e) {
  var loc = e.loc;
  return /* record */[
          /* message */Rebase.Option[/* getOrRaise */17](Js_primitive.undefined_to_opt(e.message)),
          /* from : record */[
            /* line */loc.line - 1 | 0,
            /* column */loc.column
          ],
          /* until : record */[
            /* line */loc.line - 1 | 0,
            /* column */loc.column + 1 | 0
          ]
        ];
}

function toMark(error) {
  return {
          from: {
            line: error[/* from */1][/* line */0],
            ch: error[/* from */1][/* column */1]
          },
          to: {
            line: error[/* until */2][/* line */0],
            ch: error[/* until */2][/* column */1]
          },
          options: {
            className: "syntax-error",
            title: error[/* message */0]
          }
        };
}

var $$SyntaxError = /* module */[
  /* fromRefmt */fromRefmt,
  /* fromAcorn */fromAcorn,
  /* toMark */toMark
];

function _assemble(setup, code) {
  return setup + ("\n" + code);
}

function _check(language, code) {
  if (language !== 17247) {
    if (language >= 18355) {
      return Rebase.Result[/* map2 */1](Refmt.printRE, (function (param) {
                    return fromRefmt(param[1]);
                  }), Refmt.parseRE(Template.apply(language, code)));
    } else {
      var exit = 0;
      var val;
      try {
        val = Acorn.parse(code);
        exit = 1;
      }
      catch (raw_exn){
        var exn = Js_exn.internalToOCamlException(raw_exn);
        if (exn[0] === Js_exn.$$Error) {
          return /* Error */Block.__(1, [fromAcorn(exn[1])]);
        } else {
          throw exn;
        }
      }
      if (exit === 1) {
        return /* Ok */Block.__(0, [Template.apply(/* JS */16585, code)]);
      }
      
    }
  } else {
    return Rebase.Result[/* map2 */1](Refmt.printRE, (function (param) {
                  return fromRefmt(param[1]);
                }), Refmt.parseML(Template.apply(language, code)));
  }
}

function checkSetup(code) {
  var param = Refmt.parseRE(code);
  if (param.tag) {
    var e = fromRefmt(param[0][1]);
    return /* Error */Block.__(2, [
              e[/* message */0],
              /* :: */[
                toMark(e),
                /* [] */0
              ]
            ]);
  } else {
    var param$1 = BsBox.compile(Refmt.printML(param[0]));
    if (param$1.tag) {
      return /* Error */Block.__(2, [
                param$1[0][1][/* message */0],
                /* [] */0
              ]);
    } else {
      var match = param$1[0];
      var warnings = match[/* warnings */1];
      var code$1 = match[/* code */0];
      if (warnings === "") {
        return /* Ok */Block.__(0, [code$1]);
      } else {
        return /* Warning */Block.__(1, [
                  code$1,
                  warnings
                ]);
      }
    }
  }
}

function compileTest(setup, test) {
  var param = _check(test[/* language */1], test[/* code */2]);
  if (param.tag) {
    var e = param[0];
    return /* Error */Block.__(2, [
              e[/* message */0],
              /* :: */[
                toMark(e),
                /* [] */0
              ]
            ]);
  } else {
    var param$1 = Rebase.Result[/* flatMap */6](BsBox.compile, Rebase.Result[/* map */0](Rebase.Fn[/* id */0], Rebase.Result[/* map */0](Refmt.printML, Refmt.parseRE(_assemble(setup, param[0])))));
    if (param$1.tag) {
      return /* Error */Block.__(2, [
                param$1[0][1][/* message */0],
                /* [] */0
              ]);
    } else {
      var match = param$1[0];
      var warnings = match[/* warnings */1];
      var code = match[/* code */0];
      if (warnings === "") {
        return /* Ok */Block.__(0, [code]);
      } else {
        return /* Warning */Block.__(1, [
                  code,
                  warnings
                ]);
      }
    }
  }
}

exports.$$SyntaxError = $$SyntaxError;
exports._assemble = _assemble;
exports._check = _check;
exports.checkSetup = checkSetup;
exports.compileTest = compileTest;
/* BsBox Not a pure module */
