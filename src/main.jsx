import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Add, ArrowRight, Briefcase, Category, Chart, CloseCircle, Code,
  DocumentText, Eye, EyeSlash, Flash, HambergerMenu, Home2, Logout,
  MessageText, Notification, SearchNormal1, Setting2, ShieldTick, TickCircle,
  User, Wallet3
} from 'iconsax-react'
import './styles.css'
import './skiper.css'
import { TextRoll } from './components/skiper/TextRoll'
import { ExpandingAction } from './components/skiper/ExpandingAction'
import { ScrollFade } from './components/skiper/ScrollFade'

const tools = [
  { name: 'Copywriter', desc: 'Textos que convertem, no tom da sua marca.', tag: 'Conteúdo', Icon: DocumentText, color: '#d9ff6a' },
  { name: 'Gerador de imagens', desc: 'Visuais prontos para campanhas e redes.', tag: 'Criativo', Icon: Flash, color: '#f1b7ff' },
  { name: 'Análise de dados', desc: 'Transforme planilhas em decisões claras.', tag: 'Dados', Icon: Chart, color: '#a9d5ff' },
  { name: 'Assistente de código', desc: 'Crie, revise e explique código em minutos.', tag: 'Dev', Icon: Code, color: '#ffcf73' },
  { name: 'Chat inteligente', desc: 'Respostas rápidas com o contexto do negócio.', tag: 'Atendimento', Icon: MessageText, color: '#ffa991' },
  { name: 'Propostas comerciais', desc: 'Documentos consistentes que fecham negócio.', tag: 'Vendas', Icon: Briefcase, color: '#c7baff' },
]

const nav = [
  { label: 'Visão geral', Icon: Home2 },
  { label: 'Ferramentas', Icon: Category },
  { label: 'Histórico', Icon: DocumentText },
  { label: 'Faturamento', Icon: Wallet3 },
]

function Logo({ dark = false }) {
  return <button className={`logo ${dark ? 'logo-dark' : ''}`} onClick={() => location.hash = ''} aria-label="Ir para o início">
    <span className="logo-mark"><i /><i /><i /></span><span>unify</span>
  </button>
}

function IconButton({ children, label, onClick, className = '' }) {
  return <button className={`icon-button ${className}`} aria-label={label} onClick={onClick}>{children}</button>
}

function Landing() {
  const [menu, setMenu] = useState(false)
  return <div className="landing">
    <header className="site-nav shell">
      <Logo />
      <nav className={menu ? 'nav-links open' : 'nav-links'}>
        <a href="#recursos"><TextRoll>Recursos</TextRoll></a><a href="#como-funciona"><TextRoll>Como funciona</TextRoll></a><a href="#planos"><TextRoll>Planos</TextRoll></a>
      </nav>
      <div className="nav-actions"><button className="text-button" onClick={() => location.hash='login'}>Entrar</button><button className="button light" onClick={() => location.hash='login'}>Começar agora <ArrowRight size="17" /></button></div>
      <IconButton className="menu-button" label="Abrir menu" onClick={() => setMenu(!menu)}><HambergerMenu size="22" /></IconButton>
    </header>

    <main>
      <section className="hero shell">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span className="pulse-dot" /> Sua operação, em um único lugar</div>
          <h1>Menos abas.<br /><span>Mais trabalho feito.</span></h1>
          <p>Ferramentas inteligentes para criar, analisar e operar. Um workspace simples para sua equipe produzir mais sem trocar de plataforma.</p>
          <div className="hero-actions"><button className="button accent" onClick={() => location.hash='login'}>Experimentar grátis <ArrowRight size="18" /></button><a href="#como-funciona"><TextRoll>Ver como funciona</TextRoll></a></div>
          <div className="social-proof"><div className="avatar-stack"><span>ML</span><span>RS</span><span>AO</span></div><p><strong>2.400+ profissionais</strong><br />já centralizaram seu trabalho</p></div>
        </div>
        <ProductPreview />
      </section>

      <section className="ticker"><div className="ticker-track">{['CONTEÚDO','ANÁLISE','AUTOMAÇÃO','IMAGENS','CÓDIGO','ATENDIMENTO','CONTEÚDO','ANÁLISE','AUTOMAÇÃO','IMAGENS'].map((x,i)=><React.Fragment key={i}><span>{x}</span><i /></React.Fragment>)}</div></section>

      <section className="features shell" id="recursos">
        <div className="section-heading"><span>O workspace completo</span><h2>Tudo que sua equipe precisa.<br />Sem a complexidade.</h2></div>
        <div className="feature-grid">
          <article className="feature feature-large"><div><span className="feature-num">01</span><h3>Um catálogo que cresce com você</h3><p>Acesse ferramentas especializadas para cada etapa da sua operação.</p></div><div className="mini-tool-grid">{tools.slice(0,4).map(({name,Icon,color})=><div className="mini-tool" key={name}><span style={{background:color}}><Icon size="20" variant="Linear" /></span>{name}</div>)}</div></article>
          <article className="feature feature-dark"><span className="feature-num">02</span><div className="live-status"><i /><span>Integração pronta</span></div><h3>Conecte a Unifically</h3><p>Uma camada de integração organizada para plugar suas chaves e endpoints quando estiver pronto.</p><div className="code-line"><code>UNIFICALLY_API_KEY</code><TickCircle size="18" color="#d9ff6a" /></div></article>
          <article className="feature feature-accent"><span className="feature-num">03</span><div><ShieldTick size="34" variant="Broken" /><h3>Seu trabalho continua seu</h3><p>Estrutura preparada para autenticação segura e dados isolados por workspace.</p></div></article>
        </div>
      </section>

      <section className="how shell" id="como-funciona"><div className="how-copy"><span>Comece em minutos</span><h2>Da ideia ao resultado em três passos.</h2></div><ol>{['Crie seu workspace','Escolha uma ferramenta','Entregue seu melhor trabalho'].map((x,i)=><li key={x}><span>0{i+1}</span><h3>{x}</h3><p>{['Organize equipe, projetos e preferências.','Use prompts guiados ou comece do zero.','Salve, exporte e compartilhe com sua equipe.'][i]}</p></li>)}</ol></section>

      <section className="cta shell" id="planos"><div><span>Seu próximo projeto começa aqui</span><h2>Uma plataforma.<br />Mais possibilidades.</h2></div><div className="skiper-action-wrap"><small>Toque para revelar</small><ExpandingAction onComplete={() => location.hash='login'} /></div></section>
    </main>
    <footer className="footer shell"><Logo /><p>© 2026 Unify Technologies · Componentes por <a className="skiper-credit" href="https://skiper-ui.com/" target="_blank" rel="noreferrer">Skiper UI</a></p><div><a href="#">Privacidade</a><a href="#">Termos</a></div></footer>
  </div>
}

