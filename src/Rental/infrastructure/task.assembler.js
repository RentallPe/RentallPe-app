import {Task} from "@/Rental/domain/model/task.entity.js";

export class TaskAssembler {
    static toEntityFromResource(resource) {
        return new Task({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['tasks'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}