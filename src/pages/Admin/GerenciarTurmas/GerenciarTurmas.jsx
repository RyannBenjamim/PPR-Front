import styles from "./styles.module.css";
import Title from "../../../components/Title/Title";
import InfoCard from "../../../components/InfoCard/InfoCard";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import axios from "axios";
import fetchData from "../../../utils/fetchData";
import useUseful from "../../../utils/useUseful";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from "../../../components/Pagination/Pagination";
import Message from "../../../components/Message/Message";
import Loading from "../../../components/Loading/Loading";

const GerenciarTurmas = () => {
  const [formMessage, setFormMessage] = useState(null);
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState([]);
  const { brasilFormatData } = useUseful();
  const [isLoading, setIsLoading] = useState(false); 
  const [isLoadingData, setIsLoadingData] = useState(true); 
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTurmas = turmas.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/turmas", { "nome": turma });

      setFormMessage({
        type: "success",
        text: `Turma ${response.data.data.nome} criada com sucesso.`
      });

      setTurma("");
      await getData();
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error.response.data.error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsLoadingData(true);
    try {
      const { getTurmas } = fetchData();
      const response = await getTurmas();
      setTurmas(response);
    } catch (error) {
      console.error("Erro ao carregar as turmas:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const deleteTurma = async (id) => {
    const confirmation = confirm("Você tem certeza que deseja excluir essa turma?");
    if (!confirmation) {
      navigate("/admin/gerenciar-turmas");
      return;
    }

    await axios.delete(`http://localhost:3000/turmas/${id}`);
    await getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <Title title="Gerenciar turmas" />

      <div className={styles.main_content}>
        <div className={styles.bg_left}>
          {isLoadingData ? (
            <div className={styles.loading}><Loading /></div>
          ) : (
            <>
              <p className={styles.title}>Suas turmas</p>

              {turmas.length === 0 ? (
                <Message 
                  text="Nenhuma turma cadastrada." 
                  text_color="#E0E0E0"
                  marginTop="30px"
                />
              ) : (
                <>
                  <div className={styles.turmas_container}>
                    {currentTurmas.map((turma) => (
                      <InfoCard
                        key={turma.id}
                        title={turma.nome}
                        subtitle={brasilFormatData(turma.dataCriacao)}
                        link={turma.id}
                        onClick={() => deleteTurma(turma.id)}
                      />
                    ))}
                  </div>

                  <div className={styles.pagination}>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={turmas.length}
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
          <p className={styles.form_title}>Cadastre uma nova turma</p>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Nome da turma"
              color="#1A1A1A"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            >
              <i className="fa-solid fa-users"></i>
            </Input>

            <Message
              text={formMessage ? formMessage.text : ""}
              type={formMessage ? formMessage.type : ""}
            />

            <Button
              text_size="20px"
              text_color="#E0E0E0"
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
  );
};

export default GerenciarTurmas;
