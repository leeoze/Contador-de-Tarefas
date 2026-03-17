"use client";

import { useMemo } from "react";
import { Tarefa } from "@/types/tarefa";

interface ContadorResult {
  total: number;
  concluidas: number;
  pendentes: number;
}

export function useContadorDeTarefas(tarefas: Tarefa[]): ContadorResult {
  return useMemo(() => {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluida).length;
    const pendentes = total - concluidas;
    return { total, concluidas, pendentes };
  }, [tarefas]);
}
