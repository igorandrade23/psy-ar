export type TimelineEntry = {
  id: string;
  year: string;
  school: string;
  title: string;
  name: string;
  image: string;
  summary: string;
  impact: string;
  arHeadline: string;
  accent: string;
  source: string;
  mediaSource: string;
};

export const timelineEntries: TimelineEntry[] = [
  {
    id: "wundt",
    year: "1879",
    school: "Estruturalismo nascente",
    title: "O laboratorio que formalizou a psicologia experimental",
    name: "Wilhelm Wundt",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wilhelm_Wundt.jpg",
    summary:
      "Em Leipzig, Wundt institucionalizou a psicologia experimental e consolidou a ideia de que a mente poderia ser estudada com metodo e observacao controlada.",
    impact:
      "A fundacao do laboratorio de 1879 virou um marco porque deslocou a psicologia da especulacao filosofica para a investigacao sistematica.",
    arHeadline: "Leipzig vira o ponto zero da psicologia cientifica.",
    accent: "#f4c95d",
    source: "https://pt.wikipedia.org/wiki/Wilhelm_Wundt",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Wilhelm_Wundt.jpg"
  },
  {
    id: "james",
    year: "1890",
    school: "Funcionalismo",
    title: "Uma psicologia interessada na funcao da mente",
    name: "William James",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/01/William_James_in_1890s.jpg",
    summary:
      "William James ajudou a deslocar o foco dos elementos isolados da consciencia para a utilidade pratica dos processos mentais na adaptacao ao ambiente.",
    impact:
      "Seus textos ampliaram a conversa para emocao, habito, atencao e experiencia, abrindo uma via de critica ao estruturalismo estrito.",
    arHeadline: "A mente passa a ser lida pela sua funcao, nao so pela sua estrutura.",
    accent: "#49b6b1",
    source: "https://pt.wikipedia.org/wiki/William_James",
    mediaSource: "https://commons.wikimedia.org/wiki/File:William_James_in_1890s.jpg"
  },
  {
    id: "titchener",
    year: "1892",
    school: "Estruturalismo classico",
    title: "A versao rigorosa do estruturalismo nos Estados Unidos",
    name: "Edward B. Titchener",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Edward_Bradford_Titchener.jpg",
    summary:
      "Discipulo de Wundt, Titchener sistematizou o estruturalismo em Cornell e defendeu a introspeccao experimental como caminho para decompor a experiencia consciente.",
    impact:
      "Seu projeto procurava identificar os elementos basicos da mente e deu ao estruturalismo sua forma mais influente e tambem mais contestada.",
    arHeadline: "A consciencia vira mapa: sensacao, intensidade, duracao e nitidez.",
    accent: "#f47c48",
    source: "https://pt.wikipedia.org/wiki/Edward_Titchener",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Edward_Bradford_Titchener.jpg"
  },
  {
    id: "pavlov",
    year: "1904",
    school: "Ponte para o behaviorismo",
    title: "Condicionamento classico e a forca dos estimulos observaveis",
    name: "Ivan Pavlov",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Ivan_Pavlov_nobel.jpg",
    summary:
      "Pavlov mostrou como respostas fisiologicas podiam ser associadas a estimulos do ambiente, tornando o comportamento observavel uma peca central da investigacao psicologica.",
    impact:
      "Seu trabalho com reflexos condicionados ofereceu uma base objetiva para teorias posteriores do comportamento.",
    arHeadline: "Estimulo e resposta entram no centro do palco.",
    accent: "#8ccf7e",
    source: "https://pt.wikipedia.org/wiki/Ivan_Pavlov",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Ivan_Pavlov_nobel.jpg"
  },
  {
    id: "watson",
    year: "1913",
    school: "Behaviorismo metodologico",
    title: "O manifesto que rompeu com a introspeccao",
    name: "John B. Watson",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/John_Broadus_Watson.JPG",
    summary:
      "Com o artigo de 1913, Watson defendeu que a psicologia deveria estudar apenas o comportamento observavel, rejeitando a introspeccao como metodo central.",
    impact:
      "Aqui o behaviorismo se torna programa explicito: prever e controlar o comportamento passa a ser meta cientifica legitima.",
    arHeadline: "A psicologia troca o olhar para dentro pelo comportamento mensuravel.",
    accent: "#6bc6ff",
    source: "https://pt.wikipedia.org/wiki/John_B._Watson",
    mediaSource: "https://commons.wikimedia.org/wiki/File:John_Broadus_Watson.JPG"
  },
  {
    id: "skinner",
    year: "1938",
    school: "Behaviorismo radical",
    title: "Consequencias, reforco e condicionamento operante",
    name: "B. F. Skinner",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Skinnerphoto2.jpg",
    summary:
      "Skinner levou o behaviorismo adiante ao explicar a acao humana a partir das consequencias, formulando a analise do comportamento e o condicionamento operante.",
    impact:
      "Sua obra consolidou o behaviorismo moderno e ampliou a aplicacao experimental para aprendizagem, educacao e controle ambiental.",
    arHeadline: "O comportamento deixa rastros: o reforco molda a acao futura.",
    accent: "#ff8f70",
    source: "https://pt.wikipedia.org/wiki/B._F._Skinner",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Skinnerphoto2.jpg"
  }
];
