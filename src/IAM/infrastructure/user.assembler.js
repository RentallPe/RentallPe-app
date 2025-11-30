import { User } from "@/IAM/domain/model/user.entity.js";

export class UserAssembler {
    static toEntityFromResource(r) {
        const src = r?.data ?? r;
        if (!src) return null;
        return {
            id: src.id,
            fullName: src.fullName ?? "",
            email: src.email ?? "",
            password: src.password ?? "",
            phone: src.phone ?? "",
            createdAt: src.createdAt ?? null,
            photo: src.photo ?? "",
            paymentMethods: Array.isArray(src.paymentMethods) ? src.paymentMethods : [],
            role: src.role ?? "customer",
            providerId: src.providerId ?? null
        };

    }

    static toEntitiesFromResponse(resp) {
        const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp) ?? [];
        return arr.map((x) => UserAssembler.toEntityFromResource(x)).filter(Boolean);
    }
}