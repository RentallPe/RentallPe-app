// src/Monitoring/infrastructure/workitem.assembler.js
export class WorkitemAssembler {
    static toEntityFromResource(resource) {
        return {
            id: resource.id,
            projectId: resource.projectId,
            incidentId: resource.incidentId,
            assignedToUserId: resource.assignedToUserId,
            description: resource.description,
            status: resource.status,
            createdAt: resource.createdAt,
            completedAt: resource.completedAt
        };
    }

    static toEntitiesFromResponse(response) {
        const data = response?.data ?? response;
        return Array.isArray(data)
            ? data.map(r => this.toEntityFromResource(r))
            : [];
    }
}