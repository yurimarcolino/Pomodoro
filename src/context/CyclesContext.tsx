import React, { createContext, useContext, useState, useReducer } from 'react'
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
  const [cyclesState, dispatch] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  })
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle: any) => cycle.id === activeCycleId)

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
