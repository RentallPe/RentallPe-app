import {IotDevice} from "@/Rental/domain/model/iotDevice.entity.js";

export class IotDeviceAssembler {
    static toEntityFromResource(resource) {
        return new IotDevice({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['iotDevices'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}