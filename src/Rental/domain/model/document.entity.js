/* {
      "id": 1,
      "projectId": 1,
      "type": "Blueprint",
      "filePath": "/docs/plan1.pdf",
      "createdAt": "2025-10-01T10:00:00Z"
    }*/

import { Project } from "../../../Monitoring/domain/model/project.entity.js";

export class Document {
    constructor({ id, projectId, type, filePath, createdAt }) {
        this.id = id;
        this.projectId = projectId;
        this.type = type;
        this.filePath = filePath;
        this.createdAt = createdAt;
    }

    setProject(project) {
        if (project instanceof Project) {
            this.project = project;
        } else {
            throw new Error("Invalid project instance");
        }
    }
}