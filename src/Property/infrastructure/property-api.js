// src/Property/infrastructure/property-api.js
import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";

export class PropertyApi {
    constructor() {
        const api = new BaseApi();
        this.endpoints = {
            properties: new BaseEndpoint(api, "/properties")
        };
    }

    getEndpoint(name) {
        return this.endpoints[name];
    }
}