/* {
      "id": 1,
      "propertyId": 1,
      "userId": 1,
      "name": "House Renovation 1",
      "status": "in_progress",
      "startDate": "2025-10-01",
      "endDate": "2025-12-01",
      "createdAt": "2025-10-01T08:00:00Z"
    }*/
import {Property} from "@/Rental/domain/model/property.entity.js";
import {User} from "@/Rental/domain/model/user.entity.js";

export class Project {
    constructor({ id, propertyId, userId, name, status, startDate, endDate, createdAt }) {
        this.id = id;
        this.propertyId = propertyId ?? null;
        this.userId = userId ?? null;
        this.name = name ?? '';
        this.status = status ?? 'pending';
        this.startDate = startDate ?? null;
        this.endDate = endDate ?? null;
        this.createdAt = createdAt ?? null;
    }


    setProperty(property) { this.property = property; }
    getProperty() { return this.property; }
    setUser(user) { this.user = user; }
    getUser() { return this.user; }
}
