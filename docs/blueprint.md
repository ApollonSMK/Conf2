# **App Name**: Sabores de Portugal

## Core Features:

- Diretório de Confrarias: Listagem completa de Confrarias. Filtros: região, distrito/município, área de atuação, ano de fundação, certificações. Opções de ordenação: mais seguidas, mais recentes, por nome A-Z. Cada card mostra logótipo, nome, região e contadores (seguidores, eventos, receitas).
- Perfil da Confraria: Cabeçalho: banner, logótipo, nome, região, contactos, redes sociais, botão “Seguir”. Abas: Publicações: posts com texto, imagens, vídeo (embed YouTube/Vimeo), comentários. Eventos: lista + calendário da própria Confraria. Receitas: título, foto, ingredientes, modo de preparo, tempo, dificuldade. Galeria: álbum de fotos e vídeos. Sobre: história, missão, ano de fundação, membros. Ações rápidas: Guardar receita, Partilhar evento, Contactar Confraria.
- Calendário de Eventos: Visualização em lista e em calendário (month/week/day). Filtros: data, região, tipo (festival, confraternização, degustação, concurso), custo (gratuito/pago). Página de evento com capa, descrição, mapa (lat/lng), programa e botão “Adicionar ao calendário” (.ics).
- Descobertas (Exploração Global): Página “Explorar Descobertas” com pesquisa e filtros unificados. Pesquisa por palavra-chave e tags, abrangendo: Confrarias, Eventos, Receitas. Destaques editoriais (curadoria/admin). Possibilidade de visualização em grid ou mapa.
- Publicações e Conteúdo: Editor simples (rich text básico com Markdown). Upload de imagens (Supabase Storage). Sugestão automática de tags inteligentes (LLM revê o conteúdo e associa tags pré-definidas). Agendamento de publicações.
- Sistema de Contadores Consistentes: SQL triggers no Supabase para atualizar automaticamente: followers_count em Confrarias, likes_count e comments_count em Publicações/Receitas. Evita inconsistências quando há múltiplas interações concorrentes.
- Autenticação & Papéis: Visitante: apenas leitura (conteúdos públicos). Utilizador: pode seguir confrarias, guardar receitas/eventos, comentar. ConfrariaAdmin: gestão completa da Confraria (posts, eventos, receitas, galeria). Admin (Plataforma): moderação e destaques. Supabase Auth (Email/Password + Google + Apple).
- Funcionalidades Extra: .ics Generation: botão em cada evento para exportar para calendário externo. Favoritos: utilizador pode guardar receitas e eventos. SEO otimizado: metadata dinâmica por página.

## Style Guidelines:

- Vinho escuro (principal/header): #6B1D26
- Bege claro (background): #F5F2EE
- Castanho dourado (botões secundários): #C68642
- Bordô (textos/accent): #803136
- Cinza suave (textos secundários): #5E5E5E
- Headline font: 'PT Sans', a humanist sans-serif, set to 700 weight as requested.
- Body font: 'PT Sans', a humanist sans-serif for readability and a modern feel. It is well suited for all paragraphs of text on the site.
- Use simple, elegant icons that reflect Portuguese culture and cuisine.
- Implement a clean, responsive layout with a focus on readability and user experience.