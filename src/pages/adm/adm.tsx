/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import type {
  DocumentData,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import "../adm/adm.css";
import Header from '../../components/Header/header';

interface Agendamento {
  id: string;
  nome: string;
  cpf: string;
  servico: string;
  data: string;
  hora: string;
  concluido?: boolean;
}

const formatarDataComDiaSemana = (dataStr: string) => {
  const partes = dataStr.split('-');
  if (partes.length !== 3) return dataStr;

  const data = new Date(`${dataStr}T00:00:00`);

  const formatado = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);

  // Capitaliza a primeira letra
  return formatado.charAt(0).toUpperCase() + formatado.slice(1);
};


const AdmAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const senhaCorreta = '1234';

  const fetchAgendamentos = async () => {
    setLoading(true);
    setErro('');

    try {
      const agendamentosRef: CollectionReference<DocumentData> = collection(db, 'agendamentos');
      let q: Query<DocumentData> = agendamentosRef;

      if (dataFiltro) {
        q = query(agendamentosRef, where('data', '==', dataFiltro));
      }

      const snapshot = await getDocs(q);
      const dados: Agendamento[] = [];

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        dados.push({
          id: docSnap.id,
          nome: d.nome || 'Não informado',
          cpf: d.cpf || '---',
          servico: d.servico,
          data: d.data,
          hora: d.hora,
          concluido: d.concluido || false,
        });
      });

      setAgendamentos(dados);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar agendamentos.');
    }

    setLoading(false);
  };

  const marcarComoConcluido = async (id: string) => {
    try {
      const agendamentoRef = doc(db, 'agendamentos', id);
      await updateDoc(agendamentoRef, {
        concluido: true,
      });

      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, concluido: true } : item
        )
      );
    } catch (err) {
      console.error('Erro ao marcar como concluído:', err);
      alert('Erro ao atualizar agendamento.');
    }
  };

  useEffect(() => {
    if (autenticado) {
      fetchAgendamentos();
    }
  }, [autenticado]);

  const handleFiltrar = () => {
    fetchAgendamentos();
  };

  const handleLogin = () => {
    if (senha === senhaCorreta) {
      setAutenticado(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  return (
    <>
      <Header />
      <div className="agendamentos-container">
        {!autenticado ? (
          <>
            <h2>Área Restrita</h2>
            <div className="search-box">
              <input
                type="password"
                placeholder="Digite a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button onClick={handleLogin}>Entrar</button>
            </div>
          </>
        ) : (
          <>
            <h1>Painel do Barbeiro</h1>

            <div className="search-box">
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
              />
              <button onClick={handleFiltrar} disabled={loading}>
                {loading ? 'Filtrando...' : 'Filtrar por data'}
              </button>
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="results">
              {agendamentos.length > 0 ? (
                <div className="agenda-list">
                  {Object.entries(
                    agendamentos
                      .sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora))
                      .reduce((acc: Record<string, Agendamento[]>, item) => {
                        if (!acc[item.data]) acc[item.data] = [];
                        acc[item.data].push(item);
                        return acc;
                      }, {})
                  ).map(([data, itens]) => (
                    <div key={data} className="dia">
                      <h3 className="data-titulo">{formatarDataComDiaSemana(data)}</h3>
                      {itens.map((item) => (
                        <div key={item.id} className="agendamento-card">
                          <p><strong>Nome:</strong> {item.nome}</p>
                          <p>
                              <strong>Serviço:</strong>{' '}
                              {Array.isArray(item.servico)
                                ? item.servico.join(', ')
                                : item.servico.replace(/([a-z])([A-ZÀ-Ú])/g, '$1, $2')}
                            </p>

                          <p><strong>Hora:</strong> {item.hora}</p>
                          <button
                            style={{
                              padding: '5px 10px',
                              backgroundColor: item.concluido ? '#6c757d' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: item.concluido ? 'default' : 'pointer',
                              marginTop: '5px',
                            }}
                            onClick={() => {
                              if (!item.concluido) marcarComoConcluido(item.id);
                            }}
                            disabled={item.concluido}
                          >
                            {item.concluido ? 'Concluído' : 'Concluir'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#fff' }}>Nenhum agendamento encontrado.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdmAgendamentos;
