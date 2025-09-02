/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
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

  return formatado.charAt(0).toUpperCase() + formatado.slice(1);
};

const AdmAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataFiltro, setDataFiltro] = useState('');
  useEffect(() => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  const dataHoje = `${ano}-${mes}-${dia}`;
  setDataFiltro(dataHoje);
}, []);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const formatarDataISO = (data: Date) => {
    return data.toISOString().split('T')[0];
  };

  const filtrarPorDia = async (diasASomar: number) => {
    const dataBase = new Date();
    dataBase.setDate(dataBase.getDate() + diasASomar);
    const dataFormatada = formatarDataISO(dataBase);
    setDataFiltro(dataFormatada);
    await fetchAgendamentosComData(dataFormatada);
  };

  const filtrarSemana = async () => {
    setLoading(true);
    setErro('');
    const hoje = new Date();
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(hoje.getDate() - hoje.getDay() + 1); // Segunda
    const ultimoDia = new Date(primeiroDia);
    ultimoDia.setDate(primeiroDia.getDate() + 6); // Domingo

    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const snapshot = await getDocs(agendamentosRef);
      const todos: Agendamento[] = [];

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const dataAgendamento = new Date(d.data + 'T00:00:00');
        if (dataAgendamento >= primeiroDia && dataAgendamento <= ultimoDia) {
          todos.push({
            id: docSnap.id,
            nome: d.nome || 'Não informado',
            cpf: d.cpf || '---',
            servico: d.servico,
            data: d.data,
            hora: d.hora,
            concluido: d.concluido || false,
          });
        }
      });

      setAgendamentos(todos);
    } catch (err) {
      console.error(err);
      setErro('Erro ao filtrar semana.');
    }

    setLoading(false);
  };

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

  const fetchAgendamentosComData = async (data: string) => {
    setLoading(true);
    setErro('');

    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const q = query(agendamentosRef, where('data', '==', data));
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
      setErro('Erro ao filtrar por data.');
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

  const handleFiltrar = () => {
    fetchAgendamentos();
  };

  return (
    <>
    <div className='wallpaper'>
      <Header/>
          <>
          <div className='ger-container'>
            <h1>Painel do Barbeiro</h1>
            <Link className="ger-serv"to="/gerenciar-servicos">Gerenciar serviços ativos</Link>
            <div className="search-box">
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                 style={{
                  color: '#fff',       // Cor do texto
                  backgroundColor: '#333', // Cor do fundo
                  border: '1px solid #ccc',
                  padding: '8px',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}  
                            />
              <button onClick={handleFiltrar} disabled={loading}>
                {loading ? 'Filtrando...' : 'Filtrar por data'}
              </button>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button className="botoes-filtro"onClick={() => filtrarPorDia(0)}>Hoje</button>
                <button className="botoes-filtro"onClick={() => filtrarPorDia(1)}>Amanhã</button>
                <button className="botoes-filtro"onClick={filtrarSemana}>Essa semana</button>
              </div>
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
                          {itens.map((item) => {
                            const [ano, mes, dia] = item.data.split('-').map(Number);
                            const [hora, minuto] = item.hora.split(':').map(Number);
                            const dataHoraAgendada = new Date(ano, mes - 1, dia, hora, minuto);
                            const agora = new Date();
                            const agendamentoPassado = dataHoraAgendada < agora;

  return (
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
                      backgroundColor: item.concluido || agendamentoPassado ? '#6c757d' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: item.concluido || agendamentoPassado ? 'default' : 'pointer',
                      marginTop: '5px',
                    }}
                    onClick={() => {
                      if (!item.concluido && !agendamentoPassado) marcarComoConcluido(item.id);
                    }}
                    disabled={item.concluido || agendamentoPassado}
                  >
                    {item.concluido || agendamentoPassado ? 'Concluído' : 'Concluir'}
                  </button>
                </div>
              );
            })}

                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#fff' }}>Nenhum agendamento encontrado.</p>
              )}
            </div>
            </div>
          </>    
      </div>
      
    </>
  );
};

export default AdmAgendamentos;
