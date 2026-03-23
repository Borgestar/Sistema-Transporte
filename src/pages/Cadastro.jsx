import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [contratoAtivo, setContratoAtivo] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome_aluno: '', turma: '', responsavel: '', telefone: '',
    endereco_casa: '', endereco_escola: '', horario_entrada: '', 
    horario_saida: '', turno: '', valor_servico: ''
  });

  // Lê os dados que chegam da página de Gestão (seja para editar ou exibir contrato)
  useEffect(() => {
    if (location.state?.alunoParaEditar) {
      setFormData(location.state.alunoParaEditar);
      setEditingId(location.state.alunoParaEditar.nome_aluno);
      navigate('/', { replace: true, state: {} });
    } else if (location.state?.alunoParaContrato) {
      setContratoAtivo(location.state.alunoParaContrato);
      navigate('/', { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (contratoAtivo) {
      document.title = `Contrato Transporte - ${contratoAtivo.nome_aluno}`;
    } else {
      document.title = "Gestão de Transporte";
    }
  }, [contratoAtivo]);
  


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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      if (editingId) {
        alert("Dados atualizados com sucesso!");
        navigate('/gestao'); 
      } else {
        setContratoAtivo(formData);
        setEnviado(true);
        setFormData({
          nome_aluno: '', turma: '', responsavel: '', telefone: '',
          endereco_casa: '', endereco_escola: '', horario_entrada: '',
          horario_saida: '', valor_servico: '', turno: ''
        });
        window.scrollTo(0, 0);
      }
    } else {
      alert("Erro: " + res.error.message);
    }
  };

  if (contratoAtivo && !enviado) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10 print:bg-white print:py-0 font-serif text-zinc-900">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap'); .signature-font { font-family: 'Mrs+Saint+Delafield', cursive; font-size: 38px; }`}</style>
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
          <h2 className="text-center text-xl font-bold uppercase mb-10 underline underline-offset-4 text-zinc-800">Instrumento Particular de Contrato de Transporte</h2>
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
              <div className="text-center border-t border-zinc-900 relative pt-4">
                <p className="font-bold text-[10px] uppercase italic text-zinc-800">NILMA DO SOCORRO DUTRA MUNIZ</p>
                <p className="text-[8px] text-zinc-400 uppercase italic">Contratado</p>
              </div>
              <div className="text-center border-t border-zinc-900 pt-4">
                <p className="font-bold text-[10px] uppercase italic text-zinc-800">{contratoAtivo.responsavel}</p>
                <p className="text-[8px] text-zinc-400 uppercase italic">Contratante</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center border-b-[12px] border-yellow-400 italic font-black uppercase max-w-sm w-full">
          <div className="text-5xl mb-6 text-green-500 font-sans">✅</div>
          <h2 className="text-2xl mb-10">Sucesso!</h2>
          <div className="flex flex-col gap-4">
            <button onClick={() => setEnviado(false)} className="w-full bg-yellow-400 text-zinc-900 py-5 rounded-2xl text-[10px] hover:bg-yellow-500 transition-colors">📄 Baixar Contrato</button>
            <button onClick={() => { setEnviado(false); setContratoAtivo(null); }} className="w-full bg-zinc-900 text-white py-5 rounded-2xl text-[10px] hover:bg-black transition-colors">➕ Novo Cadastro</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans pb-20 italic font-black relative">
      
      {/* --- BOTÃO FLUTUANTE DE GESTÃO --- */}
      <button 
        onClick={() => navigate('/gestao')} 
        className="fixed bottom-8 right-8 z-50 bg-zinc-900 text-white p-5 rounded-3xl text-[10px] uppercase opacity-20 hover:opacity-100 transition-all shadow-2xl"
      >
        Gestão
      </button>

      <div className="py-12 px-4 max-w-xl mx-auto">
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-zinc-200">
          <div className="bg-zinc-900 p-12 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black italic select-none">SPIN</div>
            
            <h1 className="text-2xl uppercase tracking-widest text-yellow-400">
              {editingId ? "Editar Cadastro" : "Transporte VIP"}
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase mt-2">Spin Particular</p>
          </div>
          <form onSubmit={handleSubmit} className="p-10 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><input required name="nome_aluno" value={formData.nome_aluno} onChange={handleChange} placeholder="Nome do Aluno" className="w-full p-4 bg-zinc-50 border rounded-3xl outline-none" /></div>
              <div className="col-span-1"><input name="turma" value={formData.turma} onChange={handleChange} placeholder="Turma" className="w-full p-4 bg-zinc-50 border rounded-3xl outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input required name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Responsável" className="w-full p-3 bg-zinc-50 border rounded-3xl outline-none" />
              <input type="tel" required name="telefone" value={formData.telefone} onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 11) v = v.slice(0, 11);
                  if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                  if (v.length > 9) v = `${v.slice(0, 9)}-${v.slice(9)}`;
                  setFormData({ ...formData, telefone: v });
                }} placeholder="WhatsApp" className="w-full text-xs bg-zinc-50 border rounded-3xl outline-none italic font-black" />
            </div>
            <input required name="endereco_casa" value={formData.endereco_casa} onChange={handleChange} placeholder="Endereço Casa" className="w-full p-3 bg-zinc-50 border rounded-3xl outline-none" />
            <input required name="endereco_escola" value={formData.endereco_escola} onChange={handleChange} placeholder="Escola" className="w-full p-3 bg-zinc-50 border rounded-3xl outline-none" />
            <input type="tel" required name="valor_servico" value={formData.valor_servico} onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v) v = (Number(v) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                setFormData({ ...formData, valor_servico: v });
              }} placeholder="Valor serviço = R$ 0,00" className="w-full p-4 bg-yellow-50 border-yellow-200 border rounded-3xl outline-none font-black italic" />
            <div className="grid grid-cols-2 gap-4">
              <input type="tel" required name="horario_entrada" value={formData.horario_entrada} onChange={handleTimeChange} placeholder="Entrada" className="p-4 bg-zinc-900 text-white rounded-3xl text-center text-sm italic font-black" />
              <input type="tel" required name="horario_saida" value={formData.horario_saida} onChange={handleTimeChange} placeholder="Saída" className="p-4 bg-zinc-900 text-white rounded-3xl text-center text-sm italic font-black" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-zinc-900 text-white py-6 rounded-[2.5rem] uppercase text-[10px] mt-4 hover:bg-black transition-all">
              {loading ? "Gravando..." : editingId ? "Salvar Alterações" : "Finalizar Cadastro"}
            </button>
            
            {editingId && (
               <button type="button" onClick={() => navigate('/gestao')} className="w-full bg-zinc-200 text-zinc-600 py-4 rounded-[2.5rem] uppercase text-[10px] mt-2 hover:bg-zinc-300 transition-all">
                 Cancelar
               </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
