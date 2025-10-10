export class Incident {
    constructor({ id, incNumber, description, date, status }) {
        this.id = id;
        this.incNumber = incNumber;
        this.description = description;
        this.date = new Date(date);
        this.status = status;
    }
}