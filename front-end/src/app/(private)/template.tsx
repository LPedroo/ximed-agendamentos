// Template remonta a cada navegação, repetindo o reveal (fade + subida) da página.
export default function PrivateTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-reveal">{children}</div>
}
