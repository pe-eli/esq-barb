import React, { useState } from "react";
import "./agende.css";
import HeaderLogado from "../../components/HeaderLogado/header-logado";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

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
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const navigate = useNavigate();
  const horarios = gerarHorarios();

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

  const salvarAgendamento = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (servicoSelecionado === null || !dataSelecionada || !horarioSelecionado) {
      console.error("Dados incompletos para salvar agendamento");
      return;
    }

    const db = getFirestore();
    const agendamento = {
      userId: user.uid,
      nome: user.displayName ?? "Usuário",
      email: user.email ?? "sem-email",
      servico: servicos[servicoSelecionado]?.nome ?? "Desconhecido",
      data: format(dataSelecionada, "yyyy-MM-dd"),
      horario: horarioSelecionado,
      criadoEm: new Date()
    };

    try {
      await addDoc(collection(db, "agendamentos"), agendamento);
      console.log("✅ Agendamento salvo com sucesso no Firestore.");
    } catch (error) {
      console.error("❌ Erro ao salvar agendamento:", error);
    }
  };

  const confirmarAgendamento = async () => {
    console.log("👉 Clique no botão Confirmar Agendamento");
    await salvarAgendamento();
    console.log("✅ Agendamento confirmado.");
    setAgendamentoConfirmado(true);
  };

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
          <div className="selecao-servico">
            <h2>Escolha o serviço:</h2>
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
                <button onClick={prosseguir}>Prosseguir ⟶</button>
              </div>
            )}
          </div>
        )}

       {etapaAtual === 2 && (
  <div className="selecao">
    <h2>Clique na data desejada:</h2>
    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
      <DatePicker
        className="calendario"
        selected={dataSelecionada}
        onChange={(date) => setDataSelecionada(date)}
        locale={ptBR}
        dateFormat="dd/MM/yyyy"
        inline
        minDate={new Date()}
      />
    </div>
    <div className="botoes-navegacao">
      <button onClick={voltar}>⟵ Voltar</button>
      {dataSelecionada && <button onClick={prosseguir}>Prosseguir ⟶</button>}
    </div>
  </div>
)}

        {etapaAtual === 3 && (
  <div className="selecao">
    <h2>Escolha o horário desejado:</h2>
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
        <button onClick={voltar}>
          ⟵ Voltar
        </button>
        <button onClick={prosseguir}>Prosseguir ⟶</button>
      </div>
    )}
  </div>
)}

{/* Etapa 4 - Confirmação */}
{etapaAtual === 4 && (
  <div className="selecao">
    {!agendamentoConfirmado ? (
      <>
        <h2>Confirme seu Agendamento</h2>
        <div className="confirme">
          <p><strong>Serviço:</strong> {servicoSelecionado !== null ? servicos[servicoSelecionado].nome : ""}</p>
          <p><strong>Data:</strong> {dataSelecionada ? format(dataSelecionada, "dd/MM/yyyy") : ""}</p>
          <p><strong>Horário:</strong> {horarioSelecionado}</p>
        </div>
        <div className="botoes-navegacao" style={{ marginTop: "1.5rem" }}>
          <button onClick={voltar} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            ⟵ Voltar
          </button>
          <button onClick={confirmarAgendamento}>
            Confirmar Agendamento ✔
          </button>
        </div>
      </>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h2>Agendamento Confirmado com Sucesso!</h2>
        <p style={{fontSize: window.innerWidth < 1200 ? '1rem' : '1rem',}}>
          Seu corte foi agendado. Você pode acessar seu perfil ou voltar para a página inicial.</p>
        <div className="botoes-navegacao">
          <button className="confirmacao-sucesso" onClick={() => navigate("/perfil")}>Ir para Meu Perfil</button>
          <button className="confirmacao-sucesso" onClick={() => navigate("/")}>Ir para Home</button>
        </div>
      </div>
    )}
  </div>
)}
      </div>
    </>
  );
};
export default Agendamento;
