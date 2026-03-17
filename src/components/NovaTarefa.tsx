"use client";

import { useState } from "react";
import { Tarefa } from "@/types/tarefa";

interface NovaTarefaProps {
  onAdicionar: (tarefa: Tarefa) => void;
}

export function NovaTarefa({ onAdicionar }: NovaTarefaProps) {
  const [titulo, setTitulo] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tituloTrimmed = titulo.trim();

    if (!tituloTrimmed) {
      setErro("O título não pode estar vazio.");
      return;
    }

    if (tituloTrimmed.length < 3) {
      setErro("O título deve ter pelo menos 3 caracteres.");
      return;
    }

    onAdicionar({
      id: crypto.randomUUID(),
      titulo: tituloTrimmed,
      concluida: false,
    });

    setTitulo("");
    setErro("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <input
          type="text"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            if (erro) setErro("");
          }}
          placeholder="Nome da tarefa"
          aria-label="Nome da nova tarefa"
          aria-describedby={erro ? "erro-input" : undefined}
          aria-invalid={!!erro}
          className="input-tarefa"
        />
        <button type="submit" className="btn btn-adicionar">
          Adicionar
        </button>
      </div>
      {erro && (
        <p id="erro-input" role="alert" className="erro">
          {erro}
        </p>
      )}
    </form>
  );
}
