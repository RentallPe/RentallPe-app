import axios from 'axios';

const platformApi = import.meta.env.VITE_LEARNING_PLATFORM_API_URL;

export class BaseApi {
    #http;

    get http() {
        return this.#http;
    }

    constructor() {
        this.#http = axios.create({baseURL: platformApi,
             headers: {
        'X-Master-Key': '$2a$10$csiSVb3HS6k3Kcz61azB6uO1ll90RHs/QMDItpeW1Kiep5kHXDuzO',
        'Content-Type': 'application/json',
      },});
    }
}