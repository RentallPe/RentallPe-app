import { Property } from "@/Property/domain/model/property.entity.js";

export class PropertyAssembler {
  static toEntityFromResource(r) {
    const src = r?.data ?? r;
    if (!src || !src.id) return null;

    return new Property({
      id: String(src.id),
      ownerId: String(src.ownerId ?? src.userId ?? ""),
      address: src.address ?? "",
      ubigeo: src.ubigeo ?? "",
      province: src.province ?? "",
      region: src.region ?? "",
      areaM2: Number.isFinite(+src.areaM2) ? +src.areaM2 : 0,
      yearsOld: Number.isFinite(+src.yearsOld) ? +src.yearsOld : 0,
      status: src.status ?? "active",
      createdAt: src.createdAt ? new Date(src.createdAt) : new Date(),
      image: src.image ?? "",
      name: src.name ?? "",
      handoverDate: src.handoverDate ? new Date(src.handoverDate) : null,
      progress: Number.isFinite(+src.progress) ? +src.progress : 0,
      alerts: Array.isArray(src.alerts) ? src.alerts : [],
      locks: Array.isArray(src.locks) ? src.locks : [],
    });
  }

  static toEntitiesFromResponse(resp) {
    const arr =
        Array.isArray(resp) ? resp :
            Array.isArray(resp?.data) ? resp.data :
                [];

    return arr
        .map(x => PropertyAssembler.toEntityFromResource(x))
        .filter(Boolean);
  }
}
