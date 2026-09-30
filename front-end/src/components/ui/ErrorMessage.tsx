export function ErrorMessage({ message }: { message: string }) {
    return (
        <p role="alert" className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {message}
        </p>
    )
}
