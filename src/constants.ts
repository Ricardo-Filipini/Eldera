// FIX: Import QuizQuestion type as types.ts is now a module.
import type { QuizQuestion } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Qual a filosofia de Eldin sobre relacionamentos?",
    options: [
      "Qualidade acima de tudo",
      "Quantidade sobre qualidade",
      "O amor é cego",
      "Melhor só do que mal acompanhado"
    ],
    correctAnswer: "Quantidade sobre qualidade",
    explanation: "Eldin sempre prezou por um portfólio diversificado. É a lei da oferta e da procura."
  },
  {
    question: "Em que condições Eldin bateu o pênalti lendário no InterUFG?",
    options: [
      "Sóbrio e focado",
      "Com uma perna quebrada",
      "Virado, drogado e de óculos escuros",
      "Vendado e de costas"
    ],
    correctAnswer: "Virado, drogado e de óculos escuros",
    explanation: "Apenas uma lenda pode marcar um gol em estado de pura transcendência astral. Um momento histórico!"
  },
  {
    question: "O que significa a sigla 'LGBT' para Eldin?",
    options: [
      "Lésbicas, Gays, Bissexuais, Transgêneros",
      "Lutando bravamente contra tudo",
      "Liberty, Guns, Bolsonaro, Trump",
      "Lendário, Genial, Bonito, Tesudo"
    ],
    correctAnswer: "Liberty, Guns, Bolsonaro, Trump",
    explanation: "Uma reinterpretação geopolítica que só uma mente brilhante como a dele poderia conceber."
  },
  {
    question: "Qual é a risada icônica de Eldin?",
    options: [
      "Uma gargalhada contínua",
      "Um riso baixo e discreto",
      "ha-ha-ha-ha (pausada)",
      "Ele não ri, apenas sorri sarcasticamente"
    ],
    correctAnswer: "ha-ha-ha-ha (pausada)",
    explanation: "A risada que ecoa como um motor bem ajustado. Sincopada, precisa, lendária."
  },
  {
    question: "Complete a icônica frase de Eldin: 'Se mulher não tivesse buceta eu...'",
    options: [
      "...seria gay.",
      "...investiria na bolsa.",
      "...não dava nem bom dia.",
      "...ainda seria amigo delas."
    ],
    correctAnswer: "...não dava nem bom dia.",
    explanation: "Um pilar da filosofia Eldiniana, resumindo a pragmática interação entre os sexos."
  },
  {
    question: "Qual é o arqui-inimigo natural de Eldin?",
    options: [
      "Uma prova de termodinâmica",
      "Gordas comunistas de cabelo roxo",
      "Acordar cedo no domingo",
      "Cerveja quente"
    ],
    correctAnswer: "Gordas comunistas de cabelo roxo",
    explanation: "Uma batalha ideológica travada nos campos da zueira e do bom senso. O terror delas!"
  },
  {
    question: "Como Eldin descreve seu perfeito equilíbrio entre vida pessoal e profissional?",
    options: [
      "Com planilhas de excel e meditação",
      "Evitando o trabalho a todo custo",
      "Delegando todas as tarefas",
      "Sendo maconheiro e trabalhador"
    ],
    correctAnswer: "Sendo maconheiro e trabalhador",
    explanation: "O ying e yang da vida moderna: produzindo durante o dia, carburando durante a noite para manter a genialidade."
  },
  {
    question: "Qual a principal diretriz biológica de Eldin, já comprovada com 2 filhos?",
    options: [
      "Espalhar a palavra da engenharia",
      "Encontrar a cerveja perfeitamente gelada",
      "Ser um macho alfa reprodutor",
      "Zerar todos os jogos de PlayStation"
    ],
    correctAnswer: "Ser um macho alfa reprodutor",
    explanation: "Com 2 herdeiros no currículo, a missão de perpetuar a linhagem está sendo cumprida com sucesso. A dinastia está garantida."
  }
];

export const veoLoadingMessages = [
    "Invocando os deuses do vídeo...",
    "Consultando o espírito do InterUFG...",
    "Processando a zueira em 1080p...",
    "Aguarde, a lenda está sendo renderizada...",
    "Calibrando os níveis de testosterona alfa...",
    "Isso pode demorar um pouco, assim como a fila do banheiro na festa...",
    "Gerando mais uma obra-prima...",
];