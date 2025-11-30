// Rental/infrastructure/property.assembler.js
import { Property } from "@/Property/domain/model/property.entity.js";

export class PropertyAssembler {
  static toEntityFromResource(r) {
    const src = r?.data ?? r;
    if (!src) return null;
    return {
      id: src.id,
      ownerId: src.ownerId ?? src.userId ?? null,
      name: src.name ?? null,
      address: src.address ?? "",
      province: src.province ?? "",
      region: src.region ?? "",
      status: src.status ?? "",
      handoverDate: src.handoverDate ?? null,
      progress: Number.isFinite(+src.progress) ? +src.progress : 0,
      image: src.image ?? "",
      alerts: Array.isArray(src.alerts) ? src.alerts : [],
      locks: Array.isArray(src.locks) ? src.locks : [],
      combos: Array.isArray(src.combos) ? src.combos : [],
      areaM2: Number.isFinite(+src.areaM2) ? +src.areaM2 : 0,
      yearsOld: Number.isFinite(+src.yearsOld) ? +src.yearsOld : 0,
      createdAt: src.createdAt ?? null,
    };
  }

  static toEntitiesFromResponse(resp) {
    const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp) ?? [];
    return arr.map((x) => PropertyAssembler.toEntityFromResource(x)).filter(Boolean);
  }
}