import React, { useEffect, useState } from 'react';
import './agende.css';
import Header from '../../components/Header/header';
import { db } from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';

const Agendamento: React.FC = () => {
  const [etapa, setEtapa] = useState(1);
  const [servico, setServico] = useState<string[]>([]);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [cpf, setCpf] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  const servicos = ['Corte Masculino', 'Corte Feminino', 'Barba', 'Sobrancelha'];

  // ✅ Gera horários dinâmicos
const gerarHorarios = (dataSelecionada: string): string[] => {
  const horarios: string[] = [];
  const agora = new Date();

  for (let h = 7; h < 18; h++) {
    for (const m of [0, 30]) {
      const horaStr = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
      const dataHoraStr = `${dataSelecionada}T${horaStr}:00`;
      const dataHora = new Date(dataHoraStr);

      if (dataHora.getTime() > agora.getTime()) {
        horarios.push(horaStr);
      }
    }
  }
  return horarios.sort((a, b) => {
    const [h1, m1] = a.split(':').map(Number);
    const [h2, m2] = b.split(':').map(Number);
    return h1 !== h2 ? h1 - h2 : m1 - m2;
  });
};
const todosHorarios = gerarHorarios(data);

useEffect(() => {
    if (etapa === 3 && data) {
      buscarHorarios();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa, data]);

  const buscarHorarios = async () => {
    setCarregando(true);
    try {
      const agendamentoRef = collection(db, 'agendamentos');
      const q = query(agendamentoRef, where('data', '==', data));
      const snapshot = await getDocs(q);
      const ocupados = snapshot.docs.map((doc) => doc.data().hora);
      setHorariosOcupados(ocupados);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (!servico || !data || !hora || !cpf) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      // ⚡ Verifica se o horário ainda está livre
      const agendamentoRef = collection(db, 'agendamentos');
      const q = query(
        agendamentoRef,
        where('data', '==', data),
        where('hora', '==', hora)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert('Horário já agendado. Escolha outro.');
        return;
      }

      // ✅ Salva no Firestore
      await addDoc(agendamentoRef, {
  servico, // string única
  data,
  hora,
  cpf,     // campo de nome do cliente, se quiser manter como CPF
  criadoEm: new Date(),
});


      alert('Agendamento realizado com sucesso!');
      resetar();
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar. Tente novamente.');
    }
  };

  const resetar = () => {
    setEtapa(1);
    setServico([]);
    setData('');
    setHora('');
    setCpf('');
    setHorariosOcupados([]);
  };

  return (
    <>
    <Header/>
    <div className='agendamento'>
    <div className="agendamento-container">
      {etapa === 1 && (
        <div className="etapa">
        <h2>Escolha o serviço desejado:</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="opcoes">
                {servicos.map((s) => (
                  <button
                    key={s}
                    className={servico.includes(s) ? 'ativo' : 'inativo'}
                    onClick={() => {
                      setServico((prevSelecionados) =>
                        prevSelecionados.includes(s)
                          ? prevSelecionados.filter(item => item !== s)
                          : [...prevSelecionados, s]
                      );
                    }}
                  >
                    {s}
                  </button>
                  ))}

            </div>
              <div className="botoes">
                 <button disabled={servico.length === 0} onClick={() => setEtapa(2)}>Próximo</button>
              </div> 
        </div>
      )}

      {etapa === 2 && (
        <div className="etapa">
          <h2>Escolha a data desejada:</h2>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <div className="botoes">
            <button onClick={() => setEtapa(1)}>Voltar</button>
            <button disabled={!data} onClick={() => setEtapa(3)}>Próximo</button>
          </div>
        </div>
      )}

      {etapa === 3 && (
        <div className="etapa">
          <h2>Escolha o horário desejado:</h2>
          {carregando ? (
            <p>Carregando...</p>
          ) : todosHorarios.filter(h => !horariosOcupados.includes(h)).length === 0 ? (
            <p>Nenhum horário disponível neste dia.</p>
          ) : (
            <div className="datas-grid">
              {todosHorarios.map((horario, idx) =>
                !horariosOcupados.includes(horario) && (
                  <div
                    key={idx}
                    className={`data-item ${hora === horario ? "h-ativo" : "h-inativo"}`}
                    onClick={() => setHora(horario)}
                  >
                    {horario}
                  </div>
                )
              )}
            </div>
          )}
          <div className="botoes">
            <button onClick={() => setEtapa(2)}>Voltar</button>
            <button disabled={!hora} onClick={() => setEtapa(4)}>Próximo</button>
          </div>
        </div>
      )}

      {etapa === 4 && (
        <div className="etapa">
          <h2>Confirmação:</h2>
          <p><strong>Serviço:</strong> {servico}</p>
          <p><strong>Data:</strong> {data}</p>
          <p><strong>Hora:</strong> {hora}</p>

          <input
            type="text"
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <div className="botoes">
            <button onClick={() => setEtapa(3)}>Voltar</button>
            <button disabled={!cpf} onClick={confirmarAgendamento}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default Agendamento;
