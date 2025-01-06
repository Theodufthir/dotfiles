import { Binding } from "astal"
import { Variable } from "astal/variable"
import { Connectable, bind, Subscribable } from "astal/binding"


function nDerive<
  Source extends Connectable,
  Prop extends keyof Source,
  TransformArgs extends { [Property in Prop]: Source[Property] },
  Result,
>(connectable: Source, props: Prop[], transform: (_: TransformArgs) => Result): Variable<Result>

function nDerive<
  Source extends Connectable,
  Prop extends keyof Source,
  TransformArgs extends { [Property in Prop]: Source[Property] },
  Result,
>(subscribable: Subscribable<Source>, props: Prop[], transform: (_: TransformArgs) => Result): Variable<Result>

function nDerive(obj: Connectable | Subscribable<Connectable>, props: string[], transform: (_: object) => any): Variable<any> {
  if (typeof obj["connect"] === "function") {
    return Variable.derive(
      props.map(prop => bind(obj as Connectable, prop)), (...values) => transform(
        Object.fromEntries(values.map((val, idx) => [props[idx], val]))
      )
    )
  } else if (typeof obj["subscribe"] === "function") {
    let derivation: Variable<any> | undefined
    const variable: Variable<any> = Variable({})

    const attachNewDerivation = (newConnectable: Connectable) => {
      derivation?.drop()
      derivation = newConnectable !== undefined ? nDerive(newConnectable, props, transform) : undefined
      const unsubscribe = derivation?.subscribe(val => variable.set(val))
      derivation?.onDropped(unsubscribe!)
      variable.set(derivation?.get())
    }

    attachNewDerivation(obj.get())
    const unsubscribe = obj.subscribe(attachNewDerivation)

    return variable.onDropped(unsubscribe)
  }

  throw new Error("Not derivable")
}


function nTrigger<
  Source extends Connectable,
  Prop extends keyof Source,
>(obj: Source, props: Prop[]): Variable<Source>

function nTrigger<
  Source extends Connectable,
  Prop extends keyof Source,
  Props extends Prop[],
>(obj: Subscribable<Source>, props: Props): Variable<Source>

function nTrigger(obj: Connectable | Subscribable<Connectable>, props: string[]) {
  if (typeof obj["connect"] === "function") {
    let state = false
    const connectable = obj as Connectable
    const variable = Variable(connectable)
    variable.observe(props.map(prop => [connectable, `notify::${prop as string}`]), _ =>
      ((state =! state) ? {} : obj) as Connectable)
    variable.get = () => connectable
    return variable
  } else if (typeof obj["subscribe"] === "function") {
    let connected: Variable<any> | undefined
    const variable: Variable<any> = Variable({})

    const attachNewDerivation = (newConnectable: Connectable) => {
      connected?.drop()
      connected = nTrigger(newConnectable, props)
      const unsubscribe = connected.subscribe(val => variable.set(val))
      connected.onDropped(unsubscribe)
      variable.set(connected.get())
    }

    attachNewDerivation(obj.get())
    const unsubscribe = obj.subscribe(attachNewDerivation)

    return variable.onDropped(unsubscribe)
  }

  throw new Error("Not n-connectable")
}


function nBind<
  Result
>(obj: Subscribable<Result>): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop extends keyof Object,
  Result extends Object[Prop],
>(obj: Object, prop: Prop): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop_1 extends keyof Object,
  Inter extends Object[Prop_1] & Connectable,
  Prop_2 extends keyof Object[Prop_1],
  Result extends Inter[Prop_2],
>(obj: Object, prop_1: Prop_1, prop_2: Prop_2): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop_1 extends keyof Object,
  Inter_1 extends Object[Prop_1] & Connectable,
  Prop_2 extends keyof Object[Prop_1],
  Inter_2 extends Inter_1[Prop_2] & Connectable,
  Prop_3 extends keyof Inter_1[Prop_2],
  Result extends Inter_2[Prop_3],
>(obj: Object, prop_1: Prop_1, prop_2: Prop_2, prop_3: Prop_3): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop extends keyof Object,
  Result extends Object[Prop],
>(obj: Subscribable<Object>, prop: Prop): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop_1 extends keyof Object,
  Inter extends Object[Prop_1] & Connectable,
  Prop_2 extends keyof Object[Prop_1],
  Result extends Inter[Prop_2],
>(obj: Subscribable<Object>, prop_1: Prop_1, prop_2: Prop_2): Binding<Result>

function nBind<
  Object extends Connectable,
  Prop_1 extends keyof Object,
  Inter_1 extends Object[Prop_1] & Connectable,
  Prop_2 extends keyof Object[Prop_1],
  Inter_2 extends Inter_1[Prop_2] & Connectable,
  Prop_3 extends keyof Inter_1[Prop_2],
  Result extends Inter_2[Prop_3],
>(obj: Subscribable<Object>, prop_1: Prop_1, prop_2: Prop_2, prop_3: Prop_3): Binding<Result>

function nBind(obj: Connectable | Subscribable<any>, ...props: string[]) {
  let binding = typeof obj["connect"] === "function" ? bind(obj as Connectable, props.shift()!) : bind(obj as Subscribable)
  for (; props.length > 0; props.shift())
    binding = _nBind(binding, props[0])
  return binding
}

function _nBind<
  Object extends Connectable,
  Prop extends keyof Object,
  Value extends Object[Prop]
>(subscribable: Subscribable<Object>, property: Prop): Binding<Value> {
  const getSubscribeFct = (binding: Binding<Value>) => (callback: (_: Value) => void) => {
    let connectable: Object | undefined = subscribable.get()
    const signal = `notify::${property as string}`
    let id: number | undefined = connectable?.connect(signal, () => { callback(binding.get()) })

    const unsubscribe = subscribable.subscribe(newConnectable => {
      connectable?.disconnect(id!)
      connectable = newConnectable
      id = connectable?.connect(signal, () => { callback(binding.get()) })
    })

    return () => {
      unsubscribe()
      connectable?.disconnect(id!)
    }
  }

  const getAsFct = (prevTransform = (x: any) => x) => (transform: (_: any) => any) => {
    const newTransform = (v: any) => transform(prevTransform(v))
    const newBinding = bind(subscribable).as(obj => newTransform(obj !== undefined ? obj[property] : undefined))
    newBinding.subscribe = getSubscribeFct(newBinding)
    newBinding.as = getAsFct(newTransform)
    return newBinding
  }

  const binding = bind(subscribable).as(obj => obj[property])
  binding.subscribe = getSubscribeFct(binding)
  binding.as = getAsFct()
  return binding
}


export {
  nDerive,
  nBind,
  nTrigger
}