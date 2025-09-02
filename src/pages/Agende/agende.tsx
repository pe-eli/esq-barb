import { parse } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { useNavigate } from 'react-router-dom';
import { getServicosAtivos } from '../../servicos'; // Já usa a versão Firebase

const formatarData = (data: string) => {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  const dataObj = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const diaSemana = diasSemana[dataObj.getDay()];
  const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  return `${diaSemanaCapitalizado}, ${dia}/${mes}/${ano}`;
};

const Agendamento: React.FC = () => {
  const [etapa, setEtapa] = useState(1);
  const [servicos, setServicos] = useState<{ nome: string; preco: string }[]>([]);
  const [servico, setServico] = useState<string[]>([]);
const [data, setData] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [hora, setHora] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 10) {
      return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  useEffect(() => {
    const carregarServicos = async () => {
      const servicosAtivos = await getServicosAtivos();
      setServicos(servicosAtivos);
    };
    carregarServicos();
  }, []);

  const calcularTotal = () => {
    return servicos
      .filter(s => servico.includes(s.nome))
      .reduce((total, s) => {
        const valor = parseFloat(s.preco.replace('R$', '').replace(',', '.'));
        return total + valor;
      }, 0)
      .toFixed(2)
      .replace('.', ',');
  };

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
    return horarios;
  };

  const todosHorarios = gerarHorarios(data);

  useEffect(() => {
    if (etapa === 3 && data) buscarHorarios();
  }, [etapa, data]);

  const buscarHorarios = async () => {
    setCarregando(true);
    try {
      const agendamentoRef = collection(db, 'agendamentos');
      const q = query(agendamentoRef, where('data', '==', data));
      const snapshot = await getDocs(q);
      const ocupados = snapshot.docs.map(doc => doc.data().hora);
      setHorariosOcupados(ocupados);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (!servico || !data || !hora || !telefone || !nome) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const agendamentoRef = collection(db, 'agendamentos');
      const q = query(agendamentoRef, where('data', '==', data), where('hora', '==', hora));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        alert('Horário já agendado. Escolha outro.');
        return;
      }

      await addDoc(agendamentoRef, {
        servico,
        data,
        hora,
        telefone,
        nome,
        criadoEm: new Date(),
      });

      setSucesso(true);
      resetar();
      setTimeout(() => navigate('/home'), 5000);
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar. Tente novamente.');
    }
  };

  const resetar = () => {
    setEtapa(1);
    setServico([]);
    setData(new Date().toISOString().split('T')[0]);
    setHora('');
    setTelefone('');
    setNome('');
    setHorariosOcupados([]);
  };

  // ... (continua com seu JSX sem mudanças)



  if (sucesso) {
    return (
      <>
        <Header />
        <div className="agendamento">
          <div style={{display: 'flex', flexDirection: 'column'}}
               className="agendamento-container sucesso">
            <div className="icone-check">✅</div>
            <h2>Agendamento realizado com sucesso!</h2>
            <p>Você será redirecionado para a página inicial.</p>
          </div>
        </div>
      </>
    );
  }
          return (
            <>
              <div className='agendamento'>
                <Header/>
                <div className="agendamento-container">
                  {etapa === 1 && (
          <div className="etapa1">
            <h2 style={{fontSize: '1.5rem', textAlign: "center"}}>Escolha o serviço desejado:</h2>
            <div className="opcoes" style={{ display: 'flex', flexDirection: 'column' }}>
              {servicos.map(({ nome, preco }) => (
                <button
                  key={nome}
                  className={servico.includes(nome) ? 'ativo' : 'inativo'}
                  onClick={() => {
                    setServico((prev) =>
                      prev.includes(nome)
                        ? prev.filter(item => item !== nome)
                        : [...prev, nome]
                    );
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{nome}</span>
                  <span>{preco}</span>
                </button>
              ))}
            </div>
            <p
              style={{
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                opacity: servico.length > 0 ? 1 : 0.4,
                transition: 'opacity 0.5s ease',
                margin: '0'
              }}
            >
              Total: R${calcularTotal()}
            </p>
            <div className="botoes">
              <button style={{width: window.innerWidth < 1000 ? '100%' : '100%', 
                              height: '2.8rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              alignItems: 'center'}}
                      disabled={servico.length === 0} onClick={() => setEtapa(2)}>
                Próximo
              </button>
            </div>
          </div>
        )}


          {etapa === 2 && (
  <div className="etapa">
    <h2>Escolha a data desejada:</h2>
    
    <DatePicker
  locale={ptBR}
  selected={data ? parse(data, 'yyyy-MM-dd', new Date()) : null}
  onChange={(date) => {
    if (date) {
      // mantém no estado no formato ISO (yyyy-MM-dd)
      const dataLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setData(format(dataLocal, 'yyyy-MM-dd'));
    } else {
      setData('');
    }
  }}
  minDate={new Date()}
  filterDate={(date) => date.getDay() !== 0} // Bloqueia domingos
  dateFormat="dd/MM/yyyy"  // <-- Exibição no padrão brasileiro
  placeholderText="Selecione a data"
  className="custom-datepicker"
  wrapperClassName="custom-datepicker-wrapper"
/>


    <div
      style={{ width: window.innerWidth < 1000 ? '100%' : '80%' }}
      className="botoes"
    >
      <button
        style={{
          width: window.innerWidth < 1000 ? '40%' : '100%',
          height: '2.8rem',
          justifyContent: 'center',
          textAlign: 'center',
          alignItems: 'center',
          placeSelf: 'center'
        }}
        disabled={servico.length === 0}
        onClick={() => setEtapa(1)}
      >
        Voltar
      </button>
      <button
        style={{
          width: window.innerWidth < 1000 ? '40%' : '100%',
          height: '2.8rem',
          justifyContent: 'center',
          textAlign: 'center',
          alignItems: 'center',
          placeSelf: 'center'
        }}
        disabled={servico.length === 0 || !data}
        onClick={() => setEtapa(3)}
      >
        Próximo
      </button>
    </div>
  </div>
)}

          {etapa === 3 && (
            <div className="etapa">
              <h2 style={{width: window.innerWidth < 1000 ? '80%' : '100%', margin: '0 auto', }}>
                Escolha o horário desejado:
              </h2>
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
              <div style={{width: window.innerWidth < 1000 ? '100%' : '80%'}} 
                   className="botoes">
                <button style={{width: window.innerWidth < 1000 ? '40%' : '100%', 
                              height: '2.8rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              alignItems: 'center',
                            placeSelf: 'center'}}
                      disabled={servico.length === 0} onClick={() => setEtapa(2)}>
                Voltar
              </button>
                <button style={{width: window.innerWidth < 600 ? '40%' : '100%', 
                              height: '2.8rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              alignItems: 'center',
                            placeSelf: 'center'}}
                      disabled={servico.length === 0 || !hora} onClick={() => setEtapa(4)}>
                Próximo
              </button>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="etapa">
              <h2>Confirmação:</h2>
              <p style={{margin:'0'}}><strong>Serviço:</strong> {servico.join(', ')}</p>
              <p style={{margin:'0'}}><strong>Data:</strong> {formatarData(data)}</p>
              <p style={{margin:'0'}}><strong>Hora:</strong> {hora}</p>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <input
                type="text"
                placeholder="Digite seu telefone"
                value={formatarTelefone(telefone)}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              />

              <div style={{width: window.innerWidth < 1000 ? '120%' : '80%'}}className="botoes">
                 <button style={{width: window.innerWidth < 1000 ? '40%' : '100%', 
                              height: '2.8rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              alignItems: 'center',
                              marginTop: '1.5rem',
                            placeSelf: 'center'}}
                      disabled={servico.length === 0} onClick={() => setEtapa(3)}>
                Voltar
              </button>
                <button style={{width: window.innerWidth < 1000 ? '40%' : '100%', 
                              height: '2.8rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              alignItems: 'center',
                            placeSelf: 'center'}}
                              disabled={!telefone || !nome} onClick={confirmarAgendamento}>
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Agendamento;
