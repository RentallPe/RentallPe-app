import {BaseApi} from "@/shared/infrastructure/base-api.js";
import {BaseEndpoint} from "@/shared/infrastructure/base-endpoint.js";

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

/** @type {LearningPlatformApi} */
export class LearningPlatformApi extends BaseApi {
    #endpoints = {};

    constructor() {
        super();


        endpointKeys.forEach(key => {
            const path = import.meta.env[`VITE_${key}_ENDPOINT_PATH`];
            const name = key.toLowerCase();
            this.#endpoints[name] = new BaseEndpoint(this, path);


            this[`get${capitalize(name)}`] = () => this.#endpoints[name].getAll();
            this[`get${capitalize(name.slice(0, -1))}ById`] = id => this.#endpoints[name].getById(id);
            this[`create${capitalize(name.slice(0, -1))}`] = data => this.#endpoints[name].create(data);
            this[`update${capitalize(name.slice(0, -1))}`] = data =>
                this.#endpoints[name].update(data.id, data);
            this[`delete${capitalize(name.slice(0, -1))}`] = id =>
                this.#endpoints[name].delete(id);
        });
    }

    getEndpoint(name) {
        return this.#endpoints[name];
    }
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
