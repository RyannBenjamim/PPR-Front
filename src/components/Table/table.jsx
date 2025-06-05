import { useState } from "react";
import styles from "./style.module.css"; // Importando o CSS module
import RegistrarPagamentoModal from "../modal/modalPagamento/registrarPagamentoModal";

const Tabela = ({ dados }) => {
  const [search, setSearch] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const getStatusClass = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === "pago") return styles.status_paid;
    if (normalized === "pendente") return styles.status_pending;
    if (normalized === "em atraso") return styles.status_overdue;
    return normalized;
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const dadosFiltrados = dados.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.table_container}>
      <div className={styles.table_header}>
        <h1>Controle de Pagamentos:</h1>
        <div className={styles.search_container}>
          <input
            type="text"
            placeholder="Pesquisa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>
            <i className="fas fa-filter"></i>
          </button>
        </div>
      </div>

      <div className={styles.table_scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Turma</th>
              <th>Data de Vencimento</th>
              <th>Data de Pagamento</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((row) => (
              <tr key={row.id}>
                <td>{row.nome}</td>
                <td>{row.turma}</td>
                <td>{formatarData(row.dataVencimento)}</td>
                <td>{formatarData(row.dataPagamento)}</td>
                <td>{row.valor}</td>
                <td className={styles.status}>
                  <span className={`${styles.status} ${getStatusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => setMostrarModal(true)}
          className={`${styles.button} ${styles.button_register}`}
        >
          REGISTRAR PAGAMENTO
        </button>
        <button className={`${styles.button} ${styles.button_export}`}>
          Exportar Relatório
        </button>
      </div>
      {mostrarModal && (
        <RegistrarPagamentoModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
};

export default Tabela;
