
export interface ProvaAnterior {
  id: string;
  instituicao: string;
  concurso: string;
  ano: number;
  banca: string;
  cargo: string;
  tipo: string;
  descricao: string;
  urlProva: string;
  urlGabarito: string;
  tipoGabarito: "DEFINITIVO" | "PRELIMINAR";
  urlFonte: string;
}

export const provasAnteriores: ProvaAnterior[] = [
  {
    id: "dataprev-2024-dev",
    instituicao: "DATAPREV",
    concurso: "Concurso Público DATAPREV",
    ano: 2024,
    banca: "FGV",
    cargo:
      "Analista de Tecnologia da Informação - Desenvolvimento de Software",
    tipo: "Tipo 1 - Branca",
    descricao:
      "Prova objetiva de nível superior, voltada ao cargo de Desenvolvimento de Software.",
    urlProva:
      "https://conhecimento.fgv.br/sites/default/files/concursos/ati-desenvolvimento-de-software-cns003-tipo-01.pdf",
    urlGabarito:
      "https://conhecimento.fgv.br/sites/default/files/concursos/dataprev_gabarito_definitivo-1.pdf",
    tipoGabarito: "DEFINITIVO",
    urlFonte:
      "https://conhecimento.fgv.br/concursos/dataprev24"
  },
  {
    id: "stn-2024-infra",
    instituicao: "Secretaria do Tesouro Nacional",
    concurso: "Concurso Público STN",
    ano: 2024,
    banca: "FGV",
    cargo:
      "Tecnologia da Informação - Operação e Infraestrutura",
    tipo: "Manhã - Tipo 1 - Branca",
    descricao:
      "Caderno objetivo da área de Operação e Infraestrutura, com 70 questões.",
    urlProva:
      "https://conhecimento.fgv.br/sites/default/files/concursos/area-de-tecnologia-da-informacao-operacao-e-infraestruturacns104-tipo-1.pdf",
    urlGabarito:
      "https://conhecimento.fgv.br/sites/default/files/concursos/stn2024_gabaritos_manha-e-tarde_sdjsldds.pdf",
    tipoGabarito: "DEFINITIVO",
    urlFonte:
      "https://conhecimento.fgv.br/concursos/stn"
  },
  {
    id: "cmbh-2024-desenv",
    instituicao: "Câmara Municipal de Belo Horizonte",
    concurso: "Concurso Público CMBH",
    ano: 2024,
    banca: "Instituto Consulplan",
    cargo:
      "Analista de Tecnologia da Informação - Desenvolvimento de Sistemas",
    tipo: "Tipo 4 - Azul",
    descricao:
      "Caderno de prova da área de Desenvolvimento de Sistemas.",
    urlProva:
      "https://www.cmbh.mg.gov.br/sites/default/files/pagina-basica/2024/04/anal._de_tec._da_inf._-_area_de_desenv._de_sistema_-_tipo_4_-_azul.pdf",
    urlGabarito:
      "https://www.cmbh.mg.gov.br/sites/default/files/pagina-basica/2024/04/gabaritos_preliminares.pdf",
    tipoGabarito: "PRELIMINAR",
    urlFonte:
      "https://www.cmbh.mg.gov.br/node/84587"
  }
];
