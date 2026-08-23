param(
  [Parameter(Mandatory = $true)][string]$Source,
  [string]$Destination = (Join-Path $PSScriptRoot '..\public\volta.html')
)

$outer = Get-Content -Raw -LiteralPath $Source
$match = [regex]::Match($outer, '(?is)<iframe[^>]*\ssrcdoc="(.*?)"')
if (-not $match.Success) { throw 'Nao foi possivel localizar o srcdoc do Volta Atelier.' }
$html = [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value)

# Os assets embutidos são mantidos porque também fazem parte da composição original.
# Apenas os slots explicitamente usados para hero e trabalhos recebem os vídeos.
$html = $html.Replace(' sf-hidden', '')

$videos = @(
  '/media/higgsfield-product.mp4',
  '/media/higgsfield-ugc.mp4',
  '/media/higgsfield-motion.mp4',
  '/media/higgsfield-ads.mp4',
  'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-poster.mp4',
  'https://higgsfield.ai/marketing-studio/hero-banners/marketing-studio-slider-poster-Marketplace.mp4',
  'https://cdn.higgsfield.ai/marketing-studio-motion-preview/04f54ce5-c138-46f9-b3ff-9326d1383ca3.mp4',
  'https://cdn.higgsfield.ai/marketing-studio-motion-preview/2270a163-40c5-4908-a3bc-bb18807d85fd.mp4',
  'https://cdn.higgsfield.ai/marketing-studio-motion-preview/5b54eb77-0ebb-4e84-91fb-b53ee9e7d87f.mp4',
  'https://cdn.higgsfield.ai/marketing-studio-motion-preview/6daa737e-d3a7-42c1-9544-d095a126519f.mp4',
  'https://cdn.higgsfield.ai/marketing-studio-motion-preview/d5840f15-1a7e-482c-912a-36d3bd30c078.mp4'
)

function Find-MediaRange([string]$document, [int]$imageStart) {
  $quote = [char]0
  for ($cursor = $imageStart + 4; $cursor -lt $document.Length; $cursor++) {
    $char = $document[$cursor]
    if ($quote -eq [char]0 -and ($char -eq [char]34 -or $char -eq [char]39)) { $quote = $char; continue }
    if ($quote -ne [char]0 -and $char -eq $quote) { $quote = [char]0; continue }
    if ($quote -eq [char]0 -and $char -eq [char]62) { return $cursor }
  }
  return -1
}

$ranges = [System.Collections.Generic.List[object]]::new()
$mediaIndex = 0
foreach ($spec in @(@{ Marker = '<div class=tile'; Limit = 4 }, @{ Marker = '<article class=pcard'; Limit = 6 })) {
  $marker = $spec.Marker
  $found = 0
  $cursor = 0
  while ($found -lt $spec.Limit -and ($markerStart = $html.IndexOf($marker, $cursor, [StringComparison]::Ordinal)) -ge 0) {
    $imageStart = $html.IndexOf('<img', $markerStart, [StringComparison]::Ordinal)
    if ($imageStart -lt 0) { break }
    $imageEnd = Find-MediaRange $html $imageStart
    if ($imageEnd -lt 0) { break }
    $src = $videos[$mediaIndex % 4]
    $replacement = '<video src="' + $src + '" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>'
    $ranges.Add([pscustomobject]@{ Start = $imageStart; End = $imageEnd; Replacement = $replacement })
    $mediaIndex++
    $found++
    $cursor = $imageEnd + 1
  }
}
$ranges = $ranges | Sort-Object Start
$builder = [System.Text.StringBuilder]::new($html.Length)
$cursor = 0
foreach ($range in $ranges) {
  [void]$builder.Append($html, $cursor, $range.Start - $cursor)
  [void]$builder.Append($range.Replacement)
  $cursor = $range.End + 1
}
[void]$builder.Append($html, $cursor, $html.Length - $cursor)
$html = $builder.ToString()

