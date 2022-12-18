import { differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'
import { useCountdown } from '../context/CyclesContext'

export function useActiveCycle() {
  const {
    activeCycle,
    totalSeconds,
    setCycles,
    activeCycleId,
    setAmountSecondsPassed,
  } = useCountdown()

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setAmountSecondsPassed,
    setCycles,
  ])
}
