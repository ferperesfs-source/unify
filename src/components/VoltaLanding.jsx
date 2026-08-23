import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown2, ArrowLeft2, ArrowRight, ArrowUp, CloseCircle, HambergerMenu, Pause, Play } from 'iconsax-react'

const services = [
  ['01', 'Imagem', 'Criação e edição visual'],
  ['02', 'Vídeo', 'Cenas, movimento e campanha'],
  ['03', 'Áudio', 'Voz, música e transcrição'],
  ['04', 'Texto', 'Conteúdo, código e raciocínio'],
  ['05', 'Direção', 'Referências ligadas ao fluxo'],
  ['06', 'Produção', 'Modelos em um único quadro'],
  ['07', 'Entrega', 'Resultados salvos no workspace'],
]

const projects = [
  ['Produto em cena', 'Marketing Studio', 'Imagem + vídeo'],
  ['UGC em escala', 'Marketing Studio', 'Vídeo vertical'],
  ['Motion de produto', 'Marketing Studio', 'Animação'],
  ['Anúncio de performance', 'Marketing Studio', 'Campanha'],
  ['Visual de marketplace', 'Marketing Studio', 'Imagem'],
  ['Fluxo multimodelo', 'Quadro', 'Nós conectados'],
]

const phases = [
  ['01', 'Defina', 'Comece com uma tarefa, um prompt ou uma referência. O quadro nasce limpo e recebe apenas o que seu fluxo precisa.'],
  ['02', 'Conecte', 'Ligue textos, imagens, vídeos e modelos por entradas compatíveis. Cada conexão mantém a origem visível.'],
  ['03', 'Configure', 'Escolha modelo, proporção, duração e qualidade com os parâmetros reais disponíveis na API.'],
  ['04', 'Gere', 'Acompanhe o processamento e veja o resultado aparecer dentro do próprio card da inteligência escolhida.'],
  ['05', 'Reaproveite', 'Salve o histórico, use uma saída como nova referência e continue criando sem quebrar o contexto.'],
]

const benefits = [
  ['01', 'Menos troca de contexto', 'Ferramentas de imagem, vídeo, áudio e texto convivem no mesmo espaço de produção.'],
  ['02', 'Fluxo que explica a si mesmo', 'As conexões mostram de onde cada referência veio e qual modelo produziu cada resultado.'],
  ['03', 'Catálogo realmente conectado', 'A biblioteca é alimentada pela API da Unifically, com modelos, provedores e parâmetros reais.'],
  ['04', 'Dados do seu workspace', 'Projetos, gerações e referências ficam associados ao usuário autenticado no Supabase.'],
  ['05', 'Do experimento à campanha', 'O quadro livre e o Marketing Studio cobrem tanto exploração quanto produção guiada.'],
]

const modes = [
  ['01', 'Quadro', 'Construa fluxos visuais com nós de prompt, referência e modelos conectados.', 'Abrir quadro'],
  ['02', 'Studio', 'Transforme produto, avatar e direção criativa em peças de campanha.', 'Abrir studio'],
  ['03', 'Catálogo', 'Encontre modelos por função, provedor e capacidade antes de adicioná-los.', 'Explorar modelos'],
]

function Brand({ onClick }) {
  return <button className="vl-mark" onClick={onClick} aria-label="Unify — início"><span>U</span><i>×</i><b>F</b></button>
}

