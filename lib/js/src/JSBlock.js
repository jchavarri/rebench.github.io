'use strict';

var React            = require("react");
var Editor           = require("./components/Editor.js");
var ReasonReact      = require("reason-react/lib/js/src/reasonReact.js");
var SetupBlockStyles = require("./SetupBlockStyles.js");

function text(prim) {
  return prim;
}

var component = ReasonReact.statelessComponent("TestCase");

function make(code, _) {
  var newrecord = component.slice();
  newrecord[/* render */9] = (function () {
      return React.createElement("div", {
                  className: SetupBlockStyles.root
                }, React.createElement("div", {
                      className: SetupBlockStyles.header
                    }, "Generated JavaScript"), ReasonReact.element(/* None */0, /* None */0, Editor.make(code, /* JS */16585, /* None */0, /* Some */[/* true */1], /* None */0, /* None */0, /* array */[])));
    });
  return newrecord;
}

var Styles = 0;

exports.Styles    = Styles;
exports.text      = text;
exports.component = component;
exports.make      = make;
/* component Not a pure module */