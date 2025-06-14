import axios from "axios"
import useUseful from "./useUseful"

const { getHeaders } = useUseful()

const API_URL = "https://ppr-api-smoky.vercel.app"

const fetchData = () => {
  const getTurmas = async () => {
    const response = await axios.get(`${API_URL}/turmas`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getTurmaById = async (id) => {
    const response = await axios.get(`${API_URL}/turmas/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getAlunos = async (filter) => {
    if (!filter) {
      const response = await axios.get(`${API_URL}/usuarios`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    const response = await axios.get(`${API_URL}/usuarios?filter=${filter}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getAlunoById = async (id) => {
    const response = await axios.get(`${API_URL}/usuarios/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getModulos = async () => {
    const response = await axios.get(`${API_URL}/modulos`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getModuloById = async (id) => {
    const response = await axios.get(`${API_URL}/modulos/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getVideoById = async (id) => {
    const response = await axios.get(`${API_URL}/videos/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getRanking = async () => {
    const response = await axios.get(`${API_URL}/ranking`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getPropostas = async () => {
    const response = await axios.get(`${API_URL}/propostas`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getRedacoes = async (usuarioId = false, corrigidas = false, pendentes = false) => {
    if (usuarioId && corrigidas) {
      const response = await axios.get(`${API_URL}/redacoes?usuarioId=${usuarioId}&corrigidas=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    if (usuarioId && pendentes) {
      const response = await axios.get(`${API_URL}/redacoes?usuarioId=${usuarioId}&pendentes=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    if (corrigidas) {
      const response = await axios.get(`${API_URL}/redacoes?corrigidas=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    if (pendentes) {
      const response = await axios.get(`${API_URL}/redacoes?pendentes=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    if (usuarioId) {
      const response = await axios.get(`${API_URL}/redacoes?usuarioId=${usuarioId}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    const response = await axios.get(`${API_URL}/redacoes`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getRedacaoById = async (id) => {
    const response = await axios.get(`${API_URL}/redacoes/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getSimulados = async () => {
    const response = await axios.get(`${API_URL}/simulados`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getNotasbySimuladoId = async (id) => {
    const response = await axios.get(`${API_URL}/notaSimulado/simuladoId/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getSimuladoByIdTurma = async (id) => {
    const response = await axios.get(`${API_URL}/simulados/turmaId/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getRedacoesUser = async (id) => {
    if (id) {
      const response = await axios.get(`${API_URL}/redacoes/?usuarioId=${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    const response = await axios.get(`${API_URL}/redacoes`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getCorrecoes = async () => {
    const response = await axios.get(`${API_URL}/correcoes`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getNotaSimulados = async () => {
    const response = await axios.get(`${API_URL}/notaSimulado`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getSimuladoById = async (id) => {
    const response = await axios.get(`${API_URL}/simulados/${id}`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  const getRedacoesCorrigidas = async (id) => {
    if (id) {
      const response = await axios.get(`${API_URL}/redacoes/${id}?corrigidas=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
      return response.data.data
    }
    const response = await axios.get(`${API_URL}/redacoes?corrigidas=true`, { headers: { Authorization: `Bearer ${getHeaders()}` } })
    return response.data.data
  }

  return {
    getTurmas,
    getTurmaById,
    getAlunos,
    getAlunoById,
    getModulos,
    getModuloById,
    getVideoById,
    getRanking,
    getRedacoes,
    getPropostas,
    getRedacoesCorrigidas,
    getRedacoesUser,
    getRedacaoById,
    getSimuladoById,
    getSimulados,
    getNotasbySimuladoId,
    getSimuladoByIdTurma,
    getCorrecoes,
    getNotaSimulados
  }
}

export default fetchData
