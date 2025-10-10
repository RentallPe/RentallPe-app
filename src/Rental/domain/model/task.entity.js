/* {
      "id": 1,
      "projectId": 1,
      "name": "Install wiring",
      "description": "Run network cables throughout the house",
      "status": "pending",
      "createdAt": "2025-10-01T09:00:00Z"
    }*/
import { Project } from "@/Rental/domain/model/project.entity.js";

export class Task {
    constructor({ id, projectId, name, description, status, createdAt }) {
        this.id = id;
        this.projectId = Project;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = new Date(createdAt);
    }
}