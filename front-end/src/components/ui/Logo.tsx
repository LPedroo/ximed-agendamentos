import Image from "next/image"

// Logo em fundo claro apenas (ver DESIGN.md). Arquivo original: 150×45.
export function Logo({ width = 120, priority = false }: { width?: number; priority?: boolean }) {
    return (
        <Image
            src="/logo-ximed.webp"
            alt="Ximed Saúde Ocupacional"
            width={width}
            height={Math.round((width * 45) / 150)}
            priority={priority}
        />
    )
}
