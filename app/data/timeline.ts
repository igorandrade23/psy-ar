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
    title: "O laboratório que formalizou a psicologia experimental",
    name: "Wilhelm Wundt",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wilhelm_Wundt.jpg",
    summary:
      "Em Leipzig, Wundt institucionalizou a psicologia experimental e consolidou a ideia de que a mente poderia ser estudada com método e observação controlada.",
    impact:
      "A fundação do laboratório de 1879 virou um marco porque deslocou a psicologia da especulação filosófica para a investigação sistemática.",
    arHeadline: "Leipzig vira o ponto zero da psicologia científica.",
    accent: "#f4c95d",
    source: "https://pt.wikipedia.org/wiki/Wilhelm_Wundt",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Wilhelm_Wundt.jpg"
  },
  {
    id: "james",
    year: "1890",
    school: "Funcionalismo",
    title: "Uma psicologia interessada na função da mente",
    name: "William James",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/01/William_James_in_1890s.jpg",
    summary:
      "William James ajudou a deslocar o foco dos elementos isolados da consciência para a utilidade prática dos processos mentais na adaptação ao ambiente.",
    impact:
      "Os seus textos ampliaram a conversa para emoção, hábito, atenção e experiência, abrindo uma via de crítica ao estruturalismo estrito.",
    arHeadline: "A mente passa a ser lida pela sua função, não só pela sua estrutura.",
    accent: "#49b6b1",
    source: "https://pt.wikipedia.org/wiki/William_James",
    mediaSource: "https://commons.wikimedia.org/wiki/File:William_James_in_1890s.jpg"
  },
  {
    id: "titchener",
    year: "1892",
    school: "Estruturalismo clássico",
    title: "A versão rigorosa do estruturalismo nos Estados Unidos",
    name: "Edward B. Titchener",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Edward_Bradford_Titchener.jpg",
    summary:
      "Discípulo de Wundt, Titchener sistematizou o estruturalismo em Cornell e defendeu a introspecção experimental como caminho para decompor a experiência consciente.",
    impact:
      "Seu projeto procurava identificar os elementos básicos da mente e deu ao estruturalismo sua forma mais influente e também mais contestada.",
    arHeadline: "A consciência vira mapa: sensação, intensidade, duração e nitidez.",
    accent: "#f47c48",
    source: "https://pt.wikipedia.org/wiki/Edward_Titchener",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Edward_Bradford_Titchener.jpg"
  },
  {
    id: "pavlov",
    year: "1904",
    school: "Ponte para o behaviorismo",
    title: "Condicionamento clássico e a força dos estímulos observáveis",
    name: "Ivan Pavlov",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Ivan_Pavlov_nobel.jpg",
    summary:
      "Pavlov mostrou como respostas fisiológicas podiam ser associadas a estímulos do ambiente, tornando o comportamento observável uma peça central da investigação psicológica.",
    impact:
      "Seu trabalho com reflexos condicionados ofereceu uma base objetiva para teorias posteriores do comportamento.",
    arHeadline: "Estímulo e resposta entram no centro do palco.",
    accent: "#8ccf7e",
    source: "https://pt.wikipedia.org/wiki/Ivan_Pavlov",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Ivan_Pavlov_nobel.jpg"
  },
  {
    id: "watson",
    year: "1913",
    school: "Behaviorismo metodológico",
    title: "O manifesto que rompeu com a introspecção",
    name: "John B. Watson",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/John_Broadus_Watson.JPG",
    summary:
      "Com o artigo de 1913, Watson defendeu que a psicologia deveria estudar apenas o comportamento observável, rejeitando a introspecção como método central.",
    impact:
      "Aqui o behaviorismo se torna programa explícito: prever e controlar o comportamento passa a ser meta científica legítima.",
    arHeadline: "A psicologia troca o olhar para dentro pelo comportamento mensurável.",
    accent: "#6bc6ff",
    source: "https://pt.wikipedia.org/wiki/John_B._Watson",
    mediaSource: "https://commons.wikimedia.org/wiki/File:John_Broadus_Watson.JPG"
  },
  {
    id: "skinner",
    year: "1938",
    school: "Behaviorismo radical",
    title: "Consequências, reforço e condicionamento operante",
    name: "B. F. Skinner",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Skinnerphoto2.jpg",
    summary:
      "Skinner levou o behaviorismo adiante ao explicar a ação humana a partir das consequências, formulando a análise do comportamento e o condicionamento operante.",
    impact:
      "Sua obra consolidou o behaviorismo moderno e ampliou a aplicação experimental para aprendizagem, educação e controle ambiental.",
    arHeadline: "O comportamento deixa rastros: o reforço molda a ação futura.",
    accent: "#ff8f70",
    source: "https://pt.wikipedia.org/wiki/B._F._Skinner",
    mediaSource: "https://commons.wikimedia.org/wiki/File:Skinnerphoto2.jpg"
  }
];
