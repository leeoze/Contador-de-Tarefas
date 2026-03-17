require("@testing-library/jest-dom");

// jsdom não implementa crypto.randomUUID — polyfill para os testes
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () =>
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  },
});