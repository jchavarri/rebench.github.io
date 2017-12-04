let _toArray = Array.of_list;
let _assoc = List.assoc;
let _remove_assoc = List.remove_assoc;
open! Rebase;
open! Helpers;

module Styles = AppStyles;

type state = {
  tests: list((Test.id, Test.state)),
  worker: ref(Worker.t)
};

type actions =
  | AddTest
  | UpdateTest(Test.t)
  | RemoveTest(Test.t)
  | UpdateSetup(string)
  | Clear
  | RunAll
  | RunSingle(Test.t)
  | WorkerMessage(Worker.Message.receive)
;

let _recalculateScores = (tests) => {
  let fastest =
    tests |> List.map(
              fun | (_, Test.Complete({ hz }, _)) => Some(hz)
                  | _ => None)
          |> List.filter(Option.isSome)
          |> List.map(Option.getOrRaise)
          |> List.reduce(Js.Math.max_float, 0.);

  tests |> List.map(
            fun | (id, Test.Complete({ hz } as result, _)) =>
                  (id, Test.Complete(result, Some((hz -. fastest) /. fastest *. 100.)))
                | test => test)
};

let component = ReasonReact.reducerComponent("App");
let make = (~data: Store.data,
            ~url,
            ~updateStore,
            _children) => {
  ...component,

  initialState: () => {
    tests: [],
    worker: ref(Worker.make(~onMessage=Js.log)) /* TODO: a bit hacky default */
  },

  didMount: ({ reduce, state }) => {
    ReasonReact.Update({
      ...state,
      worker: ref(Worker.make(
        ~onMessage  = reduce(message => WorkerMessage(message))
      ))
    })
  },

  reducer: (action, state) => {
    let run = tests =>
      tests |> List.map((test: Test.t) => (test.id, Compiler.compile(data.setup, test)))
            |> List.map(
                 fun | (id, Compiler.Ok(code)) => (id, code)
                     | (id, Warning(code, _))  => (id, code)
                     | (id, _)                 => (id, "throw Error('failed to compile');"))
            |> tests => state.worker^.postMessage(Run(tests));

    switch action {
    
    | AddTest =>
      ReasonReact.SideEffects(
        _self => updateStore(Store.AddTest)
      )

    | UpdateTest(test) =>
      ReasonReact.UpdateWithSideEffects({
          ...state,
          tests:
            state.tests |> List.map(((id, _) as this) =>
                             id !== test.id ? this : (id, Test.Untested))
                        |> _recalculateScores
        },
        _self => updateStore(Store.UpdateTest(test))
      )

    | RemoveTest(test) =>
      ReasonReact.UpdateWithSideEffects({
          ...state,
          tests:
            state.tests |> List.filter(((id, _)) => id !== test.id)
                        |> _recalculateScores
        },
        _self => updateStore(Store.RemoveTest(test))
      )

    | UpdateSetup(code) =>
      ReasonReact.UpdateWithSideEffects({
          ...state,
          tests: []
        },
        _self => updateStore(Store.UpdateSetup(code))
      )

    | Clear =>
      ReasonReact.UpdateWithSideEffects({
          ...state,
          tests: []
        },
        _self => updateStore(Store.Clear)
      )
    
    | RunAll =>
      ReasonReact.SideEffects(
        _self => run(data.tests)
      )
  
    | RunSingle(test) =>
      ReasonReact.SideEffects(
        _self => run([test])
      )
  
    | WorkerMessage(TestCycle(id, result)) =>
      ReasonReact.Update({
        ...state,
        tests:
          [
            (id, Test.Running(result)),
            ..._remove_assoc(id, state.tests)
          ]
      })

    | WorkerMessage(TestError(id, error)) =>
      ReasonReact.Update({
        ...state,
        tests:
          [
            (id, Test.Error(error)),
            ..._remove_assoc(id, state.tests)
          ]
      })
  
    | WorkerMessage(SuiteCycle(id, result)) =>
      ReasonReact.Update({
        ...state,
        tests:
          [
            (id, Test.Complete(result, None)),
            ..._remove_assoc(id, state.tests)
          ] |> _recalculateScores
      })
  
    | WorkerMessage(SuiteComplete) =>
      ReasonReact.NoUpdate

    | WorkerMessage(WorkerError(error)) =>
      ReasonReact.SideEffects(
        _self => Js.log(error)
      )
    }
  },

  render: ({ reduce, state }) =>
    <div className=Styles.root>
      <Toolbar onRunAll     = reduce(() => RunAll)
               onAdd        = reduce(() => AddTest)
               onClear      = reduce(() => Clear)
               shareableUrl = url />

      <WidthContainer>
        <SetupBlock code      = data.Store.setup
                    onChange  = reduce(code => UpdateSetup(code)) />

        (
          data.tests
            |> List.map(test =>
                <TestBlock
                    key       = (test.Test.id |> Test.Id.toString)
                    onChange  = reduce(changed => UpdateTest(changed))
                    onRun     = reduce(() => RunSingle(test))
                    onRemove  = reduce(() => RemoveTest(test))
                    onLanguageChange
                              = reduce(language => UpdateTest({ ...test, language }))
                    data      = test
                    setup     = data.setup
                    state     = (try (_assoc(test.id, state.tests)) {
                                | Not_found => Test.Untested
                                })
                />)
            |> List.reverse
            |> _toArray
            |> ReasonReact.arrayToElement
        )
      </WidthContainer>

      <footer className=Styles.footer>
        <WidthContainer>
          <section>
            <h1> ("Project" |> text) </h1>
            <ul>
              <li> <a href="https://github.com/rebench/rebench.github.io"> ("Source Code Repository" |> text) </a> </li>
              <li> <a href="https://github.com/rebench/rebench.github.io/issues"> ("Support / Bug Tracker" |> text) </a> </li>
            </ul>
          </section>

          <section>
            <h1> ("Made with" |> text) </h1>
            <ul>
              <li> <a href="https://github.com/bucklescript/bucklescript"> ("BuckleScript" |> text) </a> </li>
              <li> <a href="https://benchmarkjs.com/"> ("Benchmark.js" |> text) </a> </li>
              <li> <a href="https://codemirror.net/"> ("CodeMirror" |> text) </a> </li>
              <li> <a href="https://reasonml.github.io/reason-react/"> ("ReasonReact" |> text) </a> </li>
              <li> <a href="https://github.com/threepointone/glamor"> ("glamor" |> text) </a> </li>
            </ul>
          </section>

          <section>
            <h1> ("Reason" |> text) </h1>
            <ul>
              <li> <a href="https://reasonml.github.io/guide"> ("Reason Guide" |> text) </a> </li>
              <li> <a href="https://reasonml.github.io/try"> ("Reason Playground" |> text) </a> </li>
            </ul>
          </section>
        </WidthContainer>
      </footer>
    </div>
};
