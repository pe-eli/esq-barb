// src/servicos.ts
import { db } from './firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

export interface Servico {
  nome: string;
  preco: string;
  ativo: boolean;
}

const servicosRef = collection(db, "servicos");

// Lista todos os serviços
export const listarServicos = async (): Promise<Servico[]> => {
  const snapshot = await getDocs(servicosRef);
  return snapshot.docs.map((doc) => doc.data() as Servico);
};

// Adiciona um novo serviço
export const adicionarServico = async (servico: Servico): Promise<void> => {
  await addDoc(servicosRef, servico);
};

// Alterna o estado "ativo" de um serviço (buscando por nome)
export const alternarAtivacao = async (nome: string): Promise<void> => {
  const q = query(servicosRef, where("nome", "==", nome));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    const atual = docSnap.data() as Servico;
    await updateDoc(doc(db, "servicos", docSnap.id), {
      ativo: !atual.ativo
    });
  });
};

// Remove um serviço
export const removerServico = async (nome: string): Promise<void> => {
  const q = query(servicosRef, where("nome", "==", nome));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    await deleteDoc(doc(db, "servicos", docSnap.id));
  });
};

// Lista apenas os serviços ativos
export const getServicosAtivos = async (): Promise<Servico[]> => {
  const q = query(servicosRef, where("ativo", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Servico);
};
