// src/Rental/domain/model/property.entity.js
export class Property {
    constructor({ id, name, country, department, address, number, image, handoverDate, progress, alerts = [], locks = [] }) {
        this.id = id || Date.now();
        this.name = name || "New Property";
        this.country = country;
        this.department = department;
        this.address = address;
        this.number = number;
        this.image = image;
        this.handoverDate = handoverDate ? new Date(handoverDate) : null;
        this.progress = progress || 0;
        this.alerts = alerts;
        this.locks = locks;
    }

    isCompleted() {
        return this.progress === 100;
    }
}