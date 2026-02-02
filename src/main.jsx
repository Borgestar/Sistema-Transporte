import React, { useState, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { supabase } from './supabaseClient'

function App() {
  const [view, setView] = useState('cadastro'); 
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [contratoAtivo, setContratoAtivo] = useState(null);

  const [formData, setFormData] = useState({
    nome_aluno: '', responsavel: '', telefone: '',
    endereco_casa: '', endereco_escola: '',
    horario_entrada: '', horario_saida: '', turno: '',
    valor_servico: ''
  });

  const buscarAlunos = async () => {
    const { data } = await supabase.from('alunos').select('*').order('nome_aluno');
    if (data) setAlunos(data);
  };

  const handleTimeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + ":" + value.slice(2);
    let novoTurno = formData.turno;
    if (e.target.name === 'horario_entrada' && value.length === 5) {
      const hora = parseInt(value.split(':')[0]);
      novoTurno = (hora < 12) ? 'Manhã' : 'Tarde';
    }
    setFormData({ ...formData, [e.target.name]: value, turno: novoTurno });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingId) {
      res = await supabase.from('alunos').update(formData).eq('nome_aluno', editingId);
    } else {
      res = await supabase.from('alunos').insert([formData]);
    }
    setLoading(false);
    if (!res.error) {
      alert(editingId ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
      setEditingId(null); 
      if (editingId) { setView('admin'); buscarAlunos(); } else { setEnviado(true); }
    } else {
      alert("Erro: " + res.error.message);
    }
  };

  const excluirAluno = async (nome) => {
    if(confirm(`Excluir ${nome}?`)) {
      const { error } = await supabase.from('alunos').delete().eq('nome_aluno', nome);
      if (!error) buscarAlunos();
    }
  };

  const enviarMensagemWpp = (aluno) => {
    const numeroLimpo = aluno.telefone.replace(/\D/g, "");
    const msg = `Olá ${aluno.responsavel}, transporte VIP aqui! Gostaria de tratar sobre o(a) ${aluno.nome_aluno}.`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(msg)}`, '_blank');
  };

 // TELA DE CONTRATO COM ASSINATURA DO CONTRATADO
  if (contratoAtivo) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10 print:bg-white print:py-0 font-serif text-zinc-900">
        {/* Importando uma fonte de assinatura apenas para esta tela */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
            .signature-font { font-family: 'Mrs+Saint+Delafield', cursive; font-size: 38px; }
          `}
        </style>

        <div className="max-w-3xl mx-auto bg-white p-12 shadow-2xl border border-zinc-200 print:shadow-none print:border-none print:max-w-full">
          <div className="flex justify-between mb-8 print:hidden font-sans">
            <button onClick={() => setContratoAtivo(null)} className="bg-zinc-100 px-6 py-2 rounded-xl font-bold text-xs uppercase italic">← Voltar</button>
            <button onClick={() => window.print()} className="bg-yellow-400 text-zinc-900 px-6 py-2 rounded-xl font-black text-xs uppercase italic shadow-lg">Imprimir / Salvar PDF</button>
          </div>

          <div className="border-b-2 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">TRANSPORTE VIP <span className="text-yellow-600">ESCOLAR</span></h1>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-zinc-400">Logística Particular e Escolar</p>
            </div>
            <div className="text-right text-[10px] font-sans font-bold uppercase text-zinc-400">
              <p>Contrato de Prestação de Serviços</p>
              <p>Veículo Chevrolet Spin</p>
            </div>
          </div>

          <h2 className="text-center text-xl font-bold uppercase mb-10 underline underline-offset-4">Instrumento Particular de Contrato de Transporte</h2>

          <div className="space-y-6 text-[13px] leading-relaxed text-justify">
            <p><strong>1. DAS PARTES:</strong></p>
            <p><strong>CONTRATADO:</strong> NILMA DO SOCORRO DUTRA MUNIZ, responsável pela execução do transporte.</p>
            <p><strong>CONTRATANTE:</strong> {contratoAtivo.responsavel}, responsável legal pelo(a) aluno(a) <strong>{contratoAtivo.nome_aluno}</strong>.</p>
            
            <p><strong>2. DO SERVIÇO:</strong> Transporte diário nos horários de {contratoAtivo.horario_entrada}h às {contratoAtivo.horario_saida}h.</p>
            
            <section className="bg-zinc-50 p-4 rounded-lg border-l-4 border-yellow-400 italic font-medium">
              <p><strong>3. DO VALOR E PAGAMENTO:</strong></p>
              <p className="mt-2 text-lg">O valor da mensalidade é fixado em <strong>R$ {contratoAtivo.valor_servico || "0,00"}</strong>.</p>
              <p className="text-sm mt-1">Vencimento: Todo <strong>dia 05</strong> de cada mês (Tolerância até o dia 10).</p>
            </section>

            <p>3.1. <strong>FÉRIAS E DEZEMBRO:</strong> As mensalidades de Julho e Dezembro são devidas <strong>integralmente</strong> por tratar-se de reserva de vaga e custos operacionais fixos.</p>
            <p><strong>4. REGRAS:</strong> O tempo de espera máximo no local de embarque é de 05 minutos.</p>

            <div className="mt-24 grid grid-cols-2 gap-20 pt-10">
              {/* ASSINATURA JÁ PREENCHIDA DO CONTRATADO */}
              <div className="text-center border-t border-zinc-900 relative pt-4">
                <span className="signature-font absolute -top-8 left-0 right-0 text-zinc-700"></span>
                <p className="font-bold text-[10px] uppercase">NILMA DO SOCORRO DUTRA MUNIZ</p>
                <p className="text-[8px] text-zinc-400 uppercase">Contratado</p>
              </div>

              {/* CAMPO VAZIO PARA O PAI/MÃE ASSINAR */}
              <div className="text-center border-t border-zinc-900 pt-4">
                <p className="font-bold text-[10px] uppercase">{contratoAtivo.responsavel}</p>
                <p className="text-[8px] text-zinc-400 uppercase">Contratante</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 italic font-black uppercase">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center border-b-[12px] border-yellow-400">
          <h2 className="text-3xl">Sucesso!</h2>
          <button onClick={() => {setEnviado(false); setView('cadastro');}} className="mt-8 bg-zinc-900 text-white px-10 py-4 rounded-2xl text-xs">Novo Cadastro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans pb-20 italic font-black">
      <button onClick={() => { setView(view === 'cadastro' ? 'admin' : 'cadastro'); setAutenticado(false); setEditingId(null); }} className="fixed bottom-8 right-8 z-50 bg-zinc-900 text-white p-5 rounded-3xl text-[10px] uppercase opacity-20 hover:opacity-100 transition-all shadow-2xl">
        {view === 'cadastro' ? 'Gestão' : 'Sair'}
      </button>

      {view === 'cadastro' ? (
        <div className="py-12 px-4 max-w-xl mx-auto">
          <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-zinc-200">
            <div className="bg-zinc-900 p-12 text-white">
              <h1 className="text-2xl uppercase tracking-widest text-yellow-400">Transporte VIP</h1>
              <p className="text-zinc-500 text-[10px] uppercase mt-2">Spin Particular</p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-4">
              <input required name="nome_aluno" value={formData.nome_aluno} onChange={handleChange} placeholder="Nome do Aluno" className="w-full p-5 bg-zinc-50 border rounded-3xl outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Responsável" className="w-full p-5 bg-zinc-50 border rounded-3xl outline-none" />
                <input required name="telefone" value={formData.telefone} onChange={handleChange} placeholder="WhatsApp" className="w-full p-5 bg-zinc-50 border rounded-3xl outline-none" />
              </div>
              <input required name="endereco_casa" value={formData.endereco_casa} onChange={handleChange} placeholder="Endereço Casa" className="w-full p-5 bg-zinc-50 border rounded-3xl outline-none" />
              <input required name="endereco_escola" value={formData.endereco_escola} onChange={handleChange} placeholder="Escola / Bairro" className="w-full p-5 bg-zinc-50 border rounded-3xl outline-none" />
              <input required name="valor_servico" value={formData.valor_servico} onChange={handleChange} placeholder="Valor da Mensalidade" className="w-full p-5 bg-yellow-50 border-yellow-200 border rounded-3xl outline-none font-black" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="horario_entrada" value={formData.horario_entrada} onChange={handleTimeChange} placeholder="Entrada" className="p-5 bg-zinc-900 text-white rounded-3xl text-center text-xl" />
                <input required name="horario_saida" value={formData.horario_saida} onChange={handleTimeChange} placeholder="Saída" className="p-5 bg-zinc-900 text-white rounded-3xl text-center text-xl" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 text-white py-6 rounded-[2.5rem] uppercase text-[10px]">
                {loading ? "Gravando..." : editingId ? "Atualizar" : "Finalizar"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 max-w-6xl mx-auto">
          {!autenticado ? (
            <div className="max-w-xs mx-auto mt-40 p-12 bg-white rounded-[4rem] text-center border">
              <input type="password" onChange={(e) => setSenha(e.target.value)} className="w-full p-6 bg-zinc-50 rounded-3xl mb-6 text-center" placeholder="Senha" />
              <button onClick={() => { if(senha === '2315') { setAutenticado(true); buscarAlunos(); } }} className="w-full bg-zinc-900 text-white py-6 rounded-3xl uppercase text-[11px]">Entrar</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-16">
                <h1 className="text-4xl uppercase tracking-tighter">Frota VIP</h1>
                <div className="bg-yellow-400 px-10 py-6 rounded-[3rem] shadow-xl text-4xl">{alunos.length}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alunos.map(a => (
                  <div key={a.nome_aluno} className="bg-white p-10 rounded-[4rem] shadow-sm border border-zinc-200">
                    <h3 className="text-2xl uppercase mb-6 leading-none">{a.nome_aluno}</h3>
                    <div className="space-y-3 text-[11px] text-zinc-400 uppercase mb-8 border-l-4 pl-6">
                      <p className="text-zinc-600">📱 {a.responsavel}: {a.telefone}</p>
                      <p>🏠 {a.endereco_casa}</p>
                      <p>🏫 {a.endereco_escola}</p>
                      <p className="text-yellow-600">💰 Valor: R$ {a.valor_servico}</p>
                      <p className="text-zinc-900 font-black text-lg mt-4 italic">⏰ {a.horario_entrada}h - {a.horario_saida}h</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { setFormData(a); setEditingId(a.nome_aluno); setView('cadastro'); }} className="bg-zinc-50 py-4 rounded-2xl text-[9px] uppercase hover:bg-yellow-400">Editar</button>
                      <button onClick={() => setContratoAtivo(a)} className="bg-zinc-900 text-white py-4 rounded-2xl text-[9px] uppercase">Contrato</button>
                      <button onClick={() => enviarMensagemWpp(a)} className="bg-green-500 text-white py-4 rounded-2xl text-[9px] uppercase shadow-md">WhatsApp</button>
                      <button onClick={() => excluirAluno(a.nome_aluno)} className="bg-zinc-50 py-4 rounded-2xl text-[9px] uppercase text-red-400">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)