$replacements = [ordered]@{
  'Volta Atelier — Digital Design, 3D &amp; Motion Studio' = 'Unify — Inteligência em um só fluxo'
  'Volta Atelier — home' = 'Unify — início'
  '>Index<' = '>Início<'
  '>Studio<' = '>Plataforma<'
  '>Work<' = '>Criações<'
  '>People<' = '>Modelos<'
  '>Contact<' = '>Entrar<'
  '<h1 class="d-mega is-in" data-mask><span>Volta</span></h1>' = '<h1 class="d-mega is-in" data-mask><span>Uma</span></h1>'
  '<span class="d-mega is-in" data-mask><span>Atelier</span></span>' = '<span class="d-mega is-in" data-mask><span>plataforma.</span></span>'
  '<li>Brand systems</li>' = '<li>Imagem e vídeo</li>'
  '<li>Interface design</li>' = '<li>Áudio e texto</li>'
  '<li>Real‑time 3D</li>' = '<li>Fluxos conectados</li>'
  'Based in Porto, PT' = 'Workspace conectado'
  'Booking Q1 2027' = 'Supabase + Unifically'
  'Hey — Nils here.' = 'Seu fluxo começa aqui.'
  'Got a brief?' = 'Abra um quadro limpo.'
  'Speak to a producer,' = 'Escolha as ferramentas,'
  'not a contact form' = 'conecte e gere'
  'Our craft' = 'Capacidades'
  'Est. 2016' = 'Unify / 2026'
  '>Identity<' = '>Imagem<'
  '>Web Design<' = '>Vídeo<'
  '>Real‑time 3D<' = '>Áudio<'
  '>Motion<' = '>Texto<'
  '>Art Direction<' = '>Direção<'
  '>Packaging<' = '>Produção<'
  '>Sound<' = '>Entrega<'
  'Awards &amp; features' = 'Modelos conectados'
  'Sessions shipped' = 'Um só workspace'
  'Brands rebuilt' = 'API em tempo real'
  'Client rating' = 'Dados protegidos'
  'Selected work' = 'Criações conectadas'
  'Six of forty‑one' = 'Seis fluxos em destaque'
  'Halcyon Drift' = 'Produto em cena'
  'Paper Sun' = 'UGC em escala'
  'Nocturne FM' = 'Motion de produto'
  'Meridian Salt' = 'Anúncio de campanha'
  'Fern &amp; Fold' = 'Visual de marketplace'
  'Cassini Type' = 'Fluxo multimodelo'
  'Volta / signature' = 'Unify / assinatura'
  'WebGL · live' = 'Workspace · live'
  'How we work' = 'Como funciona'
  'Five moves,' = 'Cinco passos,'
  'no surprises' = 'um só contexto'
  'Interrogate' = 'Defina'
  'Frame' = 'Conecte'
  'Draw' = 'Configure'
  'Build' = 'Gere'
  'Hand over' = 'Reaproveite'
  'The people' = 'Ecossistema'
  'Nine of us. No account layer.' = 'Os modelos certos. Sem trocar de lugar.'
  'The people who pitch are the people who build. Drag to meet them.' = 'Provedores organizados por capacidade e prontos para entrar no fluxo. Arraste para explorar.'
  'Iris Vandal' = 'OpenAI'
  'Bo Okafor' = 'Anthropic'
  'Noor Haddad' = 'Google'
  'Tomas Reiter' = 'Kling'
  'Lena Ferro' = 'ElevenLabs'
  'Kit Nakamura' = 'Suno'
  'Ada Beaumont' = 'Flux'
  'Creative Director' = 'Texto e imagem'
  'Head of 3D' = 'Texto e raciocínio'
  'Design Lead' = 'Imagem e vídeo'
  'Engineering Lead' = 'Geração de vídeo'
  'Executive Producer' = 'Voz e áudio'
  'Motion Designer' = 'Música'
  '>Strategy<' = '>Geração de imagem<'
  'Client words' = 'O que muda'
  'Engagements' = 'Pontos de partida'
  'Three ways in' = 'Três formas de criar'
  '>Sprint<' = '>Quadro<'
  '>Retainer<' = '>Marketing Studio<'
  '>Full build<' = '>Catálogo<'
  '$9,400' = 'Livre'
  '$16,800' = 'Guiado'
  '$62,000' = 'Conectado'
  'Book a sprint' = 'Abrir o quadro'
  'Start a retainer' = 'Abrir o Studio'
  'Scope a build' = 'Explorar modelos'
  'Questions' = 'Perguntas'
  'Before you' = 'Antes de'
  'write in' = 'começar'
  'Ask a human' = 'Entrar agora'
  "LET’S BUILD IT" = 'CONECTE E CRIE'
}
foreach ($entry in $replacements.GetEnumerator()) { $html = $html.Replace($entry.Key, $entry.Value) }