function MediaVideo({ src, className = '', eager = false, labelledBy }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { rootMargin: '120px', threshold: .15 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <video ref={ref} className={className} src={src} muted loop playsInline preload={eager ? 'auto' : 'metadata'} aria-labelledby={labelledBy} />
}

export function VoltaLanding({ session, tools, loading, error, videos }) {
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('hero')
  const [paused, setPaused] = useState(false)
  const [benefit, setBenefit] = useState(0)
  const [faq, setFaq] = useState(0)
  const [serviceTurn, setServiceTurn] = useState(0)
  const [workTurn, setWorkTurn] = useState(0)
  const [processTurn, setProcessTurn] = useState(0)
  const [arcTurn, setArcTurn] = useState(0)
  const root = useRef(null)
  const media = useMemo(() => videos.map(item => item.video), [videos])
  const enter = target => { location.hash = session ? 'dashboard' : 'login'; if (target) sessionStorage.setItem('unify-entry', target) }
  const toolCount = loading || error ? '—' : tools.length

  useEffect(() => {
    const element = root.current
    if (!element) return
    const sections = [...element.querySelectorAll('[data-vl-section]')]
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 })
    element.querySelectorAll('[data-reveal]').forEach(item => reveal.observe(item))
    const spy = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: '-42% 0px -50%' })
    sections.forEach(section => spy.observe(section))
    let ticking = false
    const update = () => {
      ticking = false
      const progress = section => {
        const rect = section.getBoundingClientRect()
        return Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)))
      }
      const service = element.querySelector('#services')
      const works = element.querySelector('#works')
      const process = element.querySelector('#process')
      if (service) setServiceTurn(progress(service))
      if (works) setWorkTurn(progress(works))
      if (process) setProcessTurn(progress(process))
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update(); addEventListener('scroll', onScroll, { passive: true })
    return () => { reveal.disconnect(); spy.disconnect(); removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setBenefit(current => (current + 1) % benefits.length), 6500)
    return () => clearInterval(timer)
  }, [paused])

  const faqItems = [
    ['O catálogo é demonstrativo?', 'Não. Os modelos são carregados pela integração com a Unifically; disponibilidade e parâmetros vêm da API configurada.'],
    ['Onde o resultado aparece?', 'A geração aparece no card do modelo no quadro e também pode ser consultada no histórico do workspace.'],
    ['Posso usar imagem ou vídeo como referência?', 'Sim. Os blocos de referência aceitam os formatos compatíveis e se conectam visualmente às entradas do modelo.'],
    ['Consigo controlar duração e formato?', 'Sim. Quando o modelo oferece esses parâmetros, a interface expõe duração, proporção, resolução e qualidade.'],
    ['Meus projetos ficam salvos?', 'Sim. Projetos, gerações e referências são associados ao usuário autenticado e persistidos no Supabase.'],
    ['Preciso começar com um template?', 'Não. O quadro abre limpo. Você adiciona apenas os blocos necessários ou escolhe o Marketing Studio para um fluxo guiado.'],
  ]

  return <div className="volta-landing" ref={root}>
    <a className="vl-skip" href="#hero">Pular para o conteúdo</a>
    <header className="vl-header">
      <Brand onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} />
      <nav className="vl-nav" aria-label="Navegação principal">
        {[['hero', 'Início'], ['services', 'Plataforma'], ['works', 'Criações'], ['process', 'Fluxo'], ['ecosystem', 'Ecossistema'], ['cta', 'Acesso']].map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`}>{label}</a>)}
      </nav>
      <button className="vl-enter" onClick={() => enter()}>{session ? 'Abrir workspace' : 'Entrar'}<ArrowRight size="16" /></button>
      <button className="vl-menu-button" onClick={() => setMenu(true)} aria-label="Abrir menu"><HambergerMenu size="23" /></button>
    </header>

    <div className={`vl-drawer ${menu ? 'open' : ''}`} aria-hidden={!menu}>
      <button onClick={() => setMenu(false)} aria-label="Fechar menu"><CloseCircle size="28" /></button>
      {[['hero', 'Início'], ['services', 'Plataforma'], ['works', 'Criações'], ['process', 'Fluxo'], ['ecosystem', 'Ecossistema'], ['cta', 'Acesso']].map(([id, label], index) => <a href={`#${id}`} onClick={() => setMenu(false)} key={id}><small>0{index + 1}</small>{label}</a>)}
    </div>

    <main>
      <section id="hero" className="vl-hero" data-vl-section>
        <div className="vl-hero-copy" data-reveal>
          <h1><span>Uma</span><span>plataforma.</span></h1>
          <h1 className="right"><span>Todo o</span><span>seu fluxo.</span></h1>
        </div>
        <div className="vl-collage" aria-label="Exemplos de conteúdo criado no Marketing Studio">
          {media.slice(0, 9).map((src, index) => <figure className={`vl-tile t${index + 1}`} key={src}><MediaVideo src={src} eager={index < 3} /><figcaption>{projects[index % projects.length][0]}</figcaption></figure>)}
        </div>
        <div className="vl-hero-meta" data-reveal><span>IA conectada</span><b>Criação visual, vídeo,<br />áudio e texto</b><small>Unify © {new Date().getFullYear()}</small></div>
        <button className="vl-dock" onClick={() => enter('board')}><i><Play size="16" variant="Bold" /></i><span><small>Comece no quadro</small><b>Crie seu primeiro fluxo</b></span><ArrowRight size="18" /></button>
        <a href="#services" className="vl-scrollcue"><span>Explore a plataforma</span><ArrowDown2 size="18" /></a>
      </section>

      <section id="services" className="vl-services" data-vl-section>
        <div className="vl-services-pin">
          <div className="vl-section-intro" data-reveal><span className="vl-eyebrow">O que você conecta</span><h2>Um ambiente de criação.<br />Muitas inteligências.</h2><p>Escolha a capacidade certa sem abandonar o contexto do trabalho.</p></div>
          <div className="vl-cylinder" aria-label="Capacidades da plataforma">
            {services.map((item, index) => {
              const angle = index * (360 / services.length) - serviceTurn * 310
              return <article className="vl-cylinder-row" style={{ transform: `translate(-50%,-50%) rotateX(${angle}deg) translateZ(clamp(118px, 18vw, 230px))` }} key={item[0]}><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></article>
            })}
          </div>
          <div className="vl-stats">
            <div><b>{toolCount}</b><span>ferramentas ativas</span></div><div><b>01</b><span>quadro unificado</span></div><div><b>API</b><span>catálogo conectado</span></div><div><b>RLS</b><span>workspace protegido</span></div>
          </div>
        </div>
      </section>

      <section id="works" className="vl-works" data-vl-section>
        <div className="vl-stack-pin">
          <header><span className="vl-eyebrow">Produção em movimento</span><h2>Um fluxo para cada ideia.</h2><p>Conteúdo real recuperado da experiência do Marketing Studio.</p></header>
          <div className="vl-card-stack">
            {projects.map((project, index) => {
              const local = Math.max(0, Math.min(1, workTurn * projects.length - index))
              return <article className="vl-project-card" style={{ '--card-index': index, '--card-progress': local, zIndex: index + 1, transform: `translateY(${Math.max(0, (index - workTurn * projects.length) * 18)}px) scale(${1 - Math.max(0, workTurn * projects.length - index) * .025}) rotate(${(index % 2 ? 1 : -1) * Math.max(0, index - workTurn * projects.length) * .28}deg)` }} key={project[0]}>
                <MediaVideo src={media[index % media.length]} labelledBy={`project-${index}`} />
                <div className="vl-project-shade" />
                <span className="vl-project-no">0{index + 1}</span>
                <div className="vl-project-copy"><small>{project[1]}</small><h3 id={`project-${index}`}>{project[0]}</h3><p>{project[2]}</p></div>
                <div className="vl-project-rail"><span>Unify / criação conectada</span><i style={{ width: `${Math.max(8, workTurn * 100)}%` }} /><b>{project[2]}</b></div>
              </article>
            })}
          </div>
        </div>
      </section>

      <section className="vl-word" data-vl-section>
        <MediaVideo src={media[8 % media.length]} />
        <div className="vl-word-mask">UNIFY</div>
        <p><span>Uma ideia entra.</span><span>Um sistema inteiro responde.</span></p>
      </section>

      <section id="process" className="vl-process" data-vl-section>
        <div className="vl-process-pin">
          <div className="vl-process-heading"><span className="vl-eyebrow">Como funciona</span><h2>Da intenção<br />ao resultado.</h2><p>Uma sequência visual que continua legível mesmo quando o fluxo cresce.</p></div>
          <div className="vl-phase-track" style={{ transform: `translate3d(${-processTurn * Math.max(0, phases.length * 390 - innerWidth * .58)}px,0,0)` }}>
            {phases.map(([number, title, text]) => <article className="vl-phase" key={number}><small>{number}</small><h3>{title}</h3><p>{text}</p><span>{number} / 05</span></article>)}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="vl-ecosystem" data-vl-section>
        <div className="vl-shell">
          <header data-reveal><span className="vl-eyebrow">Ecossistema</span><h2>Os melhores modelos,<br />sem trocar de lugar.</h2><p>Provedores organizados por capacidade e prontos para entrar no seu fluxo.</p></header>
          <div className="vl-arc" style={{ '--arc-turn': `${arcTurn}deg` }}>
            {['OpenAI', 'Anthropic', 'Google', 'Kling', 'ElevenLabs', 'Suno', 'Flux'].map((name, index) => <article style={{ '--arc-index': index }} key={name}><small>0{index + 1}</small><div>{name.slice(0, 2).toUpperCase()}</div><h3>{name}</h3><p>{['Texto e imagem', 'Texto e raciocínio', 'Imagem e vídeo', 'Geração de vídeo', 'Voz e áudio', 'Música', 'Geração de imagem'][index]}</p></article>)}
          </div>
          <div className="vl-arc-controls"><button onClick={() => setArcTurn(value => value - 18)} aria-label="Provedor anterior"><ArrowLeft2 /></button><span>Arraste a ideia entre modelos</span><button onClick={() => setArcTurn(value => value + 18)} aria-label="Próximo provedor"><ArrowRight /></button></div>
        </div>
      </section>

      <section id="words" className="vl-benefits" data-vl-section>
        <div className="vl-shell"><span className="vl-eyebrow">O que muda no trabalho</span><h2>Menos interface.<br />Mais continuidade.</h2>
          <div className="vl-benefit-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
            {benefits.map(([number, title, text], index) => <article className={index === benefit ? 'active' : ''} aria-hidden={index !== benefit} key={number}><small>{number}</small><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <div className="vl-carousel-controls"><button onClick={() => setBenefit((benefit - 1 + benefits.length) % benefits.length)} aria-label="Benefício anterior"><ArrowLeft2 /></button><div>{benefits.map((_, index) => <button key={index} aria-label={`Mostrar benefício ${index + 1}`} className={index === benefit ? 'active' : ''} onClick={() => setBenefit(index)} />)}</div><button onClick={() => setPaused(value => !value)} aria-label={paused ? 'Continuar rotação' : 'Pausar rotação'}>{paused ? <Play /> : <Pause />}</button><button onClick={() => setBenefit((benefit + 1) % benefits.length)} aria-label="Próximo benefício"><ArrowRight /></button></div>
        </div>
      </section>

      <section id="pricing" className="vl-modes" data-vl-section>
        <div className="vl-shell"><header><span className="vl-eyebrow">Escolha seu ponto de partida</span><h2>Três portas.<br />O mesmo workspace.</h2></header>
          <div className="vl-mode-grid">{modes.map(([number, title, text, action], index) => <article className={index === 1 ? 'featured' : ''} key={number}><small>{number}</small><h3>{title}</h3><p>{text}</p><ul><li>Dados reais do usuário</li><li>Histórico integrado</li><li>Catálogo Unifically</li></ul><button onClick={() => enter(index === 1 ? 'studio' : 'board')}>{action}<ArrowRight size="17" /></button></article>)}</div>
        </div>
      </section>

      <section id="faq" className="vl-faq" data-vl-section>
        <div className="vl-shell vl-faq-grid"><header><span className="vl-eyebrow">Perguntas frequentes</span><h2>Antes de<br />começar.</h2><p>O essencial sobre o workspace e as integrações.</p></header><div>{faqItems.map(([question, answer], index) => <article className={faq === index ? 'open' : ''} key={question}><button onClick={() => setFaq(faq === index ? -1 : index)} aria-expanded={faq === index}><span>{String(index + 1).padStart(2, '0')}</span><b>{question}</b><i>+</i></button><div><p>{answer}</p></div></article>)}</div></div>
      </section>

      <section id="cta" className="vl-cta" data-vl-section>
        <div className="vl-ghosts" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>UNIFY</span>)}</div>
        <div className="vl-cta-copy" data-reveal><span className="vl-eyebrow">Seu próximo projeto começa aqui</span><h2>Construa<br />o fluxo.</h2><p>Abra um quadro limpo, conecte as ferramentas que precisa e deixe cada resultado alimentar o próximo.</p><button onClick={() => enter('board')}>{session ? 'Abrir workspace' : 'Criar acesso'}<ArrowRight /></button><a href="mailto:ferperes.fs@gmail.com">ferperes.fs@gmail.com</a></div>
      </section>
    </main>

    <footer className="vl-footer"><div className="vl-marquee"><span>Imagem · Vídeo · Áudio · Texto · Automação ·</span><span aria-hidden="true">Imagem · Vídeo · Áudio · Texto · Automação ·</span></div><div className="vl-footer-grid"><Brand onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} /><div><small>Plataforma</small><a href="#services">Capacidades</a><a href="#works">Criações</a><a href="#process">Fluxo</a></div><div><small>Workspace</small><button onClick={() => enter('board')}>Quadro</button><button onClick={() => enter('studio')}>Marketing Studio</button><button onClick={() => enter()}>Entrar</button></div><div><small>Status</small><span>{error ? 'Catálogo indisponível' : loading ? 'Sincronizando API' : `${tools.length} ferramentas conectadas`}</span><span>Supabase protegido</span></div></div><div className="vl-footer-base"><span>© {new Date().getFullYear()} Unify</span><span>Inteligência em um só fluxo</span><button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>Voltar ao topo <ArrowUp size="15" /></button></div></footer>
  </div>
}
