# SpaceConnect 🚀

Aplicativo mobile desenvolvido como projeto da disciplina de **Desenvolvimento Mobile** na FIAP, dentro da proposta **Global Solution 2025 — Space Connect**.

## Sobre o Projeto

O SpaceConnect conecta dados da indústria espacial ao cotidiano, exibindo informações em tempo real sobre o clima terrestre, asteroides próximos da Terra e a Foto Astronômica do Dia da NASA. O app demonstra como tecnologias espaciais podem gerar impacto positivo na vida das pessoas.

## Equipe

| Nome | RM |
|------|----|
|      |    |
|      |    |
|      |    |

## Funcionalidades

### Tela Início (Home)
- Painel principal com resumo de informações em tempo real
- Condições climáticas atuais de São Paulo (temperatura, vento, condição)
- Foto Astronômica do Dia da NASA (APOD) com imagem, título e descrição
- Asteroides em destaque com distância e nível de perigo

### Tela Explorador
- Listagem completa dos asteroides da semana (7 dias via NASA NeoWs API)
- Busca por nome do asteroide
- Filtros: Todos / Perigosos / Seguros
- Ordenação: por Distância / Nome / Nível de Perigo
- Cards com diâmetro estimado, distância da Terra e velocidade

### Tela Favoritos
- Salvar fotos APOD e asteroides localmente
- Persistência via AsyncStorage
- Remover itens individualmente ou limpar todos
- Navegação direta para o detalhe do item salvo

### Tela Configurações
- Alternância entre modo escuro e claro (persistido)
- Contador de favoritos salvos
- Links para as fontes de dados (NASA e Open-Meteo)
- Informações sobre o projeto

### Telas de Detalhe
- **APOD Detail**: imagem em alta resolução, descrição completa, crédito do autor, link para HD
- **NEO Detail**: dimensões do asteroide, todas as aproximações registradas, velocidade, link NASA JPL

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React Native + Expo SDK 56 |
| Linguagem | TypeScript (interfaces, genéricos, union types) |
| Navegação | React Navigation (Bottom Tabs + Native Stack) |
| Estado Global | Context API + hooks customizados |
| Persistência | AsyncStorage |
| HTTP | Axios com camada de serviço |
| UI | StyleSheet, Animated API, FlatList, ScrollView |

## APIs Utilizadas

### NASA Open APIs — `api.nasa.gov`
- **APOD** (Astronomy Picture of the Day): foto astronômica diária com descrição
- **NeoWs** (Near Earth Object Web Service): feed de asteroides próximos da Terra

### Open-Meteo — `open-meteo.com`
- Dados climáticos gratuitos, sem necessidade de chave de API
- Temperatura, velocidade do vento e código de condição climática (WMO)

## Arquitetura do Projeto

```
src/
 ├── components/
 │   ├── ApodCard.tsx        # Card da foto do dia
 │   ├── NeoCard.tsx         # Card de asteroide com indicador de perigo
 │   ├── WeatherCard.tsx     # Card de clima com ícones WMO
 │   ├── SkeletonCard.tsx    # Placeholder animado de carregamento
 │   └── EmptyState.tsx      # Estado vazio / erro
 ├── screens/
 │   ├── HomeScreen.tsx      # Dashboard principal
 │   ├── ExplorerScreen.tsx  # Listagem com filtro e busca
 │   ├── FavoritesScreen.tsx # Favoritos salvos
 │   ├── SettingsScreen.tsx  # Configurações e modo escuro
 │   ├── ApodDetailScreen.tsx
 │   └── NeoDetailScreen.tsx
 ├── navigation/
 │   └── index.tsx           # Stack + Tab navigator tipados
 ├── services/
 │   ├── nasaService.ts      # Axios para NASA API
 │   └── weatherService.ts   # Axios para Open-Meteo
 ├── hooks/
 │   ├── useApod.ts
 │   ├── useNeo.ts
 │   ├── useWeather.ts
 │   └── useFavorites.ts
 ├── contexts/
 │   └── ThemeContext.tsx     # Tema global com persistência
 ├── storage/
 │   └── favorites.ts        # CRUD AsyncStorage de favoritos
 ├── types/
 │   └── index.ts            # Interfaces e tipos TypeScript
 ├── theme/
 │   └── index.ts            # Paleta dark/light, espaçamentos
 └── utils/
     └── index.ts            # Formatadores de número, data, distância
```

## Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- Expo Go no celular (Android ou iOS) **ou** emulador Android/iOS configurado

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd space-connect

# Instalar dependências
npm install

# Iniciar o projeto
npm start
# ou
npx expo start
```

### Rodando no dispositivo
1. Instale o aplicativo **Expo Go** na loja do seu celular
2. Escaneie o QR Code exibido no terminal com o Expo Go (Android) ou com a câmera (iOS)

### Rodando no emulador
```bash
npm run android   # Android Studio com emulador aberto
npm run ios       # Xcode com simulador (apenas macOS)
```

## Conceitos Aplicados em Aula

- **Componentes e Props**: ApodCard, NeoCard, WeatherCard, EmptyState, SkeletonCard
- **Estado (useState) e Efeitos (useEffect)**: gerenciamento de loading, dados e erros
- **Hooks customizados**: useApod, useNeo, useWeather, useFavorites
- **FlatList**: listagem performática na tela Explorer
- **ScrollView + RefreshControl**: pull-to-refresh na Home
- **TypeScript**: tipagem forte com interfaces, genéricos e union types
- **Navegação tipada**: Stack Navigator + Tab Navigator com RootStackParamList
- **Context API**: ThemeContext para tema global
- **AsyncStorage**: persistência de favoritos e preferência de tema
- **Axios**: requisições HTTP com instâncias configuradas e tratamento de erro
- **Camada de serviço**: nasaService e weatherService desacoplados das telas

## Relação com a Indústria Espacial e ODS

- **ODS 13 — Ação climática**: monitoramento de dados meteorológicos em tempo real
- **ODS 9 — Inovação e infraestrutura**: uso de APIs espaciais para aplicações terrestres
- **ODS 11 — Cidades sustentáveis**: informações climáticas locais para decisões do dia a dia
- O rastreamento de asteroides (NEO) demonstra como a infraestrutura espacial protege o planeta

## Screenshots

> *(adicionar screenshots do app rodando)*
