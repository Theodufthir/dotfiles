import { Object as GObject } from "gnim/gobject";
import { Accessor, createComputed, createBinding, createExternal } from "gnim";


function createMultiBinding<
  Source extends GObject,
  Prop extends keyof Source,
  TransformArgs extends { [Property in Prop]: Source[Property] },
  Result,
>(connectable: Source, props: Prop[], transform: (_: TransformArgs) => Result): Accessor<Result>

function createMultiBinding<
  Source extends GObject,
  Prop extends keyof Source,
  TransformArgs extends { [Property in Prop]: Source[Property] },
  Result,
>(subscribable: Accessor<Source>, props: Prop[], transform: (_: TransformArgs) => Result): Accessor<Result>

function createMultiBinding(obj: GObject | Accessor<GObject>, props: (keyof GObject)[], transform: (_: object) => any): Accessor<any> {
  if (obj instanceof GObject) {
    return createComputed(
      // @ts-ignore
      props.map(prop => createBinding(obj, prop)),
      (...values) => transform(
        Object.fromEntries(values.map((val, idx) => [props[idx], val]))
      )
    )
  } else if (obj instanceof Accessor) {
    return createExternal(undefined, set => {
      let unsubscribe = () => {}

      const attachNewDerivation = () => {
        unsubscribe()
        const next_obj = obj.peek()
        if (next_obj instanceof GObject) {
          const multiBinding = createMultiBinding(obj.peek(), props, transform)
          unsubscribe = multiBinding.subscribe(() => set(multiBinding.peek()))
          set(multiBinding.peek())
        } else {
          unsubscribe = () => {}
          set(next_obj)
        }
      }

      attachNewDerivation()

      return obj.subscribe(attachNewDerivation)
    })
  }

  throw new Error("Not derivable")
}


function createReBinding<
  Object extends GObject,
  Prop extends keyof Object,
  Result extends Object[Prop],
>(obj: Accessor<Object>, prop: Prop): Accessor<Result>

function createReBinding<
  Object extends GObject,
  Prop_1 extends keyof Object,
  Inter extends Object[Prop_1] & GObject,
  Prop_2 extends keyof Object[Prop_1],
  Result extends Inter[Prop_2],
>(obj: Accessor<Object>, prop_1: Prop_1, prop_2: Prop_2): Accessor<Result>

function createReBinding<
  Object extends GObject,
  Prop_1 extends keyof Object,
  Inter_1 extends Object[Prop_1] & GObject,
  Prop_2 extends keyof Object[Prop_1],
  Inter_2 extends Inter_1[Prop_2] & GObject,
  Prop_3 extends keyof Inter_1[Prop_2],
  Result extends Inter_2[Prop_3],
>(obj: Accessor<Object>, prop_1: Prop_1, prop_2: Prop_2, prop_3: Prop_3): Accessor<Result>

function createReBinding(obj: Accessor<GObject>, ...props: string[]) {
  for (; props.length > 0; props.shift()) {
    // @ts-ignore
    obj = _recBind(obj, props[0])
  }
  return obj
}

function _recBind<
  Object extends GObject,
  Prop extends keyof Object,
  Value extends Object[Prop]
>(accessor: Accessor<Object>, property: Prop): Accessor<Value> {
  const getSubscribeFct = (binding: Accessor<Value>) => (callback: (_: Value) => void) => {
    let gobject: Object | undefined = accessor.peek()
    const signal = `notify::${property as string}`
    callback(binding.peek())
    let id: number | undefined = gobject?.connect(signal, () => { callback(binding.peek()) })

    const unsubscribe = accessor.subscribe(() => {
      const newGObject = accessor.peek()
      gobject?.disconnect(id!)
      gobject = newGObject
      callback(binding.peek())
      id = gobject?.connect(signal, () => { callback(binding.peek()) })
    })

    return () => {
      unsubscribe()
      gobject?.disconnect(id!)
    }
  }

  const getAsFct = (prevTransform = (x: any) => x) => (transform: (_: any) => any) => {
    const newTransform = (v: any) => transform(prevTransform(v))
    const newBinding = accessor.as(obj => newTransform(obj !== undefined ? obj[property] : undefined))
    newBinding.subscribe = getSubscribeFct(newBinding)
    newBinding.as = getAsFct(newTransform)
    return newBinding
  }

  const binding = accessor.as(obj => (obj !== undefined ? obj[property] : undefined) as Value)
  binding.subscribe = getSubscribeFct(binding)
  binding.as = getAsFct()
  return binding
}


function createBindingOrApply<
  Source,
  Result
>(src: Source | Accessor<Source>, transform: (_: Source) => Result): Result | Accessor<Result> {
  if (src === undefined) return transform(undefined as Source)
  return src instanceof Accessor ? src.as(transform) : transform(src as Source)
}


export {
  createMultiBinding,
  createReBinding,
  createBindingOrApply
}