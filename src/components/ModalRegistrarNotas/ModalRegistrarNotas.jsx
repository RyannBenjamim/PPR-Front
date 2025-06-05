import React, { useState } from "react";
import styles from "./styles.module.css";
import Input from "../../components/Input/Input";
import DetailsCard from "../../components/DetailsCard/DetailsCard";
import ModalFailure from "../../components/modal/modalFailure/modalFailure";
import SuccessModal from "../../components/modal/modalSucess/modalSucess";
import axios from "axios";

const ModalRegistrarNotas = ({ isOpen, onClose, aluno, nameSimulado, simuladoId }) => {
  const [notas, setNotas] = useState({
    comp1: null,
    comp2: null,
    comp3: null,
    comp4: null,
    comp5: null,
  });

  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNotaChange = (e, competencia) => {
    const valor = parseFloat(e.target.value) || 0;
    setNotas((prev) => ({
      ...prev,
      [competencia]: valor,
    }));
  };

  const notaFinal =
    notas.comp1 + notas.comp2 + notas.comp3 + notas.comp4 + notas.comp5;

  const limparCampos = () => {
    setNotas({
      comp1: null,
      comp2: null,
      comp3: null,
      comp4: null,
      comp5: null,
    });
  };

  const handleSalvar = async () => {
    try {
      await axios.post("http://localhost:3000/notaSimulado", {
        simuladoId: simuladoId,
        usuarioId: aluno?.id,
        competencia01: notas.comp1,
        competencia02: notas.comp2,
        competencia03: notas.comp3,
        competencia04: notas.comp4,
        competencia05: notas.comp5,
        notaGeral: notaFinal,
      });

      setShowSuccessModal(true); // só mostra o modal de sucesso após a resposta da API
    } catch (error) {
      console.error(error);
      setShowFailureModal(true);
    }

    limparCampos();
  };

  const handleCancelar = () => {
    limparCampos();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          Registrar Notas do Simulado de {aluno.name}
        </h2>

        <div className={styles.cardContainer}>
          <DetailsCard
            title="Nome"
            content={aluno.name}
            bg_color="#ca7e0b"
            text_size="14px"
          />
          <DetailsCard
            title="Nome do Simulado"
            content={nameSimulado}
            bg_color="#ca7e0b"
            text_size="14px"
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            type="number"
            placeholder="Nota Competência 1"
            value={notas.comp1}
            onChange={(e) => handleNotaChange(e, "comp1")}
          />
          <Input
            type="number"
            placeholder="Nota Competência 2"
            value={notas.comp2}
            onChange={(e) => handleNotaChange(e, "comp2")}
          />
          <Input
            type="number"
            placeholder="Nota Competência 3"
            value={notas.comp3}
            onChange={(e) => handleNotaChange(e, "comp3")}
          />
          <Input
            type="number"
            placeholder="Nota Competência 4"
            value={notas.comp4}
            onChange={(e) => handleNotaChange(e, "comp4")}
          />
          <Input
            type="number"
            placeholder="Nota Competência 5"
            value={notas.comp5}
            onChange={(e) => handleNotaChange(e, "comp5")}
          />
        </div>

        <DetailsCard
          title="Nota Final"
          content={notaFinal}
          bg_color="#2E7D32"
          text_size="16px"
        />

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSalvar}>
            Salvar Notas
          </button>
          <button className={styles.cancelButton} onClick={handleCancelar}>
            Cancelar
          </button>
        </div>

        {/* Modal de Sucesso */}
        {showSuccessModal && (
          <SuccessModal
            onClose={() => {
              setShowSuccessModal(false);
              onClose(); // Só fecha o modal principal aqui
            }}
          />
        )}

        {/* Modal de Falha */}
        {showFailureModal && (
          <ModalFailure
            onClose={() => {
              setShowFailureModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ModalRegistrarNotas;
