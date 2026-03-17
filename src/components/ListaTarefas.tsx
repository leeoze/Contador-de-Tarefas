"use client";

import { useState } from "react";
import { Tarefa } from "@/types/tarefa";
import { NovaTarefa } from "./NovaTarefa";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useContadorDeTarefas } from "@/hooks/useContadorDeTarefas";

interface ListaTarefasProps {
  tarefasIniciais: Tarefa[];
}

export function ListaTarefas({ tarefasIniciais }: ListaTarefasProps) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);
  const [tarefaParaRemover, setTarefaParaRemover] = useState<Tarefa | null>(null);
  const { total, concluidas, pendentes } = useContadorDeTarefas(tarefas);

  function adicionarTarefa(nova: Tarefa) {
    setTarefas((prev) => [nova, ...prev]);
  }

  function toggleTarefa(id: string) {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
    );
  }

  function confirmarRemocao() {
    if (!tarefaParaRemover) return;
    setTarefas((prev) => prev.filter((t) => t.id !== tarefaParaRemover.id));
    setTarefaParaRemover(null);
  }

  return (
    <>
      {tarefaParaRemover && (
        <ConfirmacaoModal
          titulo={tarefaParaRemover.titulo}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setTarefaParaRemover(null)}
        />
      )}

      <section className="contador" aria-label="Contador de tarefas">
        <div className="contador-item">
          <span className="contador-numero">{total}</span>
          <span className="contador-label">Total</span>
        </div>
        <div className="contador-item">
          <span className="contador-numero">{pendentes}</span>
          <span className="contador-label">Pendentes</span>
        </div>
        <div className="contador-item">
          <span className="contador-numero">{concluidas}</span>
          <span className="contador-label">Concluídas</span>
        </div>
      </section>

      <NovaTarefa onAdicionar={adicionarTarefa} />

      <ul aria-label="Lista de tarefas">
        {tarefas.length === 0 && (
          <li className="lista-vazia">Nenhuma tarefa. Adicione uma acima.</li>
        )}
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className={`tarefa-item${tarefa.concluida ? " concluida" : ""}`}>
            <label className="tarefa-label">
              <input
                type="checkbox"
                checked={tarefa.concluida}
                onChange={() => toggleTarefa(tarefa.id)}
                aria-label={`Marcar "${tarefa.titulo}" como ${tarefa.concluida ? "pendente" : "concluída"}`}
              />
              <span className="tarefa-titulo">{tarefa.titulo}</span>
            </label>
            <button
              onClick={() => setTarefaParaRemover(tarefa)}
              className="btn-remover"
              aria-label={`Remover tarefa: ${tarefa.titulo}`}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
