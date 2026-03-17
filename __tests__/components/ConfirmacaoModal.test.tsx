import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmacaoModal } from "@/components/ConfirmacaoModal";

describe("ConfirmacaoModal", () => {
  const mockConfirmar = jest.fn();
  const mockCancelar = jest.fn();

  beforeEach(() => {
    mockConfirmar.mockClear();
    mockCancelar.mockClear();
  });

  describe("Renderização", () => {
    it("exibe o título da tarefa entre aspas", () => {
      render(
        <ConfirmacaoModal
          titulo="Minha Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      expect(screen.getByText(/"Minha Tarefa"/)).toBeInTheDocument();
    });

    it("exibe o botão Confirmar", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      expect(screen.getByRole("button", { name: /confirmar exclusão/i })).toBeInTheDocument();
    });

    it("exibe o botão Cancelar", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      expect(screen.getByRole("button", { name: /cancelar exclusão/i })).toBeInTheDocument();
    });

    it("tem role=dialog e aria-modal=true", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Interação", () => {
    it("chama onConfirmar ao clicar em Excluir", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: /confirmar exclusão/i }));
      expect(mockConfirmar).toHaveBeenCalledTimes(1);
    });

    it("chama onCancelar ao clicar em Cancelar", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: /cancelar exclusão/i }));
      expect(mockCancelar).toHaveBeenCalledTimes(1);
    });

    it("chama onCancelar ao clicar no overlay", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      fireEvent.click(screen.getByRole("dialog"));
      expect(mockCancelar).toHaveBeenCalledTimes(1);
    });

    it("não propaga o clique do overlay ao clicar dentro do modal", () => {
      render(
        <ConfirmacaoModal
          titulo="Tarefa"
          onConfirmar={mockConfirmar}
          onCancelar={mockCancelar}
        />
      );
      // Clicar no texto interno não deve chamar onCancelar
      fireEvent.click(screen.getByText(/"Tarefa"/));
      expect(mockCancelar).not.toHaveBeenCalled();
    });
  });
});