$copy = [ordered]@{
  'LET''S BUILD IT' = 'CONECTE E CRIE'
  'Still unclear? Ask Nils directly — he answers within a day.' = 'O essencial sobre o workspace, as gerações e as integrações da plataforma.'
  'How small is too small?' = 'O catálogo é demonstrativo?'
  'If the budget is under about twenty thousand dollars, a full build will not fit. A two‑week sprint often will, and it usually gives a small team more leverage than a half‑funded rebrand would. Tell us the number in the first email and we will say plainly whether we are the right studio.' = 'Não. Os modelos são carregados pela integração com a Unifically; disponibilidade e parâmetros vêm da API configurada.'
  'Who actually does the work?' = 'Onde o resultado aparece?'
  'The nine people on this page. We do not subcontract design or engineering, and we run two builds at a time so nobody is split across five projects. The director who pitches you stays on the file until handover.' = 'A geração aparece no card do modelo dentro do quadro e também fica disponível no histórico do workspace.'
  'Do you work with our in‑house team?' = 'Posso usar imagem ou vídeo como referência?'
  'Often, and it tends to produce the better outcome. We can lead and let your team execute, or build alongside them in a shared repo and Figma file. Either way your engineers are in the room from week four, not handed a zip at the end.' = 'Sim. Os blocos de referência aceitam os formatos compatíveis e se conectam visualmente às entradas de cada modelo.'
  'Does all this motion hurt performance?' = 'Consigo controlar duração e formato?'
  'It does if nobody watches it. We set a frame budget in week one and hold the build to it on a mid‑range Android, not a studio laptop. Every WebGL scene ships with a static fallback, respects reduced‑motion preferences, and pauses when it scrolls out of view.' = 'Sim. Quando o modelo oferece esses parâmetros, a interface exibe duração, proporção, resolução e qualidade antes da geração.'
  'Who owns the files?' = 'Meus projetos ficam salvos?'
  'You do, from the moment the final invoice clears — source files, fonts we licensed on your behalf, 3D scenes and repository. We ask only to show the work in our portfolio, and we will sit on that until you have announced.' = 'Sim. Projetos, gerações e referências ficam associados ao usuário autenticado e persistidos no Supabase.'
  'When could we start?' = 'Preciso começar com um template?'
  'Sprints usually open up within three weeks. Full builds are booking from January 2027. If your date is fixed and close, say so — occasionally a slot moves and we would rather know who is waiting.' = 'Não. O quadro abre limpo. Você adiciona somente os blocos necessários ou escolhe o Marketing Studio para um fluxo guiado.'
  '>Next<' = '>Próximo<'
  "Let’s build it!" = 'Construa o fluxo.'
  "Tell me the budget. I’ll be honest." = 'Comece com uma ideia. A Unify conecta o restante.'
  'Start a project' = 'Abrir workspace'
  'studio@voltaatelier.example' = 'ferperes.fs@gmail.com'
  'Fixed scope, fixed price, named team. No hourly billing, no surprise change orders.' = 'Escolha a experiência que combina com a forma como você quer criar.'
  'One problem, two weeks, one senior pair.' = 'Um quadro livre para montar seu próprio fluxo.'
  'A standing studio team, monthly.' = 'Um fluxo guiado para conteúdo de campanha.'
  'Identity and site, end to end.' = 'Modelos organizados por função e provedor.'
  'Most chosen' = 'Mais direto'
  'The people who pitch are the people who build. Drag to meet them.' = 'Provedores organizados por capacidade e prontos para entrar no fluxo. Arraste para explorar.'
  'Seven of the last nine clients came from a referral by someone on this list. That is the only metric we check.' = 'Menos troca de contexto, mais continuidade entre prompt, referência, modelo e resultado.'
  'Ten to sixteen weeks, end to end. You see something real in week two — not a mood board.' = 'Do primeiro bloco ao resultado, o fluxo permanece visual, configurável e reaproveitável.'
  'Scroll' = 'Explore'
}
foreach ($entry in $copy.GetEnumerator()) { $html = $html.Replace($entry.Key, $entry.Value) }
$html = [regex]::Replace($html, '(?is)(<a\s+href=#top\s+class=mark[^>]*>)\s*V\s*(<i></i>)\s*A\s*(</a>)', '$1 U $2 F $3')
$html = $html.Replace('aria-label="Volta Atelier"', 'aria-label="Unify"')

