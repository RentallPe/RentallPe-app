
import { User} from "@/Rental/domain/model/user.entity.js";

export class UserAssembler {
    static toEntityFromResource(resource) {
        return new User(resource);
    }

    static toEntityFromResponse(response) {
        if (response.status && response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return null;
        }
        return this.toEntityFromResource(response.data || response);
    }
}