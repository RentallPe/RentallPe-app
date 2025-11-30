// src/Monitoring/infrastructure/monitoring-api.js
import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";

export class MonitoringApi {
    constructor() {
        const api = new BaseApi();
        this.endpoints = {
            incidents: new BaseEndpoint(api, "/incidents"),
            projects: new BaseEndpoint(api, "/projects"),
            notifications: new BaseEndpoint(api, "/notifications"),
            iotDevices: new BaseEndpoint(api, "/iotDevices"),
            workitems: new BaseEndpoint(api, "/workitems")
        };
    }

    getEndpoint(name) {
        return this.endpoints[name];
    }
}