import * as React from 'react'
import { useState, JSX } from 'react'
import { useEventBus } from './useMittBus'
import './CountdownTimer.css'

export default function CountdownTimer ({ timer }): JSX.Element {
  const [on] = useEventBus(timer)
  const [time, setTime] = useState(timer.remain)
  const [state, setState] = useState(timer.state)

  on('start, stop, done, reset', () => {
    setState(timer.state)
  })
  on('countdown', (e: any) => {
    setTime(e)
  })
  on('reset', () => {
    setTime(timer.remain)
  })

  return (
    <button data-role="countdown" onClick={() => {
      switch (timer.state) {
      case 'processing':
        timer.stop()
        break
      case 'done':
        timer.reset()
        break
      default:
        timer.start()
      }
    }}>{time}</button>
  )
}
