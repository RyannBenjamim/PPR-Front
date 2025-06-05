import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import styles from "../GraficoBarrasEmpilhadas/styles.module.css";

const COLORS = {
  40: "#ffbe0b",
  80: "#fb5607",
  120: "#ff006e",
  160: "#8338ec",
  200: "#3a86ff",
};

const NOTAS = Object.keys(COLORS).map(Number);

const BarrasEmpilhadas = ({ data, titulo }) => {
  const competencias = [
    "competencia01",
    "competencia02",
    "competencia03",
    "competencia04",
    "competencia05",
  ];

  function transformarParaGraficoEmpilhado(data) {
    const resultado = competencias.map((comp, i) => {
      const entrada = { competencia: `C${i + 1}` };
      NOTAS.forEach((nota) => (entrada[nota] = 0));
      return entrada;
    });

    data.forEach((aluno) => {
      competencias.forEach((comp, i) => {
        const nota = aluno[comp];
        if (resultado[i][nota] !== undefined) {
          resultado[i][nota]++;
        } else {
          resultado[i][nota] = 1;
        }
      });
    });

    return resultado;
  }

  const dadosTransformados = transformarParaGraficoEmpilhado(data);

  // Função para exibir os valores sempre, mesmo se forem pequenos
  const renderLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    const fontSize = height < 20 ? 15 : 16;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="#fff"
        fontSize={fontSize}
        dy={4}
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dadosTransformados} activeBar={{ fill: "transparent" }}>
        <XAxis dataKey="competencia" className={styles.eixoX} />
        <YAxis allowDecimals={false} className={styles.eixoY} />
        <Tooltip
          cursor={{ fill: "#111111" }}
          contentStyle={{
            backgroundColor: "#DA9E00",
            border: "9px solid #DA9E00",
            borderRadius: "16px",
          }}
          labelStyle={{ color: "var(--tooltip-label)" }}
          itemStyle={{ color: "var(--tooltip-item)" }}
          formatter={(value, name) => [`${value} aluno(s)`, `Nota ${name}`]}
          labelFormatter={(label) => `Competência: ${label}`}
        />

        <Legend />
        {NOTAS.map((nota) => (
          <Bar
            key={nota}
            dataKey={nota}
            stackId="a"
            fill={COLORS[nota]}
            name={`${nota}`}
          >
            <LabelList dataKey={nota} content={renderLabel} />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarrasEmpilhadas;
