// Rental/domain/model/property.entity.js
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
                image = "",
                name = "",
                handoverDate = null,
                progress = 0
              }) {
    this.id = id;
    this.ownerId = ownerId; // mantener como número
    this.address = address;
    this.ubigeo = ubigeo;
    this.province = province;
    this.region = region;
    this.areaM2 = areaM2;
    this.yearsOld = yearsOld;
    this.status = status;
    this.createdAt = createdAt;


    this.image = image;
    this.name = name;
    this.handoverDate = handoverDate;
    this.progress = progress;

    this.owner = null;
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