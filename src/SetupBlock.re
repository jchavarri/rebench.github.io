open Rebase;
module Styles = SetupBlockStyles;

let text = ReasonReact.stringToElement;

let component = ReasonReact.statelessComponent("TestCase");
let make = (~code, ~onChange, _children) => {
  ...component,

  render: (_) =>
    <div className=Styles.root>
      <div className=Styles.header>
        ("Setup" |> text)
      </div>
      <Editor value=code lang=`RE onChange=((code) => onChange(code)) />
    </div>
};