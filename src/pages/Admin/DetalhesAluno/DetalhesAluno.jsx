import styles from "./styles.module.css"
import Title from "../../../components/Title/Title"
import Input from "../../../components/Input/Input"
import Button from "../../../components/Button/Button"
import Message from "../../../components/Message/Message"
import InputSelect from "../../../components/InputSelect/InputSelect"
import DetailsCard from "../../../components/DetailsCard/DetailsCard"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import fetchData from "../../../utils/fetchData"
import useUseful from "../../../utils/useUseful"
import GraficoNotas from "../../../components/GraficoLinha/GraficoLinha"
import RedacoesTabela from "../../../components/RedacoesTabela/RedacoesTabela"

const DetalhesAluno = () => {
  const { aluno_id } = useParams()
  const [alunoData, setAlunoData] = useState([])
  const [redacoes, setRedacoes] = useState([])
  const [notasRedacoes, setNotasRedacoes] = useState([])
  const [formMessage, setFormMessage] = useState(null)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("")
  const [turma, setTurma] = useState("")
  const [turmas, setTurmas] = useState([])
  const { brasilFormatData, avgNotes } = useUseful()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${aluno_id}`, { 
        nome,
        email,
        tipoUsuario,
        turmaId: turma 
      })

      setFormMessage({ 
        type: "success", 
        text: `Usuário(a) ${response.data.data.nome} atualizado(a) com sucesso.` 
      })
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error.response.data.error
      });
    }
  }

  const deleteAluno = async () => {
    const confirmation = confirm(`Você tem certeza que deseja excluir o(a) aluno(a) ${alunoData.nome}?`)
    if (!confirmation) return

    await axios.delete(`http://localhost:3000/usuarios/${aluno_id}`)
    navigate("/admin/gerenciar-alunos")
  }

  useEffect(() => {
    const getData = async () => {
      const { getTurmas, getAlunoById } = fetchData() 
      const turmasResponse = await getTurmas()
      const alunoResponse = await getAlunoById(aluno_id)

      const options = turmasResponse.map(item => ({
        value: item.id,       
        label: item.nome
      }))

      setTurmas(options)
      setAlunoData(alunoResponse)
    }

    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const { getRedacoes } = fetchData() 
      const response = await getRedacoes(aluno_id, true)

      const notas = response.map(item => (
        { data: item.correcao.data, nota: item.correcao.nota }
      ))

      setRedacoes(response)
      setNotasRedacoes(notas)
    }

    getData()
  }, [])

  useEffect(() => {
    if (alunoData) {
      setNome(alunoData.nome || "")
      setEmail(alunoData.email || "")
      setTipoUsuario(alunoData.tipoUsuario || "")
      setTurma(alunoData.turmaId || "")
    }
  }, [alunoData])

  return (
    <div className={styles.container}>
      <Title title={`Gerenciar alunos - ${alunoData.nome && alunoData.nome}`} />

      <div className={styles.main_content}>
        <div className={styles.bg_left}>
          <DetailsCard  
            title="Nome"
            content={alunoData.nome && alunoData.nome}
            bg_color="#1A1A1A"
            text_size="12px"
          />

          <div className={styles.infos}>
            <DetailsCard  
              title="Email"
              content={alunoData.email && alunoData.email}
              bg_color="#1F1F1F"
              text_size="12px"
            />
            <DetailsCard  
              title="Data de matrícula"
              content={alunoData.dataCriacao && brasilFormatData(alunoData.dataCriacao)}
              bg_color="#1F1F1F"
              text_size="12px"
            />
            <DetailsCard  
              title="Tipo de usuário"
              content={alunoData.tipoUsuario && alunoData.tipoUsuario}
              bg_color="#1F1F1F"
              text_size="12px"
            />
            <DetailsCard  
              title="Média das notas"
              content={notasRedacoes.length === 0 ? 0 : avgNotes(notasRedacoes).toFixed(2)}
              bg_color="#1F1F1F"
              text_size="12px"
            />
          </div>

          <RedacoesTabela redacoes={redacoes} />
          <GraficoNotas array={notasRedacoes} height_size="300px" />

          <Button 
            text_size="15px" 
            text_color="#E0E0E0" 
            padding_sz="10px" 
            bg_color="#B2433F" 
            onClick={deleteAluno}
          ><i class="fa-solid fa-trash"></i> EXCLUIR ALUNO</Button>
        </div>

        <div className={styles.bg_right}>
          <p className={styles.form_title}>Atualize os dados do aluno</p>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Nome"
              color="#1A1A1A"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            >
              <i className="fa-solid fa-user"></i>
            </Input>

            <Input
              type="email"
              placeholder="Email"
              color="#1A1A1A"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              <i className="fa-solid fa-envelope"></i>
            </Input>

            <InputSelect 
              color="#1A1A1A"
              text="Selecione o tipo de usuário"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              options={[
                { value: "STANDARD", label: "STANDARD" },
                { value: "ADMIN", label: "ADMIN" }
              ]}
            />

            <InputSelect 
              color="#1A1A1A"
              text="Selecione a turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              options={turmas}
            />

            <Message 
              text={formMessage ? formMessage.text : ""} 
              type={formMessage ? formMessage.type : ""} 
            />

            <Button text_size="20px" text_color="#E0E0E0" padding_sz="10px" bg_color="#DA9E00">ATUALIZAR</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DetalhesAluno
