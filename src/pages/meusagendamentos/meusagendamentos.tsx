import { useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Header from '../../components/Header/header';
import './meusagendamentos.css';

type Agendamento = {
  id: string;
  servico: string[] | string;
  data: string;
  hora: string;
};

function ConsultarAgendamentos() {
  const [telefone, setTelefone] = useState('');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [buscaIniciada, setBuscaIniciada] = useState(false);

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const removerMascaraTelefone = (valor: string) => valor.replace(/\D/g, '');

  const buscarAgendamentos = async () => {
    setBuscaIniciada(true);
    try {
      const telefoneLimpo = removerMascaraTelefone(telefone);
      const q = query(collection(db, 'agendamentos'), where('telefone', '==', telefoneLimpo));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Agendamento[];

      setAgendamentos(results);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

const formatarData = (dataString: string) => {
  const [ano, mes, dia] = dataString.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia); // Aqui garantimos o fuso correto (sem UTC)

  const diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  const diaSemana = diasSemana[data.getDay()];
  return `${diaSemana}, ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
};


  const handleCancel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'agendamentos', id));
      alert('Agendamento cancelado com sucesso!');
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Não foi possível cancelar o agendamento');
    }
  };

  return (
    <>
      <div className='container-principal'>
        <Header />
        <div className='container-agendamento'>
          <div className='input-botao'>
            <h1 style={{ color: '#c8a97e', textAlign: 'center', fontSize: '1.5rem' }}>Consultar Agendamentos</h1>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: "1.1rem" }}>Digite seu telefone abaixo:</p>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="Digite seu telefone"
              style={{fontSize: "1.1rem", border: 'none', borderRadius: "4px", 
                textAlign: 'center', padding: "0.3rem"}}
            />
            <button
              style={{ cursor: 'pointer', backgroundColor: 'green', height: '5vh', color: 'white', fontSize: '1rem' }}
              onClick={buscarAgendamentos}
            >
              Buscar
            </button>
          </div>

          <div>
            {buscaIniciada && (
              <>
                {agendamentos.length > 0 ? (
                  <>
                    <h3>Seus agendamentos:</h3>
                    {agendamentos.map((agendamento) => {
                      const [ano, mes, dia] = agendamento.data.split('-').map(Number);
                      const [hora, minuto] = agendamento.hora.split(':').map(Number);
                      const dataHoraAgendada = new Date(ano, mes - 1, dia, hora, minuto);
                      const agora = new Date();
                      const agendamentoFuturo = dataHoraAgendada > agora;

                      return (
                        <div className='servico-botao' key={agendamento.id}>
                          <div style={{ width: '70%' }}>
                            <p><strong>Serviço:</strong> {Array.isArray(agendamento.servico) ? agendamento.servico.join(', ') : agendamento.servico}</p>
                            <p><strong>Data:</strong> {formatarData(agendamento.data)}</p>
                            <p><strong>Hora:</strong> {agendamento.hora}</p>
                          </div>

                          {agendamentoFuturo && (
                            <button
                              className='botao-cancelar'
                              onClick={() => handleCancel(agendamento.id)}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p style={{ textAlign: 'center' }}>Nenhum agendamento encontrado.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsultarAgendamentos;
