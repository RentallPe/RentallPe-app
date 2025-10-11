/*
*  {
      "id": 1,
      "ownerTypeId": "T1",
      "businessName": "Juan Pérez SAC",
      "documentType": "RUC",
      "documentNumber": "12345678901",
      "phone": "987654321",
      "email": "juanperez@example.com",
      "address": "123 Fake Street",
      "createdAt": "2025-10-01T09:00:00Z"
    }*/
import { OwnerType } from "./ownerType.entity";

export class Owner {
  constructor({
    id,
    ownerTypeId,
    businessName,
    documentType,
    documentNumber,
    phone,
    email,
    address,
    createdAt,
  }) {
    this.id = id;
    this.ownerTypeId = ownerTypeId;
    this.businessName = businessName;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.createdAt = createdAt;
  }

  setOwnerType(ownerType) {
    if (ownerType instanceof OwnerType) {
      this.ownerType = ownerType;
    } else {
      throw new Error("Invalid OwnerType");
    }
  }
  getOwnerType() {
    return this.ownerType;
  }
}