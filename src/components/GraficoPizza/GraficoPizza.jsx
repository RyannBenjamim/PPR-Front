import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#1a659e", // 0-500
  "#004e89", // 500-600
  "#ef233c", // 600-700
  "#9d4edd", // 700-800
  "#1b4332", // 800-900
  "#1b4332", // 900+
  "#9ef01a", // 1000
];

// Função para agrupar os dados por faixa de nota
function agruparPorFaixa(data) {
  const faixas = [
    { name: "0-500", min: 0, max: 500 },
    { name: "500-600", min: 500, max: 600 },
    { name: "600-700", min: 600, max: 700 },
    { name: "700-800", min: 700, max: 800 },
    { name: "800-900", min: 800, max: 900 },
    { name: "900+", min: 900, max: 999 }, // qualquer nota entre 900 e 999
    { name: "1000", min: 1000, max: 1000 },
  ];

  const contagem = {};

  faixas.forEach((faixa) => {
    contagem[faixa.name] = 0;
  });

  data.forEach((aluno) => {
    const nota = aluno.nota;
    const faixa = faixas.find((f) => nota >= f.min && nota <= f.max);
    if (faixa) {
      contagem[faixa.name]++;
    }
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0); // remove faixas com zero
}

const GraficoPizza = ({ data, titulo }) => {
  const dadosAgrupados = agruparPorFaixa(data);

  return (
    <div style={{ width: "100%", height: 450 }}>
      <ResponsiveContainer>
        <PieChart>
          {/* Título */}
          <text
            x="50%"
            y="5%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={22}
            fill="#fff"
            fontWeight="bold"
          >
            {titulo}
          </text>
          <Pie
            data={dadosAgrupados}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name} (${value})`}
          >
            {dadosAgrupados.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} aluno(s)`, name]}
            contentStyle={{
              backgroundColor: "#DA9E00",
              border: "9px solid #DA9E00",
              borderRadius: "16px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoPizza;
