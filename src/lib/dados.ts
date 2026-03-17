import { Tarefa } from "@/types/tarefa";

const tarefasIniciais: Tarefa[] = [
  { id: "1", titulo: "Estudar Next.js 15", concluida: false },
  { id: "2", titulo: "Criar componentes reutilizáveis", concluida: true },
  { id: "3", titulo: "Escrever testes unitários", concluida: false },
];

export async function buscarTarefas(): Promise<Tarefa[]> {
  return Promise.resolve(tarefasIniciais);
}
