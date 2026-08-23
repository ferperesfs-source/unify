import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Add, ArrowLeft2, ArrowRight, Briefcase, Category, Chart, CloseCircle, Code, DocumentText, Eye, EyeSlash, Flash, Gallery, HambergerMenu, Home2, Logout, Maximize4, MessageText, Minus, More, MouseSquare, NoteAdd, Notification, SearchNormal1, Setting2, ShieldTick, Text, TickCircle, VideoPlay, VolumeHigh, Wallet3 } from 'iconsax-react'
import './styles.css'
import './skiper.css'
import './design-system.css'
import './kage.css'
import { TextRoll } from './components/skiper/TextRoll'
import { ScrollFade } from './components/skiper/ScrollFade'
import { ProgressiveBlur } from './components/skiper/ProgressiveBlur'
import { AnimatedMetric } from './components/skiper/AnimatedMetric'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { createGenerationRecord, createProject, getCatalog, getGenerationHistory, getWorkspace, signInWithGoogle, signInWithPassword, signOut, signUpWithPassword, updateGenerationRecord, uploadGenerationReference } from './services/supabaseData'
import { unifically } from './services/unificallyClient'

const KageWorld = () => null

const iconMap = { DocumentText, Flash, Gallery, Chart, Code, MessageText, Briefcase }
const nav = [
  { label: 'Visão geral', Icon: Home2 }, { label: 'Ferramentas', Icon: Category },
  { label: 'Marketing Studio', Icon: Flash },
  { label: 'Histórico', Icon: DocumentText }, { label: 'Faturamento', Icon: Wallet3 },
]
const apiProviders = [
  { name: 'OpenAI', logo: '/providers/openai.svg' }, { name: 'Anthropic', logo: '/providers/anthropic.svg' },
  { name: 'Google Gemini', logo: '/providers/google.svg' }, { name: 'xAI', logo: '/providers/xai.svg' },
  { name: 'Cursor', logo: '/providers/cursor.svg' }, { name: 'Moonshot AI', logo: '/providers/moonshotai.svg' },
  { name: 'ElevenLabs', logo: '/providers/elevenlabs.svg' }, { name: 'Suno', logo: '/providers/suno-ai.svg' },
  { name: 'Flux', logo: '/providers/black-forest-labs.svg' }, { name: 'Kling', logo: '/providers/kling.svg' },
]
const providerLogos = {
  qwen: '/providers/qwen-color.svg', alibaba: '/providers/alibaba-color.svg', alibabacloud: '/providers/alibaba-color.svg',
  bytedance: '/providers/bytedance-color.svg', seedance: '/providers/bytedance-color.svg', seedream: '/providers/bytedance-color.svg',
  minimax: '/providers/minimax-color.svg', hailuo: '/providers/hailuo-color.svg', stability: '/providers/stability-color.svg',
  stableimage: '/providers/stability-color.svg', stablediffusion: '/providers/stability-color.svg', fal: '/providers/fal-color.svg',
  openai: '/providers/openai.svg', anthropic: '/providers/anthropic.svg', google: '/providers/google.svg',
  gemini: '/providers/google.svg', xai: '/providers/xai.svg', cursor: '/providers/cursor.svg',
  moonshot: '/providers/moonshotai.svg', kimi: '/providers/moonshotai.svg', elevenlabs: '/providers/elevenlabs.svg',
  suno: '/providers/suno-ai.svg', flux: '/providers/black-forest-labs.svg', blackforestlabs: '/providers/black-forest-labs.svg',
  bfl: '/providers/black-forest-labs.svg', kling: '/providers/kling.svg',
}
const modelGroups = [
  { key: 'image', railLabel: 'Imagem', title: 'Geração de imagens', description: 'Modelos para criar, editar e transformar imagens.', Icon: Gallery },
  { key: 'video', railLabel: 'Vídeo', title: 'Geração de vídeos', description: 'Modelos para cenas, animações e conteúdo em movimento.', Icon: VideoPlay },
  { key: 'audio', railLabel: 'Áudio', title: 'Áudio e voz', description: 'Modelos para voz, música, transcrição e processamento de áudio.', Icon: VolumeHigh },
  { key: 'llm', railLabel: 'Texto', title: 'Texto e raciocínio', description: 'Modelos de linguagem para conteúdo, código e análise.', Icon: Text },
]
const marketingStudioTemplates = [
  { id: 'product', title: 'Produto em destaque', category: 'product-shot', mode: 'image', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-Product.mp4', prompt: 'Crie uma foto publicitária premium do produto, com iluminação de estúdio, composição limpa e acabamento editorial.' },
  { id: 'ugc', title: 'UGC para redes', category: 'ugc', mode: 'video', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-UGC.mp4', prompt: 'Crie um vídeo UGC vertical, autêntico e espontâneo, apresentando o produto em uso com ritmo de rede social.' },
  { id: 'motion', title: 'Produto em movimento', category: 'motion', mode: 'video', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-Motion.mp4', prompt: 'Anime o produto com movimento cinematográfico de câmera, luz dinâmica e fundo sofisticado.' },
  { id: 'ads', title: 'Anúncio de performance', category: 'ads', mode: 'video', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-Ads.mp4', prompt: 'Crie um anúncio curto, direto e visualmente marcante para apresentar o benefício principal deste produto.' },
  { id: 'posters', title: 'Poster de campanha', category: 'posters', mode: 'image', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-poster.mp4', prompt: 'Crie um poster de campanha contemporâneo com o produto como protagonista e espaço para texto publicitário.' },
  { id: 'marketplace', title: 'Imagem de marketplace', category: 'marketplace', mode: 'image', video: 'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-Marketplace.mp4', prompt: 'Crie uma imagem clara de marketplace, com o produto bem definido, fundo limpo e iluminação comercial.' },
  { id: 'motion-01', title: 'Rotação de produto', category: 'motion', mode: 'video', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/04f54ce5-c138-46f9-b3ff-9326d1383ca3.mp4', prompt: 'Faça uma rotação suave do produto com câmera orbital e reflexos de estúdio.' },
  { id: 'motion-02', title: 'Entrada cinematográfica', category: 'motion', mode: 'video', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/2270a163-40c5-4908-a3bc-bb18807d85fd.mp4', prompt: 'Revele o produto com uma entrada cinematográfica, luz recortada e movimento preciso.' },
  { id: 'motion-03', title: 'Close publicitário', category: 'motion', mode: 'video', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/5b54eb77-0ebb-4e84-91fb-b53ee9e7d87f.mp4', prompt: 'Crie um close publicitário que destaque materiais, textura e detalhes do produto.' },
  { id: 'motion-04', title: 'Cena de campanha', category: 'ads', mode: 'video', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/6daa737e-d3a7-42c1-9544-d095a126519f.mp4', prompt: 'Transforme o produto em uma cena curta de campanha com narrativa visual e composição premium.' },
  { id: 'motion-05', title: 'Produto flutuante', category: 'motion', mode: 'video', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/d5840f15-1a7e-482c-912a-36d3bd30c078.mp4', prompt: 'Anime o produto flutuando de forma elegante, com profundidade, sombra e movimento natural.' },
]
const marketingVideoStyles = [
  { id: '2d-product-motion', title: '2D product motion', group: 'Motion', video: 'https://cdn.higgsfield.ai/marketing-studio-motion-preview/04f54ce5-c138-46f9-b3ff-9326d1383ca3.mp4', direction: 'Use animação 2D de produto, movimentos gráficos precisos, composição publicitária limpa e transições fluidas.' },
  { id: 'shopping', title: 'Shopping', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/5a9ba7c1-144b-4158-8582-47548837dd85.mp4', direction: 'Apresente a descoberta e a compra do produto em uma experiência de shopping espontânea e convincente.' },
  { id: 'at-home', title: 'At home', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/a0a7c111-da50-4c3f-a2e0-172d4a9deefb.mp4', direction: 'Mostre o produto em uso dentro de casa, com linguagem cotidiana, iluminação natural e sensação autêntica.' },
  { id: 'delivery', title: 'Delivery', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/a9f10f0d-0acd-4b86-9ee8-6e4d6a2bcb76.mp4', direction: 'Construa a cena em torno da entrega e do primeiro contato com o produto, valorizando expectativa e conveniência.' },
  { id: 'review', title: 'Review', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/0307d62d-efd8-4906-9162-be99158d25fb.mp4', direction: 'Crie um review UGC direto para a câmera, com demonstração prática, reação natural e benefício principal claro.' },
  { id: 'try-on', title: 'Try-on', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/7a9bcdd4-c60f-4aea-ad4f-14b607479d76.mp4', direction: 'Demonstre o produto sendo experimentado, destacando ajuste, aparência e reação de forma natural.' },
  { id: 'unboxing', title: 'Unboxing', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/73366684-a5c0-4c71-8061-95c7486deceb.mp4', direction: 'Mostre um unboxing progressivo, da embalagem aos detalhes do produto, com reação autêntica e ritmo de rede social.' },
  { id: 'tutorial', title: 'Tutorial', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/97464e03-828d-4177-a29d-11d165d2f7bb.mp4', direction: 'Explique visualmente como usar o produto em passos simples, claros e fáceis de acompanhar.' },
  { id: 'before-after', title: 'Before/after', group: 'UGC', video: 'https://cdn.higgsfield.ai/marketing-studio-v2-ugc/703da148-3bfa-42d9-a674-4371ebbc857f.mp4', direction: 'Estruture o vídeo como antes e depois, tornando a transformação visual imediata, clara e crível.' },
]
const formatDate = value => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(value))
const formatRelative = value => { const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000)); if (minutes < 1) return 'agora'; if (minutes < 60) return `há ${minutes} min`; const hours = Math.floor(minutes / 60); return hours < 24 ? `há ${hours}h` : formatDate(value) }
const getProviderLogo = model => { const source = `${model.id || ''} ${model.display_name || ''} ${model.owned_by || ''} ${model.provider_display || ''}`.toLowerCase().replace(/[^a-z0-9]/g, ''); return Object.entries(providerLogos).find(([key]) => source.includes(key))?.[1] }
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index)
const getModelControls = model => {
  const id = model.id || ''
  const aspect = { key: 'aspect_ratio', label: 'Proporção', type: 'select', options: ['16:9', '9:16', '1:1'], default: '16:9' }
  if (model.category === 'image') return [aspect, { key: 'resolution', label: 'Resolução', type: 'select', options: ['1k', '2k', '4k'], default: '1k' }]
  if (model.category !== 'video' || id.includes('edit') || id.includes('upscale')) return []
  if (id.includes('happyhorse-1.')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: range(3, 15), default: 5 }, { ...aspect, key: 'ratio', options: ['16:9', '9:16', '1:1', '4:3', '3:4'] }, { key: 'resolution', label: 'Resolução', type: 'select', options: ['720P', '1080P'], default: '1080P' }]
  if (id.includes('wan-2.7-video')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: range(2, 15), default: 5 }, { ...aspect, key: 'ratio', options: ['16:9', '9:16', '1:1', '4:3', '3:4'] }, { key: 'resolution', label: 'Resolução', type: 'select', options: ['720P', '1080P'], default: '1080P' }]
  if (id.includes('seedance-1.5')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: [5, 10, 12], default: 5 }, aspect, { key: 'resolution', label: 'Resolução', type: 'select', options: ['720p', '1080p'], default: '720p' }]
  if (id.includes('seedance-2')) return [{ key: 'mode', label: 'Modo', type: 'select', options: ['text_to_video', 'first_last_frame', 'omni_reference'], default: 'text_to_video' }, { key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: range(4, 15), default: 5 }, aspect, { key: 'resolution', label: 'Resolução', type: 'select', options: ['720p', '1080p'], default: '720p' }]
  if (id.startsWith('google/veo-3.1')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: [4, 6, 8], default: 4 }, { ...aspect, options: ['16:9', '9:16'] }]
  if (id.startsWith('hailuo/')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: [6, 10], default: 6 }, { key: 'resolution', label: 'Resolução', type: 'select', options: ['768p', '1080p'], default: '768p' }, { key: 'prompt_optimization', label: 'Otimizar prompt', type: 'boolean', default: true }]
  if (id.includes('kling-3.0') || id.includes('kling-o1')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: range(3, id.includes('o1') ? 10 : 15), default: 5 }, { key: 'mode', label: 'Qualidade', type: 'select', options: ['std', 'pro'], default: 'pro' }, aspect, ...(id.includes('o1') ? [] : [{ key: 'native_audio', label: 'Gerar áudio', type: 'boolean', default: true }])]
  if (id.includes('kling-2.')) return [{ key: 'duration', label: 'Duração', suffix: 's', type: 'select', options: [5, 10], default: 5 }, { key: 'mode', label: 'Qualidade', type: 'select', options: ['std', 'pro'], default: 'pro' }, aspect]
  return []
}
const getDefaultModelSettings = model => Object.fromEntries(getModelControls(model).map(control => [control.key, control.default]))
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
const unwrapTask = payload => payload?.data || payload || {}
const buildMarketingStudioInput = (model, prompt, aspectRatio, duration, mode) => {
  if (mode === 'image') return { prompt, aspect_ratio: aspectRatio, resolution: '1k' }
  const id = model?.id || ''
  const ratioKey = id.includes('happyhorse-1.') || id.includes('wan-2.7-video') ? 'ratio' : 'aspect_ratio'
  return { prompt, [ratioKey]: aspectRatio, duration: Number(duration), ...(id.includes('happyhorse-1.') || id.includes('wan-2.7-video') ? { mode: 't2v', resolution: '1080P' } : {}) }
}
const buildReferenceInput = (model, file, url, settings = {}) => {
  const id = model.id || ''
  if (id.includes('seedance-2')) return settings.mode === 'omni_reference' || file.type.startsWith('video/') ? { references: [url] } : { first_frame_url: url }
  if (id.includes('seedance-1.5')) return { first_frame_url: url }
  if (file.type.startsWith('video/')) return id.includes('gemini-omni') ? { reference_video_urls: [url] } : { video_url: url }
  if (id.startsWith('google/veo')) return { reference_image_urls: [url] }
  if (id.startsWith('hailuo/')) return { start_frame_url: url }
  if (id.includes('gemini-omni')) return { reference_image_urls: [url] }
  if (id.startsWith('kuaishou/') || model.category === 'image') return { image_urls: [url] }
  return { image_url: url }
}

function useCatalog() {
  const [tools, setTools] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { let active = true; getCatalog().then(data => active && setTools(data)).catch(err => active && setError(err.message)).finally(() => active && setLoading(false)); return () => { active = false } }, [])
  return { tools, loading, error }
}
function Logo({ dark = false }) { return <button className={`logo ${dark ? 'logo-dark' : ''}`} onClick={() => location.hash = ''} aria-label="Ir para o início"><span className="logo-mark"><i /><i /><i /></span><span>unify</span></button> }
function CatalogToolIcon({ tool }) { const Icon = iconMap[tool.icon] || Category; return <span className="kage-catalog-icon" style={{ '--tool-color': tool.color || '#e0231c' }}><Icon size="20" variant="Broken" /></span> }
function IconButton({ children, label, onClick, className = '', type = 'button' }) { return <button type={type} className={`icon-button ${className}`} aria-label={label} onClick={onClick}>{children}</button> }

const kageAsset = '/landing-pages/secret-pathways-assets/'

function KageBrand() {
  return <button className="kx-brand" onClick={() => { location.hash = '' }} aria-label="Ir para o início">
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity=".9" /><path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" /><path d="M14 35.5h16" stroke="#dfe7e0" strokeWidth="1.2" strokeOpacity=".6" /></svg>
    <span><b>UNIFY</b><i>INTELLIGENCE IN ONE FLOW</i></span>
  </button>
}

function KageForeground({ scene }) {
  const scenes = {
    portal: [['temple-wall.webp', 'kx-wall', 'left'], ['pine-tree.webp', 'kx-pine', 'right'], ['tall-grass.webp', 'kx-grass', 'up']],
    catalog: [['sakura-branch.webp', 'kx-sakura kx-sway', 'left'], ['maple-leaves.webp', 'kx-leaves kx-sway', 'right'], ['stone-lantern.webp', 'kx-lantern', 'up'], ['garden-bush.webp', 'kx-bush', 'up']],
    method: [['temple-wall.webp', 'kx-wall kx-flip', 'right'], ['basalt-stones.webp', 'kx-stones', 'up'], ['tall-grass.webp', 'kx-grass', 'up']],
    access: [['hill.webp', 'kx-hill', 'up'], ['shrine-ruins.webp', 'kx-ruins', 'left'], ['tall-grass.webp', 'kx-grass', 'up'], ['sakura-branch.webp', 'kx-sakura', 'left']],
  }
  return <div className={`kx-fg kx-fg-${scene}`} aria-hidden="true">{scenes[scene].map(([file, className, from], index) => <span className={`kx-fg-el ${className}`} data-from={from} style={{ '--fg-delay': `${index * 90}ms` }} key={`${scene}-${file}`}><img src={`${kageAsset}foreground/png/${file}`} alt="" loading="lazy" decoding="async" /></span>)}</div>
}

function KageLanding({ session }) {
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState(0)
  const { tools, loading, error } = useCatalog()
  const enter = () => { location.hash = session ? 'dashboard' : 'login' }
  const featured = tools.slice(0, 3)
  const chapters = [
    ['01', 'O portal', 'Um único limiar para todas as ferramentas.', '#portal'],
    ['02', 'Catálogo vivo', 'Modelos reais, organizados por intenção.', '#catalogo'],
    ['03', 'Método visual', 'Do prompt ao resultado sem perder contexto.', '#metodo'],
    ['04', 'Workspace', 'Seu próximo fluxo começa em um quadro limpo.', '#acesso'],
  ]

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('rv-in')), { threshold: 0.16 })
    document.querySelectorAll('.kage-landing [data-rv]').forEach(element => reveal.observe(element))
    const sections = [...document.querySelectorAll('.kx-camera-section')]
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const index = sections.indexOf(entry.target)
      setActive(index)
      sections.forEach((section, sectionIndex) => section.classList.toggle('is-active', sectionIndex === index))
    }), { rootMargin: '-38% 0px -42% 0px' })
    sections.forEach(section => sectionObserver.observe(section))
    const nav = document.querySelector('.kx-nav')
    const onScroll = () => nav?.classList.toggle('stuck', window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => { reveal.disconnect(); sectionObserver.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return <div className="landing kage-landing">
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <React.Suspense fallback={null}><KageWorld /></React.Suspense>
    <div className="kx-vignette" aria-hidden="true" /><div className="kx-grain" aria-hidden="true" />

    <header className={`kx-nav ${menu ? 'menu-open' : ''}`}>
      <KageBrand />
      <nav className="kx-nav-links" aria-label="Navegação principal">
        <a href="#portal" onClick={() => setMenu(false)}><span>Plataforma</span><span className="alt">PORTAL</span></a>
        <a href="#catalogo" onClick={() => setMenu(false)}><span>Ferramentas</span><span className="alt">CATÁLOGO</span></a>
        <a href="#metodo" onClick={() => setMenu(false)}><span>Método</span><span className="alt">FLUXO</span></a>
        <button onClick={enter}><span>{session ? 'Workspace' : 'Acesso'}</span><span className="alt">ENTRAR</span></button>
      </nav>
      <button className={`kx-burger ${menu ? 'active' : ''}`} aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /></button>
    </header>

    <main id="main-content" className="kx-page">
      <section className="kx-hero kx-camera-section is-active" id="inicio">
        <div className="kx-hero-top">
          <div className="kx-eyebrow" data-rv="fade"><span /> Capítulo 00 — O portal oculto</div>
          <h1 className="kx-display kx-h-hero" aria-label="Onde o silêncio revela o próximo fluxo">
            <span className="kx-mask"><span>Onde o silêncio</span></span>
            <span className="kx-mask"><span>revela o</span></span>
            <span className="kx-mask"><span>próximo fluxo.</span></span>
          </h1>
          <p className="kx-hero-sub" data-rv="up">Entre por um único limiar para criar com modelos, referências e resultados conectados.</p>
        </div>
        <div className="kx-hero-spacer" />
        <div className="kx-hero-foot">
          <div className="kx-cue" data-rv="fade"><span>Role para entrar</span><span className="track"><i /></span></div>
          <div className="kx-chapters">
            {chapters.map(([number, title, text, href], index) => <a className={active === index + 1 ? 'on' : ''} href={href} data-rv="up" key={number}><span className="num">{number}</span><span className="tx"><b>{title}</b><p>{text}</p></span></a>)}
          </div>
        </div>
        <a className="kx-peek" href="#catalogo" data-rv="fade" aria-label="Prévia do catálogo conectado">
          <span className="kx-peek-frame"><img src={`${kageAsset}generated/kage-sanmon-preview.webp`} alt="" width="1536" height="1024" /></span>
          <span className="kx-peek-play"><ArrowRight size="20" /></span>
          <span className="kx-peek-caption"><b>CATÁLOGO</b><i>{error ? 'BASE INDISPONÍVEL' : loading ? 'SINCRONIZANDO' : `${tools.length} FERRAMENTAS ATIVAS`}</i></span>
        </a>
        <div className="kx-wordmark" aria-hidden="true">UNIFY</div>
        <div className="kx-hero-side" aria-hidden="true">統合の道</div>
      </section>

      <section className="kx-story kx-camera-section" id="portal">
        <KageForeground scene="portal" />
        <div className="kx-sec-head" data-rv="fade"><span><b>01</b> — O limiar</span><i /><span>PORTAL</span></div>
        <div className="kx-gate-grid">
          <h2 className="kx-display kx-h-section" data-rv="up">Muitas inteligências. Uma entrada deixada aberta.</h2>
          <div className="kx-gate-copy">
            <p className="lead" data-rv="up">A Unify começa onde as abas terminam: um workspace escuro e contínuo que reúne criação visual, vídeo, áudio, texto e automação.</p>
            <p data-rv="up">Cada ferramenta entra no mesmo quadro. Prompt, referência e resultado permanecem ligados para que a ideia atravesse o processo sem perder sua origem.</p>
            <button className="kx-arrow-link" onClick={enter}><span>Atravessar o portal</span><span className="arrow"><ArrowRight size="15" /></span></button>
          </div>
        </div>
        <div className="kx-stats" data-rv="up">
          <div><b>{loading || error ? '—' : tools.length}</b><span>Ferramentas</span></div><div><b>API</b><span>Base ao vivo</span></div><div><b>RLS</b><span>Dados protegidos</span></div><div><b>∞</b><span>Possibilidades</span></div>
        </div>
      </section>

      <section className="kx-story kx-camera-section" id="catalogo">
        <KageForeground scene="catalog" />
        <div className="kx-sec-head" data-rv="fade"><span><b>02</b> — Catálogo vivo</span><i /><span>MODELOS</span></div>
        {error && <div className="kx-source-error"><CloseCircle size="18" /><span><b>Catálogo indisponível</b>{error}</span></div>}
        <div className="kx-cards">
          {[['kage-approach.webp', 'O primeiro modelo'], ['kage-lantern-court.webp', 'A corte iluminada'], ['kage-moonwater.webp', 'O resultado refletido']].map(([image, fallback], index) => {
            const tool = featured[index]
            return <button className="kx-card" data-rv="up" onClick={enter} key={image}>
              <span className="kx-card-frame"><img src={`${kageAsset}generated/${image}`} alt="" width="1536" height="1024" loading="lazy" /><i className="kx-glow" /><span className="kx-card-arrow"><ArrowRight size="16" /></span><span className="kx-card-label"><b>{tool?.name || (loading ? 'Sincronizando' : fallback)}</b><em>{tool?.category || 'UNIFY'}</em></span></span>
              <span className="kx-card-meta"><span>{tool ? 'Dado real do catálogo' : 'Workspace Unify'}</span><span>0{index + 1} / 03</span></span>
            </button>
          })}
        </div>
      </section>

      <section className="kx-story kx-camera-section" id="metodo">
        <KageForeground scene="method" />
        <div className="kx-sec-head" data-rv="fade"><span><b>03</b> — Método visual</span><i /><span>FLUXO</span></div>
        <div className="kx-method-head"><h2 className="kx-display kx-h-section" data-rv="up">Quatro movimentos. Um contexto preservado.</h2><p data-rv="up">Cada etapa é parte do mesmo percurso. Você começa com um quadro limpo e escolhe apenas os blocos necessários.</p></div>
        <div className="kx-lessons">
          {[
            ['01', 'Escolha a inteligência', 'Modelos organizados por imagem, vídeo, áudio e texto.', 'CATÁLOGO'],
            ['02', 'Adicione o contexto', 'Prompts e referências entram como blocos independentes.', 'ENTRADA'],
            ['03', 'Conecte o percurso', 'Portas por cor deixam claro o que pode ser ligado.', 'QUADRO'],
            ['04', 'Gere e preserve', 'O resultado retorna ao card e permanece no histórico.', 'SAÍDA'],
          ].map(([number, title, text, meta]) => <div className="kx-lesson" data-rv="up" key={number}><span>{number}</span><h3>{title}<em>{meta}</em></h3><p>{text}</p><b>{number} / 04</b><i /></div>)}
        </div>
      </section>

      <section className="kx-story kx-camera-section kx-final" id="acesso">
        <KageForeground scene="access" />
        <div className="kx-eyebrow" data-rv="fade"><span /> Capítulo 04 — Depois do silêncio</div>
        <h2 className="kx-display" data-rv="up">Seu próximo fluxo<br />começa aqui.</h2>
        <p data-rv="up">Entre no ambiente onde ferramentas, referências e resultados continuam parte da mesma história.</p>
        <button className="kx-cta" onClick={enter}><i /><span>{session ? 'Abrir meu workspace' : 'Acessar a plataforma'}</span><ArrowRight size="17" /></button>
      </section>
    </main>

    <footer className="kx-footer">
      <div className="kx-footer-grid"><div className="kx-footer-brand"><KageBrand /><p>Uma plataforma de ferramentas inteligentes para criar sem fragmentar o processo.</p></div><div><h4>Explorar</h4><a href="#portal">Plataforma</a><a href="#catalogo">Ferramentas</a><a href="#metodo">Método</a></div><div><h4>Produto</h4><button onClick={enter}>Workspace</button><a href="https://docs.unifically.com/introduction" target="_blank" rel="noreferrer">API Unifically</a></div><div><h4>Sistema</h4><a href="https://skiper-ui.com/" target="_blank" rel="noreferrer">Skiper UI</a><a href="https://app.iconsax.io/" target="_blank" rel="noreferrer">Iconsax</a></div></div>
      <div className="kx-footer-base"><span>© 2026 Unify Technologies</span><span>CLAREZA É UMA FORMA DE VELOCIDADE</span><span>THREE.JS · ONEST · UNIFY</span></div>
    </footer>

    <div className="kx-rail" aria-label="Progresso da página">{['inicio', 'portal', 'catalogo', 'metodo', 'acesso'].map((id, index) => <a className={active === index ? 'on' : ''} href={`#${id}`} aria-label={`Ir para a seção ${index + 1}`} key={id}><i /></a>)}</div>
  </div>
}

function Landing({ session }) {
  return <iframe title="Unify — página de apresentação" src="/volta.html" allow="autoplay; fullscreen" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0, background: '#141414' }} />
}

function Login() {
  const [mode, setMode] = useState('login'); const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('')
  const submit = async event => { event.preventDefault(); setError(''); setMessage(''); const data = new FormData(event.currentTarget); const email = String(data.get('email') || '').trim(); const password = String(data.get('password') || ''); const fullName = String(data.get('fullName') || '').trim(); if (!email || !password || (mode === 'signup' && !fullName)) return setError('Preencha todos os campos obrigatórios.'); if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.'); setLoading(true); try { if (mode === 'signup') { const { session } = await signUpWithPassword(email, password, fullName); if (session) location.hash = 'dashboard'; else setMessage('Conta criada. Confirme o e-mail para acessar o workspace.') } else { await signInWithPassword(email, password); location.hash = 'dashboard' } } catch (err) { setError(err.message) } finally { setLoading(false) } }
  const google = async () => { setError(''); try { await signInWithGoogle() } catch (err) { setError(err.message) } }
  return <main className="login-page"><section className="login-art"><Logo /><ProgressiveBlur position="top" backgroundColor="#181817" height="110px" blurAmount="5px" /><ProgressiveBlur position="bottom" backgroundColor="#181817" height="150px" blurAmount="6px" /><div className="login-statement"><div className="eyebrow"><span className="pulse-dot" /> Supabase Auth ativo</div><h2>Um lugar para<br />fazer acontecer.</h2><p>Seus projetos ficam vinculados à sua conta e protegidos por políticas de acesso.</p></div><div className="login-quote">Autenticação, catálogo e projetos conectados à infraestrutura real.<span>Unify · Workspace protegido por RLS</span></div><a className="skiper-login-credit" href="https://skiper-ui.com/v1/skiper41" target="_blank" rel="noreferrer">Progressive Blur · Skiper UI</a></section><section className="login-panel"><button className="back-link" onClick={() => location.hash = ''}>← Voltar para o site</button><div className="login-box"><span className="kicker">{mode === 'login' ? 'Bem-vindo de volta' : 'Novo workspace'}</span><h1>{mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</h1><p>{mode === 'login' ? 'Entre com seus dados reais para continuar.' : 'Seu perfil será salvo de forma segura no Supabase.'}</p><form onSubmit={submit} noValidate>{mode === 'signup' && <label>Nome completo<input name="fullName" type="text" placeholder="Como devemos chamar você?" autoComplete="name" /></label>}<label>E-mail<input name="email" type="email" placeholder="voce@empresa.com" autoComplete="email" /></label><label>Senha<div className="password-field"><input name="password" type={show ? 'text' : 'password'} placeholder="Mínimo de 6 caracteres" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><IconButton label={show ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShow(!show)}>{show ? <EyeSlash size="19" /> : <Eye size="19" />}</IconButton></div></label>{error && <div className="form-error"><CloseCircle size="17" />{error}</div>}{message && <div className="form-success"><TickCircle size="17" />{message}</div>}<button className="button login-submit" disabled={loading}>{loading ? <span className="loading-line">Conectando</span> : <><TextRoll>{mode === 'login' ? 'Entrar' : 'Criar conta'}</TextRoll> <ArrowRight size="18" /></>}</button></form><div className="divider"><span>ou continue com</span></div><button className="google-button" onClick={google}><span>G</span> Google</button><p className="signup-line">{mode === 'login' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}>{mode === 'login' ? 'Criar gratuitamente' : 'Entrar'}</button></p></div><small className="legal">Ao continuar, você concorda com nossos Termos e Política de Privacidade.</small></section></main>
}

function ToolsDirectory({ models, loading, error, onRetry, userId, onGenerationSaved }) {
  const [activeCategory, setActiveCategory] = useState('image')
  const [zoom, setZoom] = useState(0.82)
  const [librarySearch, setLibrarySearch] = useState('')
  const [drag, setDrag] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [contextSearch, setContextSearch] = useState('')
  const [pendingConnection, setPendingConnection] = useState(null)
  const [connectionPointer, setConnectionPointer] = useState(null)
  const [connections, setConnections] = useState([])
  const [selectedNodes, setSelectedNodes] = useState([])
  const [history, setHistory] = useState([])
  const [nodes, setNodes] = useState([])
  const query = librarySearch.trim().toLowerCase()
  const visibleModels = useMemo(() => models.filter(model => model.category === activeCategory && `${model.display_name || ''} ${model.provider_display || ''} ${model.owned_by || ''} ${model.id || ''}`.toLowerCase().includes(query)), [models, activeCategory, query])
  const pushHistory = () => setHistory(current => [...current.slice(-49), { nodes: nodes.map(node => ({ ...node })), connections: connections.map(connection => ({ ...connection })) }])
  const clearPendingConnection = () => { setPendingConnection(null); setConnectionPointer(null) }
  const undo = () => setHistory(current => { if (!current.length) return current; const previous = current[current.length - 1]; setNodes(previous.nodes); setConnections(previous.connections); setSelectedNodes([]); clearPendingConnection(); return current.slice(0, -1) })
  const addModel = model => { if (nodes.some(node => node.id === `model-${model.id}`)) return; pushHistory(); const id = `model-${model.id}`; setNodes(current => [...current, { id, type: 'model', model, settings: getDefaultModelSettings(model), x: 500 + (current.length % 3) * 330, y: 120 + (current.length % 2) * 300 }]); setSelectedNodes([id]) }
  const addNote = () => { pushHistory(); setNodes(current => [...current, { id: `note-${Date.now()}`, type: 'note', x: 290 + current.length * 28, y: 480, title: '', value: '' }]) }
  const updateNode = (id, changes) => setNodes(current => current.map(node => node.id === id ? { ...node, ...changes } : node))
  const updateNodeGeneration = (id, changes) => setNodes(current => current.map(node => node.id === id ? { ...node, generation: { ...(node.generation || {}), ...changes } } : node))
  const runGeneration = async nodeId => {
    const node = nodes.find(item => item.id === nodeId)
    if (!node || node.type !== 'model') return
    const promptConnection = connections.find(connection => connection.kind === 'prompt' && connection.target === nodeId)
    const promptNode = nodes.find(item => item.id === promptConnection?.source)
    const prompt = String(promptNode?.value || '').trim()
    if (!promptConnection || !prompt) return updateNodeGeneration(nodeId, { status: 'failed', error: 'Conecte um bloco Prompt preenchido antes de gerar.', output: null })

    let generationId = null
    try {
      updateNodeGeneration(nodeId, { status: 'processing', stage: 'Preparando entrada', error: '', output: null })
      let input = { ...(node.settings || {}), prompt }
      const referenceConnection = connections.find(connection => connection.kind === 'reference' && connection.target === nodeId)
      if (referenceConnection) {
        const referenceNode = nodes.find(item => item.id === referenceConnection.source)
        if (!referenceNode?.referenceFile) throw new Error('O bloco de referência conectado ainda não possui um arquivo.')
        updateNodeGeneration(nodeId, { stage: 'Enviando referência' })
        const uploaded = await uploadGenerationReference(userId, referenceNode.referenceFile)
        input = { ...input, ...buildReferenceInput(node.model, referenceNode.referenceFile, uploaded.url, node.settings) }
        if ((node.model.id || '').startsWith('google/veo-3.1') && input.reference_image_urls) input.duration = 8
      }

      const record = await createGenerationRecord({ userId, modelId: node.model.id, category: node.model.category, prompt, input })
      generationId = record.id
      updateNodeGeneration(nodeId, { generationId, stage: node.model.category === 'llm' ? 'Gerando resposta' : 'Criando tarefa' })

      if (node.model.category === 'llm') {
        const response = await unifically.createChatCompletion({ model: node.model.id, prompt })
        const text = response?.choices?.[0]?.message?.content
        if (!text) throw new Error('A Unifically concluiu a solicitação sem retornar texto.')
        const output = { text, usage: response.usage || null }
        await updateGenerationRecord(generationId, { status: 'completed', task_id: response.id || null, output, error_message: null })
        updateNodeGeneration(nodeId, { status: 'completed', stage: '', taskId: response.id, output, error: '' })
        onGenerationSaved?.()
        return
      }

      const created = unwrapTask(await unifically.createTask({ model: node.model.id, input }))
      const taskId = created.task_id
      if (!taskId) throw new Error('A Unifically não retornou o identificador da tarefa.')
      await updateGenerationRecord(generationId, { task_id: taskId })
      updateNodeGeneration(nodeId, { taskId, stage: 'Processando na Unifically' })

      for (let attempt = 0; attempt < 120; attempt += 1) {
        if (attempt > 0) await wait(3000)
        const task = unwrapTask(await unifically.getTask(taskId))
        if (task.status === 'completed') {
          const output = task.output || {}
          await updateGenerationRecord(generationId, { status: 'completed', output, cost: task.cost ?? null, error_message: null })
          updateNodeGeneration(nodeId, { status: 'completed', stage: '', output, cost: task.cost, error: '' })
          onGenerationSaved?.()
          return
        }
        if (task.status === 'failed') throw new Error(task.error_message || 'A geração falhou no provedor selecionado.')
      }
      throw new Error('A geração continua processando. Tente consultar novamente em alguns minutos.')
    } catch (generationError) {
      const message = generationError?.message || 'Não foi possível concluir a geração.'
      updateNodeGeneration(nodeId, { status: 'failed', stage: '', error: message, output: null })
      if (generationId) await updateGenerationRecord(generationId, { status: 'failed', error_message: message }).catch(() => {})
      onGenerationSaved?.()
    }
  }
  const removeNode = id => { pushHistory(); setNodes(current => current.filter(node => node.id !== id)); setConnections(current => current.filter(connection => connection.source !== id && connection.target !== id)); setSelectedNodes(current => current.filter(nodeId => nodeId !== id)); if (pendingConnection?.source === id) clearPendingConnection() }
  const removeSelected = () => { if (!selectedNodes.length) return; pushHistory(); const selected = new Set(selectedNodes); setNodes(current => current.filter(node => !selected.has(node.id))); setConnections(current => current.filter(connection => !selected.has(connection.source) && !selected.has(connection.target))); if (pendingConnection && selected.has(pendingConnection.source)) clearPendingConnection(); setSelectedNodes([]) }
  const moveNode = event => { if (pendingConnection) { const canvas = event.currentTarget.getBoundingClientRect(); const scroller = event.currentTarget.querySelector('.board-scroll'); setConnectionPointer({ x: (event.clientX - canvas.left + scroller.scrollLeft) / zoom, y: (event.clientY - canvas.top + scroller.scrollTop) / zoom }) }; if (!drag) return; const dx = (event.clientX - drag.pointerX) / zoom; const dy = (event.clientY - drag.pointerY) / zoom; if (!drag.historySaved && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) { pushHistory(); setDrag(current => current ? { ...current, historySaved: true } : current) }; setNodes(current => current.map(node => node.id === drag.id ? { ...node, x: Math.max(12, drag.x + dx), y: Math.max(12, drag.y + dy) } : node)) }
  const startDrag = (event, node) => { if (event.target.closest('button,input,textarea,label,.node-reference,.board-context-menu')) return; const additive = event.ctrlKey || event.metaKey || event.shiftKey; setSelectedNodes(current => additive ? current.includes(node.id) ? current.filter(id => id !== node.id) : [...current, node.id] : current.includes(node.id) ? current : [node.id]); event.currentTarget.setPointerCapture(event.pointerId); setDrag({ id: node.id, pointerX: event.clientX, pointerY: event.clientY, x: node.x, y: node.y, historySaved: false }) }
  const openContextMenu = event => { event.preventDefault(); if (event.target.closest('.flow-node,.board-controls')) return; const canvas = event.currentTarget.getBoundingClientRect(); const scroller = event.currentTarget.querySelector('.board-scroll'); const localX = event.clientX - canvas.left; const localY = event.clientY - canvas.top; setContextSearch(''); setContextMenu({ left: Math.max(8, Math.min(localX, canvas.width - 276)), top: Math.max(8, Math.min(localY, canvas.height - 420)), x: (localX + scroller.scrollLeft) / zoom, y: (localY + scroller.scrollTop) / zoom }) }
  const addFromContext = type => { if (!contextMenu) return; pushHistory(); const id = `${type}-${Date.now()}`; setNodes(current => [...current, { id, type, x: contextMenu.x, y: contextMenu.y, title: type === 'reference' ? 'Importar referência' : type === 'prompt' ? 'Prompt' : 'Nota', value: '' }]); setSelectedNodes([id]); setContextMenu(null) }
  const beginConnection = (event, node, kind) => { event.preventDefault(); event.stopPropagation(); const canvas = event.currentTarget.closest('.board-canvas'); const scroller = canvas.querySelector('.board-scroll'); const bounds = canvas.getBoundingClientRect(); setPendingConnection({ source: node.id, kind }); setConnectionPointer({ x: (event.clientX - bounds.left + scroller.scrollLeft) / zoom, y: (event.clientY - bounds.top + scroller.scrollTop) / zoom }) }
  const finishConnection = event => { setDrag(null); if (!pendingConnection) return; const targetElement = document.elementFromPoint(event.clientX, event.clientY)?.closest(`[data-connection-input="${pendingConnection.kind}"]`); const target = targetElement?.dataset.nodeId; if (target && target !== pendingConnection.source) { pushHistory(); setConnections(current => [...current.filter(connection => !(connection.target === target && connection.kind === pendingConnection.kind)), { source: pendingConnection.source, target, kind: pendingConnection.kind }]) }; clearPendingConnection() }
  const contextItems = [{ key: 'prompt', label: 'Prompt', type: 'prompt' }, { key: 'reference', label: 'Importar referência', type: 'reference' }, { key: 'note', label: 'Nota', type: 'note' }]
  const filteredContextItems = contextItems.filter(item => item.label.toLowerCase().includes(contextSearch.toLowerCase()))
  const filteredContextGroups = modelGroups.filter(group => group.title.toLowerCase().includes(contextSearch.toLowerCase()))
  const selectedModelNode = nodes.find(node => node.type === 'model' && selectedNodes.includes(node.id))
  const estimateGenerationCost = async node => {
    const promptConnection = connections.find(connection => connection.kind === 'prompt' && connection.target === node.id)
    const promptNode = nodes.find(item => item.id === promptConnection?.source)
    const input = { ...(node.settings || {}), prompt: String(promptNode?.value || 'Estimativa de custo').trim() }
    return unifically.estimateTask({ model: node.model.id, input })
  }
  useEffect(() => { const handleKeyboard = event => { const editable = event.target instanceof HTMLElement && (event.target.matches('input,textarea,[contenteditable="true"]') || event.target.closest('input,textarea,[contenteditable="true"]')); if (editable) return; const command = event.ctrlKey || event.metaKey; if (command && event.key.toLowerCase() === 'a') { event.preventDefault(); setSelectedNodes(nodes.map(node => node.id)); return }; if (command && event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); return }; if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); removeSelected(); return }; if (event.key === 'Escape') { setSelectedNodes([]); clearPendingConnection(); setContextMenu(null) } }; addEventListener('keydown', handleKeyboard); return () => removeEventListener('keydown', handleKeyboard) }, [nodes, connections, selectedNodes, history, pendingConnection])
  return <section className="workflow-board"><header className="board-topbar"><div><span className="board-mark"><Category size="17" /></span><div><b>Fluxo sem título</b><small>Quadro de ferramentas</small></div></div><div className={`board-api-state ${error ? 'waiting' : ''}`}><i />{loading ? 'Sincronizando modelos' : error ? 'API pendente' : `${models.length} modelos conectados`}</div></header>
    <div className="board-workspace"><nav className="board-rail" aria-label="Categorias de ferramentas">{modelGroups.map(({ key, railLabel, title, Icon }) => <button key={key} type="button" className={activeCategory === key ? 'active' : ''} onClick={() => setActiveCategory(key)} aria-label={`Abrir ${title.toLowerCase()}`} aria-pressed={activeCategory === key} title={title}><Icon size="23" variant="Broken" aria-hidden="true" /><span>{railLabel}</span></button>)}</nav>
      <aside className="board-library"><div className="library-head"><div><span>Biblioteca</span><h2>{modelGroups.find(group => group.key === activeCategory)?.title}</h2></div><span>{visibleModels.length}</span></div><label className="library-search"><SearchNormal1 size="18" /><input value={librarySearch} onChange={event => setLibrarySearch(event.target.value)} placeholder="Buscar modelos..." aria-label="Buscar modelos nesta categoria" />{librarySearch && <button type="button" onClick={() => setLibrarySearch('')} aria-label="Limpar busca"><CloseCircle size="16" /></button>}</label>{error ? <div className="library-message error"><CloseCircle size="20" /><b>Unifically indisponível</b><small>{error}</small><button onClick={onRetry}>Tentar novamente</button></div> : loading ? <div className="library-models">{Array.from({ length: 6 }).map((_, index) => <div className="library-model skeleton" key={index}><i /><span /></div>)}</div> : visibleModels.length ? <div className="library-models">{visibleModels.map(model => { const logo = getProviderLogo(model); const provider = model.provider_display || model.owned_by || 'Provedor'; return <button className="library-model" key={model.id} onClick={() => addModel(model)}><span className="library-logo">{logo ? <img src={logo} alt="" /> : provider.slice(0, 2).toUpperCase()}</span><span><b>{model.display_name || model.id}</b><small>{provider}</small></span><Add size="15" /></button> })}</div> : <div className="library-message"><SearchNormal1 size="20" /><b>Nenhum modelo encontrado</b><small>{query ? 'Limpe ou ajuste a busca.' : 'Esta função não possui modelos disponíveis.'}</small></div>}</aside>
      <div className="board-canvas" onContextMenu={openContextMenu} onPointerDown={event => { if (!event.target.closest('.board-context-menu')) setContextMenu(null); if (!event.target.closest('.flow-node,.board-context-menu,.board-controls,.model-settings-panel')) setSelectedNodes([]) }} onPointerMove={moveNode} onPointerUp={finishConnection} onPointerCancel={() => { setDrag(null); clearPendingConnection() }}><div className="board-scroll"><div className="board-stage" style={{ transform: `scale(${zoom})` }}><svg className="board-edges" width="1900" height="1100" aria-hidden="true">{connections.map(connection => { const source = nodes.find(node => node.id === connection.source); const target = nodes.find(node => node.id === connection.target); if (!source || !target) return null; const startX = source.x + 270; const startY = source.y + (connection.kind === 'prompt' ? 198 : 194); const endX = target.x; const endY = target.y + (connection.kind === 'prompt' ? 83 : 129); const bend = Math.max(90, Math.abs(endX - startX) * .48); return <path className={`${connection.kind}-edge`} key={`${connection.kind}-${connection.source}-${connection.target}`} d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`} /> })}{pendingConnection && connectionPointer && (() => { const source = nodes.find(node => node.id === pendingConnection.source); if (!source) return null; const startX = source.x + 270; const startY = source.y + (pendingConnection.kind === 'prompt' ? 198 : 194); const endX = connectionPointer.x; const endY = connectionPointer.y; const bend = Math.max(70, Math.abs(endX - startX) * .42); return <path className={`${pendingConnection.kind}-edge preview-edge`} d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`} /> })()}</svg>{nodes.map(node => node.type === 'prompt' ? <article className={`flow-node prompt-node ${selectedNodes.includes(node.id) ? 'selected' : ''}`} key={node.id} style={{ transform: `translate3d(${node.x}px,${node.y}px,0)` }} onPointerDown={event => startDrag(event, node)}><header><span><MessageText size="17" />Prompt</span>{node.id === 'prompt' ? <More size="18" /> : <button onClick={() => removeNode(node.id)}><CloseCircle size="17" /></button>}</header><div className="node-body"><label>Instrução<textarea value={node.value || ''} onChange={event => updateNode(node.id, { value: event.target.value })} placeholder="Descreva o que deseja criar..." /></label></div><footer><span>texto</span><button className="port output connection-port prompt-connection-port" onPointerDown={event => beginConnection(event, node, 'prompt')} aria-label="Arrastar conexão de prompt" /></footer></article> : node.type === 'reference' ? <ReferenceFlowNode key={node.id} node={node} selected={selectedNodes.includes(node.id)} active={pendingConnection?.source === node.id} onPointerDown={startDrag} onRemove={removeNode} onReferenceChange={file => updateNode(node.id, { referenceFile: file })} onConnect={event => beginConnection(event, node, 'reference')} /> : node.type === 'note' ? <article className={`flow-node note-node ${selectedNodes.includes(node.id) ? 'selected' : ''}`} key={node.id} style={{ transform: `translate3d(${node.x}px,${node.y}px,0)` }} onPointerDown={event => startDrag(event, node)}><header><span><NoteAdd size="17" />Nota</span><button onClick={() => removeNode(node.id)}><CloseCircle size="17" /></button></header><textarea value={node.value || ''} onChange={event => updateNode(node.id, { value: event.target.value })} placeholder="Adicione uma observação..." /></article> : <ModelFlowNode key={node.id} node={node} selected={selectedNodes.includes(node.id)} pendingKind={pendingConnection?.kind} promptConnected={connections.some(connection => connection.target === node.id && connection.kind === 'prompt')} referenceConnected={connections.some(connection => connection.target === node.id && connection.kind === 'reference')} onGenerate={() => runGeneration(node.id)} onPointerDown={startDrag} onRemove={removeNode} />)}</div></div>{selectedModelNode && <ModelSettingsPanel node={selectedModelNode} onChange={settings => { pushHistory(); updateNode(selectedModelNode.id, { settings }) }} onEstimate={() => estimateGenerationCost(selectedModelNode)} onClose={() => setSelectedNodes([])} />}
        <div className={`board-hint ${pendingConnection ? 'connecting' : ''}`}><MouseSquare size="17" /><span>{pendingConnection ? `Arraste até a entrada ${pendingConnection.kind === 'prompt' ? 'prompt' : 'referência'} da mesma cor` : selectedNodes.length ? `${selectedNodes.length} selecionado${selectedNodes.length > 1 ? 's' : ''} · Backspace para apagar` : 'Arraste as bolinhas para conectar · botão direito adiciona blocos'}</span></div><div className="board-controls"><button aria-label="Desfazer" onClick={undo} disabled={!history.length}><ArrowLeft2 size="18" /></button><button aria-label="Adicionar nota" onClick={addNote}><NoteAdd size="18" /></button><i /><button aria-label="Diminuir zoom" onClick={() => setZoom(value => Math.max(.5, Number((value - .1).toFixed(2))))}><Minus size="18" /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Aumentar zoom" onClick={() => setZoom(value => Math.min(1.3, Number((value + .1).toFixed(2))))}><Add size="18" /></button><button aria-label="Restaurar zoom" onClick={() => setZoom(.82)}><Maximize4 size="17" /></button></div>{contextMenu && <div className="board-context-menu" style={{ left: contextMenu.left, top: contextMenu.top }} onContextMenu={event => event.preventDefault()}><label><SearchNormal1 size="18" /><input autoFocus value={contextSearch} onChange={event => setContextSearch(event.target.value)} placeholder="Buscar" /><CloseCircle size="17" /></label><div className="context-actions">{filteredContextItems.map(item => <button key={item.key} onClick={() => addFromContext(item.type)}>{item.label}</button>)}{filteredContextItems.length > 0 && filteredContextGroups.length > 0 && <i />}{filteredContextGroups.map(group => <button key={group.key} onClick={() => { setActiveCategory(group.key); setContextMenu(null) }}>{group.title}<ArrowRight size="15" /></button>)}</div></div>}</div>
    </div></section>
}

