import { useState } from 'react';
import styles from './styles.module.css';

export default function ToggleAnalysis({ data1, data2, setTaggle }) {
  const [selected, setSelected] = useState('Análise Mensal');

  const handleToggle = (value) => {
    setSelected(value);
    setTaggle(value); // envia o valor pro pai
  };

  return (
    <div className={styles.toggle_container}>
      <button
        className={`${styles.toggle_button} ${selected === 'Análise Mensal' ? styles.active : ''}`}
        onClick={() => handleToggle('Análise Mensal')}
      >
        {data1}
      </button>
      <button
        className={`${styles.toggle_button} ${selected === 'Análise Semanal' ? styles.active : ''}`}
        onClick={() => handleToggle('Análise Semanal')}
      >
        {data2}
      </button>
    </div>
  );
}
