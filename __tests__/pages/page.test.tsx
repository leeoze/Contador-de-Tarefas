import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { buscarTarefas } from "@/lib/dados";
import { ListaTarefas } from "@/components/ListaTarefas";

describe("Página principal — integração", () => {
  describe("buscarTarefas", () => {
    it("retorna uma lista não-vazia", async () => {
      const tarefas = await buscarTarefas();
      expect(tarefas.length).toBeGreaterThan(0);
    });

    it("retorna tarefas com id, titulo e concluida", async () => {
      const tarefas = await buscarTarefas();
      tarefas.forEach((t) => {
        expect(typeof t.id).toBe("string");
        expect(typeof t.titulo).toBe("string");
        expect(typeof t.concluida).toBe("boolean");
      });
    });

    it("contém ao menos uma tarefa pendente e uma concluída", async () => {
      const tarefas = await buscarTarefas();
      expect(tarefas.some((t) => !t.concluida)).toBe(true);
      expect(tarefas.some((t) => t.concluida)).toBe(true);
    });
  });

  describe("Renderização com dados reais", () => {
    it("exibe todas as tarefas da fonte de dados", async () => {
      const tarefas = await buscarTarefas();
      render(<ListaTarefas tarefasIniciais={tarefas} />);
      tarefas.forEach((t) => {
        expect(screen.getByText(t.titulo)).toBeInTheDocument();
      });
    });

    it("exibe o total correto no contador", async () => {
      const tarefas = await buscarTarefas();
      render(<ListaTarefas tarefasIniciais={tarefas} />);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      const numeros = contador.querySelectorAll(".contador-numero");
      expect(numeros[0].textContent).toBe(String(tarefas.length));
    });

    it("exibe o número correto de pendentes", async () => {
      const tarefas = await buscarTarefas();
      const pendentes = tarefas.filter((t) => !t.concluida).length;
      render(<ListaTarefas tarefasIniciais={tarefas} />);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      const numeros = contador.querySelectorAll(".contador-numero");
      expect(numeros[1].textContent).toBe(String(pendentes));
    });

    it("exibe o número correto de concluídas", async () => {
      const tarefas = await buscarTarefas();
      const concluidas = tarefas.filter((t) => t.concluida).length;
      render(<ListaTarefas tarefasIniciais={tarefas} />);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      const numeros = contador.querySelectorAll(".contador-numero");
      expect(numeros[2].textContent).toBe(String(concluidas));
    });

    it("exibe botão remover para cada tarefa", async () => {
      const tarefas = await buscarTarefas();
      render(<ListaTarefas tarefasIniciais={tarefas} />);
      const botoesRemover = screen.getAllByRole("button", { name: /remover tarefa/i });
      expect(botoesRemover).toHaveLength(tarefas.length);
    });
  });
});
