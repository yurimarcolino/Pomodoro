import { useFormContext } from 'react-hook-form'
import { useCycles } from '../../../context/CyclesContext'
import {
  FormContainer,
  MinutesAmountInput,
  TaskInput,
} from '../NewCycleForm/styles'

export function NewCycleForm() {
  const { activeCycle } = useCycles()
  const { register } = useFormContext()

  const inputDisabled = !!activeCycle

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        list="task-suggestions"
        id="task"
        placeholder="Dê um nome para o seu projeto"
        {...register('task')}
        disabled={inputDisabled}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        placeholder="00"
        type="number"
        id="minutesAmount"
        step={1}
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={inputDisabled}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
