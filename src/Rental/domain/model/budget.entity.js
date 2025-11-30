/*{
      "id": 1,
      "projectId": 1,
      "providerId": 1,
      "amount": 10000.0,
      "estimatedDays": 30,
      "createdAt": "2025-10-01T13:00:00Z"
    }*/
import {Project} from "@/Monitoring/domain/model/project.entity.js";
import {Provider} from "@/Provider/domain/model/provider.entity.js";

export class Budget {
    constructor({id, projectId, providerId, amount, estimatedDays, createdAt}) {
        this.id = id;
        this.projectId = Project;
        this.providerId = Provider;
        this.amount = amount;
        this.estimatedDays = estimatedDays;
        this.createdAt = new Date(createdAt);
    }
}