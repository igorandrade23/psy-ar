export type SlideSource = {
  label: string;
  url?: string;
  contexts?: Array<"site" | "ar">;
};

export type Slide = {
  assetId: string;
  title: string;
  description: string;
  details: string;
  references: string[];
  mediaSources?: SlideSource[];
  siteEmbedUrl?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  arMediaWidth?: number;
  arMediaHeight?: number;
} & (
  | {
      kind: "image";
      image: string;
      video?: string;
    }
  | {
      kind: "model";
      file: string;
      audio?: string;
      position: string;
      rotation: string;
      scale: string;
      modelOffset: string;
      minScale?: number;
      maxScale?: number;
    }
);

export const slides: Slide[] = [
  {
    kind: "image",
    assetId: "slide-origens",
    title: "Origens da capoeira",
    description:
      "Registros do século XIX mostram que a capoeira já circulava em cidades brasileiras como prática corporal, luta, jogo e forma de sociabilidade entre populações negras.",
    details:
      "A pintura atribuída a Augustus Earle costuma ser utilizada em estudos históricos como um dos registros visuais mais conhecidos de uma prática semelhante à capoeira no Brasil oitocentista. Ao apresentar corpo, confronto, ritmo e observação coletiva, a imagem ajuda a compreender a capoeira como manifestação social e não apenas como técnica de combate.",
    references: [
      "Assunção, M. R. (2005). Capoeira: The history of an Afro-Brazilian martial art. Routledge.",
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Imagem: Augustus Earle, \"CapoeiraEarle.JPG\"",
        url: "https://commons.wikimedia.org/wiki/File:CapoeiraEarle.JPG"
      }
    ],
    mediaWidth: 1200,
    mediaHeight: 796,
    arMediaWidth: 1200,
    arMediaHeight: 796,
    image: "/images/capoeira-earle.jpg"
  },
  {
    kind: "image",
    assetId: "slide-resistencia",
    title: "Repressão e resistência",
    description:
      "Ao longo de sua história, a capoeira foi alvo de perseguição e estigma, mas permaneceu viva por meio da transmissão entre mestres, rodas e comunidades.",
    details:
      "A criminalização da capoeira em diferentes momentos da história brasileira não impediu sua continuidade. A prática persistiu porque esteve vinculada a redes de pertencimento, memória e formação coletiva. Por isso, estudar capoeira exige observá-la como experiência histórica de resistência cultural e reinvenção social.",
    references: [
      "Assunção, M. R. (2005). Capoeira: The history of an Afro-Brazilian martial art. Routledge.",
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Imagem: Julia Rubinic, \"Capoeira in Salvador Brazil\"",
        url: "https://commons.wikimedia.org/wiki/File:Capoeira_in_Salvador_Brazil.jpg"
      }
    ],
    mediaWidth: 1188,
    mediaHeight: 781,
    arMediaWidth: 1188,
    arMediaHeight: 781,
    image: "/images/roda-capoeira-angola.jpg"
  },
  {
    kind: "image",
    assetId: "slide-patrimonio",
    title: "Capoeira como patrimônio vivo",
    description:
      "Hoje, a capoeira é reconhecida como patrimônio cultural e segue ativa em escolas, projetos, academias, grupos comunitários e rodas públicas.",
    details:
      "Esse reconhecimento institucional não encerra a história da capoeira; ao contrário, reforça sua permanência como prática viva, transmitida pela experiência do corpo, da música, da oralidade e do convívio. A roda continua sendo espaço de aprendizagem, disciplina, improviso e elaboração de identidade coletiva.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2017). Patrimônio cultural imaterial: salvaguarda da roda de capoeira e do ofício dos mestres de capoeira. IPHAN.",
      "United Nations Educational, Scientific and Cultural Organization. (2014). Capoeira circle. UNESCO Intangible Cultural Heritage."
    ],
    mediaSources: [
      {
        label: "Imagem: Clara Angeleas / Ministério da Cidadania, série \"Patrimônio Imaterial Capoeira\"",
        url: "https://commons.wikimedia.org/wiki/File:Patrim%C3%B4nio_Imaterial_Capoeira_(49188931842).jpg"
      }
    ],
    mediaWidth: 2048,
    mediaHeight: 1365,
    arMediaWidth: 2048,
    arMediaHeight: 1365,
    image: "/images/patrimonio-imaterial-capoeira.jpg"
  },
  {
    kind: "image",
    assetId: "slide-ginga",
    title: "A ginga",
    description:
      "A ginga é o movimento-base da capoeira. Ela organiza o equilíbrio, a defesa, a leitura do jogo e a relação entre ataque e esquiva.",
    details:
      "Mais do que um passo repetido, a ginga produz ritmo, intenção e disponibilidade corporal. Ela ensina o praticante a nunca permanecer estático, a negociar distância e tempo, e a transformar o corpo em linguagem. Por isso, a ginga é frequentemente apresentada como síntese técnica e simbólica da capoeira contemporânea.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Visualização 3D no site: Combat - Capoeira Kick por moveai",
        url: "https://sketchfab.com/3d-models/combat-capoeira-kick-01e0d2a4914c46a1a79b46d0fc56483a",
        contexts: ["site"]
      },
      {
        label: "GIF na experiência AR: Djino, \"Ginga de dos.gif\" (Wikimedia Commons, CC BY-SA)",
        url: "https://commons.wikimedia.org/wiki/File:Ginga_de_dos.gif",
        contexts: ["ar"]
      }
    ],
    siteEmbedUrl:
      "https://sketchfab.com/models/01e0d2a4914c46a1a79b46d0fc56483a/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=0&ui_stop=0&ui_theatre=1&ui_watermark=0",
    mediaWidth: 360,
    mediaHeight: 240,
    arMediaWidth: 360,
    arMediaHeight: 240,
    image: "/gifs/ginga.gif"
  },
  {
    kind: "model",
    assetId: "slide-berimbau2",
    title: "Berimbau",
    description:
      "O berimbau orienta a roda e ajuda a definir o tipo de jogo, o andamento do toque e a atenção dos participantes.",
    details:
      "Na roda de capoeira, o berimbau ocupa lugar central porque estrutura o ritmo e sinaliza modos distintos de jogar. Seu som não funciona apenas como acompanhamento: ele organiza a dinâmica da roda, orienta entradas e reforça a relação entre música, disciplina e improviso.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Modelo 3D: Berimbau por luthier.digital",
        url: "https://sketchfab.com/3d-models/berimbau-d09a9682a4d3453c8aaa64631359496f"
      }
    ],
    siteEmbedUrl:
      "https://sketchfab.com/models/d09a9682a4d3453c8aaa64631359496f/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=0&ui_stop=0&ui_theatre=1&ui_watermark=0",
    file: "/models/berimbau2.glb",
    audio: "/audio/berimbau.ogg",
    position: "0 0 0",
    rotation: "0 90 0",
    scale: "0.015 0.015 0.015",
    modelOffset: "-16.85 -76.83 2.19",
    minScale: 0.01,
    maxScale: 0.05
  },
  {
    kind: "model",
    assetId: "slide-pandeiro",
    title: "Pandeiro Brasileiro",
    description:
      "O pandeiro complementa a roda com marcação rítmica, balanço e resposta ao toque principal do berimbau.",
    details:
      "Na capoeira, o pandeiro reforça a pulsação da roda e contribui para a densidade sonora do conjunto. Seu uso aproxima a capoeira de outros campos da música popular brasileira e evidencia que a roda articula corpo, canto, percussão e escuta coletiva.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Modelo 3D: Pandeiro samba instrument por HQ3DMOD",
        url: "https://sketchfab.com/3d-models/pandeiro-samba-instrument-218bf9f047ec4a8cafd4b4983e008c85"
      }
    ],
    siteEmbedUrl:
      "https://sketchfab.com/models/218bf9f047ec4a8cafd4b4983e008c85/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=0&ui_stop=0&ui_theatre=1&ui_watermark=0",
    file: "/models/pandeiro_brasileiro.glb",
    audio: "/audio/pandeiro.mp3",
    position: "0 0 0",
    rotation: "0 180 0",
    scale: "3 3 3",
    modelOffset: "-14 -0.1 0",
    minScale: 1.2,
    maxScale: 12
  },
  {
    kind: "model",
    assetId: "slide-atabaque",
    title: "Atabaque",
    description:
      "O atabaque amplia a base percussiva da roda e ajuda a sustentar a energia coletiva da música e do canto.",
    details:
      "Embora o berimbau costume ocupar o centro simbólico da roda, o atabaque contribui para a sustentação do ritmo e reforça a presença de matrizes percussivas afro-brasileiras. Seu timbre grave ajuda a construir ambiência, intensidade e coesão entre movimento corporal e acompanhamento musical.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2014). Roda de capoeira e ofício dos mestres de capoeira. IPHAN."
    ],
    mediaSources: [
      {
        label: "Modelo 3D: Atabaque por luthier.digital",
        url: "https://sketchfab.com/3d-models/atabaque-cfd22abe35c84f2f9e07ee803e8dc6dc"
      }
    ],
    siteEmbedUrl:
      "https://sketchfab.com/models/cfd22abe35c84f2f9e07ee803e8dc6dc/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=0&ui_stop=0&ui_theatre=1&ui_watermark=0",
    file: "/models/atabaque.glb",
    audio: "/audio/atabaque.mp3",
    position: "0 0 0",
    rotation: "0 180 0",
    scale: "1.2 1.2 1.2",
    modelOffset: "-0.35 -0.59 0.07",
    minScale: 0.6,
    maxScale: 8
  },
  {
    kind: "image",
    assetId: "slide-musicos",
    title: "A roda e a música hoje",
    description:
      "A roda contemporânea articula jogo, música, canto, memória e convivência, mantendo a capoeira como prática coletiva e elemento cultural vivo.",
    details:
      "Em contextos contemporâneos, a roda preserva dimensões históricas da capoeira ao mesmo tempo que dialoga com escola, turismo, políticas de patrimônio e formação artística. A presença de músicos e praticantes no mesmo espaço mostra que a capoeira continua sendo, ao mesmo tempo, arte, pedagogia, performance e experiência comunitária.",
    references: [
      "Instituto do Patrimônio Histórico e Artístico Nacional. (2017). Patrimônio cultural imaterial: salvaguarda da roda de capoeira e do ofício dos mestres de capoeira. IPHAN.",
      "United Nations Educational, Scientific and Cultural Organization. (2014). Capoeira circle. UNESCO Intangible Cultural Heritage."
    ],
    mediaSources: [
      {
        label: "Imagem: Projeto Transite, \"Musicos da Capoeira Angola\"",
        url: "https://commons.wikimedia.org/wiki/File:Musicos_da_Capoeira_Angola.jpg"
      }
    ],
    mediaWidth: 4288,
    mediaHeight: 2848,
    arMediaWidth: 4288,
    arMediaHeight: 2848,
    image: "/images/musicos-capoeira-angola.jpg"
  }
];
