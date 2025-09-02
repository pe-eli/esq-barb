import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarServicos.css";
import Header from "../../components/Header/header";

import {
  listarServicos,
  adicionarServico,
  alternarAtivacao,
  removerServico,
  type Servico,
} from "../../servicos";

const GerenciarServicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");

  useEffect(() => {
    atualizarLista();
  }, []);

  const atualizarLista = async () => {
    try {
      const lista = await listarServicos();
      setServicos(lista);
    } catch (e) {
      console.error("Erro ao carregar serviços:", e);
    }
  };

  const handleAlternar = async (nome: string) => {
    await alternarAtivacao(nome);
    await atualizarLista();
  };

  const handleRemover = async (nome: string) => {
    await removerServico(nome);
    await atualizarLista();
  };

  const handleAdicionar = async () => {
    if (!novoNome || !novoPreco) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await adicionarServico({
        nome: novoNome,
        preco: novoPreco,
        ativo: true,
      });
      setNovoNome("");
      setNovoPreco("");
      await atualizarLista();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
      <div className="wp">
        <Header />
      <div className="gerenciar-servicos-container">
        <h1 style={{textAlign: 'center'}}>Gerenciar Serviços</h1>
        <Link className="adm"to="/adm">Visualizar todos os agendamentos</Link>
        <h2 style={{ borderTop: "1px solid white", paddingTop: "1vh", marginBottom: 0 }}>
          Adicionar Novo Serviço
        </h2>
        <div className="adicionar-servico-form">
          <div className="cjt-inputs">
          <label htmlFor="servico" style={{ margin: "0", fontWeight: "bold" }}>
            Nome do Serviço
          </label>
          <input
            id="servico"
            type="text"
            placeholder="Serviço"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="inputs"
          />
             </div>
             <div className="cjt-inputs">
          <label htmlFor="preco" style={{ margin: "0", fontWeight: "bold" }}>
            Preço do Serviço
          </label>
          <input
            id="preco"
            type="text"
            placeholder="Preço"
            value={novoPreco}
            className="inputs"
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");
              const numero = parseInt(valor || "0", 10);
              const formatado = `R$${(numero / 100).toFixed(2).replace(".", ",")}`;
              setNovoPreco(formatado);
            }}
          />
         </div>
        </div>
         <button onClick={handleAdicionar} className="add">
            Adicionar
          </button>
          <div style={{width: '100%', borderBottom: '1px solid white', marginTop: '1.5rem'}}></div>
        <h2 style={{ marginTop: '2rem'}}>Serviços Ativos</h2>
        <div className="servicos-grid">
          
          {servicos.map((servico) => (
            <div
              key={servico.nome}
              className={`card-servico ${servico.ativo ? "ativo" : "inativo"}`}
            >
              <h3>{servico.nome}</h3>
              <p className="preco">{servico.preco}</p>
              <p className="status">{servico.ativo ? "Ativado" : "Desativado"}</p>

              <div className="botoes">
                <button
                  onClick={() => handleAlternar(servico.nome)}
                  style={{
                    backgroundColor: servico.ativo ? "#ffc107" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14.4px 12px",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  {servico.ativo ? "Desativar" : "Ativar"}
                </button>
                <button
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => handleRemover(servico.nome)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default GerenciarServicos;
