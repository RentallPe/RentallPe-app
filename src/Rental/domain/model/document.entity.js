// Document entity
import { Project } from "@/Monitoring/domain/model/project.entity.js";

export class Document {
    constructor({ id, projectId, type, filePath, createdAt }) {
        this.id = id;
        this.projectId = projectId;
        this.type = type;
        this.filePath = filePath;
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