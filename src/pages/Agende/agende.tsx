import React, { useEffect, useState } from 'react';
import './agende.css';
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
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [cpf, setCpf] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  const servicos = ['Corte Masculino', 'Corte Feminino', 'Barba', 'Sobrancelha'];

  // ✅ Gera horários dinâmicos
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
        horarios.push(`${horaStr}:00`);
      }

      // 30 minutos
      if (h > horaAtual || (h === horaAtual && minutoAtual < 30)) {
        horarios.push(`${horaStr}:30`);
      }
    }

    return horarios;
  };

  const todosHorarios = gerarHorarios();

  useEffect(() => {
    if (etapa === 3 && data) {
      buscarHorarios();
    }
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
    setServico('');
    setData('');
    setHora('');
    setCpf('');
    setHorariosOcupados([]);
  };

  return (
    <div className="agendamento-container">
      <h2>Agendamento de Corte</h2>

      {etapa === 1 && (
        <div className="etapa">
          <h3>1. Escolha o serviço</h3>
          <div className="opcoes">
            {servicos.map((s) => (
              <button
                key={s}
                className={servico === s ? 'ativo' : ''}
                onClick={() => setServico(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="botoes">
            <button disabled={!servico} onClick={() => setEtapa(2)}>Próximo</button>
          </div>
        </div>
      )}

      {etapa === 2 && (
        <div className="etapa">
          <h3>2. Escolha a data</h3>
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
          <h3>3. Escolha o horário</h3>
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
                    className={`data-item ${hora === horario ? "selecionado" : ""}`}
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
          <h3>4. Confirmação</h3>
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
  );
};

export default Agendamento;
