import styles from "./styles.module.css"
import { Link, useParams } from "react-router-dom"
import Title from "../../../components/Title/Title"
import DetailsCard from "../../../components/DetailsCard/DetailsCard"
import Button from "../../../components/Button/Button"
import Message from "../../../components/Message/Message"
import InputSelect from "../../../components/InputSelect/InputSelect"
import fetchData from "../../../utils/fetchData"
import useUseful from "../../../utils/useUseful"
import { useState, useEffect } from "react"
import axios from "axios"

const CorrigirRedacao = () => {
  const { redacao_id } = useParams()
  const [redacao, setRedacao] = useState([])
  const { brasilFormatData } = useUseful()
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState(null)

  const [file, setFile] = useState(null)
  const [comp01, setComp01] = useState("")
  const [comp02, setComp02] = useState("")
  const [comp03, setComp03] = useState("")
  const [comp04, setComp04] = useState("")
  const [comp05, setComp05] = useState("")
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    const getData = async () => {
      const { getRedacaoById } = fetchData()
      const response = await getRedacaoById(redacao_id)
      setRedacao(response)
    }

    getData()
  }, [])

  useEffect(() => {
    console.log(redacao)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    const userID = redacao.usuario.id
    formData.append('competencia01', comp01)
    formData.append('competencia02', comp02)
    formData.append('competencia03', comp03)
    formData.append('competencia04', comp04)
    formData.append('competencia05', comp05)
    formData.append('feedback', feedback)
    formData.append('redacaoId', redacao_id)

    try {
      await axios.post(
        `http://localhost:3000/correcoes/${userID}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormMessage({
        type: 'success',
        text: 'Redação corrigida com sucesso.',
      });
    } catch (error) {
      console.log(error)
      setFormMessage({
        type: 'error',
        text: error.response?.data?.error || 'Erro ao enviar a redação.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Title title="Correção" />
      <div className={styles.main_content}>
        <div className={styles.bg_left}>
          <p className={styles.title}>Detalhes da redação</p>

          <DetailsCard  
            title="Título"
            content={redacao.titulo && redacao.titulo}
            bg_color="#1F1F1F"
            text_size="16px"
          />

          <DetailsCard  
            title="Enviado em"
            content={redacao.data && brasilFormatData(redacao.data)}
            bg_color="#1F1F1F"
            text_size="16px"
          />

          <DetailsCard  
            title="Status"
            content={redacao.status && redacao.status}
            bg_color="#1F1F1F"
            text_size="16px"
          />

          <DetailsCard  
            title="Autor"
            content={redacao.usuario?.nome && redacao.usuario?.nome}
            bg_color="#1F1F1F"
            text_size="16px"
          />

          <Link to={`http://localhost:3000/redacoes/download/${redacao_id}`}>
            <Button 
              text_size="20px" 
              text_color="#E0E0E0" 
              padding_sz="10px" 
              bg_color="#DA9E00"
            ><i class="fa-solid fa-download"></i> BAIXAR ESSA REDAÇÃO</Button>
          </Link>
        </div>
        
        <form className={styles.bg_right} onSubmit={handleSubmit}>
          <p className={styles.title}>Avaliação</p>
          <InputSelect 
            color="#1A1A1A"
            text="Competência 1 - Domínio da norma culta"
            value={comp01}
            onChange={(e) => setComp01(Number(e.target.value))}
            options={[
              { value: 0, label: "Competência 01: 0" },
              { value: 40, label: "Competência 01: 40" },
              { value: 80, label: "Competência 01: 80" },
              { value: 120, label: "Competência 01: 120" },
              { value: 160, label: "Competência 01: 160" },
              { value: 200, label: "Competência 01: 200" }
            ]}
          />

          <InputSelect 
            color="#1A1A1A"
            text="Competência 02 - Compreensão da proposta"
            value={comp02}
            onChange={(e) => setComp02(Number(e.target.value))}
            options={[
              { value: 0, label: "Competência 02: 0" },
              { value: 40, label: "Competência 02: 40" },
              { value: 80, label: "Competência 02: 80" },
              { value: 120, label: "Competência 02: 120" },
              { value: 160, label: "Competência 02: 160" },
              { value: 200, label: "Competência 02: 200" }
            ]}
          />

          <InputSelect 
            color="#1A1A1A"
            text="Competência 03 - Argumentação"
            value={comp03}
            onChange={(e) => setComp03(Number(e.target.value))}
            options={[
              { value: 0, label: "Competência 03: 0" },
              { value: 40, label: "Competência 03: 40" },
              { value: 80, label: "Competência 03: 80" },
              { value: 120, label: "Competência 03: 120" },
              { value: 160, label: "Competência 03: 160" },
              { value: 200, label: "Competência 03: 200" }
            ]}
          />

          <InputSelect 
            color="#1A1A1A"
            text="Competência 04 - Coesão Textual"
            value={comp04}
            onChange={(e) => setComp04(Number(e.target.value))}
            options={[
              { value: 0, label: "Competência 04: 0" },
              { value: 40, label: "Competência 04: 40" },
              { value: 80, label: "Competência 04: 80" },
              { value: 120, label: "Competência 04: 120" },
              { value: 160, label: "Competência 04: 160" },
              { value: 200, label: "Competência 04: 200" }
            ]}
          />

          <InputSelect 
            color="#1A1A1A"
            text="Competência 05 - Proposta de Intervenção"
            value={comp05}
            onChange={(e) => setComp05(Number(e.target.value))}
            options={[
              { value: 0, label: "Competência 05: 0" },
              { value: 40, label: "Competência 05: 40" },
              { value: 80, label: "Competência 05: 80" },
              { value: 120, label: "Competência 05: 120" },
              { value: 160, label: "Competência 05: 160" },
              { value: 200, label: "Competência 05: 200" }
            ]}
          />

          <DetailsCard  
            title="Nota final"
            content={comp01 + comp02 + comp03 + comp04 + comp05}
            bg_color="#1F1F1F"
            text_size="16px"
          />

          <div className={styles.feedback}>
            <p className={styles.feedback_text}>Feedback</p>
            <textarea 
              className={styles.feedback_input} 
              placeholder="Deixe um feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.correcao_file_box}>
            <p className={styles.correcao_file_text}>Selecione o arquivo da correção</p>
            <input 
              className={styles.correcao_file} 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <Button 
            text_size="20px" 
            text_color="#E0E0E0" 
            padding_sz="10px" 
            bg_color="#DA9E00"
            isLoading={isLoading}
          ><i class="fa-regular fa-circle-check"></i> ENVIAR CORREÇÃO</Button>

          <Message 
            text={formMessage ? formMessage.text : ""} 
            type={formMessage ? formMessage.type : ""} 
          />
        </form>
      </div>
    </div>
  )
}

export default CorrigirRedacao