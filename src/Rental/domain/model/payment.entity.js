/* {
      "id": 1,
      "projectId": 1,
      "amount": 1500.5,
      "date": "2025-10-01T12:00:00Z",
      "status": "paid",
      "createdAt": "2025-10-01T12:10:00Z"
    }*/

import {Project} from "@/Monitoring/domain/model/project.entity.js";

export class Payment {
    constructor({
                    id,
                    comboId,
                    propertyId,
                    customerId,
                    providerId,
                    amount,
                    status,
                    date,
                    propertyName,
                    customerName
                }) {
        this.id = id;
        this.comboId = comboId;
        this.propertyId = propertyId;
        this.customerId = customerId;
        this.providerId = providerId;
        this.amount = amount;
        this.status = status;
        this.date = date;
        this.propertyName = propertyName;
        this.customerName = customerName;
    }
}
