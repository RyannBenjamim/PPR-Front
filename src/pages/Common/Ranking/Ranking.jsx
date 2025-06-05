import styles from "./styles.module.css"
import Title from "../../../components/Title/Title"
import { useState, useEffect } from "react"
import RankingTabela  from "../../../components/RankingTabela/RankingTabela"
import fetchData from "../../../utils/fetchData"
import defaultProfilePicture from '../../../images/Defalult_profile_picture.jpg';


  const RankingAlunos = () => {
  const [ranking, setRanking] = useState([])
   useEffect(() => {
    const getData = async () => {
      const { getRanking } = fetchData() 
      const response = await getRanking()
      setRanking(response)
      console.log(response)
    }
  
    getData()
  }, [])
  
  return (
    <div className={styles.container}>
      <Title title="Ranking de Alunos" />

      <div className={styles.main_content}>
        <div className={styles.podium} role="region" aria-label="Pódio dos três melhores alunos">          <div className={styles.position_container}>
            <i className={`fa-solid fa-crown ${styles.crown_silver}`}></i>
            <h2>2º</h2>
            <img 
              className={styles.img_container} 
              src={ranking[1] ? `http://localhost:3000/usuarios/${ranking[1].id}/profile-image` : defaultProfilePicture} 
              alt="Segundo lugar" 
            />
            {ranking[1] && <h3 title={ranking[1].nome}>{ranking[1].nome}</h3>}
            {ranking[1] && <p title={`Média: ${ranking[1].media}`}>{ranking[1].media}</p>}
          </div>          <div className={styles.position_container_first}>
            <i className={`fa-solid fa-crown ${styles.crown_gold}`}></i>
            <h2>1º</h2>
            <img 
              className={styles.img_container} 
              src={ranking[0] ? `http://localhost:3000/usuarios/${ranking[0].id}/profile-image` : defaultProfilePicture} 
              alt="Primeiro lugar" 
            />
            {ranking[0] && <h3 title={ranking[0].nome}>{ranking[0].nome}</h3>}
            {ranking[0] && <p title={`Média: ${ranking[0].media}`}>{ranking[0].media}</p>}
          </div>          <div className={styles.position_container}>
            <i className={`fa-solid fa-crown ${styles.crown_bronze}`}></i>
            <h2>3º</h2>
            <img 
              className={styles.img_container} 
              src={ranking[2] ? `http://localhost:3000/usuarios/${ranking[2].id}/profile-image` : defaultProfilePicture} 
              alt="Terceiro lugar" 
            />
            {ranking[2] && <h3 title={ranking[2].nome}>{ranking[2].nome}</h3>}
            {ranking[2] && <p title={`Média: ${ranking[2].media}`}>{ranking[2].media}</p>}
          </div>
        </div>

        <RankingTabela ranking={ranking || []}/>
      </div>
    </div>
  )
}

export default RankingAlunos
