"use client"

import { Button } from "@/components/ui/Button"

// Erros inesperados (API fora do ar, rate limit...). Não desloga o usuário.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="w-full max-w-md rounded-xl border border-border bg-white p-8 text-center">
        <h1 className="mb-3 text-[clamp(30px,4vw,40px)] leading-[1.2] font-semibold tracking-[-0.02em] text-primary">Algo deu errado</h1>
        <p className="mb-6 text-text-muted">{error.digest ? "Não foi possível carregar esta página. Tente novamente em instantes." : error.message}</p>
        <Button type="button" arrow={false} onClick={reset}>Tentar novamente</Button>
      </section>
    </main>
  )
}