function ReferenceFlowNode({ node, selected, active, onPointerDown, onRemove, onReferenceChange, onConnect }) {
  const [reference, setReference] = useState(null); const [referenceUrl, setReferenceUrl] = useState(''); const [referenceError, setReferenceError] = useState('')
  useEffect(() => { if (!reference) { setReferenceUrl(''); return undefined }; const url = URL.createObjectURL(reference); setReferenceUrl(url); return () => URL.revokeObjectURL(url) }, [reference])
  const chooseReference = file => { if (!file) return; const allowed = file.type.startsWith('image/') || file.type.startsWith('video/'); if (!allowed) return setReferenceError('Selecione uma imagem ou um vídeo válido.'); if (file.size > 100 * 1024 * 1024) return setReferenceError('O arquivo precisa ter até 100 MB.'); setReferenceError(''); setReference(file); onReferenceChange?.(file) }
  const clearReference = event => { event.stopPropagation(); setReference(null); setReferenceError(''); onReferenceChange?.(null) }
  return <article className={`flow-node reference-node ${selected ? 'selected' : ''} ${active ? 'connecting' : ''}`} style={{ transform: `translate3d(${node.x}px,${node.y}px,0)` }} onPointerDown={event => onPointerDown(event, node)}><header><span><Gallery size="17" />Importar referência</span><button onClick={() => onRemove(node.id)} aria-label="Remover bloco de referência"><CloseCircle size="17" /></button></header><div className="node-body">{reference ? <div className="node-reference">{reference.type.startsWith('image/') ? <img src={referenceUrl} alt="Prévia da referência" /> : <video src={referenceUrl} muted preload="metadata" />}<span><b>{reference.name}</b><small>{reference.type.startsWith('video/') ? 'vídeo' : 'imagem'} · {(reference.size / 1024 / 1024).toFixed(1)} MB</small></span><button type="button" onClick={clearReference} aria-label="Remover arquivo"><CloseCircle size="16" /></button></div> : <label className="reference-node-drop" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); chooseReference(event.dataTransfer.files?.[0]) }}><Gallery size="20" /><span><b>Escolha uma referência</b><small>Clique ou arraste uma imagem ou vídeo</small></span><input type="file" accept="image/*,video/*" onChange={event => chooseReference(event.target.files?.[0])} /></label>}{referenceError && <small className="node-reference-error">{referenceError}</small>}</div><footer><span>referência</span><small>{reference ? 'arquivo pronto' : 'aguardando arquivo'}</small><button className="port output connection-port reference-connection-port" onPointerDown={onConnect} aria-label="Arrastar conexão de referência" /></footer></article>
}

