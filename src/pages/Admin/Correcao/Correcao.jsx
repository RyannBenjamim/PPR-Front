import styles from "./styles.module.css"
import Title from "../../../components/Title/Title"
import Loading from "../../../components/Loading/Loading"
import fetchData from "../../../utils/fetchData"
import InfoCard from "../../../components/InfoCard/InfoCard"
import Pagination from "../../../components/Pagination/Pagination"
import Button from "../../../components/Button/Button"
import Message from "../../../components/Message/Message"
import useUseful from "../../../utils/useUseful"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Correcao = () => {
  const [redacoesPendentes, setRedacoesPendentes] = useState([])
  const [redacoesCorrigidas, setRedacoesCorrigidas] = useState([])
  const [isLoading, setIsLoading] = useState(true) 
  const [modalIsClicked, setModalIsClicked] = useState(false)
  const [modalData, setModalData] = useState({})

  const itemsPerPage = 5
  const [currentPagePen, setCurrentPagePen] = useState(1)
  const [currentPageCorr, setCurrentPageCorr] = useState(1)
  
  const indexOfLastItem = currentPagePen * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentRedacoesPen = redacoesPendentes.slice(indexOfFirstItem, indexOfLastItem)

  const indexOfLastItemCorr = currentPageCorr * itemsPerPage
  const indexOfFirstItemCorr = indexOfLastItemCorr - itemsPerPage
  const currentRedacoesCorr = redacoesCorrigidas.slice(indexOfFirstItemCorr, indexOfLastItemCorr)

  const { brasilFormatData } = useUseful()

  useEffect(() => {
    const getData = async () => {
      try {
        const { getRedacoes } = fetchData() 
        const pendentesResponse = await getRedacoes(false, false, true)
        const corrigidasResponse = await getRedacoes(false, true)

        setRedacoesPendentes(pendentesResponse)
        setRedacoesCorrigidas(corrigidasResponse)
      } catch (error) {
        console.error("Erro ao buscar redações:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={`${modalIsClicked ? styles.modal_details_bg : styles.modal_details_bg_closed}`}>
        <div className={styles.modal_details}>

          <div className={styles.header}>
            <p className={styles.title}>{modalData?.titulo}</p>
            <div className={styles.modal_button} onClick={() => setModalIsClicked(false)}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.infos}>
            <p className={styles.author}>{`Autor: ${modalData?.usuario?.nome}`}</p>
            <p className={styles.data}>{`Data de envio: ${brasilFormatData(modalData?.data)}`}</p>
            <p className={styles.data}>{`Data da correção: ${brasilFormatData(modalData?.correcao?.data)}`}</p>
          </div>

          <div className={styles.notes_box}>
            <p className={styles.notes_title}>Notas:</p>
            <div className={styles.notes}>
              <p>{`Competência 01: ${modalData?.correcao?.competencia01}`}</p>
              <p>{`Competência 02: ${modalData?.correcao?.competencia02}`}</p>
              <p>{`Competência 03: ${modalData?.correcao?.competencia03}`}</p>
              <p>{`Competência 04: ${modalData?.correcao?.competencia04}`}</p>
              <p>{`Competência 05: ${modalData?.correcao?.competencia05}`}</p>
            </div>
          </div>

          <div className={styles.final_note}>{`Nota final: ${modalData?.correcao?.nota}`}</div>

          <div className={styles.feedback}>
            <p className={styles.feedback_text}>Feedback:</p>
            <div className={styles.feedback_content}>
              <p>{modalData?.correcao?.feedback}</p>
            </div>
          </div>

          <div className={styles.buttons}>
            <Link to={`http://localhost:3000/redacoes/download/${modalData?.id}`}>
              <Button 
                text_size="20px" 
                text_color="#E0E0E0" 
                padding_sz="10px" 
                bg_color="#DA9E00"
              ><i className="fa-solid fa-download"></i> BAIXAR REDAÇÃO</Button>
            </Link>
            <Link to={`http://localhost:3000/correcoes/download/${modalData?.correcao?.id}`}>
              <Button 
                text_size="20px" 
                text_color="#E0E0E0" 
                padding_sz="10px" 
                bg_color="#DA9E00"
              ><i className="fa-solid fa-download"></i> BAIXAR CORREÇÃO</Button>
            </Link>
          </div>

        </div>
      </div>

      <Title title="Correção" />
      <div className={styles.main_content}>
        <div className={styles.bg_left}>
          <p className={styles.title}>Redações Pendentes</p>
          {isLoading ? (
            <div className={styles.loading}><Loading /></div>
          ) : redacoesPendentes.length === 0 ? (
            <Message 
              text="Nenhuma redação pendente encontrada." 
              text_color="#E0E0E0"
              marginTop="30px"
            />
          ) : (
            <>
              <div className={styles.redacoes_container}>
                {currentRedacoesPen.map((redacao) => (
                  <InfoCard 
                    key={redacao.id}
                    title={redacao.titulo} 
                    subtitle={redacao?.usuario?.nome} 
                    link={redacao.id}
                  />
                ))}
              </div>
              <div className={styles.pagination}>
                <Pagination
                  currentPage={currentPagePen}
                  totalItems={redacoesPendentes.length}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPagePen}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.bg_right}>
          <p className={styles.title}>Redações Corrigidas</p>
          {isLoading ? (
            <div className={styles.loading}><Loading /></div>
          ) : redacoesCorrigidas.length === 0 ? (
            <Message 
              text="Nenhuma redação corrigida encontrada." 
              text_color="#E0E0E0"
              marginTop="30px"
            />
          ) : (
            <>
              <div className={styles.redacoes_container}>
                {currentRedacoesCorr.map((redacao) => (
                  <InfoCard 
                    key={redacao.id}
                    title={redacao.titulo} 
                    subtitle={redacao?.usuario?.nome} 
                    infoCardOnClick={() => {
                      setModalData(redacao)
                      setModalIsClicked(true)
                    }}
                  />
                ))}
              </div>
              <div className={styles.pagination}>
                <Pagination
                  currentPage={currentPageCorr}
                  totalItems={redacoesCorrigidas.length}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPageCorr}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Correcao

