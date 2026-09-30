import { withQuery, type ListParams } from "@/utils/query"

// Apenas as rotas da API. Usadas pelos actions em /src/actions.
const API_BASE_URL = `${process.env.API_URL ?? "http://localhost:3333"}/api`

export const ApiRoutes = {
    auth: {
        login: () => `${API_BASE_URL}/auth/login`,
        logout: () => `${API_BASE_URL}/auth/logout`,
        me: () => `${API_BASE_URL}/me`,
    },

    users: {
        create: () => `${API_BASE_URL}/users`,
        findAll: (params?: ListParams) => withQuery(`${API_BASE_URL}/users`, params),
        findById: (id: string) => `${API_BASE_URL}/users/${id}`,
        update: (id: string) => `${API_BASE_URL}/users/${id}`,
        disable: (id: string) => `${API_BASE_URL}/users/${id}/disable`,
        enable: (id: string) => `${API_BASE_URL}/users/${id}/enable`,
    },

    rooms: {
        create: () => `${API_BASE_URL}/rooms`,
        findAll: (params?: ListParams) => withQuery(`${API_BASE_URL}/rooms`, params),
        findById: (id: string) => `${API_BASE_URL}/rooms/${id}`,
        update: (id: string) => `${API_BASE_URL}/rooms/${id}`,
        delete: (id: string) => `${API_BASE_URL}/rooms/${id}`,
    },

    examTypes: {
        create: () => `${API_BASE_URL}/exam-types`,
        findAll: (params?: ListParams) => withQuery(`${API_BASE_URL}/exam-types`, params),
        findById: (id: string) => `${API_BASE_URL}/exam-types/${id}`,
        update: (id: string) => `${API_BASE_URL}/exam-types/${id}`,
        disable: (id: string) => `${API_BASE_URL}/exam-types/${id}/disable`,
        enable: (id: string) => `${API_BASE_URL}/exam-types/${id}/enable`,
    },

    appointments: {
        create: () => `${API_BASE_URL}/appointments`,
        findAll: (params?: ListParams) => withQuery(`${API_BASE_URL}/appointments`, params),
        findById: (id: string) => `${API_BASE_URL}/appointments/${id}`,
        update: (id: string) => `${API_BASE_URL}/appointments/${id}`,
        cancel: (id: string) => `${API_BASE_URL}/appointments/${id}/cancel`,
        delete: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    },

    medicalExaminations: {
        create: () => `${API_BASE_URL}/medical-examinations`,
        findAll: (params?: ListParams) => withQuery(`${API_BASE_URL}/medical-examinations`, params),
        findById: (id: string) => `${API_BASE_URL}/medical-examinations/${id}`,
        update: (id: string) => `${API_BASE_URL}/medical-examinations/${id}`,
        delete: (id: string) => `${API_BASE_URL}/medical-examinations/${id}`,
    },
} as const