function ModelSettingsPanel({ node, onChange, onEstimate, onClose }) {
  const controls = getModelControls(node.model); const logo = getProviderLogo(node.model); const settings = node.settings || {}; const [estimate, setEstimate] = useState(null); const [estimateLoading, setEstimateLoading] = useState(false); const [estimateError, setEstimateError] = useState('')
  useEffect(() => { if (node.model.category === 'llm') return undefined; let active = true; const timer = setTimeout(async () => { setEstimateLoading(true); setEstimateError(''); try { const response = await onEstimate(); if (active) setEstimate(response?.data || null) } catch (error) { if (active) setEstimateError(error.message) } finally { if (active) setEstimateLoading(false) } }, 450); return () => { active = false; clearTimeout(timer) } }, [node.id, node.model.category, JSON.stringify(settings)])
  const change = (key, value) => onChange({ ...settings, [key]: value })
  const usd = Number(estimate?.cost); const brl = Number(estimate?.brl_cost)
  return <aside className="model-settings-panel"><header><span>{logo ? <img src={logo} alt="" /> : <Setting2 size="20" />}<b>{node.model.display_name || node.model.id}</b></span><button type="button" onClick={onClose} aria-label="Fechar propriedades"><CloseCircle size="19" /></button></header><div className="model-settings-content">{controls.length ? controls.map(control => control.type === 'boolean' ? <label className="settings-toggle" key={control.key}><span>{control.label}</span><input type="checkbox" checked={Boolean(settings[control.key])} onChange={event => change(control.key, event.target.checked)} /><i /></label> : <label className="settings-field" key={control.key}><span>{control.label}</span><select value={settings[control.key] ?? control.default} onChange={event => change(control.key, typeof control.default === 'number' ? Number(event.target.value) : event.target.value)}>{control.options.map(option => <option value={option} key={option}>{option}{control.suffix || ''}</option>)}</select></label>) : <div className="settings-empty"><Setting2 size="23" /><b>Sem ajustes adicionais</b><small>Este modelo usa os parâmetros definidos automaticamente pela API.</small></div>}<section className={`settings-cost ${estimateLoading ? 'loading' : ''}`}><span>Custo estimado</span>{estimateLoading ? <div className="cost-skeleton"><i /><i /></div> : estimateError ? <small>{estimateError}</small> : Number.isFinite(usd) ? <><b>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3, maximumFractionDigits: 4 }).format(usd)}</b><strong>{Number.isFinite(brl) ? `≈ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(brl)}` : 'Conversão BRL indisponível'}</strong><small>Dry run · nenhum crédito consumido{estimate?.rate_date ? ` · câmbio de ${formatDate(estimate.rate_date)}` : ''}</small></> : <small>Custo disponível para modelos de mídia.</small>}</section></div><footer><small>Os valores serão enviados à Unifically junto com o prompt.</small></footer></aside>
}

