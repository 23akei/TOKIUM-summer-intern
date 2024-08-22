import {Api} from "../openapi/api"


export const api = new Api({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
})
