import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useContadorDeTarefas } from "@/hooks/useContadorDeTarefas";
import { Tarefa } from "@/types/tarefa";

const t = (id: string, concluida: boolean): Tarefa => ({
  id,
  titulo: `Tarefa ${id}`,
  concluida,
});

describe("useContadorDeTarefas", () => {
  it("retorna zeros para lista vazia", () => {
    const { result } = renderHook(() => useContadorDeTarefas([]));
    expect(result.current).toEqual({ total: 0, concluidas: 0, pendentes: 0 });
  });

  it("conta apenas tarefas pendentes", () => {
    const { result } = renderHook(() =>
      useContadorDeTarefas([t("1", false), t("2", false)])
    );
    expect(result.current).toEqual({ total: 2, concluidas: 0, pendentes: 2 });
  });

  it("conta apenas tarefas concluídas", () => {
    const { result } = renderHook(() =>
      useContadorDeTarefas([t("1", true), t("2", true)])
    );
    expect(result.current).toEqual({ total: 2, concluidas: 2, pendentes: 0 });
  });

  it("conta lista mista corretamente", () => {
    const { result } = renderHook(() =>
      useContadorDeTarefas([t("1", false), t("2", true), t("3", false), t("4", true)])
    );
    expect(result.current).toEqual({ total: 4, concluidas: 2, pendentes: 2 });
  });

  it("garante que total === concluidas + pendentes", () => {
    const { result } = renderHook(() =>
      useContadorDeTarefas([t("1", false), t("2", true), t("3", false)])
    );
    const { total, concluidas, pendentes } = result.current;
    expect(total).toBe(concluidas + pendentes);
  });

  it("atualiza os valores quando a lista muda", () => {
    const { result, rerender } = renderHook(
      ({ tarefas }) => useContadorDeTarefas(tarefas),
      { initialProps: { tarefas: [t("1", false)] } }
    );
    expect(result.current.total).toBe(1);

    rerender({ tarefas: [t("1", true), t("2", false), t("3", false)] });
    expect(result.current).toEqual({ total: 3, concluidas: 1, pendentes: 2 });
  });

  it("reflete remoção de uma tarefa", () => {
    const { result, rerender } = renderHook(
      ({ tarefas }) => useContadorDeTarefas(tarefas),
      { initialProps: { tarefas: [t("1", false), t("2", true)] } }
    );
    expect(result.current.total).toBe(2);

    rerender({ tarefas: [t("2", true)] });
    expect(result.current).toEqual({ total: 1, concluidas: 1, pendentes: 0 });
  });
});
