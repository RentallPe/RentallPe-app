import {OwnerType} from "@/Rental/domain/model/ownerType.entity.js";

export class OwnerTypeAssembler {
    static toEntityFromResource(resource) {
        return new OwnerType({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['ownerTypes'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}