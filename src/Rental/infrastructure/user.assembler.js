import { User } from "@/Rental/domain/model/user.entity.js";

export class UserAssembler {
     static toEntityFromResource(r) {
    const src = r?.data ?? r;
    if (!src) return null;
    return {
      id: src.id,
      fullName: src.fullName ?? "",
      email: src.email ?? "",
      phone: src.phone ?? "",
      createdAt: src.createdAt ?? null,
      photo: src.photo ?? "",
      paymentMethods: Array.isArray(src.paymentMethods) ? src.paymentMethods : [],
    };
  }

    static toEntitiesFromResponse(resp) {
    const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp) ?? [];
    return arr.map((x) => UserAssembler.toEntityFromResource(x)).filter(Boolean);
  }
}