import { User } from "@/Rental/domain/model/user.entity.js";

export class UserAssembler {
    static toEntityFromResource(resource) {
        return new User({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = Array.isArray(response.data)
            ? response.data
            : response.data.users || [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}