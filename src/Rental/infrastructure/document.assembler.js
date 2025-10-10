import {Document} from "@/Rental/domain/model/document.entity.js";

export class DocumentAssembler {
    static toEntityFromResource(resource) {
        return new Document({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['documents'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}