/** Resposta paginada de GET /publicacoes */
export interface PublicacaoPaginada {
  paginaAtual: number;
  totalDePaginas: number;
  totalDePublicacoes: number;
  publicacoes: Publicacao[];
}

/** Modelo alinhado ao backend Kotlin (Publicacao) */
export interface Publicacao {
  publicacaoId: number | null;
  empresaId: number | null;
  nomeEmpresa: string | null;
  titulo: string | null;
  descricao: string | null;
  tipoContrato: string | null;
  dtExpiracao: string | null;
  dtPublicacao: string | null;
}

/** GET /candidaturas/usuario — PublicacaoResponseDto */
export interface PublicacaoResumo {
  publicacaoId: number;
  titulo: string;
  descricao: string;
  tipoContrato: string;
  dtExpiracao: string;
  dtPublicacao: string;
  nomeEmpresa: string;
}

export interface UsuarioToken {
  nome: string | null;
  email: string;
  tokenJwt: string | null;
}

export interface UsuarioPerfil {
  nome: string | null;
  email: string;
  cpf: string | null;
  telefone: string | null;
  escolaridade: string | null;
  idade: number | null;
  estadoCivil: string | null;
  estado: string | null;
  cidade: string | null;
  biografia: string | null;
  curriculoUrl: string | null;
  /** Path relativo (ex.: `/usuarios/fotos/download/...`) ou URL absoluta */
  fotoUrl: string | null;
}

export interface ExperienciaApi {
  id: number;
  cargo: string;
  empresa: string;
  /** ISO string ou array [ano, mês, dia] conforme serialização Jackson */
  dtInicio: string | number[];
  dtFim: string | number[];
}

export interface CurriculoInfo {
  filename: string;
}
