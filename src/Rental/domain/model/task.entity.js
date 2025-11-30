// Task entity
import { Project } from "@/Monitoring/domain/model/project.entity.js";

export class Task {
    constructor({ id, projectId, name, description, status, createdAt }) {
        this.id = id;
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = new Date(createdAt);
    }

    setProject(project) {
        if (project instanceof Project) {
            this.project = project;
        } else {
            throw new Error("Invalid project instance");
        }
    }
}