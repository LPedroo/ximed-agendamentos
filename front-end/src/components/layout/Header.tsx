"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/ui/Logo"

type Props = {
    items: { label: string; href: string }[]
    userName: string
    roleLabel: string
}

// Pílula flutuante fixa; abaixo de 1200px vira hambúrguer e expande em coluna.
export function Header({ items, userName, roleLabel }: Props) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const linkClass = (href: string) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return `text-sm transition-colors duration-200 hover:text-primary max-xl:text-base ${active ? "font-semibold text-primary" : "font-medium text-text"}`
    }

    return (
        <header className="fixed inset-x-0 top-4 z-40 px-5">
            <div
                className={`mx-auto max-w-[1200px] bg-[rgba(243,243,243,.92)] py-2 pr-2.5 pl-[22px] shadow-header backdrop-blur-[10px] ${open ? "rounded-[28px]" : "rounded-full"}`}
            >
                <div className="flex items-center justify-between gap-4">
                    <Link href="/appointments" aria-label="Ximed — início" className="flex shrink-0 items-center">
                        <Logo width={108} priority />
                    </Link>

                    <nav aria-label="Principal" className="hidden items-center gap-8 xl:flex">
                        {items.map((item) => (
                            <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined} className={linkClass(item.href)}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-4 xl:flex">
                        <div className="text-right text-[13px] leading-tight">
                            <p className="font-medium">{userName}</p>
                            <p className="text-text-muted">{roleLabel}</p>
                        </div>
                        <form action={logout}>
                            <Button type="submit" size="sm" variant="secondary" arrow={false}>Sair</Button>
                        </form>
                    </div>

                    <button
                        type="button"
                        aria-label={open ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                        className="flex size-10 items-center justify-center rounded-full text-text hover:bg-white xl:hidden"
                    >
                        {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
                    </button>
                </div>

                {open && (
                    <div className="flex flex-col gap-4 px-2 pt-4 pb-4 xl:hidden">
                        <nav aria-label="Principal móvel" className="flex flex-col gap-4">
                            {items.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={linkClass(item.href)}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex items-center justify-between gap-3 border-t border-border-strong pt-4">
                            <div className="text-[13px] leading-tight">
                                <p className="font-medium">{userName}</p>
                                <p className="text-text-muted">{roleLabel}</p>
                            </div>
                            <form action={logout}>
                                <Button type="submit" size="sm" variant="secondary" arrow={false}>Sair</Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
