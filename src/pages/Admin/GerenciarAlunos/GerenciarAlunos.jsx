import styles from "./styles.module.css"
import Title from "../../../components/Title/Title"
import Input from "../../../components/Input/Input"
import Button from "../../../components/Button/Button"
import Message from "../../../components/Message/Message"
import Pagination from "../../../components/Pagination/Pagination"
import InputSelect from "../../../components/InputSelect/InputSelect"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import fetchData from "../../../utils/fetchData"
import InfoCard from "../../../components/InfoCard/InfoCard"
import Loading from "../../../components/Loading/Loading"
import defaultProfilePicture from '../../../images/Defalult_profile_picture.jpg';

const GerenciarAlunos = () => {
  const [formMessage, setFormMessage] = useState(null)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("")
  const [turma, setTurma] = useState("")
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [search, setSearch] = useState("")

  const [isLoading, setIsLoading] = useState(false)            
  const [isLoadingData, setIsLoadingData] = useState(false)    

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAlunos = alunos.slice(indexOfFirstItem, indexOfLastItem)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/usuarios", { 
        nome,
        email,
        tipoUsuario,
        turmaId: turma 
      })

      setFormMessage({ 
        type: "success", 
        text: `Usuário(a) ${response.data.data.nome} criado(a) com sucesso.` 
      })

      setNome("")
      setEmail("")
      setTipoUsuario("")
      setTurma("")

      await getAlunos()
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error.response.data.error
      });
    } finally {
      setIsLoading(false)
    }
  }

  const getAlunos = async (busca) => {
    setIsLoadingData(true)
    try {
      const { getAlunos } = fetchData() 
      const response = await getAlunos(busca)
      setAlunos(response)
    } catch (error) {
      console.error("Erro ao buscar alunos:", error)
      setAlunos([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const deleteAluno = async (nome, id) => {
    const confirmation = confirm(`Você tem certeza que deseja excluir o(a) aluno(a) ${nome}?`)
    if (!confirmation) {
      navigate("/admin/gerenciar-alunos")
      return
    } 

    await axios.delete(`http://localhost:3000/usuarios/${id}`)
    await getAlunos()
    navigate("/admin/gerenciar-alunos")
  }

  useEffect(() => { 
    setCurrentPage(1)
    getAlunos(search)
  }, [search])

  useEffect(() => {
    const getData = async () => {
      setIsLoadingData(true)
      try {
        const { getTurmas, getAlunos } = fetchData() 
        const turmasResponse = await getTurmas()
        const alunosResponse = await getAlunos()

        const options = turmasResponse.map(item => ({
          value: item.id,       
          label: item.nome
        }))

        setTurmas(options)
        setAlunos(alunosResponse)
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    getData()
  }, [])

  return (
    <div className={styles.container}>
      <Title title="Gerenciar alunos" />

      <div className={styles.main_content}>
        <div className={styles.bg_left}>
          {isLoadingData ? (
            <div className={styles.loading}><Loading /></div>
          ) : (
            <>
              <Input 
                type="text" 
                placeholder="Pesquise por um aluno" 
                color="#1A1A1A" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </Input>

              {alunos.length === 0 ? (
                <Message 
                  text="Nenhum aluno cadastrado." 
                  text_color="#E0E0E0"
                  marginTop="30px"
                />
              ) : (
                <>
                  <div className={styles.alunos_container}>
                    {currentAlunos.map((aluno) => (
                      <InfoCard 
                        key={aluno.id}
                        img={aluno.caminho ? `http://localhost:3000/usuarios/${aluno.id}/profile-image` : defaultProfilePicture}
                        title={aluno.nome} 
                        subtitle={aluno.email} 
                        link={aluno.id}
                        onClick={() => deleteAluno(aluno.nome, aluno.id)}
                      />
                    ))}
                  </div>

                  <div className={styles.pagination}>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={alunos.length}
                      itemsPerPage={itemsPerPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.bg_right}>
          <p className={styles.form_title}>Cadastre um novo aluno</p>

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

            <Button 
              text_size="20px" 
              padding_sz="10px" 
              bg_color="#DA9E00"
              isLoading={isLoading}
            >
              CADASTRAR
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GerenciarAlunos

