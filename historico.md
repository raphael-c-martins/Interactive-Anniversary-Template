# HISTÓRICO - Interactive Anniversary Template

Registro evolutivo das decisões arquiteturais focadas em Alta Disponibilidade, Segurança e UX de Alta Densidade.

> **Diretriz de Preservação:** Em manutenções e atualizações deste projeto, **nunca apagar logs persistentes ou resetar bancos de dados** (caso integrações locais ou futuras estejam ativas).

## [17/11/2026] - Refino de Áudio, Responsividade e Animações
- **Controle de Áudio e Volume Inicial Baixo:** Volume inicial reduzido de 100% para `15%` com entrada suave (*fade-in* de `700ms`), persistência local no navegador (`localStorage`) e suporte alternativo via *Web Audio API* (`GainNode`) para dispositivos que bloqueiam escrita em `audio.volume` (como iOS Safari).
- **Mini Player Expansível:** Substituição do botão simples por pílula acessível (`44x44px`) com troca animada de ícones e painel de volume contendo barra deslizante, botões `-`/`+` e silenciar/reativar, fechando ao clicar fora ou pressionar `Esc`.
- **Correções de Responsividade (320px a 1920px):**
  - Cálculo dinâmico da abertura da carta e espaçamento superior da seção para que a folha aberta nunca cubra o título `"Um Dia Especial"` em nenhuma resolução.
  - Remoção de `<div>` excedente no `index.html`, desativação de `contenteditable` em leitura para evitar abertura acidental do teclado no celular e sincronia da pauta do papel via `background-attachment: local` com `--paper-line-h`.
  - Ajuste do mural de polaroides para largura fluida (`min(280px, calc(100vw - 3.25rem))`), espaçamento inferior seguro acima do player flutuante e redução das rotações extremas em telas menores.
- **Sistema de Animações e Acessibilidade:** Padronização com *motion tokens* (`--duration-*`, `--ease-*`, `--blur-*`), revelação escalonada nos títulos, inclinação 3D suave nas polaroides para mouse, eliminação de `transition: all`, ativação do fundo radial ambiente e cobertura integral de `@media (prefers-reduced-motion: reduce)` (inclusive pausando partículas quando a aba fica oculta).

## [Fase de Distribuição] - GitHub & Netlify Ready
- **Sanitização de Código**: Remoção de dados sensíveis e referências pessoais para publicação em portfólio público.
- **Configuração de Ambiente**: Criação de `.gitignore` e `LICENSE` (MIT) para padronização Open Source.
- **Deploy Optimization**: Ajuste do script de Auto-Refresh para execução exclusiva em ambiente local, prevenindo requisições desnecessárias em produção.
- **Modernização de UX (Dev)**: Renomeação do script de controle para `iniciar-servidor-local.bat` com interface ASCII aprimorada e comandos simplificados.
- **Favicon Integration**: Geração de identidade visual via IA e processamento via script Python para recorte circular e transparência (PNG-Alpha), garantindo visual limpo na guia do navegador.
- **Transparência de Dados**: Inclusão de disclaimer mandatório no README reforçando o caráter meramente ilustrativo do conteúdo (fotos/textos) para conformidade com portfólios públicos.
- **Rebranding Descritivo**: Renomeação do projeto para `Interactive-Anniversary-Template` e ajuste da estrutura de pastas para refletir um padrão técnico e profissional.
- **Documentação**: Atualização do README com guias de deploy para Netlify e estruturação técnica para recrutadores.
- **Bug Fix (README)**: Correção do badge de deploy do Netlify que apresentava imagem quebrada; substituído pelo botão oficial de "Deploy to Netlify" com link parametrizado para o repositório atual.
- **Refatoração de Nomenclatura**: Remoção completa de todas as menções ao antigo nome "Jarvis" (Protocol/API) em todos os arquivos (`README.md`, `main.js`, `server.py`, `.bat`), substituindo por termos genéricos como "Local Dev" para melhor adequação Open Source.
- **Limpeza de Workspace**: Remoção de arquivos residuais e inúteis (`]`) para manter o repositório leve e organizado.
- **Visual Evidence**: Inclusão de link direto para a demonstração ao vivo no Netlify no topo do README.




## [Fase Final] - Alta Performance e Mobile-First
- **Music Engine**: Substituição de embeds externos por um **Local Audio Engine**. Implementado listener global para contornar restrições de autoplay mobile.
- **Photo Gallery Engine**: Implementação de lógica de ordenação mista (Narrativa vs Dinâmica). Fixado arquivo de fechamento de DOM para encerramento emocional da experiência.
- **Mobile Refactoring**: Implementação de `aspect-ratio: 3/2` no envelope. Adicionado botão de fechamento (X) com lógica de segurança para evitar fechamentos acidentais durante o scroll em dispositivos touch.
- **Remoção do CloudSync**: Desativação total da sincronização com banco de dados externo (KVDB.io) para eliminar dependências de terceiros e garantir que o código local seja a única fonte de verdade (SSOT).

## [Fase de Interface] - Otimização UI/UX
- **Envelope 3D Interativo**: Implementação de Polígonos CSS (`clip-path`) para criar um envelope hiper-realista sem dependências externas.
- **Tipografia Dinâmica**: Sincronização matemática entre Background-Size de papel pautado e Line-Height de textos editáveis.
- **Media Encoding**: Rotina em JavaScript para tratamento de caminhos de arquivos e codificação de caracteres especiais para compatibilidade cross-platform.

## [Fase Inicial] - Kickoff e Estruturação
- **Modularização**: Separação estrita entre lógica de frontend e diretórios de ativos.
- **Tech Stack**: Escolha por HTML/CSS/JS Vanilla para garantir leveza e ausência de vulnerabilidades de dependências externas (bloatware).
