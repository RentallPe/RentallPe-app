/*{
      "id": 1,
      "projectId": 1,
      "description": "Water leak in bathroom",
      "status": "pending",
      "createdAt": "2025-10-01T09:30:00Z",
      "updatedAt": null
    }*/

import { Project } from "./project.entity.js";

export class Incident {
    constructor({ id, projectId, description, status, createdAt, updatedAt }) {
        this.id = id;
        this.projectId = projectId;
        this.description = description;
        this.status = status;
        this.createdAt = new Date(createdAt);
        this.updatedAt = updatedAt;
    }

    setProject(project) {
        if (project instanceof Project) {
            this.project = project;
        } else {
            throw new Error("Invalid project instance");
        }
    }
}