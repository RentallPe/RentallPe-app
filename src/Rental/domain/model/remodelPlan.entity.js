/*{
      "id": 1,
      "propertyId": 1,
      "planName": "Kitchen Renovation",
      "scopeSummary": "Furniture replacement and gas installation",
      "startDate": "2025-10-01T08:00:00Z",
      "endDate": "2025-11-01T08:00:00Z",
      "createdAt": "2025-10-01T08:00:00Z"
    }*/
import {Property} from "@/Rental/domain/model/property.entity.js";

export class RemodelPlan {
    constructor({id, propertyId, planName, scopeSummary, startDate, endDate, createdAt}) {
        this.id = id;
        this.propertyId = Property;
        this.planName = planName;
        this.scopeSummary = scopeSummary;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.createdAt = new Date(createdAt);
    }
}