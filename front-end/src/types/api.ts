export type ApiIssue = { path: string; message: string }

export type ApiFailure = {
    ok: false
    status: number
    error: string
    message: string
    issues?: ApiIssue[]
}

export type ActionResult<T> = { ok: true; data: T } | ApiFailure