function ModelFlowNode({ node, selected, pendingKind, promptConnected, referenceConnected, onGenerate, onPointerDown, onRemove }) {
  const { model } = node; const provider = model.provider_display || model.owned_by || 'Provedor'; const logo = getProviderLogo(model); const resultLabel = model.category === 'video' ? 'vídeo' : model.category === 'image' ? 'imagem' : model.category === 'audio' ? 'áudio' : 'texto'
  const acceptsReference = model.category === 'video' || model.category === 'image'
  const processing = node.generation?.status === 'processing'
  return <article className={`flow-node model-node ${model.category} ${selected ? 'selected' : ''}`} style={{ transform: `translate3d(${node.x}px,${node.y}px,0)` }} onPointerDown={event => onPointerDown(event, node)}><header><span className="node-model-title"><i className="node-logo">{logo ? <img src={logo} alt="" /> : provider.slice(0, 2).toUpperCase()}</i><span><b>{model.display_name || model.id}</b><small>{provider}</small></span></span><button onClick={() => onRemove(node.id)} aria-label={`Remover ${model.display_name || model.id}`}><CloseCircle size="17" /></button></header><div className="node-body"><div className={`node-input prompt-target ${pendingKind === 'prompt' ? 'ready' : ''} ${promptConnected ? 'connected' : ''}`} data-connection-input="prompt" data-node-id={node.id}><i className="port input" /><span>prompt</span><small>{promptConnected ? 'conectado' : pendingKind === 'prompt' ? 'solte aqui' : 'texto'}</small></div>{acceptsReference && <button type="button" className={`node-input optional reference-target ${pendingKind === 'reference' ? 'ready' : ''} ${referenceConnected ? 'connected' : ''}`} data-connection-input="reference" data-node-id={node.id}><i className="port input" /><span>referência</span><small>{referenceConnected ? 'conectada' : pendingKind === 'reference' ? 'solte aqui' : model.category === 'video' ? 'imagem ou vídeo' : 'imagem'}</small></button>}<div className="node-model-id">{model.id}</div><ModelGenerationResult generation={node.generation} category={model.category} /></div><footer><button type="button" className="node-generate-button" disabled={processing} onClick={event => { event.stopPropagation(); onGenerate() }}><Flash size="14" variant={processing ? 'Bulk' : 'Linear'} /><TextRoll>{processing ? 'Gerando' : 'Gerar'}</TextRoll></button><small>{processing ? node.generation.stage : node.generation?.status === 'completed' ? 'concluído' : resultLabel}</small><i className="port output" /></footer></article>
}