function ProductPreview() {
  return <div className="preview-wrap reveal delay"><div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
    <div className="preview-window">
      <div className="window-bar"><span /><span /><span /><div>app.unify.tools</div></div>
      <div className="preview-body"><aside><Logo dark /><div className="fake-nav active" /><div className="fake-nav" /><div className="fake-nav small" /></aside><div className="preview-content"><div className="preview-head"><div><b>Boa tarde, Marina</b><small>O que você quer criar hoje?</small></div><span>MG</span></div><div className="command-demo"><SearchNormal1 size="17" /><span>Busque uma ferramenta ou tarefa...</span><kbd>⌘ K</kbd></div><div className="demo-grid">{tools.slice(0,4).map(({name,Icon,color})=><div key={name}><span style={{background:color}}><Icon size="20" /></span><b>{name}</b><small>Abrir ferramenta</small></div>)}</div></div></div>
    </div>
    <div className="floating-tag tag-one"><TickCircle size="18" variant="Bold" /> Projeto salvo</div><div className="floating-tag tag-two"><Flash size="18" variant="Bold" /> +32% produtividade</div>
  </div>
}

function Login() {
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const submit = e => { e.preventDefault(); const data = new FormData(e.currentTarget); if (!data.get('email') || !data.get('password')) return setError('Preencha seu e-mail e sua senha.'); setError(''); setLoading(true); setTimeout(()=>location.hash='dashboard', 850) }
  return <main className="login-page">
    <section className="login-art"><Logo /><div className="login-statement"><div className="eyebrow"><span className="pulse-dot" /> Workspace inteligente</div><h1>Um lugar para<br />fazer acontecer.</h1><p>Crie, analise e automatize com ferramentas pensadas para o seu fluxo.</p></div><div className="login-quote">“Agora nossa equipe produz em horas o que levava dias.”<span>Marina Lima · Estúdio Norte</span></div></section>
    <section className="login-panel"><button className="back-link" onClick={()=>location.hash=''}>← Voltar para o site</button><div className="login-box"><span className="kicker">Bem-vindo de volta</span><h2>Acesse seu workspace</h2><p>Entre com seus dados para continuar.</p><form onSubmit={submit} noValidate><label>E-mail corporativo<input name="email" type="email" placeholder="voce@empresa.com" autoComplete="email" /></label><label>Senha<div className="password-field"><input name="password" type={show?'text':'password'} placeholder="Mínimo de 8 caracteres" autoComplete="current-password" /><IconButton label={show?'Ocultar senha':'Mostrar senha'} onClick={()=>setShow(!show)}>{show?<EyeSlash size="19"/>:<Eye size="19"/>}</IconButton></div></label><div className="form-row"><label className="checkbox"><input type="checkbox" /> <span>Lembrar de mim</span></label><button type="button">Esqueci minha senha</button></div>{error&&<div className="form-error"><CloseCircle size="17" />{error}</div>}<button className="button login-submit" disabled={loading}>{loading?<span className="loading-line">Preparando seu workspace</span>:<>Entrar <ArrowRight size="18" /></>}</button></form><div className="divider"><span>ou continue com</span></div><button className="google-button"><span>G</span> Google</button><p className="signup-line">Ainda não tem uma conta? <button>Crie gratuitamente</button></p></div><small className="legal">Ao continuar, você concorda com nossos Termos e Política de Privacidade.</small></section>
  </main>
}

