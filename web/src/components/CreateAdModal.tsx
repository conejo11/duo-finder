import { FC, FormEvent, useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import Input from "./form/Input";
import { Check, GameController } from "phosphor-react";
import { Game } from "../App";
import axios from "axios";

interface CreateAdModalProps {
  
}
 
const CreateAdModal: FC<CreateAdModalProps> = () => {
  const [games, setGames] = useState<Game[]>([])
  const [weekdays, setWeekdays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false)

  useEffect(() => {
    axios('http://localhost:3333/games')
      .then(res => setGames(res.data))
  }, []);

  async function handleCreateAdd (ev: FormEvent) {
    ev.preventDefault()
    const formData = new FormData(ev.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        ...data,
        weekdays: weekdays.map(Number), 
        useVoiceChannel: useVoiceChannel, 
        yearsPlaying: Number(data.yearsPlaying)
      })
      alert('Anúncio criado com sucesso')
    } catch (error) {
      console.log(error)
      alert('Erro aoc riar o anúncio')
    }
  }

  return (<Dialog.Portal>
    <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>
    <Dialog.Content className='bg-[#2a2634] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-black/25'>
      <Dialog.Title className='text-3xl text-white font-black'>
        Publique um anúncio
      </Dialog.Title>
      <form onSubmit={handleCreateAdd} className='mt-8 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label 
            className='font-semibold' 
            htmlFor="game"
          >
            Qual o game?
          </label>
          <select  
            className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none' 
            id="game" 
            name="game" 
            defaultValue={""}
          >
            <option disabled value="">Selecione o game que deseja jogar</option>
            {games.map(game => <option key={game.id} value={game.id}>{game.title}</option>)}
          </select>
        </div>
        <div className='flex flex-col gap-2'>
          <label 
            htmlFor="name"
          >
            Seu nome (ou nickname)
          </label>
          <Input 
            id="name" 
            name="name"
            type="text" 
            placeholder='Como te chamam dentro do game?' 
          />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label 
              htmlFor="yearsPlaying"
            >
              Joga a quantos anos?
            </label>
            <Input 
              id="yearsPlaying" 
              name="yearsPlaying"
              type="number" 
              placeholder='Tudo bem ser 0' 
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label 
              htmlFor="discord"
            >
              Qual seu discord?
            </label>
            <Input 
              id="discord" 
              name="discord"
              type="text" 
              placeholder='Usuário#0000' 
            />
          </div>
        </div>


        <div className='flex gap-6'>
          <div className='flex flex-col gap-2'>
            <label 
              htmlFor="weekDays"
            >
              Quando costuma jogar?
            </label>
            <div>
              <ToggleGroup.Root 
                onValueChange={setWeekdays} 
                value={weekdays}
                type="multiple" 
                className='grid grid-cols-4 gap-2'
              >
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}` } 
                  title='Domingo'
                  value='0'
                >D</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Segunda'
                  value='1'
                >S</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Terça'
                  value='2'
                >T</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Quarta'
                  value='3'
                >Q</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Quinta'
                  value='4'
                >Q</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Sexta'
                  value='5'
                >S</ToggleGroup.Item>
                <ToggleGroup.Item  
                  className={`w-8 h-8 rounded ${weekdays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}` }  
                  title='Sábado'
                  value='6'
                >S</ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>
          <div className='flex flex-col gap-2 flex-1'>
            <label 
              htmlFor="hourStart"
            >
              Qual horário do dia?
            </label>
            <div className='grid grid-cols-2 gap-2'>
              <Input 
                id="hourStart" 
                name="hourStart" 
                type="time" 
                placeholder='De' 
              />
              <Input 
                id="hourEnd" 
                name="hourEnd" 
                type="time" 
                placeholder='Até' 
              />
            </div>
          </div>
        </div>

        <label className='mt-2 flex gap-2 text-sm items-center'>
          <Checkbox.Root 
            className="w-6 h-6 rounded bg-zinc-900 p-1" 
            onCheckedChange={(checked) => setUseVoiceChannel(checked as boolean)}
            checked={useVoiceChannel}
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-emerald-400"/>
            </Checkbox.Indicator>
          </Checkbox.Root>
          Costumo me conectar ao chat de voz
        </label>

        <footer className='mt-4 flex justify-end gap-4'>
          <Dialog.Close 
            type='button'
            className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
          >
            Cancelar
          </Dialog.Close>
          <button 
            className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-700' 
            type='submit'
          >
            <GameController size={24}/>
            Encontrar duo
          </button>
        </footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>);
}
 
export default CreateAdModal;