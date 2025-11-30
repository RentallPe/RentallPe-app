// src/Provider/infrastructure/provider-api.js
import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";

export class ProviderApi {
    constructor() {
        const api = new BaseApi();
        this.endpoints = {
            combos: new BaseEndpoint(api, "/combos"),
            providers: new BaseEndpoint(api, "/providers")
        };
    }

    getEndpoint(name) {
        return this.endpoints[name];
    }
}