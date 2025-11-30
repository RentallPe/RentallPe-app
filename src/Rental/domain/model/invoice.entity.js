// Invoice entity
import { Payment } from "@/Rental/domain/model/payment.entity.js";

export class Invoice {
    constructor({ id, paymentId, number, issueDate, createdAt }) {
        this.id = id;
        this.paymentId = paymentId; // 👈 usar el id, no la clase
        this.number = number;
        this.issueDate = new Date(issueDate);
        this.createdAt = new Date(createdAt);
    }

    setPayment(payment) {
        if (payment instanceof Payment) {
            this.payment = payment;
        } else {
            throw new Error("Invalid payment instance");
        }
    }
}