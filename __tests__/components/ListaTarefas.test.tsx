import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ListaTarefas } from "@/components/ListaTarefas";
import { Tarefa } from "@/types/tarefa";

const tarefasMock: Tarefa[] = [
  { id: "1", titulo: "Tarefa pendente", concluida: false },
  { id: "2", titulo: "Tarefa concluída", concluida: true },
  { id: "3", titulo: "Outra tarefa", concluida: false },
];

describe("ListaTarefas", () => {
  describe("Renderização", () => {
    it("exibe todas as tarefas recebidas", () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      expect(screen.getByText("Tarefa pendente")).toBeInTheDocument();
      expect(screen.getByText("Tarefa concluída")).toBeInTheDocument();
      expect(screen.getByText("Outra tarefa")).toBeInTheDocument();
    });

    it("exibe mensagem quando lista está vazia", () => {
      render(<ListaTarefas tarefasIniciais={[]} />);
      expect(screen.getByText(/nenhuma tarefa/i)).toBeInTheDocument();
    });

    it("exibe contador com totais corretos", () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      expect(contador).toHaveTextContent("3"); // total
      expect(contador).toHaveTextContent("2"); // pendentes
      expect(contador).toHaveTextContent("1"); // concluídas
    });

    it("exibe botão Remover para cada tarefa", () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const botoesRemover = screen.getAllByRole("button", { name: /remover tarefa/i });
      expect(botoesRemover).toHaveLength(3);
    });

    it("exibe checkbox marcado para tarefa concluída", () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const checkbox = screen.getByRole("checkbox", { name: /tarefa concluída/i });
      expect(checkbox).toBeChecked();
    });

    it("exibe checkbox desmarcado para tarefa pendente", () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const checkbox = screen.getByRole("checkbox", { name: /tarefa pendente/i });
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Toggle de tarefa", () => {
    it("marca uma tarefa pendente como concluída", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const checkbox = screen.getByRole("checkbox", { name: /tarefa pendente/i });
      fireEvent.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());
    });

    it("desmarca uma tarefa concluída", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const checkbox = screen.getByRole("checkbox", { name: /tarefa concluída/i });
      fireEvent.click(checkbox);
      await waitFor(() => expect(checkbox).not.toBeChecked());
    });

    it("atualiza o contador ao fazer toggle", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const checkbox = screen.getByRole("checkbox", { name: /tarefa pendente/i });
      fireEvent.click(checkbox);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      await waitFor(() => {
        const numeros = Array.from(contador.querySelectorAll(".contador-numero")).map(
          (el) => el.textContent
        );
        expect(numeros[2]).toBe("2"); // concluídas aumentou para 2
      });
    });
  });

  describe("Adicionar tarefa", () => {
    it("adiciona nova tarefa à lista", async () => {
      const user = userEvent.setup();
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "Nova tarefa");
      fireEvent.submit(screen.getByRole("textbox", { name: /nome da nova tarefa/i }).closest("form")!);
      await waitFor(() => expect(screen.getByText("Nova tarefa")).toBeInTheDocument());
    });

    it("atualiza o contador total após adicionar", async () => {
      const user = userEvent.setup();
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "Mais uma");
      fireEvent.submit(screen.getByRole("textbox", { name: /nome da nova tarefa/i }).closest("form")!);
      const contador = screen.getByLabelText(/contador de tarefas/i);
      await waitFor(() => {
        expect(contador.querySelector(".contador-numero")?.textContent).toBe("4");
      });
    });
  });

  describe("Remover tarefa — modal", () => {
    it("abre o modal ao clicar em Remover", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      const botoes = screen.getAllByRole("button", { name: /remover tarefa/i });
      fireEvent.click(botoes[0]);
      await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    });

    it("exibe o título da tarefa no modal", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      fireEvent.click(screen.getAllByRole("button", { name: /remover tarefa: tarefa pendente/i })[0]);
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toHaveTextContent("Tarefa pendente");
      });
    });

    it("fecha o modal ao clicar em Cancelar", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      fireEvent.click(screen.getAllByRole("button", { name: /remover tarefa/i })[0]);
      await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
      fireEvent.click(screen.getByRole("button", { name: /cancelar exclusão/i }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("remove a tarefa ao confirmar no modal", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      fireEvent.click(screen.getByRole("button", { name: /remover tarefa: tarefa pendente/i }));
      await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
      fireEvent.click(screen.getByRole("button", { name: /confirmar exclusão/i }));
      await waitFor(() => {
        expect(screen.queryByText("Tarefa pendente")).not.toBeInTheDocument();
      });
    });

    it("não remove se o usuário cancelar", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      fireEvent.click(screen.getAllByRole("button", { name: /remover tarefa/i })[0]);
      await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
      fireEvent.click(screen.getByRole("button", { name: /cancelar exclusão/i }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expect(screen.getByText("Tarefa pendente")).toBeInTheDocument();
    });

    it("atualiza o contador após remover", async () => {
      render(<ListaTarefas tarefasIniciais={tarefasMock} />);
      fireEvent.click(screen.getAllByRole("button", { name: /remover tarefa/i })[0]);
      await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
      fireEvent.click(screen.getByRole("button", { name: /confirmar exclusão/i }));
      const contador = screen.getByLabelText(/contador de tarefas/i);
      await waitFor(() => {
        expect(contador.querySelector(".contador-numero")?.textContent).toBe("2");
      });
    });
  });
});
