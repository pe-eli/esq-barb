import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import HeaderLogado from "../../components/HeaderLogado/header-logado";
import "./meuperfil.css";

const MeuPerfil: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ nome: string; email: string } | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const nome = user.displayName || "Nome não disponível";
      setUserInfo({ nome, email: user.email || "" });

      const buscarHistorico = async () => {
        try {
          const agendamentosRef = collection(db, "agendamentos");
          const q = query(agendamentosRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const agendamentos = querySnapshot.docs.map(doc => doc.data());
          setHistorico(agendamentos);
        } catch (error) {
          console.error("Erro ao buscar histórico:", error);
        }
      };

      buscarHistorico();
    }
  }, []);

  return (
    <>
      <HeaderLogado />
      <div className="perfil-container">
        <h1>Meu Perfil</h1>
        {userInfo && (
          <div className="info-usuario">
            <p><strong>Nome:</strong> {userInfo.nome}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
        )}

        <div className="historico-container">
          <h2>Histórico de Cortes</h2>
          {historico.length === 0 ? (
            <p className="mensagem">Nenhum corte registrado.</p>
          ) : (
            <ul className="historico-lista">
              {historico.map((item, idx) => (
                <li key={idx} className="historico-item">
                  <p>
                    <p>
  <strong>Serviço{Array.isArray(item.servicos) && item.servicos.length > 1 ? "s" : ""}:</strong>{" "}
  {Array.isArray(item.servicos)
    ? item.servicos.length > 0
      ? item.servicos.join(", ")
      : "Nenhum serviço"
    : item.servicos || "Nenhum serviço"}
</p>

                  </p>
                  <p><strong>Data:</strong> {item.data}</p>
                  <p><strong>Horário:</strong> {item.horario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MeuPerfil;
