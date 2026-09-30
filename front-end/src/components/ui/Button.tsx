import Link from "next/link"
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react"
import { ArrowRight } from "lucide-react"

type Variant = "primary" | "secondary" | "danger"
type Size = "md" | "sm"

type StyleProps = { variant?: Variant; size?: Size; arrow?: boolean; fullWidth?: boolean }

const VARIANT_CLASS: Record<Variant, { button: string; circle: string }> = {
    primary: { button: "bg-primary text-white hover:bg-primary-dark", circle: "bg-white text-primary" },
    secondary: { button: "border border-border-strong bg-white text-text hover:bg-surface", circle: "bg-primary text-white" },
    danger: { button: "border border-error/30 bg-white text-error hover:bg-error/5", circle: "bg-error text-white" },
}

// Pílula com círculo de seta à direita (padrão-assinatura). `arrow={false}` para ações compactas e submits.
const buttonClass = ({ variant = "primary", size = "md", arrow = true, fullWidth = false }: StyleProps) =>
    [
        "group inline-flex items-center justify-center gap-2.5 rounded-full font-medium select-none",
        "transition-[transform,box-shadow,background-color] duration-200 active:scale-[.98]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 text-[13px]" : "h-[39px] text-sm",
        arrow ? "pl-3.5 pr-[3px]" : size === "sm" ? "px-3.5" : "px-5",
        fullWidth && "w-full h-[51px] text-[15px] font-semibold shadow-button",
        VARIANT_CLASS[variant].button,
    ]
        .filter(Boolean)
        .join(" ")

function Content({ children, variant = "primary", size = "md", arrow = true }: StyleProps & { children: ReactNode }) {
    return (
        <>
            {children}
            {arrow && (
                <span
                    aria-hidden
                    className={`flex items-center justify-center rounded-full ${size === "sm" ? "size-[26px]" : "size-[33px]"} ${VARIANT_CLASS[variant].circle}`}
                >
                    <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-0.5" strokeWidth={1.75} />
                </span>
            )}
        </>
    )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps

export function Button({ variant, size, arrow, fullWidth, className = "", children, ...props }: ButtonProps) {
    return (
        <button className={`${buttonClass({ variant, size, arrow, fullWidth })} ${className}`} {...props}>
            <Content variant={variant} size={size} arrow={arrow}>{children}</Content>
        </button>
    )
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps

export function ButtonLink({ variant, size, arrow, fullWidth, className = "", children, ...props }: ButtonLinkProps) {
    return (
        <Link className={`${buttonClass({ variant, size, arrow, fullWidth })} ${className}`} {...props}>
            <Content variant={variant} size={size} arrow={arrow}>{children}</Content>
        </Link>
    )
}
