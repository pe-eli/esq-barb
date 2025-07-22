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
import "../meusagendamentos/meusagendamentos.css";
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

const AdmAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const senhaCorreta = '1234'; // 🔐 Troque por uma senha mais segura se quiser

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
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Serviço</th>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.cpf}</td>
                        <td>{item.servico}</td>
                        <td>{item.data}</td>
                        <td>{item.hora}</td>
                        <td>
                          <button
                            style={{
                              padding: '5px 10px',
                              backgroundColor: item.concluido ? '#6c757d' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: item.concluido ? 'default' : 'pointer',
                            }}
                            onClick={() => {
                              if (!item.concluido) marcarComoConcluido(item.id);
                            }}
                            disabled={item.concluido}
                          >
                            {item.concluido ? 'Concluído' : 'Concluir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
