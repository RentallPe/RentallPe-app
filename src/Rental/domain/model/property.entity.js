/*{
      "id": "1760165416141",
      "ownerId": 1,
      "address": "Fifth Avenue 14032, Surco, Lima",
      "ubigeo": "150140",
      "areaM2": 140,
      "yearsOld": 3,
      "status": "available",
      "createdAt": "2025-10-11T06:50:16.141Z",
      "image": "https://picsum.photos/300/200?random=99",
      "name": "Urban Cottage",
      "handoverDate": null,
      "progress": 45,
      "alerts": [
        {
          "id": "A-100",
          "message": "Consumo eléctrico por encima de lo usual.",
          "createdAt": "2025-10-28T12:00:00Z"
        },
        {
          "id": "A-101",
          "message": "Detección de puerta principal abierta por 10 minutos.",
          "createdAt": "2025-10-29T09:30:00Z"
        }
      ],
      "locks": [],
      "owner": null,
      "combos": [
        {
          "id": 2,
          "providerId": 1,
          "name": "Security Essentials",
          "description": "Smart locks, motion sensors, and cameras.",
          "price": 950,
          "installDays": 3,
          "image": "https://picsum.photos/400/250?random=2"
        },
        {
          "id": 1,
          "providerId": 1,
          "name": "Smart Kitchen Pack",
          "description": "Includes smart oven, water filter, and lighting.",
          "price": 1200,
          "installDays": 5,
          "image": "https://picsum.photos/400/250?random=1"
        }
      ],
      "consumptions": [{
        "id": 1760165416141,
        "projectId": 1001,
        "date": "2025-10-10T00:00:00Z",
        "type": "electricity",
        "amount": 1200,
        "currencySymbol": "$"
      }]
    },*/
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
                    progress = 0,
                    alerts = [],
                    locks = [],
                    combos = [],
                    consumptions = []
                }) {
        this.id = id;
        this.ownerId = ownerId;
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
        this.alerts = alerts;
        this.locks = locks;
        this.owner = null;
        this.combos = combos;
        this.consumptions = consumptions;
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