import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './meusagendamentos.css';
import Header from '../../components/Header/header';

interface Agendamento {
  servico: string;
  data: string;
  hora: string;
}

const ConsultAgendamentos: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setAgendamentos([]);

    try {
      const q = query(collection(db, 'agendamentos'), where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);
      const results: Agendamento[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          servico: data.servico,
          data: data.data,
          hora: data.hora,
        });
      });

      setAgendamentos(results);
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar agendamentos.');
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="agendamento">
        <div className="agendamento-container">
          <h2>Consultar Agendamentos</h2>

          <div className="etapa">
            <input
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <div className="botoes">
              <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="results" style={{ marginTop: '1.5rem' }}>
            {agendamentos.length > 0 ? (
              <table style={{ width: '100%', marginTop: '1rem', color: '#fff' }}>
                <thead>
                  <tr style={{ color: '#f5d105' }}>
                    <th>Serviço</th>
                    <th>Data</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((agendamento, index) => (
                    <tr key={index}>
                      <td>{agendamento.servico}</td>
                      <td>{agendamento.data}</td>
                      <td>{agendamento.hora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#fff' }}>Nenhum agendamento encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultAgendamentos;
