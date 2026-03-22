"use client";

interface ConfirmacaoModalProps {
  titulo: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmacaoModal({
  titulo,
  onConfirmar,
  onCancelar,
}: ConfirmacaoModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="modal-overlay"
      onClick={onCancelar}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p id="modal-titulo" className="modal-pergunta">
          Excluir tarefa?
        </p>
        <p className="modal-tarefa">&quot;{titulo}&quot;</p>
        <div className="modal-acoes">
          <button
            onClick={onCancelar}
            className="btn btn-cancelar"
            aria-label="Cancelar exclusão"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="btn btn-confirmar"
            aria-label="Confirmar exclusão"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
