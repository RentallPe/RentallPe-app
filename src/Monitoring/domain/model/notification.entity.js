/*{
      "id": 1,
      "userId": 1,
      "projectId": 1,
      "message": "New task assigned",
      "createdAt": "2025-10-01T07:00:00Z"
    }*/
import { User } from "../../../IAM/domain/model/user.entity.js";
import { Project } from "./project.entity.js";

export class Notification {
    constructor({ id, userId, projectId, message, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.message = message;
        this.createdAt = createdAt;
    }

    setUser(user) {
        if (user instanceof User) {
            this.user = user;
        } else {
            throw new Error("Invalid user instance");
        }
    }
    setProject(project) {
        if (project instanceof Project) {
            this.project = project;
        } else {
            throw new Error("Invalid project instance");
        }
    }
}