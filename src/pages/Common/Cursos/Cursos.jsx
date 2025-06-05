import styles from "./styles.module.css"
import Title from "../../../components/Title/Title"
import { useEffect, useState } from "react"
import fetchData from "../../../utils/fetchData"
import Carousel from "../../../components/Carousel/Carousel"
import Loading from "../../../components/Loading/Loading"
import Message from "../../../components/Message/Message"

const Cursos = () => {
  const [modulos, setModulos] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { getModulos } = fetchData() 
      const response = await getModulos()
      setModulos(response)
    }
  
    getData()
  }, [])

  if (!modulos) return (
    <div className={styles.container}>
      <Title title="Cursos" />
      <div className={styles.main_content}>
        <Loading />
      </div>
    </div>
  ) 

  if (modulos.length === 0) {
    return (
      <div className={styles.container}>
        <Title title="Cursos" />
        <div className={styles.main_content}>
          <Message 
            text="Nenhum curso cadastrado." 
            text_color="#E0E0E0"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Title title="Cursos" />
      
      <div className={styles.main_content}>
        {modulos.map((modulo) => (
          <Carousel key={modulo.id} array={modulo.videos} text={modulo.nome} />
        ))}
      </div>
    </div>
  )
}

export default Cursos