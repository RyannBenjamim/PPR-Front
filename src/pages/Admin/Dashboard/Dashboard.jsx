import styles from "../Dashboard/styles.module.css";
import Title from "../../../components/Title/Title";
import BarrasEmpilhadas from "../../../components/GraficoBarrasEmpilhadas/BarrasEmpilhadas";
import GraficoPizza from "../../../components/GraficoPizza/GraficoPizza";
import Button from "../../../components/Button/Button";
import { useState, useEffect } from "react";
import fetchData from "../../../utils/fetchData";
import GraficoBarras from "../../../components/GraficoBarras/Barra";
import Taggle from "../../../components/Taggle/Taggle";
import CardDash from "../../../components/CardDash/CardDash";

import {
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  set,
} from "date-fns";

const Dashboard = () => {
  const [IdTurma, setIdTurma] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [data, setData] = useState([]);
  const [dataTextos, setDataTextos] = useState([]);
  const [usuariosTurma, setUsuariosTurma] = useState([]);
  const [dataCompetencia, setDataCompetencia] = useState([]);
  const [correcoes, setCorrecoes] = useState([]);
  const [redacoes, setRedacoes] = useState([]);
  const [taggle, setTaggle] = useState("Análise Mensal");
  const [simulados, setSimulados] = useState([]);
  const [alunos, setAlunos] = useState([]);

  // buscar as turmas para colocar no select
  useEffect(() => {
    const getDataInicias = async () => {
      const { getTurmas, getSimulados, getAlunos } = fetchData();
      const response = await getTurmas();
      const responseSimulado = await getSimulados();
      const responseAlunos = await getAlunos();

      const options = response.map((item) => ({
        id: item.id,
        nome: item.nome,
      }));
      setTurmas(options);
      setSimulados(responseSimulado);
      setAlunos(responseAlunos);

      if (options.length > 0) {
        setIdTurma(options[0].id);
      }
    };
    getDataInicias();
  }, []);

  useEffect(() => {
    const fetchGeral = async () => {
      
      if (!IdTurma) {
        return;
      }

      const inicioDoMes = startOfMonth(new Date());
      const fimDoMes = endOfMonth(new Date());

      const { getNotaSimulados, getSimuladoByIdTurma } = fetchData();

      const responseSimulado = await getSimuladoByIdTurma(IdTurma);
      const responseNotasSimulados = await getNotaSimulados();

      const notas = responseSimulado.filter((item) => {
        const data = parseISO(item.data);
        return data >= inicioDoMes && data <= fimDoMes;
      });

      const idsSimuladosDoMes = notas.map((simulado) => simulado.id);

      console.log("Todos os simulados do mes", idsSimuladosDoMes);

      const NotasSimuladoDoMes = responseNotasSimulados
        .filter((r) => idsSimuladosDoMes.includes(r.simuladoId))
        .map((item) => ({
          usuarioId: item.usuarioId,
          competencia01: item.competencia01,
          competencia02: item.competencia02,
          competencia03: item.competencia03,
          competencia04: item.competencia04,
          competencia05: item.competencia05,
          nota: item.notaGeral,
        }));

      setDataTextos([]);
      setDataCompetencia(NotasSimuladoDoMes);
    };

    const fetchTurmaData = async () => {
      try {
        const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 0 });
        const fimSemana = endOfWeek(new Date(), { weekStartsOn: 0 });

        const { getTurmaById, getRedacoes, getCorrecoes } = fetchData();

        const turma = await getTurmaById(IdTurma);
        const redacoes = await getRedacoes();
        const correcoes = await getCorrecoes();

        setUsuariosTurma(turma.usuarios || []);
        setRedacoes(redacoes);

        const redacoesSemana = redacoes.filter((r) => {
          const dataRedacao = new Date(r.data);
          return dataRedacao >= inicioSemana && dataRedacao <= fimSemana;
        });

        const idsRedacoesEnviadas = new Set(
          redacoesSemana.map((r) => r.usuarioId)
        );
        const alunos = turma.usuarios || [];
        const produzidos = alunos.filter((aluno) =>
          idsRedacoesEnviadas.has(aluno.id)
        ).length;
        const semProducao = alunos.length - produzidos;

        setDataTextos([
          {
            name: "Produção de Textos",
            produzidos,
            semProducao,
          },
        ]);

        const dadosGraficoCompetencia = correcoes
          .filter((c) => {
            const turmaOk = c.redacao?.usuario?.turma?.id === turma.id;
            const dataRedacao = c.redacao?.data;

            if (!turmaOk || !dataRedacao) return false;

            const data = parseISO(dataRedacao);
            return isWithinInterval(data, {
              start: inicioSemana,
              end: fimSemana,
            });
          })
          .map((c) => ({
            aluno: c.redacao.usuario.nome,
            competencia01: c.competencia01,
            competencia02: c.competencia02,
            competencia03: c.competencia03,
            competencia04: c.competencia04,
            competencia05: c.competencia05,
            turma: c.redacao.usuario.turma.nome,
            nota: c.nota,
          }));

        setDataCompetencia(dadosGraficoCompetencia);
        setData([]);
      } catch (error) {
        console.log(error);
      }
    };

    if (taggle === "Análise Mensal") {
      fetchGeral();
    } else if (taggle === "Análise Semanal") {
      fetchTurmaData();
    } else {
      setDataCompetencia([]);
      setDataTextos([]);
    }
  }, [IdTurma, taggle]);

  return (
    <div className={styles.container}>
      <Title title="Dashboard" />
      <div className={styles.container_desenpenho}>
        <div className={styles.CardDashs_container}>
          <CardDash
            title="Total de alunos"
            content={alunos.length}
            titleColor="#ffffff"
            contentColor="#ffffff"
            color="#1A1A1A"
            fontSize="22px"
            
            icon={
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 19.9999C21 18.2583 19.3304 16.7767 17 16.2275M15 20C15 17.7909 12.3137 16 9 16C5.68629 16 3 17.7909 3 20M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5M9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <CardDash
            color={"#1A1A1A"}
            title="Total de turmas"
            content={turmas.length}
            fontSize="22px"

            icon={
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 7H17.8486C17.3511 7 17 6.49751 17 6C17 4.34315 15.6569 3 14 3C12.3431 3 11 4.34315 11 6C11 6.49751 10.6488 7 10.1513 7H8C7.44771 7 7 7.44772 7 8V10.1513C7 10.6488 6.49751 11 6 11C4.34315 11 3 12.3431 3 14C3 15.6569 4.34315 17 6 17C6.49751 17 7 17.3511 7 17.8486V20C7 20.5523 7.44771 21 8 21L20 21C20.5523 21 21 20.5523 21 20V17.8486C21 17.3511 20.4975 17 20 17C18.3431 17 17 15.6569 17 14C17 12.3431 18.3431 11 20 11C20.4975 11 21 10.6488 21 10.1513L21 8C21 7.44772 20.5523 7 20 7Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
          <CardDash
            title="Total de simulados"
            content={simulados.length}
            color={"#1A1A1A"}
            fontSize="22px"
            icon={
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.89761 18.1618C8.28247 19.3099 10.0607 20 12.0001 20C16.4184 20 20.0001 16.4183 20.0001 12C20.0001 11.431 19.9407 10.8758 19.8278 10.3404M6.89761 18.1618C5.12756 16.6944 4.00014 14.4789 4.00014 12C4.00014 7.58172 7.58186 4 12.0001 4C15.8494 4 19.0637 6.71853 19.8278 10.3404M6.89761 18.1618C8.85314 17.7147 11.1796 16.7828 13.526 15.4281C16.2564 13.8517 18.4773 12.0125 19.8278 10.3404M6.89761 18.1618C4.46844 18.7171 2.61159 18.5243 1.99965 17.4644C1.36934 16.3726 2.19631 14.5969 3.99999 12.709M19.8278 10.3404C21.0796 8.79041 21.5836 7.38405 21.0522 6.46374C20.5134 5.53051 19.0095 5.26939 16.9997 5.59929"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />
        </div>

        <div className={styles.selects}>
          <div className={styles.taggle}>
            <Taggle
              data1="Análise Mensal"
              data2="Análise Semanal"
              setTaggle={setTaggle}
            />
          </div>
          <div className={styles.select_turma}>
            <select
              value={IdTurma}
              onChange={(e) => setIdTurma(e.target.value)}
            >
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.container_graficos}>
          <div className={styles.left}>
            <h2>Análise de Desempenho por competências</h2>
            <BarrasEmpilhadas data={dataCompetencia} />
            {Array.isArray(dataTextos) && dataTextos.length > 0 && (
              <GraficoBarras
                data={dataTextos}
                titulo={"Análise de Textos Produzidos"}
              />
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.grafico_pizza}>
              <GraficoPizza
                data={dataCompetencia}
                titulo={"Análise de Desempenho por Notas"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
