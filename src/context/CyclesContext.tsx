import { differenceInSeconds } from 'date-fns'
import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import {
  createNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycle/actions'
import { Cycle, cycleReducer } from '../reducers/cycle/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesProviderProps {
  children: React.ReactNode
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
  activeCycle: Cycle | undefined
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  interruptCurrentCycle: () => void
  createNewCycle: ({ task, minutesAmount }: CreateCycleData) => void
}

const cyclesContext = createContext({} as CyclesContextData)

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialValue) => {
      const storedState = localStorage.getItem('@pomodoro-ignite.1.0.0')

      if (!storedState) return initialValue

      return JSON.parse(storedState)
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle: any) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomodoro-ignite.1.0.0', stateJSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction(activeCycleId))
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      minutesAmount,
      task,
      startDate: new Date(),
    }

    dispatch(createNewCycleAction(newCycle))
    setSecondsPassed(0)
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <cyclesContext.Provider
      value={{
        createNewCycle,
        cycles,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
        activeCycleId,
        amountSecondsPassed,
        setSecondsPassed,
        activeCycle,
      }}
    >
      {children}
    </cyclesContext.Provider>
  )
}

export const useCycles = () => {
  return useContext(cyclesContext)
}
