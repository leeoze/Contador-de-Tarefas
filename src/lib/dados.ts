import { Tarefa } from "@/types/tarefa";

const tarefasIniciais: Tarefa[] = [
  { id: "1", titulo: "Estudar", concluida: false },
  { id: "2", titulo: "Beber água", concluida: true },
  { id: "3", titulo: "Pagar boleto", concluida: false },
];

export async function buscarTarefas(): Promise<Tarefa[]> {
  return Promise.resolve(tarefasIniciais);
}
