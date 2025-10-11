import  {Property} from '@/Rental/domain/model/property.entity.js';

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        return new Property({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['properties'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}