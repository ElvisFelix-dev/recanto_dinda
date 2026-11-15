import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PawPrint, ArrowLeft, ArrowRight, CalendarDays, HeartHandshake, UploadCloud, CheckCircle2 } from 'lucide-react'
import { hotelApi } from '../services/api'

const field = 'w-full rounded-xl border border-[#eadbd3] bg-white px-4 py-3 text-sm text-[#54372f] outline-none transition focus:border-[#d94d91] focus:ring-4 focus:ring-[#d94d91]/10'
const label = 'mb-2 block text-sm font-semibold text-[#593a31]'
const yesNo = [{value:'true',label:'Sim'},{value:'false',label:'Não'}]

export default function HotelBooking() {
  const navigate = useNavigate()
  const [step,setStep] = useState(0)
  const [files,setFiles] = useState([])
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [done,setDone] = useState(false)
  const [form,setForm] = useState({
    guardian:{name:'',cpf:'',rg:'',address:'',phone:'',email:''},
    pet:{name:'',breed:'',sex:'female',neutered:false},
    stay:{checkIn:'',checkOut:''},
    health:{vaccinesUpToDate:false,lastDewormingDate:'',fleaTreatment:'',hasAllergies:false,allergyDetails:'',takesMedication:false,medicationDetails:'',veterinarian:{clinic:'',name:'',phone:''}},
    declarations:{emergencyAuthorization:false,truthfulInformation:false,adequateHealth:false,disclosedConditions:false,socializationRisks:false,emergencyMeasures:false,veterinaryExpenses:false}
  })
  const update = (section,key,value) => setForm(old=>({...old,[section]:{...old[section],[key]:value}}))
  const updateNested = (section,parent,key,value) => setForm(old=>({...old,[section]:{...old[section],[parent]:{...old[section][parent],[key]:value}}}))
  const steps = ['Tutor','Pet e período','Saúde','Declarações']
  const requiredDeclarations = [
    ['emergencyAuthorization','Autorizo o encaminhamento do meu pet para atendimento veterinário em caso de emergência e me responsabilizo pelas despesas.'],
    ['truthfulInformation','Declaro que todas as informações prestadas são verdadeiras.'],
    ['adequateHealth','Declaro que meu pet encontra-se em condições de saúde para hospedagem.'],
    ['disclosedConditions','Declaro que informei doenças, tratamentos, alergias e alterações comportamentais conhecidas.'],
    ['socializationRisks','Estou ciente de que podem ocorrer intercorrências, acidentes ou doenças inerentes à convivência entre animais.'],
    ['emergencyMeasures','Autorizo que sejam tomadas medidas necessárias para preservar a saúde do meu pet em caso de urgência.'],
    ['veterinaryExpenses','Estou ciente de que despesas veterinárias decorrentes de emergência serão de minha responsabilidade.']
  ]
  const next = () => {
    setError('')
    if(step===0 && Object.values(form.guardian).some(v=>!String(v).trim())) return setError('Preencha todos os dados obrigatórios do tutor.')
    if(step===1 && (!form.pet.name || !form.pet.breed || !form.stay.checkIn || !form.stay.checkOut || new Date(form.stay.checkOut)<=new Date(form.stay.checkIn))) return setError('Preencha os dados do pet e informe um período válido.')
    if(step===2 && (!form.health.lastDewormingDate || !form.health.fleaTreatment || !files.length || (form.health.hasAllergies&&!form.health.allergyDetails) || (form.health.takesMedication&&!form.health.medicationDetails))) return setError('Complete os dados de saúde e anexe a carteira de vacinação.')
    if(step===3 && Object.values(form.declarations).some(v=>!v)) return setError('É necessário aceitar todas as declarações para enviar a solicitação.')
    setStep(s=>Math.min(3,s+1))
  }
  const submit = async () => {
    setBusy(true); setError('')
    try {
      const payload={...form,stay:{checkIn:new Date(form.stay.checkIn).toISOString(),checkOut:new Date(form.stay.checkOut).toISOString()}}
      const result=await hotelApi.submitBooking(payload,files)
      navigate('/hotel/solicitacao-enviada',{state:{bookingId:result.data?.bookingId}})
    } catch(e) { setError(e.message) } finally { setBusy(false) }
  }
  const input = (section,key,placeholder,type='text',required=true) => <input className={field} type={type} required={required} placeholder={placeholder} value={form[section][key]} onChange={e=>update(section,key,e.target.value)} />
  const selectYesNo = (section,key) => <select className={field} value={String(form[section][key])} onChange={e=>update(section,key,e.target.value==='true')}><option value="false">Não</option><option value="true">Sim</option></select>
  return <main className="min-h-screen bg-[#fff8f3] px-4 py-10 text-[#593a31]">
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#8b5a49]"><ArrowLeft size={16}/>Voltar ao Recanto</Link>
      <header className="mb-8 text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#fce2ed] text-[#d94d91]"><PawPrint size={28}/></div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d94d91]">Recanto da Dinda · Hotel</p><h1 className="mt-2 text-3xl font-black">Solicitação de hospedagem</h1><p className="mt-2 text-sm text-[#98796d]">Conte um pouquinho sobre você e seu melhor amigo.</p></header>
      <div className="mb-6 grid grid-cols-4 gap-2">{steps.map((s,i)=><div key={s}><div className={`h-1.5 rounded-full ${i<=step?'bg-[#d94d91]':'bg-[#eadbd3]'}`}/><p className={`mt-2 text-xs font-semibold ${i===step?'text-[#d94d91]':'text-[#a58b80]'}`}>{s}</p></div>)}</div>
      <section className="rounded-3xl border border-[#f0e2da] bg-white p-5 shadow-[0_18px_55px_rgba(89,58,49,.07)] sm:p-8">
        {step===0&&<><h2 className="mb-5 text-xl font-bold">Dados do tutor</h2><div className="grid gap-4 sm:grid-cols-2">{[['name','Nome completo'],['cpf','CPF'],['rg','RG'],['phone','Telefone'],['email','E-mail'],['address','Endereço']].map(([k,t])=><label key={k} className={k==='address'?'sm:col-span-2':''}><span className={label}>{t} *</span><input className={field} value={form.guardian[k]} onChange={e=>update('guardian',k,e.target.value)} /></label>)}</div></>}
        {step===1&&<><h2 className="mb-5 text-xl font-bold">Dados do pet e período</h2><div className="grid gap-4 sm:grid-cols-2"><label><span className={label}>Nome do pet *</span>{input('pet','name','Nome do pet')}</label><label><span className={label}>Raça *</span>{input('pet','breed','Raça')}</label><label><span className={label}>Sexo *</span><select className={field} value={form.pet.sex} onChange={e=>update('pet','sex',e.target.value)}><option value="female">Fêmea</option><option value="male">Macho</option></select></label><label><span className={label}>Castrado?</span>{selectYesNo('pet','neutered')}</label><label><span className={label}>Entrada *</span>{input('stay','checkIn','','datetime-local')}</label><label><span className={label}>Saída *</span>{input('stay','checkOut','','datetime-local')}</label></div></>}
        {step===2&&<><h2 className="mb-5 text-xl font-bold">Saúde e informações veterinárias</h2><div className="grid gap-4 sm:grid-cols-2"><label><span className={label}>Vacinas em dia?</span>{selectYesNo('health','vaccinesUpToDate')}</label><label><span className={label}>Última vermifugação *</span>{input('health','lastDewormingDate','','date')}</label><label className="sm:col-span-2"><span className={label}>Antipulgas utilizado *</span>{input('health','fleaTreatment','Produto e data da aplicação')}</label><label><span className={label}>Possui alergia?</span>{selectYesNo('health','hasAllergies')}</label>{form.health.hasAllergies&&<label><span className={label}>Quais alergias?</span>{input('health','allergyDetails','Descreva as alergias')}</label>}<label><span className={label}>Faz uso de medicamentos?</span>{selectYesNo('health','takesMedication')}</label>{form.health.takesMedication&&<label><span className={label}>Quais medicamentos?</span>{input('health','medicationDetails','Informe os medicamentos')}</label>}<label><span className={label}>Clínica veterinária</span><input className={field} value={form.health.veterinarian.clinic} onChange={e=>updateNested('health','veterinarian','clinic',e.target.value)}/></label><label><span className={label}>Nome do veterinário</span><input className={field} value={form.health.veterinarian.name} onChange={e=>updateNested('health','veterinarian','name',e.target.value)}/></label><label><span className={label}>Telefone veterinário</span><input className={field} value={form.health.veterinarian.phone} onChange={e=>updateNested('health','veterinarian','phone',e.target.value)}/></label><label className="sm:col-span-2"><span className={label}>Carteira de vacinação * (até 5 arquivos, 10 MB cada)</span><input className={field} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e=>setFiles(Array.from(e.target.files||[]).slice(0,5))}/></label></div></>}
        {step===3&&<><h2 className="mb-2 text-xl font-bold">Declarações e autorizações</h2><p className="mb-5 text-sm text-[#98796d]">Leia atentamente e confirme cada declaração para enviar a solicitação.</p><div className="space-y-3">{requiredDeclarations.map(([key,text])=><label key={key} className="flex gap-3 rounded-xl border border-[#f0e2da] bg-[#fffaf7] p-4 text-sm leading-6"><input type="checkbox" checked={form.declarations[key]} onChange={e=>update('declarations',key,e.target.checked)} className="mt-1 h-4 w-4 accent-[#d94d91]"/><span>{text}</span></label>)}</div></>}
        {error&&<p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <div className="mt-8 flex justify-between gap-3"><button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0||busy} className="rounded-xl border border-[#eadbd3] px-5 py-3 text-sm font-bold disabled:opacity-40">Voltar</button>{step<3?<button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-[#593a31] px-6 py-3 text-sm font-bold text-white hover:bg-[#432a23]">Continuar <ArrowRight size={16}/></button>:<button onClick={submit} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#d94d91] px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{busy?'Enviando...':'Enviar solicitação'} <CheckCircle2 size={16}/></button>}</div>
      </section>
      <p className="mt-5 text-center text-xs text-[#a58b80]">O envio é uma solicitação. A hospedagem será confirmada após análise da equipe.</p>
    </div>
  </main>
}
