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
    constructor({ id, projectId, propertyId, amount, installment, status, date, dueDate, maturityDate, createdAt, currency, currencySymbol }) {
        this.id = id;
        this.projectId = projectId ?? null;
        this.propertyId = propertyId ?? null;
        this.amount = Number(amount ?? 0);
        this.installment = Number(installment ?? 1);
        this.status = status ?? 'pending';
        this.date = date ?? null;
        this.dueDate = dueDate ?? null;
        this.maturityDate = maturityDate ?? null;
        this.createdAt = createdAt ?? null;
        this.currency = currency ?? null;
        this.currencySymbol = currencySymbol ?? null;
    }
}
