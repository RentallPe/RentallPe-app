import {Invoice} from "@/Rental/domain/model/invoice.entity.js";

export class InvoiceAssembler {
    static toEntityFromResource(resource) {
        return new Invoice({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['invoices'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}