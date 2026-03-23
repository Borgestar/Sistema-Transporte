import React from 'react';

export default function Vendas() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Cabeçalho / Hero Section */}
      <header className="bg-zinc-900 border-b border-yellow-600/30 pt-20 pb-32 px-6 relative overflow-hidden">
        {/* Efeito de luz no fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Transforme seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Transporte Escolar</span> em uma Empresa Digital
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            O sistema definitivo para motoristas VIP. Gere contratos em PDF automaticamente e tenha o controle financeiro total da sua rota na palma da mão.
          </p>
          <a 
            href="https://wa.me/5521979779313?text=Olá! Quero testar o sistema de transporte VIP por 7 dias." 
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-950 font-black uppercase tracking-widest px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(234,179,8,0.2)]"
          >
            Começar Teste Grátis de 7 Dias
          </a>
        </div>
      </header>

      {/* --- NOVA SEÇÃO: MOCKUP COM A FOTO DO SISTEMA --- */}
      <section className="-mt-24 px-6 relative z-20 max-w-5xl mx-auto mb-20">
        <div className="rounded-t-2xl bg-zinc-800 border-x border-t border-zinc-700 flex items-center px-4 py-3 shadow-2xl">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto text-[10px] text-zinc-500 uppercase tracking-widest font-black flex-1 text-center pr-8">
            Painel de Gestão Exclusivo
          </div>
        </div>
        <div className="bg-zinc-950 border-x border-b border-zinc-700 rounded-b-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* A IMAGEM VAI AQUI! */}
          <img 
            src="./print-painel.png" 
            alt="Visão do Painel de Gestão" 
            className="w-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            // Se a imagem não for encontrada, mostra um texto provisório para não ficar feio
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Mensagem temporária que some quando você colocar a foto real */}
          <div className="hidden h-96 bg-zinc-900 flex-col items-center justify-center text-zinc-500 italic p-10 text-center">
            <span className="text-4xl mb-4">📸</span>
            <p>A sua foto do painel vai aparecer aqui.</p>
            <p className="text-sm mt-2">Salve um print da sua tela como <b>print-painel.png</b> dentro da pasta <b>public</b>.</p>
          </div>

        </div>
      </section>

      {/* Benefícios */}
      <section className="py-12 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 hover:border-yellow-500/50 transition-colors group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📄</div>
          <h3 className="text-xl font-bold text-white mb-3 uppercase">Contratos Automáticos</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Esqueça o papel. Envie um link para os pais e o sistema gera o contrato de prestação de serviços em PDF na mesma hora.
          </p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 hover:border-yellow-500/50 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full blur-2xl group-hover:bg-yellow-500/10 transition-colors"></div>
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📊</div>
          <h3 className="text-xl font-bold text-white mb-3 uppercase">Gestão Financeira</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Saiba exatamente quanto você fatura, os gastos com gasolina e a sua margem de lucro real com um painel gráfico moderno.
          </p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 hover:border-yellow-500/50 transition-colors group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📱</div>
          <h3 className="text-xl font-bold text-white mb-3 uppercase">Organização Total</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Endereços, turnos, escolas e um botão de WhatsApp direto para chamar os responsáveis de cada criança com um clique.
          </p>
        </div>
      </section>

      {/* Preço e Chamada para Ação */}
      <section className="bg-zinc-900 py-24 px-6 border-t border-zinc-800 mt-12">
        <div className="max-w-3xl mx-auto text-center bg-zinc-950 p-12 md:p-16 rounded-[4rem] border border-yellow-600/20 shadow-2xl relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-zinc-950 font-bold px-6 py-2 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20">
            Acesso Exclusivo
          </div>
          <h2 className="text-3xl font-black text-white uppercase mb-6">Tranquilidade por menos do que você imagina</h2>
          <p className="text-zinc-400 mb-8">
            Tenha acesso a todo o sistema por menos do que custa a mensalidade de um único passageiro.
          </p>
          <div className="text-6xl font-black text-yellow-500 mb-10 italic">
            R$ 69,90 <span className="text-xl text-zinc-500 font-normal not-italic">/mês</span>
          </div>
          <a 
            href="https://wa.me/5521979779313?text=Quero assinar o sistema de transporte escolar." 
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-zinc-100 text-zinc-950 font-bold uppercase py-6 rounded-3xl hover:bg-yellow-500 transition-colors text-sm tracking-wide"
          >
            Quero Organizar Meu Transporte Agora
          </a>
        </div>
      </section>

      {/* Rodapé Borges Digital */}
      <footer className="bg-black py-10 text-center text-zinc-600 text-[10px] uppercase tracking-widest border-t border-zinc-900">
        <p>Desenvolvido com excelência por <a href="https://wa.me/5521979779313?text=Quero assinar o sistema de transporte escolar." target="_blank" rel="noreferrer" className="text-yellow-600 hover:text-yellow-500 font-bold transition-colors">Borges Digital</a></p>
        <p className="mt-3 text-zinc-800 font-sans">© 2026 Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
