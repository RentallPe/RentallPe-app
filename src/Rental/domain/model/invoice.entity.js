/*{
      "id": 1,
      "paymentId": 1,
      "number": "INV-001",
      "issueDate": "2025-10-01",
      "createdAt": "2025-10-01T11:00:00Z"
    }*/

import { Payment } from "@/Rental/domain/model/payment.entity.js";

export class Invoice {
    constructor({ id, paymentId, number, issueDate, createdAt }) {
        this.id = id;
        this.paymentId = Payment;
        this.number = number;
        this.issueDate = new Date(issueDate);
        this.createdAt = new Date(createdAt);
    }
}