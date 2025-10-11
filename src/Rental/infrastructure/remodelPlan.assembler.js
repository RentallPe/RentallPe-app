import {RemodelPlan} from "@/Rental/domain/model/remodelPlan.entity.js";

export class RemodelPlanAssembler {
    static toEntityFromResource(resource) {
        return new RemodelPlan({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['remodelPlans'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}