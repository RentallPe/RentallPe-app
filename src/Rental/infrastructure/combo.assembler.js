import { Combo } from "../domain/model/combo.entity";

export class ComboAssembler {
    static toEntityFromResource(resource) {
        return new Combo({...resource});
    }
    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['combos'];
        return resources.map(resource => this.toEntityFromResource(resource));
    } 
}