function ModelGenerationResult({ generation, category }) {
  if (!generation) return <div className="node-result-empty">O resultado aparecerá aqui</div>
  if (generation.status === 'processing') return <div className="node-result-loading"><span /><span /><small>{generation.stage || 'Processando'}</small></div>
  if (generation.status === 'failed') return <div className="node-result-error"><CloseCircle size="15" /><span>{generation.error}</span></div>
  const output = generation.output || {}
  const imageUrl = output.image_url || output.image_urls?.[0] || output.images?.[0]?.url || output.images?.[0]
  const videoUrl = output.video_url || output.video_urls?.[0] || output.videos?.[0]?.url || output.videos?.[0]
  const audioUrl = output.audio_url || output.audio_urls?.[0] || output.audios?.[0]?.url || output.audios?.[0]
  const text = output.text || output.content || output.lyrics
  if (category === 'image' && imageUrl) return <div className="node-result-media"><img src={imageUrl} alt="Resultado gerado" /><a href={imageUrl} target="_blank" rel="noreferrer">Abrir imagem</a></div>
  if (category === 'video' && videoUrl) return <div className="node-result-media"><video src={videoUrl} controls playsInline preload="metadata" /><a href={videoUrl} target="_blank" rel="noreferrer">Abrir vídeo</a></div>
  if (category === 'audio' && audioUrl) return <div className="node-result-audio"><Music size="18" /><audio src={audioUrl} controls preload="metadata" /></div>
  if (text) return <div className="node-result-text">{text}</div>
  return <div className="node-result-json"><pre>{JSON.stringify(output, null, 2)}</pre></div>
}

