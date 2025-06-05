"use client"

import styles from "./styles.module.css"
import { useState, useEffect } from 'react';
import Card from '../../../components/Card/Card';
import Title from '../../../components/Title/Title';
import BTN from '../../../components/Button/Button';
import fetchData from "../../../utils/fetchData";

const Inicio = () => {
  const [redacoes, setRedacoes] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [redacoesCorrigidas, setRedacoesCorrigidas] = useState([]);


const getAlunoId = () => {
    const aluno = localStorage.getItem('user_access_data')
    const {id} = JSON.parse(aluno)
    return id 
}

const [isDownloading, setIsDownloading] = useState(false);

const handleDownloadProposta = async () => {
  try {
    setIsDownloading(true);
    const response = await fetch('http://localhost:3000/propostas/download', {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error('Falha no download');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'proposta-da-semana.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); 
    setIsDownloading(false);
  } catch (error) {
    console.error("Erro ao baixar proposta:", error);
    alert("Houve um erro ao baixar a proposta. Por favor, tente novamente mais tarde.");
    setIsDownloading(false);
  }
};



  useEffect(() => {
    const getData = async () => {
      const { getRedacoes, getAlunoById} = fetchData() 
      const alunoId = getAlunoId()
      const response = await getRedacoes(alunoId)
      setRedacoes(response)
      const responseCorrigidas = await getRedacoes(alunoId,true)
      setRedacoesCorrigidas(responseCorrigidas)
    }
    getData()
  },[])

    useEffect(()=>{
      const getData = async () => {
        const {getAlunoById} = fetchData()
        const response = await getAlunoById(getAlunoId())
        setUsuario(response)  
      }
      getData()
    },[])

  return (
    <div className={styles.container}>
      <Title title="Início" />
        <div className={styles.main_content}>
            <Card 
          title={`Olá, ${usuario.nome} !`} 
          content="Aprimore suas habilidades de redação com feedback personalizado" 
          variant="default"
          actions={
            <>
            <div className={styles.button}>            <BTN
            bg_color="#FFF5CC" 
            text_size={{default: "20px", mobile: "20px"}}
            text_color="#DA9E00"
            padding_sz={{default: "10px", mobile: "8px"}}
            onClick={() => window.location.href = '/aluno/nova-redacao'} 
            className={styles.responsive_button}
            > 
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.button_icon}>
            <path d="M14.1677 0.732422L12.2771 2.62305L17.3552 7.70117L19.2458 5.81055C20.2224 4.83398 20.2224 3.25195 19.2458 2.27539L17.7068 0.732422C16.7302 -0.244141 15.1482 -0.244141 14.1716 0.732422H14.1677ZM11.3943 3.50586L2.28879 12.6152C1.88254 13.0215 1.58567 13.5254 1.4216 14.0762L0.0387918 18.7754C-0.0588645 19.1074 0.0309793 19.4629 0.273167 19.7051C0.515354 19.9473 0.870823 20.0371 1.19895 19.9434L5.89817 18.5605C6.44895 18.3965 6.95285 18.0996 7.3591 17.6934L16.4724 8.58398L11.3943 3.50586Z" fill="#DA9E00"/>
            </svg>
            <span className={styles.button_text}>Criar Nova Redação</span>
            </BTN>

            </div>
            </>
          }
            />
             {/*STATUS DAS REDACOES*/}
        <div className={styles.status_container}>
          
          <Card 
            title="Total de redações" 
            content={redacoes.length} 
            variant="default"
            icon={
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="10" fill="#FFF5CC"/>
              <path d="M26.1831 12.7332L24.2904 14.6257L29.3741 19.709L31.2668 17.8164C32.2444 16.8389 32.2444 15.2552 31.2668 14.2777L29.726 12.7332C28.7484 11.7556 27.1647 11.7556 26.187 12.7332H26.1831ZM23.4067 15.5094L14.2913 24.628C13.8846 25.0346 13.5874 25.5391 13.4232 26.0904L12.0388 30.7944C11.9411 31.1267 12.031 31.4826 12.2735 31.725C12.5159 31.9674 12.8718 32.0574 13.2003 31.9635L17.9046 30.5793C18.456 30.4151 18.9604 30.1179 19.3671 29.7112L28.4903 20.5927L23.4067 15.5094Z" fill="#DA9E00"/>
              </svg>

            }
          />
          <Card 
            title="Avaliadas" 
            content={redacoesCorrigidas.length}
            variant="default"
            icon={
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="10" fill="#DCFCE7"/>
              <path d="M22 32C24.6522 32 27.1957 30.9464 29.0711 29.0711C30.9464 27.1957 32 24.6522 32 22C32 19.3478 30.9464 16.8043 29.0711 14.9289C27.1957 13.0536 24.6522 12 22 12C19.3478 12 16.8043 13.0536 14.9289 14.9289C13.0536 16.8043 12 19.3478 12 22C12 24.6522 13.0536 27.1957 14.9289 29.0711C16.8043 30.9464 19.3478 32 22 32ZM26.4141 20.1641L21.4141 25.1641C21.0469 25.5312 20.4531 25.5312 20.0898 25.1641L17.5898 22.6641C17.2227 22.2969 17.2227 21.7031 17.5898 21.3398C17.957 20.9766 18.5508 20.9727 18.9141 21.3398L20.75 23.1758L25.0859 18.8359C25.4531 18.4688 26.0469 18.4688 26.4102 18.8359C26.7734 19.2031 26.7773 19.7969 26.4102 20.1602L26.4141 20.1641Z" fill="#16A34A"/>
              </svg>
            }
          />

          <Card 
            title="Média de Notas" 
            content={redacoesCorrigidas.length > 0
            ? (redacoesCorrigidas.reduce((acc, redacao) => acc + (redacao.correcao?.nota || 0), 0) / redacoesCorrigidas.length).toFixed(1)
            : "0.0"} 
            variant="default"
            icon={
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="10" fill="#FFF5CC"/>
              <path d="M23.0881 12.703C22.8873 12.2734 22.4631 12 21.9973 12C21.5314 12 21.111 12.2734 20.9065 12.703L18.4711 17.8704L13.0323 18.6985C12.5778 18.7688 12.1991 19.0969 12.0589 19.546C11.9188 19.9952 12.0324 20.4912 12.3582 20.8232L16.3047 24.8501L15.373 30.5409C15.2972 31.0096 15.4866 31.4861 15.8616 31.7634C16.2365 32.0407 16.7327 32.0759 17.1417 31.8532L22.0011 29.1778L26.8604 31.8532C27.2694 32.0759 27.7656 32.0446 28.1406 31.7634C28.5155 31.4822 28.7049 31.0096 28.6291 30.5409L27.6936 24.8501L31.6402 20.8232C31.9659 20.4912 32.0833 19.9952 31.9394 19.546C31.7955 19.0969 31.4205 18.7688 30.966 18.6985L25.5234 17.8704L23.0881 12.703Z" fill="#DA9E00"/>
              </svg>
            }
          />
        </div>
        
        <div className={styles.status_container}>
        <Card 
            title="Proposta da semana" 
            content="Escreva uma redação dissertativa-argumentativa sobre o tema:" 
            variant="default"
            actions={
              <>  
              <div className={styles.button}>
              <BTN
              bg_color="#FFF5CC" 
              text_size={{default: "20px", mobile: "20px"}}
              text_color="#DA9E00"
              padding_sz={{default: "10px", mobile: "8px"}}
              onClick={handleDownloadProposta}
              className={styles.responsive_button}
              isLoading={isDownloading}
              >
                {!isDownloading && (
                  <>
                    <span className={styles.button_text} style={{color: "#DA9E00"}}>Baixar detalhes da Proposta</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.button_icon}>
                    <path d="M11.25 1.25C11.25 0.558594 10.6914 0 10 0C9.30859 0 8.75 0.558594 8.75 1.25V10.7305L5.88281 7.86328C5.39453 7.375 4.60156 7.375 4.11328 7.86328C3.625 8.35156 3.625 9.14453 4.11328 9.63281L9.11328 14.6328C9.60156 15.1211 10.3945 15.1211 10.8828 14.6328L15.8828 9.63281C16.3711 9.14453 16.3711 8.35156 15.8828 7.86328C15.3945 7.375 14.6016 7.375 14.1133 7.86328L11.25 10.7305V1.25ZM2.5 13.75C1.12109 13.75 0 14.8711 0 16.25V17.5C0 18.8789 1.12109 20 2.5 20H17.5C18.8789 20 20 18.8789 20 17.5V16.25C20 14.8711 18.8789 13.75 17.5 13.75H13.5352L11.7656 15.5195C10.7891 16.4961 9.20703 16.4961 8.23047 15.5195L6.46484 13.75H2.5ZM16.875 15.9375C17.1236 15.9375 17.3621 16.0363 17.5379 16.2121C17.7137 16.3879 17.8125 16.6264 17.8125 16.875C17.8125 17.1236 17.7137 17.3621 17.5379 17.5379C17.3621 17.7137 17.1236 17.8125 16.875 17.8125C16.6264 17.8125 16.3879 17.7137 16.2121 17.5379C16.0363 17.3621 15.9375 17.1236 15.9375 16.875C15.9375 16.6264 16.0363 16.3879 16.2121 16.2121C16.3879 16.0363 16.6264 15.9375 16.875 15.9375Z" fill="#DA9E00"/>
                    </svg>
                  </>
                )}
              </BTN>

              </div>
              </>
            }
          />


          
        </div>

        <div className={styles.status_container}>
        <Card 
            title="Simulados" 
            content="Veja aqui as informações sobre os simulados realizados" 
            variant="default"
            actions={
              <>  
              <div className={styles.button}>
               <BTN
              bg_color="#FFF5CC" 
              text_size={{default: "20px", mobile: "20px"}}
              text_color="#DA9E00"
              padding_sz={{default: "10px", mobile: "8px"}}
              
              className={styles.responsive_button}
              isLoading={isDownloading}
              >
                {!isDownloading && (
                  <>
                    <span className={styles.button_text} style={{color: "#DA9E00"}}>Simulados</span>
                  </>
                )}
              </BTN>
              </div>
              </>
            }
          />
        </div>
        </div>  
      </div>
  )
}

export default Inicio