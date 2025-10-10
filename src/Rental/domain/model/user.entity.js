
import { Property } from "./property.entity.js";
import { Incident } from "./incident.entity.js";
import { PaymentMethod } from "./payment.entity.js";

export class User {
    constructor({ id, name, country, department, photo, properties = [], incidents = [], paymentMethods = [] }) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.department = department;
        this.photo = photo;
        this.properties = properties.map(p => new Property(p));
        this.incidents = incidents.map(i => new Incident(i));
        this.paymentMethods = paymentMethods.map(pm => new PaymentMethod(pm));
    }
    getLatestAlerts(limit = 3) {
        return this.properties.flatMap(p => p.alerts || []).slice(0, limit);
    }

    getPendingPayments(limit = 3) {
        return (this.payments || []).slice(0, limit);
    }
    addPaymentMethod(payment) {
        this.paymentMethods.push(new PaymentMethod(payment));
    }


}