import React, { useState, useEffect } from "react";
import "./agende.css";
import HeaderLogado from "../../components/HeaderLogado/header-logado";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

// 🔥 SUBSTITUIR ARRAY FIXO
// const servicos = [
//   { nome: "Corte de Cabelo Masculino", duracao: "30 min", preco: "R$ 40,00" },
//   { nome: "Barba", duracao: "20 min", preco: "R$ 35,00" },
//   { nome: "Reflexo", duracao: "120 min", preco: "R$ 110,00" },
//   { nome: "Nevou", duracao: "40 min", preco: "R$ 120,00" }
// ];

const etapas = ["Serviço", "Data", "Horário", "Confirmar"];

const gerarHorarios = () => {
  const horarios = [];
  const agora = new Date();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();

  for (let h = 7; h < 18; h++) {
    const horaStr = h.toString().padStart(2, '0');

    // 00 minutos
    if (h > horaAtual || (h === horaAtual && minutoAtual < 0)) {
      horarios.push(`${horaStr}:00`);
    } else if (h === horaAtual && minutoAtual < 30) {
      // 00 só entra se ainda estiver antes de 00
      horarios.push(`${horaStr}:00`);
    }

    // 30 minutos
    if (h > horaAtual || (h === horaAtual && minutoAtual < 30)) {
      horarios.push(`${horaStr}:30`);
    }
  }

  return horarios;
};

const parsePreco = (precoStr: string): number => {
  return parseFloat(precoStr.replace("R$ ", "").replace(",", "."));
};

const Agendamento: React.FC = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);

  // 🆕 ESTADO PARA SERVIÇOS DINÂMICOS DO FIREBASE
  const [servicos, setServicos] = useState<any[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const navigate = useNavigate();
  const horarios = gerarHorarios();

  // 🆕 BUSCAR SERVIÇOS DO FIREBASE COM "ativo" === true
  useEffect(() => {
    const carregarServicos = async () => {
      const db = getFirestore();
      const servicosRef = collection(db, "servicosDisponiveis");
      const q = query(servicosRef, where("ativo", "==", true));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServicos(lista);
    };
    carregarServicos();
  }, []);

  const toggleServico = (id: string) => {
    setServicosSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
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

  useEffect(() => {
    const carregarHorariosOcupados = async () => {
      if (!dataSelecionada) return;
      const db = getFirestore();
      const agendamentosRef = collection(db, "agendamentos");
      const dataFormatada = format(dataSelecionada, "yyyy-MM-dd");
      const q = query(agendamentosRef, where("data", "==", dataFormatada));
      const querySnapshot = await getDocs(q);
      const horarios = querySnapshot.docs.map(doc => doc.data().horario);
      setHorariosOcupados(horarios);
    };

    carregarHorariosOcupados();
  }, [dataSelecionada]);

  const salvarAgendamento = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (servicosSelecionados.length === 0 || !dataSelecionada || !horarioSelecionado) {
      console.error("Dados incompletos para salvar agendamento");
      return;
    }

    const db = getFirestore();
    const servicosSelecionadosDetalhes = servicos.filter((s) => servicosSelecionados.includes(s.id));
    const agendamento = {
      userId: user.uid,
      nome: user.displayName ?? "Usuário",
      email: user.email ?? "sem-email",
      servicos: servicosSelecionadosDetalhes.map((s) => s.nome),
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
      <div className="fundo"></div>
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

        {etapaAtual === 1 && (
          <div className="selecao">
            <h2>Escolha um ou mais serviços:</h2>
            <div className="servicos-grid">
              {servicos.map((s) => (
                <div
                  key={s.id}
                  className={`card-servico ${servicosSelecionados.includes(s.id) ? "selecionado" : ""}`}
                  onClick={() => toggleServico(s.id)}
                >
                  <h3>{s.nome}</h3>
                  <span className="duracao">Duração: <strong>{s.duracao}</strong></span>
                  <p className="preco">{s.preco}</p>
                </div>
              ))}
            </div>
            {servicosSelecionados.length > 0 && (
              <div>
                <button className="botoes-navegacao" onClick={prosseguir}>Prosseguir</button>
              </div>
            )}
          </div>
        )}

        {etapaAtual === 2 && (
          <div className="selecao" style={{ position: "relative" }}>
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
                minDate={new Date()}
              />
            </div>
            {dataSelecionada && (
              <div>
                <button className="botoes-navegacao"onClick={prosseguir}>Prosseguir</button>
              </div>
            )}
          </div>
        )}

        {etapaAtual === 3 && (
          <div className="selecao" style={{ position: "relative" }}>
            <button className="botao-voltar-topo" onClick={voltar}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <h2>Escolha o horário desejado:</h2>
            <div className="datas-grid">
              {horarios.map((horario, idx) => (
                !horariosOcupados.includes(horario) && (
                  <div
                    key={idx}
                    className={`data-item ${horarioSelecionado === horario ? "selecionado" : ""}`}
                    onClick={() => setHorarioSelecionado(horario)}
                  >
                    {horario}
                  </div>
                )
              ))}
            </div>
            {horarioSelecionado && (
              <div>
                <button className="botoes-navegacao" onClick={prosseguir}>Prosseguir</button>
              </div>
            )}
          </div>
        )}

        {etapaAtual === 4 && (
          <div className="selecao">
            {!agendamentoConfirmado ? (
              <>
                <h2>Confirme seu agendamento:</h2>
                <div style={{ textAlign: "left", background: "#fff", padding: "1.5rem", borderRadius: "12px", marginTop: "1rem" }}>
                  <p><strong>Serviços:</strong></p>
                  <ul>
                    {servicosSelecionados.map((id) => {
                      const servico = servicos.find(s => s.id === id);
                      const precoNumerico = parsePreco(servico.preco);
                      return (
                        <li style={{color: "black"}}key={id}>
                          {servico.nome} - R$ {precoNumerico.toFixed(2).replace(".", ",")}
                        </li>
                      );
                    })}
                  </ul>
                  <p><strong>Total:</strong> R$ {
                    servicosSelecionados.reduce((total, id) => {
                      const servico = servicos.find(s => s.id === id);
                      return total + parsePreco(servico.preco);
                    }, 0).toFixed(2).replace(".", ",")
                  }</p>
                  <p><strong>Data:</strong> {dataSelecionada ? format(dataSelecionada, "dd/MM/yyyy") : ""}</p>
                  <p><strong>Horário:</strong> {horarioSelecionado}</p>
                </div>
                <div>
                  <button className="botao-voltar-topo" onClick={voltar}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                  </button>

                  <button className="botoes-navegacao" onClick={confirmarAgendamento}>
                    Confirmar agendamento!
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h2>Obrigado! Agendamento confirmado com sucesso!</h2>
                <p>Seu corte foi agendado. Você pode acessar seu perfil ou voltar para a página inicial.</p>
                <div>
                  <button className="botoes-navegacao" onClick={() => navigate("/perfil")}>Ir para Meu Perfil</button>
                  <button className="botoes-navegacao" onClick={() => navigate("/")}>Sair</button>
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
