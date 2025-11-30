import { IotDevice } from "@/Monitoring/domain/model/iotDevice.entity.js";

export class IotDeviceAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new IotDevice({
            id: resource.id ?? null,
            projectId: resource.projectId ?? null,
            type: resource.type ?? "",
            status: resource.status ?? "inactive",
            installedAt: resource.installedAt ?? null
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response) return [];
        if (response.status && response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }


        let resources = [];
        if (Array.isArray(response)) {
            resources = response;
        } else if (Array.isArray(response.data)) {
            resources = response.data;
        } else if (response.data?.iotDevices) {
            resources = response.data.iotDevices;
        }

        return resources.map(r => this.toEntityFromResource(r)).filter(Boolean);
    }
}