import { ButtonLink } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="w-full max-w-md rounded-xl border border-border bg-white p-8 text-center">
        <p className="mb-2 text-sm font-semibold text-primary">Erro 404</p>
        <h1 className="mb-3 text-[clamp(30px,4vw,40px)] leading-[1.2] font-semibold tracking-[-0.02em] text-primary">Página não encontrada</h1>
        <p className="mb-6 text-text-muted">O endereço que você acessou não existe ou foi removido.</p>
        <ButtonLink href="/appointments" arrow={false}>Voltar ao início</ButtonLink>
      </section>
    </main>
  )
}
