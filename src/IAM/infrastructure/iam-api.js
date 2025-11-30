// src/IAM/infrastructure/iam-api.js
import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";

export class IamApi {
    constructor() {
        const api = new BaseApi();
        this.endpoints = {
            users: new BaseEndpoint(api, "/users")
        };
    }

    getEndpoint(name) {
        return this.endpoints[name];
    }
}