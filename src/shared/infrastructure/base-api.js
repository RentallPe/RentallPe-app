import axios from 'axios';

const base = (import.meta.env.VITE_LEARNING_PLATFORM_API_URL || '').replace(/\/+$/,'');

export class BaseApi {
  #http;
  get http() { return this.#http; }

  constructor() {
    console.log('BaseApi: baseURL=', base);
    if (!base) throw new Error(' VITE_LEARNING_PLATFORM_API_URL no definido');
    this.#http = axios.create({
      baseURL: base,
      headers: {
       'X-Master-Key': '$2a$10$csiSVb3HS6k3Kcz61azB6uO1ll90RHs/QMDItpeW1Kiep5kHXDuzO',
        'Content-Type': 'application/json',
      },
    });
    
  }
}