export class Workitem {
    constructor({ id, projectId, incidentId, assignedToUserId, description, status, createdAt, completedAt }) {
        this.id = id;
        this.projectId = projectId;
        this.incidentId = incidentId;
        this.assignedToUserId = assignedToUserId;
        this.description = description ?? "";
        this.status = status ?? "pending";
        this.createdAt = createdAt ?? new Date().toISOString();
        this.completedAt = completedAt ?? null;
    }


    markCompleted() {
        this.status = "completed";
        this.completedAt = new Date().toISOString();
    }

    reopen() {
        this.status = "in_progress";
        this.completedAt = null;
    }
}