import styles from "./styles.module.css"
import { Link } from 'react-router-dom'

const InfoCard = ({ 
  img, 
  title, 
  subtitle, 
  link, 
  button_registrar = false, 
  button = true, 
  onClick = undefined,
  infoCardOnClick = undefined
}) => {
  return (
    <Link className={styles.container} to={link} onClick={infoCardOnClick}>
      {img && <img src={img} alt="foto do aluno" />}

      <div className={styles.infos}>
        <p className={styles.title}>{title}</p>
        {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {button === true ? <button className={styles.btn} onClick={onClick} >EXCLUIR</button> : null}
      {button_registrar === true ? <button className={styles.btn} onClick={onClick} >REGISTRAR NOTA</button> : null}
    </Link>
  )
}

export default InfoCard