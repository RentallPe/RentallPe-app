import {Budget} from "../domain/model/budget.entity";

export class BudgetAssembler {
    static toEntityFromResource(resource) {
        return new Budget({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['budgets'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}