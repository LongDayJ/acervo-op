// styled-components removido -- estilos migrados para globals.css e Tailwind
// Mantido como passthrough para nao exigir alteracoes no layout.tsx
export function StyledProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
