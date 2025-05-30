import React from "react";
import "./agende.css";
import HeaderLogado from "../../components/HeaderLogado/header-logado";

const servicos = [
  { nome: "Corte de Cabelo Masculino", duracao: "30 min", preco: "R$ 40,00" },
  { nome: "Barba", duracao: "20 min", preco: "R$ 35,00" },
  { nome: "Reflexo", duracao: "120 min", preco: "R$ 110,00" },
  { nome: "Nevou", duracao: "40 min", preco: "R$ 120,00" },
];

const Agendamento: React.FC = () => {
  return (
    <>
    <img className='fundo' src="Agende/fundo.png" alt="" />
    <HeaderLogado/>
    <div className="agendamento-container">
      <h1>Agende seu serviço</h1>
      <p>Escolha o serviço, data e horário de sua preferência</p>

      <div className="passos">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className={`passo ${num === 1 ? "ativo" : ""}`}>
            <div className="numero">{num}</div>
            <span>
              {["Escolha", "Serviço", "Data", "Horário", "Confirmar"][num - 1]}
            </span>
          </div>
        ))}
      </div>

      <div className="selecao">
        <div className="botoes-selecao">
        </div>
        <h2>Escolha um Serviço</h2>
        <div className="servicos-grid">
          {servicos.map((s, idx) => (
            <div key={idx} className="card-servico">
              <h3>{s.nome}</h3>
              <span className="duracao">Duração: <strong>{s.duracao}</strong></span>
              <p className="preco">{s.preco}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Agendamento;
