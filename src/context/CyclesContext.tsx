import React, { createContext, useContext, useState } from 'react'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

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
  totalSeconds: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  interruptCurrentCycle: () => void
  addNewCycle(cycle: Cycle): void
  createNewCycle: ({ task, minutesAmount }: CreateCycleData) => void
}

const cyclesContext = createContext({} as CyclesContextData)

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function addNewCycle(cycle: Cycle) {
    setCycles((state) => [...state, cycle])
  }

  function interruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
    document.title = 'Pomodoro'
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      minutesAmount,
      task,
      startDate: new Date(),
    }

    addNewCycle(newCycle)
    setActiveCycleId(id)
    setSecondsPassed(0)
  }

  return (
    <cyclesContext.Provider
      value={{
        createNewCycle,
        cycles,
        addNewCycle,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
        activeCycleId,
        amountSecondsPassed,
        setSecondsPassed,
        activeCycle,
        totalSeconds,
      }}
    >
      {children}
    </cyclesContext.Provider>
  )
}

export const useCycles = () => {
  return useContext(cyclesContext)
}
