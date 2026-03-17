import { buscarTarefas } from "@/lib/dados";
import { ListaTarefas } from "@/components/ListaTarefas";

export default async function Home() {
  const tarefas = await buscarTarefas();

  return (
    <main className="container">
      <h1>Contador de Tarefas</h1>
      <ListaTarefas tarefasIniciais={tarefas} />
    </main>
  );
}