$html = [regex]::Replace($html, '(?is)<p class="mono-md wordwash" id=introCopy>.*?</p>', '<p class="mono-md wordwash" id=introCopy><span class=lit>Reúna</span> <span class=lit>imagem,</span> <span class=lit>vídeo,</span> <span class=lit>áudio</span> <span class=lit>e</span> <span class=lit>texto</span> <span class=lit>em</span> <span class=lit>um</span> <span class=lit>quadro</span> <span class=lit>visual</span> <span class=lit>onde</span> <span class=lit>cada</span> <span class=lit>resultado</span> <span class=lit>pode</span> <span class=lit>alimentar</span> <span class=lit>o</span> <span class=lit>próximo.</span></p>')

$exactCss = @'
<style id="unify-volta-overrides">
  .tile video,.pcard video{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover}
  .tile img,.pcard img{position:relative;z-index:1}
  .tile video{transition:transform .7s cubic-bezier(.16,1,.3,1)}
  .tile:hover video{transform:scale(1.035)}
  .hdr .mark{cursor:pointer}
  @media (prefers-reduced-motion:reduce){.tile video,.pcard video{animation:none!important}.collage-in{transform:none!important}}
</style>
'@
$html = $html.Replace('</head>', "$exactCss</head>")
if (-not $html.Contains('</head>')) { $html = $html.Replace('<body', "$exactCss<body") }

