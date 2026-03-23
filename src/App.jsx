import { HashRouter, Routes, Route } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Gestao from './pages/Gestao'
import Vendas from './pages/Vendas' // AQUI! Importamos a sua nova página

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* A página das mães continua sendo a principal */}
        <Route path="/" element={<Cadastro />} />
        
        {/* O seu painel de gestão escondido */}
        <Route path="/gestao" element={<Gestao />} />

        {/* A SUA NOVA PÁGINA DE VENDAS PARA OS MOTORISTAS! */}
        <Route path="/vendas" element={<Vendas />} />
      </Routes>
    </HashRouter>
  )
}

export default App
