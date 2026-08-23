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
  'Next' = 'Próximo'
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
  const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (isIntersecting && !reduced) target.play().catch(() => {}); else target.pause();
  }), {rootMargin:'120px',threshold:.08});
  [...document.querySelectorAll('.tile video,.pcard video')].forEach(video => observer.observe(video));
  document.querySelectorAll('a.btn, #heroDock').forEach(link => {
    if (link.getAttribute('href') === '#cta') return;
  });
  const ctaLinks = document.querySelectorAll('#cta a.btn, #pricing a.btn');
  ctaLinks.forEach(link => { link.href = '/#login'; link.target = '_top'; });
})();
</script>
'@
if ($html.Contains('</body>')) { $html = $html.Replace('</body>', "$exactScript</body>") }
else { $html += $exactScript }

$destinationPath = [System.IO.Path]::GetFullPath($Destination)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destinationPath)) | Out-Null
[System.IO.File]::WriteAllText($destinationPath, $html, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $destinationPath ($([Math]::Round((Get-Item $destinationPath).Length / 1MB, 2)) MB)"
