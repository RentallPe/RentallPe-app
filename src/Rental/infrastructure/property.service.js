import axios from "axios";
import { Property } from "@/Rental/domain/model/property.entity.js";

export async function addProperty(rawData, ownerId = 1) {
    const newProperty = new Property({
        id: Date.now(), // o dejar que json-server lo genere
        ownerId,
        address: rawData.address,
        ubigeo: rawData.ubigeo || "",
        province: rawData.department,
        region: rawData.country,
        areaM2: 0,
        yearsOld: 0,
        status: "available",
        createdAt: new Date().toISOString(),
        image: rawData.image,
        name: rawData.name,
        handoverDate: rawData.handoverDate,
        progress: rawData.progress,
        alerts: [],
        locks: []
    });

    return axios.post("http://localhost:3000/properties", newProperty);
}