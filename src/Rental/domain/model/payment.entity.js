
export class PaymentMethod {
    constructor({ id, type, number, expiry, cvv }) {
        this.id = id;
        this.type = type;
        this.number = number;
        this.expiry = expiry;
        this.cvv = cvv;
    }

    maskedNumber() {
        return `**** **** **** ${this.number.slice(-4)}`;
    }
}