function Dashboard() {
  const [active,setActive]=useState('Visão geral'); const [search,setSearch]=useState(''); const [mobile,setMobile]=useState(false); const [loading,setLoading]=useState(true)
  useEffect(()=>{ const id=setTimeout(()=>setLoading(false),600); return()=>clearTimeout(id)},[])
  const filtered=useMemo(()=>tools.filter(t=>(t.name+t.desc+t.tag).toLowerCase().includes(search.toLowerCase())),[search])
  return <div className="dashboard">
    <aside className={mobile?'dash-sidebar open':'dash-sidebar'}><div className="sidebar-top"><Logo dark /><IconButton className="close-mobile" label="Fechar menu" onClick={()=>setMobile(false)}><CloseCircle size="21" /></IconButton></div><nav>{nav.map(({label,Icon})=><button key={label} className={active===label?'active':''} onClick={()=>{setActive(label);setMobile(false)}}><Icon size="20" />{label}</button>)}</nav><div className="sidebar-bottom"><div className="api-status"><span><i /> Unifically API</span><small>Aguardando conexão</small></div><button><Setting2 size="20" />Configurações</button><div className="user-card"><div>ML</div><span><b>Marina Lima</b><small>Plano Pro</small></span><IconButton label="Sair" onClick={()=>location.hash='login'}><Logout size="18" /></IconButton></div></div></aside>
    <main className="dash-main"><header className="dash-header"><IconButton className="dash-menu" label="Abrir menu" onClick={()=>setMobile(true)}><HambergerMenu size="22" /></IconButton><div className="global-search"><SearchNormal1 size="19"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar em todo o workspace..."/><kbd>⌘ K</kbd></div><IconButton label="Notificações" className="notification-button"><Notification size="21"/><i /></IconButton><button className="profile-chip"><span>ML</span><b>Marina</b></button></header>
      <div className="dash-content"><div className="dash-intro"><div><span className="kicker">Sexta-feira, 22 de agosto</span><h1>Boa tarde, Marina.</h1><p>Qual ferramenta vai acelerar seu trabalho hoje?</p></div><button className="button dash-cta"><Add size="19" /> Novo projeto</button></div>
        <section className="quick-action"><div><span className="spark"><Flash size="21" variant="Bold" /></span><div><b>Comece com uma tarefa</b><p>Descreva o que precisa e indicamos a ferramenta certa.</p></div></div><button><span>Ex: crie uma legenda para o lançamento...</span><ArrowRight size="18" /></button></section>
        <section className="tool-section"><div className="tool-heading"><div><span className="kicker">Catálogo</span><h2>Suas ferramentas</h2></div><button>Ver todas <ArrowRight size="16" /></button></div>
          {loading?<div className="tool-grid">{Array.from({length:6}).map((_,i)=><div className="tool-card skeleton" key={i}><span/><i/><i/></div>)}</div>:filtered.length?<ScrollFade className="tool-scroll"><div className="tool-grid">{filtered.map(({name,desc,tag,Icon,color},i)=><article className="tool-card" style={{'--i':i}} key={name}><div className="tool-icon" style={{background:color}}><Icon size="24" variant="Linear" /></div><span className="tool-tag">{tag}</span><h3>{name}</h3><p>{desc}</p><button>Abrir ferramenta <ArrowRight size="17" /></button></article>)}</div></ScrollFade>:<div className="empty-state"><SearchNormal1 size="28"/><h3>Nenhuma ferramenta encontrada</h3><p>Tente buscar por outro termo ou categoria.</p><button onClick={()=>setSearch('')}>Limpar busca</button></div>}
        </section>
        <section className="recent"><div className="tool-heading"><div><span className="kicker">Atividade</span><h2>Projetos recentes</h2></div><button>Ver histórico <ArrowRight size="16" /></button></div><div className="recent-table"><div><span className="file-icon"><DocumentText size="19" /></span><p><b>Campanha de lançamento · Inverno</b><small>Copywriter · editado há 18 min</small></p><span className="status">Concluído</span><button>•••</button></div><div><span className="file-icon blue"><Chart size="19" /></span><p><b>Relatório de performance · Q2</b><small>Análise de dados · editado ontem</small></p><span className="status draft">Rascunho</span><button>•••</button></div></div></section>
      </div>
    </main>{mobile&&<button className="sidebar-overlay" aria-label="Fechar menu" onClick={()=>setMobile(false)} />}
  </div>
}

function App(){const [route,setRoute]=useState(location.hash.slice(1));useEffect(()=>{const h=()=>setRoute(location.hash.slice(1));addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[]);return route==='login'?<Login/>:route==='dashboard'?<Dashboard/>:<Landing/>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
