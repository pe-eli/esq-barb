import React, { useEffect, useState } from "react";
import "./GerenciarServicos.css";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Servico {
  id: string;
  nome: string;
  duracao: string;
  preco: string;
  ativo: boolean;
}

const GerenciarServicos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);

  const adminEmails = ['mp6171745@gmail.com', 'p.mouuraa05@gmail.com'];
  const isAdmin = adminEmails.includes(user?.email ?? '');

  useEffect(() => {
    if (!user) {
      // Se não estiver logado, redireciona para login
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      // Se logado mas não for admin, redireciona para home
      navigate('/');
      return;
    }

    const buscarServicos = async () => {
      const querySnapshot = await getDocs(collection(db, "servicosDisponiveis"));
      const lista: Servico[] = [];
      querySnapshot.forEach((docItem) => {
        const data = docItem.data();
        lista.push({
          id: docItem.id,
          nome: data.nome,
          duracao: data.duracao,
          preco: data.preco,
          ativo: data.ativo,
        });
      });
      setServicos(lista);
      setCarregando(false);
    };

    buscarServicos();
  }, [user]);

  const alternarAtivacao = async (id: string, estadoAtual: boolean) => {
    const docRef = doc(db, "servicosDisponiveis", id);
    await updateDoc(docRef, { ativo: !estadoAtual });

    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ativo: !estadoAtual } : s))
    );
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className="gerenciar-servicos-container">
      <h1>Gerenciar Serviços</h1>
      <div className="servicos-grid">
        {servicos.map((servico) => (
          <div
            key={servico.id}
            className={`card-servico ${servico.ativo ? "ativo" : "inativo"}`}
            onClick={() => alternarAtivacao(servico.id, servico.ativo)}
          >
            <h3>{servico.nome}</h3>
            <p className="duracao">{servico.duracao}</p>
            <p className="preco">{servico.preco}</p>
            <p className="status">
              {servico.ativo ? "Disponível" : "Indisponível"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciarServicos;