$exactScript = @'
<script>
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const progress = section => {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  };
  const nearViewport = section => {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.bottom > -innerHeight * .45 && rect.top < innerHeight * 1.45;
  };
  const mediaObserver = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (isIntersecting && !reduced) target.play().catch(() => {}); else target.pause();
  }), {rootMargin:'120px',threshold:.08});
  [...document.querySelectorAll('.tile video,.pcard video')].forEach(video => mediaObserver.observe(video));

  const hero = document.querySelector('#hero');
  const heroStage = document.querySelector('#heroStage');
  const collage = document.querySelector('#collage');
  const tiles = [...document.querySelectorAll('.tile')];
  const services = document.querySelector('#services');
  const cylinder = document.querySelector('#cyl');
  const cylinderRows = [...document.querySelectorAll('.cyl-row')];
  const works = document.querySelector('#works');
  const cards = [...document.querySelectorAll('.pcard')];
  const worksIndex = document.querySelector('#wIdx');
  const worksProgress = document.querySelector('#wProg');
  const worksName = document.querySelector('#wName');
  const glword = document.querySelector('#glword');
  const glcanvas = document.querySelector('#glcanvas');
  const processSection = document.querySelector('#process');
  const horizontalTrack = document.querySelector('#hzTrack');
  const horizontalProgress = document.querySelector('#hzProg');
  const phases = [...document.querySelectorAll('.phase')];
  const arc = document.querySelector('#arc');
  const teamCards = [...document.querySelectorAll('.tcard')];
  const quoteStage = document.querySelector('#cw');
  const quoteCards = [...document.querySelectorAll('.qcard')];
  const quoteDots = [...document.querySelectorAll('#cwDots i')];
  const header = document.querySelector('#hdr');
  const navLinks = [...document.querySelectorAll('.navchain a')];
  const ghosts = document.querySelector('.ghosts');
  const pointer = {x:0,y:0,tx:0,ty:0};
  let horizontalOverflow = 0;
  let cylinderRadius = 240;
  let lastScroll = scrollY;
  let teamTurn = 0;
  let quoteTurn = 0;
  let dragging = null;

  tiles.forEach((tile,index) => {
    tile.dataset.baseTransform = tile.style.transform || '';
    tile.dataset.floatIndex = index;
  });

  const measure = () => {
    cylinderRadius = clamp(innerWidth * .18, 125, 292);
    if (processSection && horizontalTrack) {
      horizontalOverflow = Math.max(0, horizontalTrack.scrollWidth - innerWidth + innerWidth * .08);
      processSection.style.height = `${innerHeight + horizontalOverflow + innerHeight * .35}px`;
    }
  };

  const renderCylinder = amount => cylinderRows.forEach(row => {
    const base = Number(row.dataset.angle || 0);
    const angle = base - amount * 310;
    const facing = Math.abs(((angle + 180) % 360 + 360) % 360 - 180);
    const opacity = clamp(1 - (facing - 34) / 62);
    const scale = .76 + clamp(1 - facing / 100) * .24;
    row.style.transform = `translate(-50%,-50%) rotateX(${angle}deg) translateZ(${cylinderRadius}px)`;
    row.style.opacity = opacity;
    const title = row.querySelector('h3');
    if (title) title.style.transform = `scale(${scale})`;
    row.classList.toggle('mid', facing < 7);
  });

  const renderStack = amount => {
    const step = amount * Math.max(1, cards.length - 1);
    const current = Math.min(cards.length - 1, Math.floor(step + .25));
    cards.forEach((card,index) => {
      const delta = index - step;
      if (delta < 0) {
        const gone = Math.min(1.5, -delta);
        card.style.transform = `translate3d(${-gone * 18}px,${-gone * innerHeight * .78}px,0) rotate(${gone * 4.5}deg) scale(${1-gone*.035})`;
        card.style.opacity = clamp(1 - gone * .8);
        card.style.pointerEvents = 'none';
      } else {
        const depth = Math.min(5, delta);
        card.style.transform = `translate3d(${depth * 56}px,${depth * 37}px,0) rotate(${-depth * 4.2}deg) scale(${1-depth*.062})`;
        card.style.opacity = clamp(1 - depth * .13, .35, 1);
        card.style.pointerEvents = depth < .55 ? 'auto' : 'none';
      }
      card.style.zIndex = String(100 - index * 10);
      card.classList.toggle('front', index === current);
    });
    const active = cards[current];
    if (worksIndex) worksIndex.textContent = String(current + 1).padStart(2,'0');
    if (worksProgress) worksProgress.style.width = `${((current + 1) / cards.length) * 100}%`;
    if (worksName && active) worksName.textContent = `${active.dataset.title || ''} — ${active.dataset.cat || ''}`;
  };

  const renderTeam = () => {
    const count = teamCards.length;
    const spread = Math.min(innerWidth * .42, 620);
    teamCards.forEach((card,index) => {
      const angle = ((index + teamTurn) / count) * Math.PI * 2;
      const x = Math.sin(angle) * spread;
      const z = Math.cos(angle);
      const y = (1 - z) * 72;
      const scale = .58 + (z + 1) * .21;
      card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z * 180}px) scale(${scale})`;
      card.style.opacity = clamp((z + 1.15) / 1.35);
      card.style.filter = `brightness(${.62 + (z + 1) * .19})`;
      card.style.zIndex = String(Math.round((z + 1) * 50));
      card.style.pointerEvents = z > .45 ? 'auto' : 'none';
    });
  };

  const renderQuotes = () => {
    const count = quoteCards.length;
    quoteCards.forEach((card,index) => {
      let delta = ((index - quoteTurn) % count + count) % count;
      if (delta > count / 2) delta -= count;
      const abs = Math.abs(delta);
      card.style.transform = `translate(-50%,-50%) translate3d(${delta * Math.min(innerWidth*.32,350)}px,0,${-abs * 135}px) rotateY(${-delta * 36}deg) scale(${1-abs*.145})`;
      card.style.opacity = clamp(1 - Math.max(0,abs-1) * .75);
      card.style.filter = `brightness(${1-abs*.15})`;
      card.style.zIndex = String(100 - abs * 35);
      card.style.pointerEvents = abs < .45 ? 'auto' : 'none';
    });
    quoteDots.forEach((dot,index) => dot.classList.toggle('on', index === ((quoteTurn % count) + count) % count));
  };

  const update = time => {
    const y = scrollY;
    pointer.x += (pointer.tx - pointer.x) * .075;
    pointer.y += (pointer.ty - pointer.y) * .075;
    const heroAmount = progress(hero);
    if (heroStage && nearViewport(hero)) {
      heroStage.style.transform = `translate3d(0,${-heroAmount * 34}px,0) scale(${1-heroAmount*.035})`;
      heroStage.style.filter = `blur(${heroAmount * 4}px)`;
      heroStage.style.opacity = String(1-heroAmount*.58);
    }
    if (collage && !reduced && nearViewport(hero)) collage.style.transform = `translate3d(${pointer.x*18}px,${pointer.y*13-heroAmount*26}px,0) scale(1.015)`;
    if (!reduced && nearViewport(hero)) tiles.forEach((tile,index) => {
      const drift = Math.sin(time*.00055 + index*.72) * (3 + index%3);
      tile.style.transform = `${tile.dataset.baseTransform} translate3d(0,${drift}px,0)`;
    });
    if (nearViewport(services)) renderCylinder(progress(services));
    if (nearViewport(works)) renderStack(progress(works));
    if (glcanvas && glword && nearViewport(glword)) {
      const gl = progress(glword);
      glcanvas.style.transform = `scale(${1.04 + Math.sin(gl*Math.PI)*.08}) rotate(${(gl-.5)*1.8}deg)`;
      glcanvas.style.filter = `hue-rotate(${gl*18}deg) contrast(${1.05+gl*.12})`;
    }
    if (horizontalTrack && processSection && nearViewport(processSection)) {
      const hz = progress(processSection);
      horizontalTrack.style.transform = `translate3d(${-hz * horizontalOverflow}px,0,0)`;
      if (horizontalProgress) horizontalProgress.style.width = `${hz*100}%`;
      phases.forEach(phase => {
        const rect = phase.getBoundingClientRect();
        const center = rect.left + rect.width/2;
        const active = Math.abs(center-innerWidth/2) < rect.width*.7;
        phase.style.transform = `translateY(${active ? -10 : 0}px)`;
        phase.style.borderColor = active ? 'var(--signal)' : '';
      });
    }
    if (ghosts && !reduced) ghosts.style.transform = `translate3d(0,${progress(document.querySelector('#cta')) * -90}px,0) rotate(-8deg)`;
    if (header) {
      header.classList.toggle('scrolled', y > 20);
      header.style.transform = y > lastScroll && y > innerHeight*.5 ? 'translateY(-105%)' : 'translateY(0)';
      header.style.transition = 'transform .45s var(--e-out),background .3s';
    }
    const spySections = [hero,services,works,processSection,document.querySelector('#team'),document.querySelector('#cta')];
    const current = spySections.filter(Boolean).find(section => {const r=section.getBoundingClientRect();return r.top<=innerHeight*.52&&r.bottom>=innerHeight*.52});
    navLinks.forEach(link => link.classList.toggle('on', current && link.getAttribute('href') === `#${current.id}`));
    lastScroll = y;
    requestAnimationFrame(update);
  };

  addEventListener('pointermove', event => {
    pointer.tx = (event.clientX / innerWidth - .5) * 2;
    pointer.ty = (event.clientY / innerHeight - .5) * 2;
  }, {passive:true});
  addEventListener('resize', measure, {passive:true});

  if (arc) {
    arc.tabIndex = 0;
    arc.style.touchAction = 'pan-y';
    arc.addEventListener('pointerdown', event => { dragging = {kind:'team',x:event.clientX,start:teamTurn}; arc.setPointerCapture(event.pointerId); });
    arc.addEventListener('pointermove', event => { if (dragging?.kind === 'team') { teamTurn = dragging.start + (event.clientX-dragging.x)/150; renderTeam(); } });
    arc.addEventListener('pointerup', () => dragging = null);
    arc.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); teamTurn += event.key === 'ArrowLeft' ? -.45 : .45; renderTeam(); } });
  }

  document.querySelector('#cwPrev')?.addEventListener('click', () => { quoteTurn--; renderQuotes(); });
  document.querySelector('#cwNext')?.addEventListener('click', () => { quoteTurn++; renderQuotes(); });
  if (quoteStage) {
    quoteStage.tabIndex = 0;
    quoteStage.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); quoteTurn += event.key === 'ArrowLeft' ? -1 : 1; renderQuotes(); } });
  }

  document.querySelectorAll('.faq').forEach(item => {
    const button = item.querySelector('button');
    const body = item.querySelector('.body');
    button?.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq button[aria-expanded="true"]').forEach(other => {
        if (other === button) return;
        other.setAttribute('aria-expanded','false');
        const otherBody = other.closest('.faq')?.querySelector('.body');
        if (otherBody) otherBody.style.height = '0px';
      });
      button.setAttribute('aria-expanded', String(!open));
      if (body) body.style.height = open ? '0px' : `${body.scrollHeight}px`;
      const plus = button.querySelector('.pm i:last-child');
      if (plus) plus.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  });

  const burger = document.querySelector('#burger');
  const drawer = document.querySelector('#drawer');
  const setMenu = open => {
    burger?.setAttribute('aria-expanded',String(open));
    drawer?.setAttribute('aria-hidden',String(!open));
    if (drawer) { drawer.style.clipPath = open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'; drawer.style.pointerEvents = open ? 'auto' : 'none'; }
    drawer?.querySelectorAll('a').forEach((link,index) => { link.style.opacity = open ? '1' : '0'; link.style.transform = open ? 'translateY(0)' : 'translateY(28px)'; link.style.transitionDelay = open ? `${index*60+180}ms` : '0ms'; });
  };
  burger?.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  const ctaLinks = document.querySelectorAll('#cta a.btn, #pricing a.btn');
  ctaLinks.forEach(link => { link.href = '/#login'; link.target = '_top'; });
  measure();
  renderTeam();
  renderQuotes();
  renderCylinder(0);
  renderStack(0);
  window.__voltaMotionReady = true;
  requestAnimationFrame(update);
})();
</script>
'@
if ($html.Contains('</body>')) { $html = $html.Replace('</body>', "$exactScript</body>") }
else { $html += $exactScript }

$destinationPath = [System.IO.Path]::GetFullPath($Destination)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destinationPath)) | Out-Null
[System.IO.File]::WriteAllText($destinationPath, $html, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $destinationPath ($([Math]::Round((Get-Item $destinationPath).Length / 1MB, 2)) MB)"
