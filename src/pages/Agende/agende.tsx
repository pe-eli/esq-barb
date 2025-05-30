import React, { useState } from "react";
import "./agende.css";
import HeaderLogado from "../../components/HeaderLogado/header-logado";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

const servicos = [
  { nome: "Corte de Cabelo Masculino", duracao: "30 min", preco: "R$ 40,00" },
  { nome: "Barba", duracao: "20 min", preco: "R$ 35,00" },
  { nome: "Reflexo", duracao: "120 min", preco: "R$ 110,00" },
  { nome: "Nevou", duracao: "40 min", preco: "R$ 120,00" },
];

const etapas = ["Serviço", "Data", "Horário", "Confirmar"];

const gerarHorarios = () => {
  const horarios = [];
  for (let h = 7; h < 18; h++) {
    horarios.push(`${h.toString().padStart(2, '0')}:00`);
    horarios.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return horarios;
};

const Agendamento: React.FC = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  const selecionarServico = (index: number) => {
    setServicoSelecionado(index);
  };

  const prosseguir = () => {
    if (etapaAtual < etapas.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const confirmarAgendamento = () => {
    alert("Agendamento confirmado com sucesso!");
    // Aqui você pode redirecionar ou resetar os estados
  };

  const horarios = gerarHorarios();

  return (
    <>
      <img className="fundo" src="Agende/fundo.png" alt="" />
      <HeaderLogado />
      <div className="agendamento-container">
        <h1>Agende seu serviço</h1>
        <p className="texto-branco">
  Escolha o serviço, data e horário de sua preferência
</p>

        <div className="passos">
          {etapas.map((etapa, idx) => (
            <div key={idx} className={`passo ${etapaAtual === idx + 1 ? "ativo" : ""}`}>
              <div className="numero">{idx + 1}</div>
              <span>{etapa}</span>
            </div>
          ))}
        </div>

        {/* Etapa 1 - Serviço */}
        {etapaAtual === 1 && (
          <div className="selecao">
            <h2>Escolha um Serviço</h2>
            <div className="servicos-grid">
              {servicos.map((s, idx) => (
                <div
                  key={idx}
                  className={`card-servico ${servicoSelecionado === idx ? "selecionado" : ""}`}
                  onClick={() => selecionarServico(idx)}
                >
                  <h3>{s.nome}</h3>
                  <span className="duracao">Duração: <strong>{s.duracao}</strong></span>
                  <p className="preco">{s.preco}</p>
                </div>
              ))}
            </div>
            {servicoSelecionado !== null && (
              <div className="botoes-navegacao">
                
                <button onClick={prosseguir}>Prosseguir</button>
              </div>
            )}
          </div>
        )}

        {/* Etapa 2 - Data */}
        {etapaAtual === 2 && (
  <div className="selecao" style={{ position: "relative" }}>
    {/* Botão Voltar no canto */}
    <button className="botao-voltar-topo" onClick={voltar}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>

    <h2>Escolha a Data</h2>
    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
  <DatePicker
    selected={dataSelecionada}
    onChange={(date) => setDataSelecionada(date)}
    locale={ptBR}
    dateFormat="dd/MM/yyyy"
    inline
    minDate={new Date()} // 👈 impede seleção de datas anteriores a hoje
  />
</div>

    {dataSelecionada && (
      <div className="botoes-navegacao">
        <button onClick={prosseguir}>Prosseguir</button>
      </div>
    )}
  </div>
)}


        {/* Etapa 3 - Horário */}
        {etapaAtual === 3 && (
  <div className="selecao" style={{ position: "relative" }}>
    {/* Botão Voltar no topo */}
    <button className="botao-voltar-topo" onClick={voltar}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>

    <h2>Escolha o Horário</h2>
    <div className="datas-grid">
      {horarios.map((horario, idx) => (
        <div
          key={idx}
          className={`data-item ${horarioSelecionado === horario ? "selecionado" : ""}`}
          onClick={() => setHorarioSelecionado(horario)}
        >
          {horario}
        </div>
      ))}
    </div>

    {horarioSelecionado && (
      <div className="botoes-navegacao">
        <button onClick={prosseguir}>Prosseguir</button>
      </div>
    )}
  </div>
)}


        {/* Etapa 4 - Confirmação */}
        {etapaAtual === 4 && (
          <div className="selecao">
            <h2>Confirme seu Agendamento</h2>
            <div style={{ textAlign: "left", background: "#fff", padding: "1.5rem", borderRadius: "12px", marginTop: "1rem" }}>
              <p><strong>Serviço:</strong> {servicoSelecionado !== null ? servicos[servicoSelecionado].nome : ""}</p>
              <p><strong>Data:</strong> {dataSelecionada ? format(dataSelecionada, "dd/MM/yyyy") : ""}</p>
              <p><strong>Horário:</strong> {horarioSelecionado}</p>
            </div>
            <div className="botoes-navegacao">
              <button className="botao-voltar-topo" onClick={voltar}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  Voltar
</button>

              <button onClick={confirmarAgendamento}>Confirmar Agendamento</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Agendamento;
