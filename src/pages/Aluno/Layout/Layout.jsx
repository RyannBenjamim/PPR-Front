import styles from "./styles.module.css"
import { Outlet } from "react-router-dom"
import Header from "../../../components/Header/Header"
import { Link } from "react-router-dom"

import logo from "../../../images/logo02.png"
import { useState } from "react"

const links = [
  { name: "Início", icon: "fa-solid fa-house", path: "" },
  { name: "Perfil", icon: "fa-solid fa-user", path: "perfil" },
  { name: "Nova redação", icon: "fa-solid fa-pen", path: "nova-redacao" },
  { name: "Ranking", icon: "fa-solid fa-ranking-star", path: "ranking" },
  { name: "Cursos", icon: "fa-solid fa-tv", path: "cursos" },
  { name: "Configurações", icon: "fa-solid fa-gear", path: "configuracoes" },
]

const AlunoLayout = () => {
  const [isClicked, setIsClicked] = useState(false)

  const menuBtnClick = () => setIsClicked(prev => !prev)

  return (
    <div className={styles.container}>

      <aside className={styles.header_mobile}>
        <img src={logo} />

        <nav className={`${isClicked ? styles.active : styles.inactive}`}>
          {links.map((link, index) => (
            <Link key={index} to={link.path} className={styles.link_box} onClick={() => setIsClicked(false)}>
              <div className={styles.link}>
                <i className={link.icon}></i>
                <p>{link.name}</p>
              </div>
            </Link>
          ))}
          
          <Link className={styles.link_box}>
            <div className={styles.link}>
              <i class="fa-brands fa-whatsapp"></i>
              <p>Fale com o suporte</p>
            </div>
          </Link>
        </nav>

        <div className={styles.menu_btn} onClick={menuBtnClick}>
          {isClicked ? <i class="fa-solid fa-circle-xmark"></i> : <i class="fa-solid fa-bars"></i>}
        </div>
      </aside>


      <aside className={styles.sidebar}>
        <Header options={links} />
      </aside>

      <div className={styles.main_container}>
        <main className={styles.main_content}>
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default AlunoLayout
