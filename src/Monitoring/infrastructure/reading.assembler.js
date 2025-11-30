// src/Monitoring/infrastructure/reading.assembler.js
export class ReadingAssembler {
    static toEntityFromResource(resource) {
        return {
            id: resource.id,
            iotDeviceId: resource.iotDeviceId,
            projectId: resource.projectId,
            metricName: resource.metricName,
            value: resource.value,
            unit: resource.unit,
            timestamp: resource.timestamp
        };
    }

    static toEntitiesFromResponse(response) {
        const data = response?.data ?? response;
        return Array.isArray(data)
            ? data.map(r => this.toEntityFromResource(r))
            : [];
    }
}