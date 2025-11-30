import {Project} from "@/Monitoring/domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntityFromResource(resource) {
        return new Project({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['projects'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}