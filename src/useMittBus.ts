import mitt, { type Handler } from 'mitt'
const emitter = mitt()

export type EventHandlerAttacher = (event: string, handler: Function) => void
export type EventHandlerRemover = (event: string) => void
export type EventDispatcher = (event: string, detail?: object) => void

export type EventBus = {
  on: EventHandlerAttacher
  off: EventHandlerRemover
  dispatch: EventDispatcher
}

export type Injected = {
  bus: typeof emitter
  injectBus (bus: typeof emitter): void
  on (event: string, handler: Function): void
  off (event: string): void
  dispatch (event: string, detail: object): void
}

export function eventBusInjectable <T extends object>(model: T): T {
  if (typeof model['bus'] === 'undefined') {
    model['injectBus'] = function (bus: typeof emitter) {
      this.bus = bus
    }
    model['on'] = function (event: string, handler: Function) {
      if (this.bus) this.bus.on(event, handler)
    }
    model['off'] = function (event: string) {
      if (this.bus) this.bus.off(event)
    }
    model['dispatch'] = function (event: string, detail?: any) {
      if (this.bus) this.bus.emit(event, detail)
    }
  } else {
    console.warn(`${model} is already EventBus injected`)
  }

  return model
}

export function on (model: Injected, event: string, handler: Function) {
  model.bus.on(event, handler as unknown as Handler)
}

export function off (model: Injected, event: string) {
  model.bus.off(event)
}

export function dispatch (model: Injected, event: string, detail?: any) {
  model.bus.emit(event, detail)
}

export function useEventBus (model: Injected): [EventHandlerAttacher, EventDispatcher, EventHandlerRemover] {
  model.injectBus(mitt())

  return [
    // on
    (event: string, handler: Function) => {
      model.on(event, handler)
    },
    // dispatch
    (event: string, detail?: any) => {
      model.dispatch(event, detail)
    },
    // off
    (event: string) => {
      model.off(event)
    },
  ]
}
