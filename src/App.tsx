import * as React from 'react'
import { JSX } from 'react'
import './App.css'
import { eventBusInjectable } from './useMittBus'
import { Timer } from './timer'
import CountdownTimer  from './CountdownTimer'

function App(): JSX.Element {
  const timers = Array.from(Array(3)).map((e) => eventBusInjectable(new Timer(3)))

  return (
    <>
      <h1>React and EventBus hook example</h1>
      <div className="card">
        <div className="button-group">
          {timers.map((timer, i) => <CountdownTimer key={i} timer={timer} />)}
        </div>
        <div className="button-group">
          <button onClick={() => timers.forEach(timer => timer.start())}>start</button>
        </div>
      </div>
    </>
  )
}

export default App
