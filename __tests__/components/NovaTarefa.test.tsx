import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NovaTarefa } from "@/components/NovaTarefa";

describe("NovaTarefa", () => {
  const mockAdicionar = jest.fn();

  beforeEach(() => mockAdicionar.mockClear());

  describe("Renderização", () => {
    it("exibe o campo de input", () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      expect(screen.getByRole("textbox", { name: /nome da nova tarefa/i })).toBeInTheDocument();
    });

    it("exibe o botão Adicionar", () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      expect(screen.getByRole("button", { name: /adicionar/i })).toBeInTheDocument();
    });

    it("inicia com o campo vazio", () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      expect(screen.getByRole("textbox", { name: /nome da nova tarefa/i })).toHaveValue("");
    });

    it("não exibe erro inicialmente", () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("exibe erro ao submeter campo vazio", async () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/não pode estar vazio/i);
      });
    });

    it("exibe erro se título tiver menos de 3 caracteres", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "ab");
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/pelo menos 3 caracteres/i);
      });
    });

    it("exibe erro se título for só espaços", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "   ");
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/não pode estar vazio/i);
      });
    });

    it("marca o input como aria-invalid quando há erro", async () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => {
        expect(screen.getByRole("textbox", { name: /nome da nova tarefa/i })).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("limpa o erro ao digitar após um erro", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "a");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Submissão", () => {
    it("chama onAdicionar com título e concluida=false", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "Minha tarefa");
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => expect(mockAdicionar).toHaveBeenCalledTimes(1));
      expect(mockAdicionar.mock.calls[0][0]).toMatchObject({
        titulo: "Minha tarefa",
        concluida: false,
      });
    });

    it("limpa o campo após submissão válida", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      const input = screen.getByRole("textbox", { name: /nome da nova tarefa/i });
      await user.type(input, "Tarefa válida");
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => expect(input).toHaveValue(""));
    });

    it("remove espaços extras do título antes de salvar", async () => {
      const user = userEvent.setup();
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      await user.type(screen.getByRole("textbox", { name: /nome da nova tarefa/i }), "  Tarefa  ");
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      await waitFor(() => expect(mockAdicionar).toHaveBeenCalledTimes(1));
      expect(mockAdicionar.mock.calls[0][0].titulo).toBe("Tarefa");
    });

    it("não chama onAdicionar se título for inválido", () => {
      render(<NovaTarefa onAdicionar={mockAdicionar} />);
      fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
      expect(mockAdicionar).not.toHaveBeenCalled();
    });
  });
});