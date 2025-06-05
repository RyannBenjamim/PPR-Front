import styles from "../NovaRedacao/styles.module.css";
import Title from "../../../components/Title/Title";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { useEffect, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import InfoCard from "../../../components/InfoCard/InfoCard";
import Pagination from "../../../components/Pagination/Pagination";
import Loading from "../../../components/Loading/Loading";
import Message from "../../../components/Message/Message";
import fetchData from "../../../utils/fetchData";
import { useNavigate } from "react-router-dom";
import RedacaoModal from "../../../components/RedacaoModal/RedacaoModal";
import useUseful from "../../../utils/useUseful";

const Novaredacao = () => {
  const [fileName, setFilesName] = useState("Nenhum arquivo enviado");
  const [tema, setTema] = useState("");
  const [formMessage, setFormMessage] = useState(null);
  const [fileBlob, setFileBlob] = useState(null); 
  const [search, setSearch] = useState("")  
  const [redacao, setRedacao] = useState([])
  const navigate = useNavigate()
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentredacaos = redacao.slice(indexOfFirstItem, indexOfLastItem)
  const [usuario, setUsuario] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  // Estado para o modal de redação
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRedacao, setSelectedRedacao] = useState(null);
  const { brasilFormatData } = useUseful();

  const getAlunoId = () => {
      const aluno = localStorage.getItem('user_access_data')
      const {id} = JSON.parse(aluno)
      return id
  }

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFilesName(file.name);

    if (!file) return;

    if (file.type.startsWith("image/")) {
      try {
        const compressedImage = await imageCompression(file, {
          maxSizeMB: 5,
          useWebWorker: true,
        });

        const imageData = await compressedImage.arrayBuffer();
        const pdfDoc = await PDFDocument.create();
        const imageExit = file.type.includes("png")
          ? await pdfDoc.embedPng(imageData)
          : await pdfDoc.embedJpg(imageData);

        const page = pdfDoc.addPage([
          imageExit.width * 0.7,
          imageExit.height * 0.7,
        ]);
        page.drawImage(imageExit, {
          x: 0,
          y: 0,
          width: imageExit.width * 0.7,
          height: imageExit.height * 0.7,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        setFileBlob(blob);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    } else if (file.type === "application/pdf") {
      setFileBlob(file);
    } else {
      alert("Formato de arquivo não aceito");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });  const handleSubmit = async () => {
    if (!fileBlob || !tema.trim()) {
      setFormMessage({
        type: "error",
        text: "Preencha o tema e envie um arquivo válido."
      });
      return;
    }
    
    // Verificar tamanho do arquivo (limite de 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes
    if (fileBlob.size > MAX_FILE_SIZE) {
      setFormMessage({
        type: "error",
        text: "O arquivo é muito grande. O tamanho máximo permitido é 10MB."
      });
      return;
    }

    const alunoId = getAlunoId();
      // Criar um novo FormData a cada envio para evitar acumular dados
    const formData = new FormData();
    formData.append("titulo", tema);
    formData.append("file", fileBlob, fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
    // Adicionar o ID do aluno no próprio formData para garantir que o backend o receba
    formData.append("usuarioId", alunoId);    try { 
      const response = await axios.post(`http://localhost:3000/redacoes/${alunoId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });      // Limpar o formulário após o sucesso
      setFormMessage({
        type: "success",
        text: `Redação enviada com sucesso!`,
      });
      setTema("");
      setFilesName("Nenhum arquivo enviado");
      setFileBlob(null);
    } catch (error) {
      console.error(error);    // Melhorar a exibição de mensagens de erro
    let errorMessage = "Erro ao enviar redação.";
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data?.error || "Erro de validação: Verifique se os dados enviados estão corretos.";
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorMessage = "Você não tem permissão para enviar esta redação.";
      } else if (error.response.status === 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else {
        errorMessage = error.response.data?.error || "Erro desconhecido ao enviar a redação.";
      }
    }
    
    setFormMessage({
      type: "error",
      text: errorMessage,
    });
    }
  };
  
  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR",{
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };  useEffect(()=>{
    const getData = async() =>{
      try {        
        const alunoId = getAlunoId();
        const { getRedacoesUser } = fetchData();
        const redacoesData = await getRedacoesUser(alunoId);
        if (redacoesData) {
          // Buscar as correções para cada redação
          const options = await Promise.all(
            redacoesData.map(async item => {
              let correcao = null;
              try {
                // Verificar se a redação já tem correção
                const correcaoResponse = await axios.get(`http://localhost:3000/correcoes/redacao/${item.id}`);
                if (correcaoResponse.data && correcaoResponse.data.data) {
                  correcao = correcaoResponse.data.data;
                }
              } catch (error) {
                // Sem correção disponível
                console.log("Redação sem correção:", item.id);
              }
              return {
                id: item.id,
                titulo: item.titulo,
                status: item.status,
                data: item.data,
                usuarioId: item.usuarioId,
                correcao: correcao
              };
            })
          ).then(result => result.sort((a, b) => new Date(b.data) - new Date(a.data))); // Ordena por data decrescente
            setRedacao(options);
        } else {
          console.error('Nenhuma redação encontrada');
          setRedacao([]);
        }      } catch (error) {
        console.error('Erro ao buscar redações:', error.message);
        setRedacao([]);
      }
    }
    getData()
  }, [formMessage]) // Atualizar quando enviar uma nova redação
  useEffect(() => {
    const getData  = async () => {
      const {getAlunoById} = fetchData()
      const alunoId = getAlunoId();
      const response = await getAlunoById(alunoId)
      setUsuario(response)
    }
    getData()
  },[])

  /*
  const deleteRedacao = async (id) => {
    const confirmation = confirm("Tem certeza que deseja excluir essa redacao?")
    if (!confirmation) {
      navigate("/admin/nova-redacao")
      return
    }
    const alunoId = getAlunoId();
    await axios.delete(`http://localhost:3000/redacoes/${id}?userId=${alunoId}`)
    navigate("/admin/nova-redacao")
  }
  */

  // Função para abrir o modal com a redação selecionada
  const handleRedacaoClick = (redacao) => {
    setSelectedRedacao(redacao);
    setModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRedacao(null);
  };

  // Função para verificar se a tela é mobile
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Adicionar listener para redimensionamento da janela
  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [checkIfMobile]);

  return (
    <div className={styles.container}>
      {!isMobile ? (
        // Layout desktop original
        <>
          <Title title="Nova Redação" />
          <div className={styles.main_content}>
            <div className={styles.bg_left}>
              {redacao.length === 0 ? <div className={styles.loading}><Loading /></div> :
                <> 
                  <p className={styles.form_title}>Redações enviadas</p>
                  <Input
                    type="text"
                    placeholder="Pesquise por redacao"
                    color="#1A1A1A" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </Input>                  <div className={styles.redacao_container}>
                    {currentredacaos.map((redacao) => (
                      <div key={redacao.id} className={styles.card_wrapper} onClick={() => handleRedacaoClick(redacao)}>
                        <InfoCard
                          key={redacao.id}
                          img="https://static.vecteezy.com/system/resources/previews/028/049/250/non_2x/terms-icon-design-vector.jpg"
                          title={redacao.titulo}
                          subtitle={formatarData(redacao.data)}
                          link="#"
                          button={false}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.pagination}>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={redacao.length}
                      itemsPerPage={itemsPerPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </>
              }
            </div>
            <div className={styles.bg_right}>
              <p className={styles.form_title}>Upload Da Nova Redação</p>
              <Input
                type="text"
                placeholder="Tema da nova redação"
                color="#1A1A1A"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
              >
                <i className="fa-solid fa-pen"></i>
              </Input>
              <div className={styles.upload_container}>
                {/* Substituir a área de upload original pelo novo estilo */}
                <div {...getRootProps()} className={styles.desktop_upload_area}>
                  <input {...getInputProps()} />
                  <svg className={styles.desktop_upload_icon} viewBox="0 0 309 197">
                    <path
                      d="M69.369 196.821C31.0715 196.821 0 168.484 0 133.557C0 105.967 19.3655 82.5065 46.3423 73.8517C46.2942 72.6655 46.246 71.4793 46.246 70.2931C46.246 31.4562 80.7378 0 123.323 0C151.889 0 176.795 14.1465 190.138 35.2344C197.461 30.7532 206.325 28.1172 215.815 28.1172C241.346 28.1172 262.061 47.0085 262.061 70.2931C262.061 75.653 260.953 80.7492 258.978 85.494C287.111 90.6781 308.307 113.392 308.307 140.586C308.307 171.647 280.703 196.821 246.645 196.821H69.369ZM107.426 101.486C102.897 105.615 102.897 112.293 107.426 116.379C111.954 120.465 119.276 120.509 123.756 116.379L142.544 99.2451L142.592 158.16C142.592 164.003 147.746 168.703 154.153 168.703C160.56 168.703 165.715 164.003 165.715 158.16V99.2451L184.502 116.379C189.03 120.509 196.353 120.509 200.833 116.379C205.313 112.249 205.361 105.571 200.833 101.486L162.295 66.3391C157.766 62.2094 150.444 62.2094 145.964 66.3391L107.426 101.486Z"
                      fill="#474747"
                    />
                  </svg>
                  <p className={styles.desktop_upload_text}>
                    Clique para selecionar um arquivo
                  </p>
                  <p className={styles.desktop_upload_text}>
                    (PDF, JPG ou PNG)
                  </p>
                </div>
                
                {/* Exibir arquivo selecionado com estilo igual ao mobile */}
                {fileBlob && (
                  <div className={styles.desktop_file_selected}>
                    <i className={`fa-solid fa-file-pdf ${styles.desktop_file_icon}`}></i>
                    <span className={styles.desktop_file_name}>{fileName}</span>
                    <i 
                      className={`fa-solid fa-times ${styles.desktop_file_remove}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilesName("Nenhum arquivo enviado");
                        setFileBlob(null);
                      }}
                    ></i>
                  </div>
                )}
                
                <div className={styles.info_container}>
                  <Message 
                    text={formMessage ? formMessage.text : ""} 
                    type={formMessage ? formMessage.type : ""} 
                  />
                </div>
                
                <div className={styles.submit_button}>
                  <button 
                    className={styles.desktop_button}
                    onClick={handleSubmit}
                    disabled={!fileBlob || !tema.trim()}
                  >
                    Enviar redação
                    <i className={`fa-solid fa-paper-plane ${styles.desktop_button_icon}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Nova interface mobile com o componente Title
        <div className={styles.mobile_container}>
          {/* Substituindo o header customizado pelo componente Title */}
          <Title title="Nova Redação" />
          
          <div className={styles.mobile_content}>
            <div className={styles.mobile_form}>
              <h2 className={styles.mobile_form_title}>Envie sua redação</h2>
              
              <div className={styles.mobile_input_container}>
                <Input
                  type="text"
                  placeholder="Qual o tema da redação?"
                  color="#1A1A1A"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                >
                  <i className="fa-solid fa-pen"></i>
                </Input>
              </div>
              
              <div {...getRootProps()} className={styles.mobile_upload_area}>
                <input {...getInputProps()} />
                <svg className={styles.mobile_upload_icon} viewBox="0 0 309 197">
                  <path
                    d="M69.369 196.821C31.0715 196.821 0 168.484 0 133.557C0 105.967 19.3655 82.5065 46.3423 73.8517C46.2942 72.6655 46.246 71.4793 46.246 70.2931C46.246 31.4562 80.7378 0 123.323 0C151.889 0 176.795 14.1465 190.138 35.2344C197.461 30.7532 206.325 28.1172 215.815 28.1172C241.346 28.1172 262.061 47.0085 262.061 70.2931C262.061 75.653 260.953 80.7492 258.978 85.494C287.111 90.6781 308.307 113.392 308.307 140.586C308.307 171.647 280.703 196.821 246.645 196.821H69.369ZM107.426 101.486C102.897 105.615 102.897 112.293 107.426 116.379C111.954 120.465 119.276 120.509 123.756 116.379L142.544 99.2451L142.592 158.16C142.592 164.003 147.746 168.703 154.153 168.703C160.56 168.703 165.715 164.003 165.715 158.16V99.2451L184.502 116.379C189.03 120.509 196.353 120.509 200.833 116.379C205.313 112.249 205.361 105.571 200.833 101.486L162.295 66.3391C157.766 62.2094 150.444 62.2094 145.964 66.3391L107.426 101.486Z"
                    fill="#474747"
                  />
                </svg>
                <p className={styles.mobile_upload_text}>
                  Toque para selecionar um arquivo
                </p>
                <p className={styles.mobile_upload_text}>
                  (PDF, JPG ou PNG)
                </p>
              </div>
              
              {fileBlob && (
                <div className={styles.mobile_file_selected}>
                  <i className={`fa-solid fa-file-pdf ${styles.mobile_file_icon}`}></i>
                  <span className={styles.mobile_file_name}>{fileName}</span>
                  <i 
                    className={`fa-solid fa-times ${styles.mobile_file_remove}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilesName("Nenhum arquivo enviado");
                      setFileBlob(null);
                    }}
                  ></i>
                </div>
              )}
              
              <div className={styles.mobile_message_container}>
                {formMessage && (
                  <div className={formMessage.type === "success" ? styles.mobile_success : styles.mobile_error}>
                    <i className={`fa-solid ${formMessage.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} ${styles.mobile_message_icon}`}></i>
                    <span className={styles.mobile_message_text}>{formMessage.text}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.mobile_submit_button}>
                <button 
                  className={styles.mobile_button}
                  onClick={handleSubmit}
                  disabled={!fileBlob || !tema.trim()}
                >
                  Enviar redação
                  <i className={`fa-solid fa-paper-plane ${styles.mobile_button_icon}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para visualização da redação */}
      <RedacaoModal 
        redacao={selectedRedacao}
        isOpen={modalOpen}
        onClose={closeModal}
        activeTab="minhas"
        brasilFormatData={formatarData}
      />
    </div>
  );
}

export default Novaredacao;