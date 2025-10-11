/*
*  {
      "id": 1,
      "ownerId": 1,
      "address": "742 Evergreen Terrace",
      "ubigeo": "150101",
      "province": "Lima",
      "region": "Lima",
      "areaM2": 120.5,
      "yearsOld": 10,
      "status": "occupied",
      "createdAt": "2025-10-01T10:00:00Z"
    }*/

import { Owner } from "./owner.entity";

export class Property {
  constructor({
    id,
    ownerId,
    address,
    ubigeo,
    province,
    region,
    areaM2,
    yearsOld,
    status,
    createdAt,
  }) {
    this.id = id;
    this.ownerId = new Owner();
    this.address = address;
    this.ubigeo = ubigeo;
    this.province = province;
    this.region = region;
    this.areaM2 = areaM2;
    this.yearsOld = yearsOld;
    this.status = status;
    this.createdAt = createdAt;
  }

  setOwner(owner) {
    if (owner instanceof Owner) {
      this.owner = owner;
    } else {
      throw new Error("Invalid Owner");
    }
  }
  getOwner() {
    return this.owner;
  }
}