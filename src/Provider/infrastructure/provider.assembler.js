import { Provider } from "@/Provider/domain/model/provider.entity.js";

export class ProviderAssembler {

    static toEntityFromResource(resource) {
        if (!resource) return null;

        return new Provider({
            id: Number(resource.id),
            name: resource.name ?? "",
            contact: resource.contact ?? ""
        });
    }

    static toEntitiesFromResponse(response) {
        const arr = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.data?.providers)
                    ? response.data.providers
                    : [];

        return arr.map(r => this.toEntityFromResource(r)).filter(Boolean);
    }
}
