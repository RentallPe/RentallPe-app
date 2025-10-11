/* {
      "id": 1,
      "projectId": 1,
      "amount": 1500.5,
      "date": "2025-10-01T12:00:00Z",
      "status": "paid",
      "createdAt": "2025-10-01T12:10:00Z"
    }*/

import {Project} from "@/Rental/domain/model/project.entity.js";

export class Payment {
    constructor({id, projectId, amount, date, status, createdAt}) {
        this.id = id;
        this.projectId = projectId;
        this.amount = amount;
        this.date = new Date(date);
        this.status = status;
        this.createdAt = new Date(createdAt);
    }
}