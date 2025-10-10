import {Provider} from "@/Rental/domain/model/provider.entity.js";

export class ProviderAssembler {
    static toEntityFromResource(resource) {
        return new Provider({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['providers'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}