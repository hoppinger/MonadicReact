# Introduction
In this article we discuss the journey of Hoppinger, an innovative web development company, across the perilous lands of modern client-side web-application development with React and modern JavaScript variants such as TypeScript.

By boldly committing to the strictest software engineering disciplines of static typing, referential transparency, and functional programming, we are observing a significant increase in the quality and reliability of our deployed products, not to mention developer efficiency (when taking into account dramatic reduction in bugs and defects).

# The wonders of React and TypeScript
About a year ago, at Hoppinger, we made a serious switch to React and TypeScript. The goal was to stop with writing spaghetti-jQuery, and to embrace single page applications (SPA's).

The big improvement of React over jQuery is simply lack of mutable shared state. When components can only communicate via callbacks, they effectively become referentially transparent: each component will always behave the same as long as it receives the same starting properties. This fundamental reliability makes React components simpler to reuse and to compose with each other.

Of course, as more and more code was written in React, we found ourselves confrontend with the issue of correctly composing components with complex interfaces. The question "what properties does this component expect?" becomes so recurring, that you begin to wonder if a better experience is possible.

## Enter TypeScript
Shortly after our dive into React, we realized that TypeScript was the answer to our secondary problem: by using static typing and an alert compiler, we can get contextual help (and often also beautiful visual help in our editor) whenever we pass the wrong parameters to functions and components.

## The bliss
At this point, we had reached a temporary state of nirvana: we could build beautiful reusable components, and using and combining them together happen effortlessly thanks to the helping hand of TypeScript.


# The pains of React and TypeScript
Of course, the honeymoon phase was soon over. We quickly realized that the toolchain we had set up introduced new issues. One of the most evident was the huge amount of cerimony needed around the definition and invocation of a React component. Lots of components with just some basic local state will look like:

```typescript
type Props = { ... }
type State = { ... }
class Comp extends React.Component<Props, State> {
  constructor(p:Props, context:any) {
    super(p, context)

    this.state = { ... }
  }
  componentWillMount() {
    ...
  }
  componentWillUnmount() {
    ...
  }
  componentWillReceiveProps(p:Props) {
    ...
  }
  render() {
    ...
  }
}
```

Notice that we have not even gotten the chance yet to specify **what** the component even does, this is all just surrounding noise.

Moreover, it becomes quickly evident that without some very serious complexity, building truly generic abstract libraries of components requires a veritable mountain of glue code. _Dispatching containers_ will quickly pop out all over the place, looking roughly like:

```typescript
type Props = { ... }
type State = { step:"A"|"B"|"C"|..., ... }
class Comp extends React.Component<Props, State> {
  constructor(p:Props, context:any) {
    super(p, context)

    this.state = { step:"A", ... }
  }
  componentWillMount() {
    ...
  }
  componentWillUnmount() {
    ...
  }
  componentWillReceiveProps(p:Props) {
    ...
  }
  render() {
    return step == "A" ?
        <AComponent data={this.state...} callback={x => this.setState(...)} />
      : step == "B" ?
        <BComponent data={this.state...} callback={y => this.setState(...)} />
      : ...
  }
}
```

The mere creation of a form or a wizard, which is conceptually very simple, becomes unwieldy and verbose. Even though this does not offset the great power of this combination of React and TypeScript (the result is good enough more often than not!), it left us to wonder whether or not it would be possible to define better libraries and abstractions.

# The wonders of `monadic_react`
Fortunately, this sort of problem has already been encountered, and conquered, in other domains within informatica. The functional programming community, in their quest to translate the elegance of mathematical and logical constructs into programming languages, stumbled across the concept of "monads". Monads are a very abstract concept which is, surpisingly, proving to be almost a silver bullet capable of fixing issues related to:
- concurrency management (`async/await` in ES6, TypeScript, and C#);
- query management (`flatMap` in Immutablejs, `Stream` in Java, `LINQ` in C#);
- collection management (`generators` in Python and JavaScript, `yield return` in C#);
- and much more...

The impact of monads has been so profound and has led to some languages standing at the forefront of innovation (Haskell, F# and Scala among others) to acquire an extension to their syntax to make the use of generic monads visually more pleasant.

## The intuition
Sometimes we get lost in the more operative aspects of a given technology, thereby losing sight of the bigger picture or abstracting away details which were actually relevant (and thus must not be abstracted away!).

Consider an HTML control, such as `<input type="text" ... />`. What are its inputs and outputs? A naïve answer would point out that the `input` control has:
- the user written text as input;
- the input box in the page as output.

This *user centric approach* is certainly fundamental when building interactive systems, but does not help during the *engineering phase*. During the engineering phase, we are rather **assembling a network of interconnected elements on a page**.

This means, that, with respect to this interconnected network of elements on a page, the `<input type="text" ... />` seen before should be seen as having:
- the initial text as input;
- text as output (whenever the user types something).

Notice how the input and the output have been turned around with respect to the naïve definition, and even better, how we are now ignoring all the details that are not relevant for the composition of elements.

We can indeed give a general definition of our monadic react components, capturing the fact that a component which produces an output of type `A` is a react renderable (`JSX.Element`) which encapsulates a continuation (`cont`) which is called back whenever the `JSX.Element` is capable of yielding yet another output:

```typescript
type C<A> = (cont:(_:A)=>void) => JSX.Element
```

We can easily bind different components together. Suppose we had a component `select_number:C<number>`, we could print only the even numbers by saying:

```typescript
select_number
.filter(n => n % 2 == 0)
.map(n => `The last even number you typed is ${n}`)
.then(s => string("view")(s))
```

(Note: this is actual monadic react code!)

Scaling this approach up to forms, wizards, menus, and much more is, so far, holding up. For example, here is the actual code from a form:

```
let course_form_sample : C<void> =
  simple_form_with_save_button("edit", c => `course_${c.Id}`,
  [
    { kind:"string", field_name:"Name",
      in:c => c.Name || "", out:c => (n:string) => ({...c, Name:n}),
      get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind:"number", field_name:"Points",
      in:c => c.Points || 0, out:c => (p:number) => ({...c, Points:p}),
      get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] },
    { kind:"date", field_name:"Begin",
      in:c => c.StartDate, out:c => (p:Moment.Moment) => ({...c, StartDate:p}),
      get_errors:c=>[] },
  ],
  download_course(1), upload_course)
```

The definition of the form has essentially become declarative and is now very hard to get wrong.

Moreover, since the type of the object is now `C<void>`, the form itself can be composed wherever we might want, for example to build a larger form or a larger page with multiple components working in unison. As they say, it's [turtles all the way down](https://en.wikipedia.org/wiki/Turtles_all_the_way_down).

### The rest of the React world?
`monadic react` supports, of course, the integration of its structures within existing React applications, thereby allowing developers to introduce it on a very small scale, as an easily replaceable peripheric functionality, and use it more and more if desired and/or convenient.

At the same time, existing React components can be wrapped inside a thin adapter in order to be used by a `monadic react` library. This makes it possible to reuse existing React code without having to refactor it. Moreover, the wrapping requires simply passing a continuation (callback) that notifies the rest of `monadic react` of the fact that the external component has produced some data that need to be processed.

## The benefits
The main benefits that we have noticed are:
- we write less code: this reduces the attack surface where potential bugs may hide;
- we write less boring code: this allows us to focus on the functionality, not boring plumbing;
- we can define templates: this allows us to create a DSL per application;
- we still have code and regular old functions everywhere: we can do plenty of regular coding between components;
- we can easily compose and recompose components: this allows us to experiment and refactor SPA applications quickly.

## The challenges
Of course, there also are some challenges involved. The largest bottleneck for adoption is, of course, defined by spreading knowledge within the team of developers. This requires starting small, supporting developers should they encounter trouble, and pushing quality as a driving factor against the "yet another thing to learn" emotional response.

## Useful links
All sources are shared, of course, under an open source license (MIT). The project also has an npm package.

To see the library in action, you can jump to:
- [the npm package](https://www.npmjs.com/package/monadic_react);
- [the project repository](https://github.com/giuseppemag/MonadicReact);
- [the sample repository](https://github.com/hoppinger/monadic-react-sample);
- [the published sample](https://monadic_react.productie.hoppinger.com/).

# Conclusion
The world of web development is changing, fast. Innovation is moving fast, and large companies educate users every day to the marvelous possibilities that web sites and web applications offer. This makes life exciting, but also less than easy, for web developers: the technology to support this change is rapidly increasing in complexity, as the applications that customers require as the norm are more and more rich and interactive.

Staying ahead of the wave requires thinking in dynamic terms, and embracing, rather than fighting, the adoption of more reliable engineering practices. Teams that dare to do this will thrive in this beautifully changing world.
