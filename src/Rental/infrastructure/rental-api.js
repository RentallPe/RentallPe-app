import {BaseApi} from "@/shared/infrastructure/base-api.js";
import {BaseEndpoint} from "@/shared/infrastructure/base-endpoint.js";
import { JsonBinEndpoint } from './jsonbin-endpoint.js';

const endpointKeys = [
    "USERS",
    "IOT_DEVICES",
    "DOCUMENTS",
    "INVOICES",
    "INCIDENTS",
    "NOTIFICATIONS",
    "PAYMENTS",
    "REMOTE_PLANS",
    "BUDGETS",
    "PROPERTIES",
    "OWNERS",
    "PROVIDERS",
    "PROJECTS",
    "TASKS",
    "OWNER_TYPES"
];
/**
 * @typedef {Object} CrudGroup
 * @property {() => Promise<any[]>} getAll
 * @property {(id: number|string) => Promise<any>} getById
 * @property {(data: any) => Promise<any>} create
 * @property {(data: any) => Promise<any>} update
 * @property {(id: number|string) => Promise<any>} delete
 */

/**
 * @typedef {Object} LearningPlatformApi
 * @property {( ) => Promise<any[]>} getUsers
 * @property {(id: number|string) => Promise<any>} getUserById
 * @property {(data: any) => Promise<any>} createUser
 * @property {(data: any) => Promise<any>} updateUser
 * @property {(id: number|string) => Promise<any>} deleteUser
 * @property {(name: string) => CrudGroup} getEndpoint
 */

/** @type {RentalApi } */
export class RentalApi extends BaseApi {
  #endpoints = {};

  constructor() {
    super();

    const base = this.http?.defaults?.baseURL ?? '';
    const autoKind = /jsonbin\.io\/v\d+\/b\//.test(base) ? 'jsonbin' : 'rest';
    const kind = (import.meta.env.VITE_BACKEND_KIND || autoKind).toLowerCase();


    if (kind === 'rest' && /jsonbin\.io/.test(base)) {
      throw new Error('Config inválida: base JSONBin con modo REST. Usa VITE_BACKEND_KIND=jsonbin.');
    }
    console.log('[RentalApi] KIND=', kind);

    const endpointsMap = {
      users:        import.meta.env.VITE_USERS_ENDPOINT_PATH,
      iot_devices:  import.meta.env.VITE_IOT_DEVICES_ENDPOINT_PATH,
      documents:    import.meta.env.VITE_DOCUMENTS_ENDPOINT_PATH,
      invoices:     import.meta.env.VITE_INVOICES_ENDPOINT_PATH,
      incidents:    import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH,
      notifications:import.meta.env.VITE_NOTIFICATIONS_ENDPOINT_PATH,
      payments:     import.meta.env.VITE_PAYMENTS_ENDPOINT_PATH,
      remote_plans: import.meta.env.VITE_REMOTE_PLANS_ENDPOINT_PATH,
      budgets:      import.meta.env.VITE_BUDGETS_ENDPOINT_PATH,
      properties:   import.meta.env.VITE_PROPERTIES_ENDPOINT_PATH,
      owners:       import.meta.env.VITE_OWNERS_ENDPOINT_PATH,
      providers:    import.meta.env.VITE_PROVIDERS_ENDPOINT_PATH,
      projects:     import.meta.env.VITE_PROJECTS_ENDPOINT_PATH,
      tasks:        import.meta.env.VITE_TASKS_ENDPOINT_PATH,
      owner_types:  import.meta.env.VITE_OWNER_TYPES_ENDPOINT_PATH,
      combos:       import.meta.env.VITE_COMBOS_ENDPOINT_PATH,
    };

    const jsonKeyMap = {
      iot_devices:  'iotDevices',
      remote_plans: 'remodelPlans',
      owner_types:  'ownerTypes',
    };

    for (const [name, path] of Object.entries(endpointsMap)) {
      if (kind === 'jsonbin') {
        const key = jsonKeyMap[name] || name;
        this.#endpoints[name] = new JsonBinEndpoint(this, key);
      } else {
        if (!path) { console.warn(`[RentalApi] Falta VITE_${name.toUpperCase()}_ENDPOINT_PATH. Se omite.`); continue; }
        const safePath = path.startsWith('/') ? path : `/${path}`;
        this.#endpoints[name] = new BaseEndpoint(this, safePath);
      }

      this[`get${cap(name)}`]                 = () => this.#endpoints[name].getAll();
      this[`get${cap(name.slice(0,-1))}ById`] = (id)  => this.#endpoints[name].getById(id);
      this[`create${cap(name.slice(0,-1))}`]  = (d)   => this.#endpoints[name].create(d);
      this[`update${cap(name.slice(0,-1))}`]  = (d)   => this.#endpoints[name].update(d.id, d);
      this[`delete${cap(name.slice(0,-1))}`]  = (id)  => this.#endpoints[name].delete(id);
    }
  }

  getEndpoint(name) { return this.#endpoints[name]; }
}
const cap = s => s[0].toUpperCase() + s.slice(1);