function StudioAssetField({ label, file, accept, onChange, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState('')
  useEffect(() => { if (!file) { setPreviewUrl(''); return undefined }; const url = URL.createObjectURL(file); setPreviewUrl(url); return () => URL.revokeObjectURL(url) }, [file])
  return <div className={`studio-asset ${file ? 'filled' : ''}`}>
    <label className="studio-asset-upload" aria-label={`${file ? 'Substituir' : 'Adicionar'} ${label.toLowerCase()}`}>
      {file ? file.type.startsWith('video/') ? <video src={previewUrl} muted playsInline /> : <img src={previewUrl} alt={`Prévia de ${label.toLowerCase()}`} /> : <span><Add size="17" /></span>}
      <b>{label}</b><small>{file ? 'Pronto' : label === 'Avatar' ? 'Rosto ou pessoa' : 'Imagem ou vídeo'}</small><input type="file" accept={accept} onChange={event => { onChange(event.target.files?.[0]); event.currentTarget.value = '' }} />
    </label>
    {file && <button className="studio-asset-remove" type="button" onClick={onRemove} aria-label={`Remover ${label.toLowerCase()}`} title={`Remover ${label.toLowerCase()}`}><CloseCircle size="18" /></button>}
  </div>
}

function MarketingStudio({ models, loading, error, userId, onRetry, onGenerationSaved, onOpenMenu, onOpenHistory }) {
  const [mode, setMode] = useState('image')
  const [category, setCategory] = useState('all')
  const [prompt, setPrompt] = useState('')
  const [modelId, setModelId] = useState('')
  const [aspectRatio, setAspectRatio] = useState('3:4')
  const [duration, setDuration] = useState(5)
  const [videoStyleId, setVideoStyleId] = useState(marketingVideoStyles[0].id)
  const [styleOpen, setStyleOpen] = useState(false)
  const [styleSearch, setStyleSearch] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [product, setProduct] = useState(null)
  const [generation, setGeneration] = useState(null)
  const [estimate, setEstimate] = useState(null)
  const [estimateLoading, setEstimateLoading] = useState(false)
  const studioModels = useMemo(() => models.filter(model => model.category === mode && !/(edit|upscale|extend|motion-control)/.test(model.id || '')), [models, mode])
  const selectedModel = studioModels.find(model => model.id === modelId) || studioModels[0]
  const selectedVideoStyle = marketingVideoStyles.find(style => style.id === videoStyleId) || marketingVideoStyles[0]
  const durationControl = selectedModel && getModelControls(selectedModel).find(control => control.key === 'duration')
  const durationOptions = mode === 'video' ? (durationControl?.options || [5]) : []
  const aspectControl = selectedModel && getModelControls(selectedModel).find(control => control.label === 'Proporção')
  const aspectOptions = aspectControl?.options || ['16:9', '9:16', '1:1']
  const filteredVideoStyles = useMemo(() => marketingVideoStyles.filter(style => `${style.title} ${style.group}`.toLowerCase().includes(styleSearch.trim().toLowerCase())), [styleSearch])
  const effectivePrompt = mode === 'video' ? `${prompt.trim() || 'Campanha de produto'}\n\nDireção de estilo: ${selectedVideoStyle.direction}` : prompt.trim() || 'Campanha de produto'
  const templates = useMemo(() => marketingStudioTemplates.filter(template => category === 'all' || template.category === category), [category])

  useEffect(() => { if (!studioModels.length) return; if (!studioModels.some(model => model.id === modelId)) setModelId(studioModels[0].id) }, [mode, studioModels, modelId])
  useEffect(() => { if (mode !== 'video' || !durationOptions.length) return; if (!durationOptions.includes(Number(duration))) setDuration(Number(durationControl?.default ?? durationOptions[0])) }, [mode, selectedModel?.id, duration, durationControl?.default, durationOptions])
  useEffect(() => { if (!aspectOptions.includes(aspectRatio)) setAspectRatio(aspectControl?.default || aspectOptions[0]) }, [selectedModel?.id, aspectRatio, aspectControl?.default, aspectOptions])
  useEffect(() => {
    if (!styleOpen) return undefined
    const closeWithEscape = event => { if (event.key === 'Escape') setStyleOpen(false) }
    window.addEventListener('keydown', closeWithEscape)
    return () => window.removeEventListener('keydown', closeWithEscape)
  }, [styleOpen])
  useEffect(() => {
    if (!selectedModel) { setEstimate(null); return undefined }
    let active = true
    const timer = setTimeout(async () => {
      setEstimateLoading(true)
      try {
        const input = buildMarketingStudioInput(selectedModel, effectivePrompt, aspectRatio, duration, mode)
        const response = await unifically.estimateTask({ model: selectedModel.id, input })
        if (active) setEstimate(response?.data || null)
      } catch { if (active) setEstimate(null) } finally { if (active) setEstimateLoading(false) }
    }, 550)
    return () => { active = false; clearTimeout(timer) }
  }, [selectedModel?.id, mode, aspectRatio, duration, effectivePrompt])

  const selectTemplate = template => { setCategory(template.category); setMode(template.mode); setPrompt(template.prompt); setGeneration(null); document.querySelector('.studio-prompt')?.focus() }
  const chooseReference = (kind, file) => {
    if (!file) return
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return setGeneration({ status: 'failed', error: 'Escolha uma imagem ou um vídeo válido.' })
    if (kind === 'avatar' && !file.type.startsWith('image/')) return setGeneration({ status: 'failed', error: 'O avatar precisa ser uma imagem.' })
    if (file.size > 100 * 1024 * 1024) return setGeneration({ status: 'failed', error: 'Cada referência precisa ter até 100 MB.' })
    if (kind === 'avatar') setAvatar(file); else setProduct(file)
    setGeneration(null)
  }
  const generate = async () => {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt) return setGeneration({ status: 'failed', error: 'Descreva a campanha que deseja criar.' })
    if (!selectedModel) return setGeneration({ status: 'failed', error: 'Nenhum modelo compatível está disponível.' })
    let generationId = null
    try {
      setGeneration({ status: 'processing', stage: 'Preparando campanha' })
      let input = buildMarketingStudioInput(selectedModel, mode === 'video' ? `${cleanPrompt}\n\nDireção de estilo: ${selectedVideoStyle.direction}` : cleanPrompt, aspectRatio, duration, mode)
      const assets = [{ kind: 'avatar', file: avatar }, { kind: 'product', file: product }].filter(asset => asset.file)
      if (assets.length) {
        setGeneration({ status: 'processing', stage: assets.length > 1 ? 'Enviando avatar e produto' : `Enviando ${assets[0].kind === 'avatar' ? 'avatar' : 'produto'}` })
        const uploadedAssets = await Promise.all(assets.map(async asset => ({ ...asset, ...(await uploadGenerationReference(userId, asset.file)) })))
        const urls = uploadedAssets.map(asset => asset.url)
        const modelKey = selectedModel.id || ''
        if (mode === 'image') input.image_urls = urls
        else if (modelKey.includes('happyhorse-1.')) input = { ...input, mode: 'r2v', reference_image_urls: urls }
        else if (modelKey.includes('wan-2.7-video')) {
          const imageUrls = uploadedAssets.filter(asset => asset.file.type.startsWith('image/')).map(asset => asset.url)
          const videoUrls = uploadedAssets.filter(asset => asset.file.type.startsWith('video/')).map(asset => asset.url)
          input = { ...input, mode: 'r2v', ...(imageUrls.length ? { reference_image_urls: imageUrls } : {}), ...(videoUrls.length ? { reference_video_urls: videoUrls } : {}) }
        }
        else if (modelKey.includes('seedance-2')) input = { ...input, mode: 'omni_reference', references: urls }
        else if (modelKey.includes('gemini-omni') || modelKey.startsWith('google/veo')) input.reference_image_urls = urls
        else if (uploadedAssets.length === 1) input = { ...input, ...buildReferenceInput(selectedModel, uploadedAssets[0].file, uploadedAssets[0].url, input) }
        else input = { ...input, ...buildReferenceInput(selectedModel, product || avatar, (uploadedAssets.find(asset => asset.kind === 'product') || uploadedAssets[0]).url, input), references: urls }
      }
      const record = await createGenerationRecord({ userId, modelId: selectedModel.id, category: mode, prompt: cleanPrompt, input })
      generationId = record.id
      setGeneration({ status: 'processing', stage: 'Criando na Unifically' })
      const created = unwrapTask(await unifically.createTask({ model: selectedModel.id, input }))
      if (!created.task_id) throw new Error('A Unifically não retornou o identificador da tarefa.')
      await updateGenerationRecord(generationId, { task_id: created.task_id })
      for (let attempt = 0; attempt < 120; attempt += 1) {
        if (attempt) await wait(3000)
        const task = unwrapTask(await unifically.getTask(created.task_id))
        if (task.status === 'completed') {
          await updateGenerationRecord(generationId, { status: 'completed', output: task.output || {}, cost: task.cost ?? null, error_message: null })
          setGeneration({ status: 'completed', output: task.output || {}, cost: task.cost })
          onGenerationSaved?.()
          return
        }
        if (task.status === 'failed') throw new Error(task.error_message || 'A geração falhou no provedor selecionado.')
        setGeneration({ status: 'processing', stage: 'Produzindo conteúdo' })
      }
      throw new Error('A geração continua processando. Consulte o histórico em alguns minutos.')
    } catch (generationError) {
      const message = generationError?.message || 'Não foi possível concluir a geração.'
      setGeneration({ status: 'failed', error: message })
      if (generationId) await updateGenerationRecord(generationId, { status: 'failed', error_message: message }).catch(() => {})
      onGenerationSaved?.()
    }
  }
  const usd = Number(estimate?.cost); const brl = Number(estimate?.brl_cost)
  const categories = [{ key: 'all', label: 'Todos' }, { key: 'product-shot', label: 'Produto' }, { key: 'motion', label: 'Motion' }, { key: 'ugc', label: 'UGC' }, { key: 'ads', label: 'Anúncios' }, { key: 'posters', label: 'Posters' }, { key: 'marketplace', label: 'Marketplace' }]

  return <section className="marketing-studio">
    <header className="studio-topbar"><div><IconButton className="studio-menu" label="Abrir menu" onClick={onOpenMenu}><HambergerMenu size="21" /></IconButton><span className="studio-symbol"><Flash size="18" variant="Bold" /></span><div><b>Marketing Studio</b><small>Campanhas com modelos da Unifically</small></div></div><div className="studio-links"><button onClick={onOpenHistory}>Minhas gerações</button><button onClick={() => document.querySelector('.studio-templates')?.scrollIntoView({ behavior: 'smooth' })}>Templates</button></div></header>
    <div className="studio-scroll"><section className="studio-hero"><div className="studio-showcase">{marketingStudioTemplates.slice(0, 6).map((template, index) => <button type="button" className="studio-showcase-card" key={template.id} onClick={() => selectTemplate(template)} style={{ '--studio-index': index }}><video src={template.video} autoPlay muted loop playsInline preload="metadata" /><span>{template.title}</span></button>)}</div><div className="studio-title"><span>Conteúdo de campanha em um só fluxo</span><h1>Transforme qualquer produto<br />em conteúdo pronto para publicar.</h1></div>
      <div className="studio-composer"><div className="studio-mode" role="tablist" aria-label="Tipo de geração"><button className={mode === 'image' ? 'active' : ''} onClick={() => { setMode('image'); setGeneration(null); setStyleOpen(false) }}><Gallery size="18" />Imagem</button><button className={mode === 'video' ? 'active' : ''} onClick={() => { setMode('video'); setGeneration(null) }}><Flash size="18" />Vídeo</button></div><div className="studio-input-shell"><textarea className="studio-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder={mode === 'video' ? 'Descreva o vídeo que deseja criar...' : 'Descreva a imagem que deseja criar...'} /><div className="studio-input-actions"><select aria-label="Modelo" value={selectedModel?.id || ''} onChange={event => setModelId(event.target.value)} disabled={loading || !studioModels.length}>{loading ? <option>Carregando modelos...</option> : studioModels.length ? studioModels.map(model => <option value={model.id} key={model.id}>{model.display_name || model.id}</option>) : <option>Nenhum modelo disponível</option>}</select>{mode === 'video' && <button type="button" className="studio-style-trigger" onClick={() => setStyleOpen(true)} aria-haspopup="dialog" aria-expanded={styleOpen}><Flash size="14" variant="Bold" /><span>{selectedVideoStyle.title}</span><ArrowRight size="13" /></button>}<select aria-label="Proporção" value={aspectRatio} onChange={event => setAspectRatio(event.target.value)}>{aspectOptions.map(option => <option key={option}>{option}</option>)}</select>{mode === 'video' && <select className="studio-duration" aria-label="Duração do vídeo" value={duration} onChange={event => setDuration(Number(event.target.value))}>{durationOptions.map(option => <option key={option} value={option}>{option}s</option>)}</select>}</div></div><StudioAssetField label="Avatar" file={avatar} accept="image/*" onChange={file => chooseReference('avatar', file)} onRemove={() => setAvatar(null)} /><StudioAssetField label="Produto" file={product} accept="image/*,video/*" onChange={file => chooseReference('product', file)} onRemove={() => setProduct(null)} /><button type="button" className="studio-generate" onClick={generate} disabled={generation?.status === 'processing' || !selectedModel} aria-busy={generation?.status === 'processing'}><Flash size="19" variant="Bold" /><span>{generation?.status === 'processing' ? generation.stage : selectedModel ? 'Gerar' : 'Aguardando modelo'}</span><small>{estimateLoading ? 'calculando custo' : Number.isFinite(usd) ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3 }).format(usd)} · ${Number.isFinite(brl) ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(brl) : 'BRL indisponível'}` : 'estimativa no clique'}</small></button></div>
      {styleOpen && <div className="studio-style-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setStyleOpen(false) }}><section className="studio-style-dialog" role="dialog" aria-modal="true" aria-labelledby="studio-style-title"><header><div><span>Preset de vídeo</span><h2 id="studio-style-title">Escolha o estilo</h2></div><button type="button" onClick={() => setStyleOpen(false)} aria-label="Fechar estilos"><CloseCircle size="22" /></button></header><label className="studio-style-search"><SearchNormal1 size="18" /><input autoFocus value={styleSearch} onChange={event => setStyleSearch(event.target.value)} placeholder="Buscar estilos" /></label><div className="studio-style-grid">{filteredVideoStyles.map(style => <button type="button" key={style.id} className={`studio-style-card ${style.id === videoStyleId ? 'selected' : ''}`} onClick={() => { setVideoStyleId(style.id); setStyleOpen(false); setStyleSearch('') }}><video src={style.video} muted loop playsInline preload="metadata" onMouseEnter={event => event.currentTarget.play().catch(() => {})} onMouseLeave={event => { if (style.id !== videoStyleId) { event.currentTarget.pause(); event.currentTarget.currentTime = 0 } }} /><span><small>{style.group}</small><b>{style.title}</b></span>{style.id === videoStyleId && <i><TickCircle size="18" variant="Bold" /></i>}</button>)}</div>{!filteredVideoStyles.length && <p className="studio-style-empty">Nenhum estilo corresponde à busca.</p>}</section></div>}
      {error && <div className="studio-error"><CloseCircle size="17" />{error}<button onClick={onRetry}>Tentar novamente</button></div>}
      {generation && <section className="studio-result"><div><span>Resultado</span><b>{generation.status === 'processing' ? 'Sua campanha está sendo produzida' : generation.status === 'completed' ? 'Conteúdo concluído' : 'A geração precisa de atenção'}</b></div><ModelGenerationResult generation={generation} category={mode} /></section>}
    </section>
    <section className="studio-templates"><div className="studio-section-head"><div><span>Biblioteca criativa</span><h2>Explore templates</h2></div><small>{templates.length} opções</small></div><div className="studio-filters" role="group" aria-label="Categorias de templates">{categories.map(item => <button key={item.key} className={category === item.key ? 'active' : ''} onClick={() => setCategory(item.key)}>{item.label}</button>)}</div><div className="studio-template-grid">{templates.map((template, index) => <button type="button" className="studio-template" key={template.id} onClick={() => selectTemplate(template)} style={{ '--studio-index': index }}><video src={template.video} muted loop playsInline preload="metadata" onMouseEnter={event => event.currentTarget.play().catch(() => {})} onMouseLeave={event => { event.currentTarget.pause(); event.currentTarget.currentTime = 0 }} /><span><small>{categories.find(item => item.key === template.category)?.label}</small><b>{template.title}</b><i>Usar template <ArrowRight size="15" /></i></span></button>)}</div></section></div>
  </section>
}

function Dashboard({ session }) {
  const { tools, loading: toolsLoading, error: toolsError } = useCatalog(); const [active, setActive] = useState('Visão geral'); const [mobile, setMobile] = useState(false); const [profile, setProfile] = useState(null); const [projects, setProjects] = useState([]); const [generations, setGenerations] = useState([]); const [historyLoading, setHistoryLoading] = useState(true); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [task, setTask] = useState(''); const [creating, setCreating] = useState(false); const [models, setModels] = useState([]); const [modelsLoading, setModelsLoading] = useState(true); const [modelsError, setModelsError] = useState(''); const [unificallyReady, setUnificallyReady] = useState(false)
  const loadWorkspace = async () => { setLoading(true); try { const data = await getWorkspace(session.user.id); setProfile(data.profile); setProjects(data.projects) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  const loadModels = async () => { setModelsLoading(true); setModelsError(''); try { const result = await unifically.listModels(); setModels(Array.isArray(result?.data) ? result.data : []); setUnificallyReady(true) } catch (err) { setModelsError(err.message); setUnificallyReady(false) } finally { setModelsLoading(false) } }
  const loadHistory = async () => { setHistoryLoading(true); try { setGenerations(await getGenerationHistory(session.user.id)) } catch (err) { setError(err.message) } finally { setHistoryLoading(false) } }
  useEffect(() => { loadWorkspace() }, [session.user.id])
  useEffect(() => { loadModels() }, [session.user.id])
  useEffect(() => { loadHistory() }, [session.user.id])
  const fullName = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário'; const firstName = fullName.split(' ')[0]; const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U'
  const create = async title => { const cleanTitle = title.trim(); if (!cleanTitle) return setError('Descreva a tarefa antes de criar o projeto.'); setCreating(true); setError(''); try { const project = await createProject({ userId: session.user.id, toolId: tools[0]?.id, title: cleanTitle }); setProjects(current => [project, ...current]); setTask('') } catch (err) { setError(err.message) } finally { setCreating(false) } }
  const exit = async () => { try { await signOut(); location.hash = 'login' } catch (err) { setError(err.message) } }
  const focusClass = active === 'Ferramentas' ? 'tools-focus' : active === 'Marketing Studio' ? 'studio-focus' : ''
  return <div className={`dashboard ${focusClass}`}><aside className={mobile ? 'dash-sidebar open' : 'dash-sidebar'}><div className="sidebar-top"><Logo dark /><IconButton className="close-mobile" label="Fechar menu" onClick={() => setMobile(false)}><CloseCircle size="21" /></IconButton></div><nav>{nav.map(({ label, Icon }) => <button key={label} className={active === label ? 'active' : ''} onClick={() => { setActive(label); setMobile(false) }}><Icon size="20" />{label}</button>)}</nav><div className="sidebar-bottom"><div className="api-status connected"><span><i /> Supabase</span><small>Conectado e protegido</small></div><div className={`api-status ${unificallyReady ? 'connected' : ''}`}><span><i /> Unifically</span><small>{unificallyReady ? `${models.length} modelos disponíveis` : 'Aguardando API key'}</small></div><button><Setting2 size="20" />Configurações</button><div className="user-card"><div>{initials}</div><span><b>{fullName}</b><small>Plano {profile?.plan || 'free'}</small></span><IconButton label="Sair" onClick={exit}><Logout size="18" /></IconButton></div></div></aside>
    <main className="dash-main">{active !== 'Marketing Studio' && <header className="dash-header"><IconButton className="dash-menu" label="Abrir menu" onClick={() => setMobile(true)}><HambergerMenu size="22" /></IconButton><IconButton label="Notificações" className="notification-button"><Notification size="21" /></IconButton><button className="profile-chip"><span>{initials}</span><b>{firstName}</b></button></header>}<div className={`dash-content ${active === 'Ferramentas' ? 'board-mode' : active === 'Marketing Studio' ? 'studio-mode' : ''}`}>{active === 'Ferramentas' ? <ToolsDirectory models={models} loading={modelsLoading} error={modelsError} onRetry={loadModels} userId={session.user.id} onGenerationSaved={loadHistory} /> : active === 'Marketing Studio' ? <MarketingStudio models={models} loading={modelsLoading} error={modelsError} userId={session.user.id} onRetry={loadModels} onGenerationSaved={loadHistory} onOpenMenu={() => setMobile(true)} onOpenHistory={() => setActive('Histórico')} /> : <><div className="dash-intro"><div><span className="kicker">{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><h1>Olá, {firstName}.</h1><p className="dashboard-live-counts">{loading || historyLoading ? 'Carregando seu workspace...' : <><span><AnimatedMetric value={projects.length} /> {projects.length === 1 ? 'projeto' : 'projetos'}</span><i /><span><AnimatedMetric value={generations.length} /> {generations.length === 1 ? 'geração' : 'gerações'}</span></>}</p></div><button className="button dash-cta" onClick={() => document.querySelector('.quick-task-input')?.focus()}><Add size="19" /> Novo projeto</button></div>
    <section className="quick-action"><div><span className="spark"><Flash size="21" variant="Bold" /></span><div><b>Comece com uma tarefa</b><p>O projeto será salvo no seu workspace.</p></div></div><button className="quick-task-button" onClick={() => create(task)} disabled={creating}><input className="quick-task-input" value={task} onChange={event => setTask(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); create(task) } }} onClick={event => event.stopPropagation()} placeholder="Ex: criar uma legenda para o lançamento..." /><ArrowRight size="18" /></button></section>
    {(error || toolsError) && <div className="dashboard-error"><CloseCircle size="17" />{error || toolsError}</div>}
    <section className="tool-section"><div className="tool-heading"><div><span className="kicker">Catálogo real</span><h2>Ferramentas disponíveis</h2></div><span className="database-count">{tools.length} ativas</span></div>{toolsLoading ? <div className="tool-grid">{Array.from({ length: 6 }).map((_, i) => <div className="tool-card skeleton" key={i}><span /><i /><i /></div>)}</div> : tools.length ? <ScrollFade className="tool-scroll"><div className="tool-grid">{tools.map((tool, i) => { const Icon = iconMap[tool.icon] || Category; return <article className="tool-card" style={{ '--i': i }} key={tool.id}><div className="tool-icon" style={{ background: tool.color }}><Icon size="24" /></div><span className="tool-tag">{tool.category}</span><h3>{tool.name}</h3><p>{tool.description}</p><button onClick={() => { setTask(`Novo projeto com ${tool.name}`); document.querySelector('.quick-task-input')?.focus() }}>Usar ferramenta <ArrowRight size="17" /></button></article> })}</div></ScrollFade> : <div className="empty-state"><SearchNormal1 size="28" /><h3>Nenhuma ferramenta disponível</h3><p>O catálogo ainda não possui ferramentas ativas.</p></div>}</section>
    <section className="recent"><div className="tool-heading"><div><span className="kicker">Banco de dados</span><h2>Projetos recentes</h2></div><button onClick={loadWorkspace}>Atualizar</button></div>{loading ? <div className="recent-table recent-loading"><span className="loading-line">Consultando seus projetos</span></div> : projects.length ? <div className="recent-table">{projects.slice(0, 6).map(project => { const Icon = iconMap[project.tool?.icon] || DocumentText; return <div key={project.id}><span className="file-icon" style={{ background: project.tool?.color || '#e8e6df' }}><Icon size="19" /></span><p><b>{project.title}</b><small>{project.tool?.name || 'Projeto'} · {formatRelative(project.updated_at)}</small></p><span className={`status ${project.status === 'draft' ? 'draft' : ''}`}>{project.status === 'draft' ? 'Rascunho' : project.status}</span><button aria-label="Opções">•••</button></div> })}</div> : <div className="empty-state project-empty"><DocumentText size="28" /><h3>Nenhum projeto ainda</h3><p>Descreva sua primeira tarefa acima. Ela será salva aqui.</p></div>}</section></>}</div></main>{mobile && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMobile(false)} />}</div>
}

function App() {
  const [route, setRoute] = useState(location.hash.slice(1)); const [session, setSession] = useState(null); const [authLoading, setAuthLoading] = useState(true)
  useEffect(() => { const handler = () => setRoute(location.hash.slice(1)); addEventListener('hashchange', handler); return () => removeEventListener('hashchange', handler) }, [])
  useEffect(() => { if (!supabase) { setAuthLoading(false); return }; supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false) }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession)); return () => subscription.unsubscribe() }, [])
  if (!isSupabaseConfigured) return <main className="config-error"><CloseCircle size="28" /><h1>Supabase não configurado</h1><p>Adicione as variáveis indicadas em <code>.env.example</code>.</p></main>
  if (authLoading) return <main className="app-loading"><Logo dark /><span className="loading-line">Verificando sessão</span></main>
  if (route === 'dashboard' || route === 'login') return session ? <Dashboard session={session} /> : <Login />
  return <Landing session={session} />
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
