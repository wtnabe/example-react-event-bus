import { dispatch } from './useMittBus'
import type { EventBus, Injected } from './useMittBus'

export type TimerState = 'yet' | 'processing' | 'pause' | 'done'
export type TimerEvent = 'start' | 'countdown' | 'stop' | 'done' | 'reset'

export class Timer {
  readonly init: number
  private _remain: number
  private _state: TimerState = 'yet'
  private intervalId: number | undefined
  bus: EventBus | undefined

  /**
   * @param {number} sec
   */
  constructor (sec: number = 10) {
    this.init = sec * 1000
    this._remain = sec * 1000
    this.intervalId = undefined
  }

  get remain () {
    return this._remain
  }

  get state () {
    return this._state
  }

  reset () {
    this._remain = this.init
    this._state = 'yet'
    dispatch(this as unknown as Injected, 'reset')
  }
  
  start () {
    if (this.state !== 'processing' && this.state !== 'done') {
      this.intervalId = setInterval(() => {
        this._remain = this.remain - 10
        dispatch(this as unknown as Injected, 'countdown', this.remain)
        if (this.remain <= 0) {
          this.over()
        }
      }, 10)
      this._state = 'processing'
      dispatch(this as unknown as Injected, 'start')
    }
  }

  stop () {
    if (this.state === 'processing') {
      clearInterval(this.intervalId)
      this._state = 'pause'
      dispatch(this as unknown as Injected, 'stop')
    }
  }

  over () {
    clearInterval(this.intervalId)
    this._state = 'done'
    dispatch(this as unknown as Injected, 'done')
  }
}
