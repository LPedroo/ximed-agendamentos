import { redirect } from "next/navigation"
import { LoginForm } from "@/components/forms/LoginForm"
import { Logo } from "@/components/ui/Logo"
import { getCurrentUser } from "@/lib/session"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  // Cookie existente não basta: só redireciona se a API confirmar a sessão (evita loop com token expirado).
  // Na tela de login, falha da API (fora do ar, rate limit) não deve impedir de exibir o formulário.
  const user = await getCurrentUser().catch(() => null)
  if (user) redirect("/")

  const { expired } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-primary to-secondary px-5 py-16">
      <section className="animate-reveal w-full max-w-md rounded-xl bg-white p-8 shadow-card md:p-10">
        <div className="mb-6 flex justify-center">
          <Logo width={150} priority />
        </div>
        <h1 className="mb-2 text-center text-[clamp(30px,4vw,40px)] leading-[1.2] font-semibold tracking-[-0.02em] text-primary">Entrar</h1>
        <p className="mb-8 text-center text-text-muted">Acesse o sistema de agendamento de exames.</p>
        <LoginForm expired={expired === "1"} />
      </section>
    </main>
  )
}
