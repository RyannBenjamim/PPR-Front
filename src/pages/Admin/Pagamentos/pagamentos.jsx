import styles from "../Pagamentos/Pagamentos.module.css";
import Card from "../../../components/CardPagamento/Card";
import Tabela from "../../../components/Table/table";
import Title from "../../../components/Title/Title";
import { VictoryPie } from "victory";
import { VictoryTheme } from "victory";
import { useEffect, useState } from "react";

const colors = ["#4CAF50", "#FF9800", "#F44336"]; // Verde, Laranja, Vermelho

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [totais, setTotais] = useState({
    recebido: 0,
    pendente: 0,
    atrasado: 0,
  });

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const res = await fetch("http://localhost:3000/pagamentos");
        const json = await res.json();
        const pagamentos = json.data;

        const usuariosMap = {};

        const pagamentosComUsuario = await Promise.all(
          pagamentos.map(async (item) => {
            if (!usuariosMap[item.usuarioId]) {
              const resUsuario = await fetch(`http://localhost:3000/usuarios/${item.usuarioId}`);
              const usuarioJson = await resUsuario.json();
              const usuarioData = usuarioJson.data;

              usuariosMap[item.usuarioId] = {
                nome: usuarioData.nome,
                turma: usuarioData.turmaId
              };

              const resTurma = await fetch(`http://localhost:3000/turmas/${usuarioData.turmaId}`);
              const turmaJson = await resTurma.json();
              const turmaData = turmaJson.data;

              usuariosMap[item.usuarioId].turma = turmaData.nome;
            }

            const usuario = usuariosMap[item.usuarioId];

            return {
              ...item,
              nome: usuario.nome,
              turma: usuario.turma,
              status: item.dataPagamento ? "Pago" : "Pendente",
            };
          })
        );

        const hoje = new Date();
        let recebido = 0;
        let pendente = 0;
        let atrasado = 0;

        const pagamentosAtualizados = pagamentosComUsuario.map((pagamento) => {
          const vencimento = new Date(pagamento.dataVencimento);

          if (pagamento.dataPagamento) {
            recebido += pagamento.valor;
            return { ...pagamento, status: "Pago" };
          } else if (vencimento < hoje) {
            atrasado += pagamento.valor;
            return { ...pagamento, status: "Atrasado" };
          } else {
            pendente += pagamento.valor;
            return { ...pagamento, status: "Pendente" };
          }
        });

        setPagamentos(pagamentosAtualizados);
        setTotais({ recebido, pendente, atrasado });

      } catch (err) {
        console.error("Erro ao buscar dados de pagamentos e usuários:", err);
      }
    };

    fetchPagamentos();
  }, []);

  const dadosGrafico = [
    { x: "Pago", y: totais.recebido },
    { x: "Pendente", y: totais.pendente },
    { x: "Em Atraso", y: totais.atrasado },
  ];

  return (
    <div className={styles.container}>
      <Title title="Pagamentos" />
      <div className={styles.containerCard}>
        <div className={styles.containerGrafico}>
          <VictoryPie
            data={dadosGrafico}
            theme={VictoryTheme.material}
            colorScale={colors}
            innerRadius={40}
            padAngle={5}
            labels={({ datum }) =>
              `${datum.x}\n${((datum.y /
                (totais.recebido + totais.pendente + totais.atrasado || 1)) * 100).toFixed(1)}%`
            }
            style={{
              labels: {
                fill: "#f5fffb",
                fontSize: 13,
                fontWeight: "bold",
              },
            }}
          />
        </div>
        <Card label="Total Recebido" value={`R$ ${totais.recebido.toFixed(2)}`} />
        <Card label="Total Pendente" value={`R$ ${totais.pendente.toFixed(2)}`} />
        <Card label="Total Atrasado" value={`R$ ${totais.atrasado.toFixed(2)}`} />
      </div>
      <div>
        <Tabela dados={pagamentos} />
      </div>
    </div>
  );
};

export default Pagamentos;
