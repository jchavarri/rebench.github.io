open! Rebase;
open! Helpers;

let component = ReasonReact.statelessComponent("SetupBlock");
let make = (~code, ~onChange, _children) => {
  ...component,

  render: (_) =>
    <SyntaxChecker input=(`RE, code) wait=100>
      ...(((isError, marks)) =>

        <Block_ className=(isError ? "s-error" : "") header=`Text("Setup") collapsible=true>
          <Editor value=code lang=`RE onChange marks />
        </Block_>)

    </SyntaxChecker>
};