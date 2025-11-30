import { Combo } from "../domain/model/combo.entity.js";

export class ComboAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        return new Combo({
            id: Number(resource.id),
            providerId: Number(resource.providerId) || null,
            name: resource.name ?? "",
            description: resource.description ?? "",
            price: Number(resource.price) || 0,
            installDays: resource.installDays ?? "—",
            planType: (
                resource.planType ??
                resource.plan_type ??
                resource.plan ??
                "basic"
            ).toString().toLowerCase(),
            image: resource.image ?? resource.img ?? `https://picsum.photos/400/250?random=${resource.id}`
        });
    }

    static toEntitiesFromResponse(resp) {
        const arr = Array.isArray(resp)
            ? resp
            : Array.isArray(resp.data)
                ? resp.data
                : resp.data?.combos ?? [];

        return arr.map(r => this.toEntityFromResource(r)).filter(Boolean);
    }
}
