'use strict';

var Icon = require("./Icon.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Vrroom = require("vrroom/src/Vrroom.bs.js");
var ReasonReact = require("reason-react/src/ReasonReact.js");
var TypedGlamor = require("bs-typed-glamor/src/TypedGlamor.bs.js");
var ButtonStyles = require("./ButtonStyles.bs.js");

function makeIcon(param) {
  if (param) {
    return ReasonReact.element(/* None */0, /* None */0, Icon.make(param[0], /* array */[]));
  } else {
    return Vrroom.nothing;
  }
}

var component = ReasonReact.statelessComponent("Button");

function make(label, icon, $staropt$star, $staropt$star$1, $staropt$star$2, onClick, _) {
  var style = $staropt$star ? $staropt$star[0] : /* Normal */-453122489;
  var alignIcon = $staropt$star$1 ? $staropt$star$1[0] : /* Left */847852583;
  var className = $staropt$star$2 ? $staropt$star$2[0] : "";
  return /* record */[
          /* debugName */component[/* debugName */0],
          /* reactClassInternal */component[/* reactClassInternal */1],
          /* handedOffState */component[/* handedOffState */2],
          /* willReceiveProps */component[/* willReceiveProps */3],
          /* didMount */component[/* didMount */4],
          /* didUpdate */component[/* didUpdate */5],
          /* willUnmount */component[/* willUnmount */6],
          /* willUpdate */component[/* willUpdate */7],
          /* shouldUpdate */component[/* shouldUpdate */8],
          /* render */(function () {
              var match = alignIcon === /* Left */847852583;
              var match$1 = alignIcon === /* Right */-57574468;
              return React.createElement("button", {
                          className: Curry._1(Vrroom.Helpers[/* ClassName */5][/* join */0], /* :: */[
                                TypedGlamor.toString(ButtonStyles.root(style, alignIcon)),
                                /* :: */[
                                  className,
                                  /* [] */0
                                ]
                              ]),
                          onClick: (function () {
                              return Curry._1(onClick, /* () */0);
                            })
                        }, match ? makeIcon(icon) : Vrroom.nothing, Vrroom.text(label), match$1 ? makeIcon(icon) : Vrroom.nothing);
            }),
          /* initialState */component[/* initialState */10],
          /* retainedProps */component[/* retainedProps */11],
          /* reducer */component[/* reducer */12],
          /* subscriptions */component[/* subscriptions */13],
          /* jsElementWrapped */component[/* jsElementWrapped */14]
        ];
}

var Styles = 0;

exports.Styles = Styles;
exports.makeIcon = makeIcon;
exports.component = component;
exports.make = make;
/* component Not a pure module */
