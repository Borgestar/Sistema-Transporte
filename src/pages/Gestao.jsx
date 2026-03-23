import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- NOVO: Componente visual para a caixinha que aparece ao passar o mouse ---
const TooltipPersonalizado = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 p-5 rounded-[2rem] shadow-2xl border border-zinc-800 italic">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl text-yellow-400 font-black tracking-tighter">
          R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function Gestao() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
  const [contratoAtivo, setContratoAtivo] = useState(null); 

  const gastoGasolina = 800; // Valor da gasolina

  useEffect(() => {
    if (autenticado) {
      buscarAlunos();
    }
  }, [autenticado]);

  const buscarAlunos = async () => {
    setCarregando(true); 
    const { data } = await supabase.from('alunos').select('*').order('nome_aluno');
    
    if (data) {
      setAlunos(data);
      const total = data.reduce((acc, aluno) => {
        if (!aluno.valor_servico) return acc;
        const limpo = String(aluno.valor_servico).replace(/[^\d,]/g, ""); 
        const valorFormatoIngles = limpo.replace(",", "."); 
        return acc + (Number(valorFormatoIngles) || 0);
      }, 0);
      setFaturamento(total);
    }
    setCarregando(false); 
  };

  const excluirAluno = async (nome) => {
    if(confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      await supabase.from('alunos').delete().eq('nome_aluno', nome);
      buscarAlunos();
    }
  };

  const enviarMensagemWpp = (aluno) => {
    const numeroLimpo = String(aluno.telefone).replace(/\D/g, "");
    const msg = `Olá ${aluno.responsavel}, transporte VIP aqui! Gostaria de tratar sobre o(a) ${aluno.nome_aluno}.`;
    window.open(`https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const lucroLiquido = faturamento - gastoGasolina;
  const dadosGrafico = [
    { name: 'Faturamento', valor: faturamento, gradient: 'url(#corFaturamento)' }, 
    { name: 'Gasolina', valor: gastoGasolina, gradient: 'url(#corGasolina)' }, 
    { name: 'Lucro Líquido', valor: lucroLiquido, gradient: 'url(#corLucro)' } 
  ];

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-sans italic font-black">
        <div className="max-w-xs w-full p-12 bg-white rounded-[4rem] text-center shadow-xl border border-zinc-200">
          <h2 className="text-xl uppercase tracking-widest text-zinc-800 mb-6">Acesso Restrito</h2>
          <input type="password" onChange={(e) => setSenha(e.target.value)} className="w-full p-6 bg-zinc-50 rounded-3xl mb-6 text-center outline-none border focus:border-yellow-400" placeholder="Senha" />
          <button onClick={() => { if(senha === '2315') setAutenticado(true); }} className="w-full bg-zinc-900 text-white py-6 rounded-3xl uppercase text-[11px] hover:bg-black transition-all">Entrar</button>
        </div>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-sans italic font-black uppercase text-zinc-400">
        <p className="animate-pulse">A calcular dados financeiros...</p>
      </div>
    );
  }

  if (contratoAtivo) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10 print:bg-white print:py-0 font-serif text-zinc-900">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap'); .signature-font { font-family: 'Mrs+Saint+Delafield', cursive; font-size: 38px; }`}</style>
        <div className="max-w-3xl mx-auto bg-white p-12 shadow-2xl border border-zinc-200 print:shadow-none print:border-none print:max-w-full">
          <div className="flex justify-between mb-8 print:hidden font-sans">
            <button onClick={() => setContratoAtivo(null)} className="bg-zinc-100 px-6 py-2 rounded-xl font-bold text-xs uppercase italic hover:bg-zinc-200">← Voltar p/ Painel</button>
            <button onClick={() => window.print()} className="bg-yellow-400 text-zinc-900 px-6 py-2 rounded-xl font-black text-xs uppercase italic shadow-lg hover:bg-yellow-500">Imprimir / Salvar PDF</button>
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

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans p-8 pb-20 italic font-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl uppercase tracking-tighter">Painel de Gestão</h1>
            <p className="text-zinc-500 uppercase text-[10px] mt-2 tracking-widest">Controle Financeiro e Frota</p>
          </div>
          <button onClick={() => setAutenticado(false)} className="bg-zinc-200 text-zinc-600 px-6 py-3 rounded-2xl text-[10px] uppercase hover:bg-zinc-300">Sair</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-lg flex flex-col justify-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Crianças a Bordo</p>
            <p className="text-4xl text-yellow-400">{alunos.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-[2rem] shadow-sm border border-green-100 flex flex-col justify-center">
            <p className="text-[10px] text-green-600 uppercase tracking-widest mb-1">Faturamento Atual</p>
            <p className="text-2xl text-green-700 font-bold">R$ {faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-[2rem] shadow-sm border border-red-100 flex flex-col justify-center">
            <p className="text-[10px] text-red-600 uppercase tracking-widest mb-1">Gastos (Gasolina)</p>
            <p className="text-2xl text-red-700 font-bold">R$ {gastoGasolina.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-[2rem] shadow-sm border border-blue-100 flex flex-col justify-center">
            <p className="text-[10px] text-blue-600 uppercase tracking-widest mb-1">Lucro Líquido</p>
            <p className="text-2xl text-blue-700 font-bold">R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* --- GRÁFICO VIP COM DEGRADÊ E TOOLTIP PERSONALIZADO --- */}
        <div className="bg-white p-8 rounded-[4rem] shadow-sm border border-zinc-200 mb-12 h-96 relative">
          <h2 className="text-xl uppercase mb-8 text-zinc-800 tracking-tight ml-4">Desempenho Financeiro</h2>
          <ResponsiveContainer width="99%" height="80%">
            <BarChart key={faturamento} data={dadosGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              {/* Definição das cores em degradê */}
              <defs>
                <linearGradient id="corFaturamento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="corGasolina" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="corLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="name" tick={{fontWeight: '900', fontStyle: 'italic', fill: '#71717a', fontSize: 11}} axisLine={false} tickLine={false} dy={15} />
              <YAxis hide />
              {/* Tooltip super estilizado que criámos lá em cima */}
              <Tooltip content={<TooltipPersonalizado />} cursor={{fill: 'transparent'}} />
              
              {/* Barras mais arredondadas e que usam o degradê */}
              <Bar dataKey="valor" radius={[24, 24, 0, 0]} barSize={70} animationDuration={1500}>
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.gradient} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-2xl uppercase tracking-tighter mb-6">Lista de Passageiros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alunos.map(a => (
            <div key={a.nome_aluno} className="bg-white p-10 rounded-[4rem] shadow-sm border border-zinc-200 relative group hover:border-yellow-400 transition-all duration-300">
              <div className="absolute top-8 right-10 bg-zinc-100 px-4 py-1.5 rounded-full text-[8px] uppercase tracking-widest text-zinc-500">
                {a.turno}
              </div>
              <h3 className="text-2xl uppercase mb-1 leading-none">{a.nome_aluno}</h3>
              {a.turma && <p className="text-[10px] text-yellow-600 mb-6 ml-1 font-black italic">TURMA: {a.turma}</p>}
              
              <div className="space-y-3 text-[11px] text-zinc-400 uppercase mb-8 border-l-4 border-yellow-400 pl-6">
                <p className="text-zinc-600">📱 {a.responsavel}: {a.telefone}</p>
                <p>🏠 {a.endereco_casa}</p>
                <p>🏫 {a.endereco_escola}</p>
                <p className="text-yellow-600">💰 Valor: {a.valor_servico}</p>
                <p className="text-zinc-900 font-black text-lg mt-4 italic tracking-tight">⏰ {a.horario_entrada}h - {a.horario_saida}h</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => navigate('/', { state: { alunoParaEditar: a } })} className="bg-zinc-50 py-4 rounded-2xl text-[9px] uppercase hover:bg-yellow-400 hover:text-zinc-900 transition-all">Editar</button>
                <button onClick={() => setContratoAtivo(a)} className="bg-zinc-900 text-white py-4 rounded-2xl text-[9px] uppercase hover:bg-zinc-700 transition-all">Contrato</button>
                <button onClick={() => enviarMensagemWpp(a)} className="bg-green-500 text-white py-4 rounded-2xl text-[9px] uppercase shadow-md hover:bg-green-600 transition-all">WhatsApp</button>
                <button onClick={() => excluirAluno(a.nome_aluno)} className="bg-zinc-50 py-4 rounded-2xl text-[9px] uppercase text-red-400 hover:bg-red-50 hover:text-red-500 transition-all">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
