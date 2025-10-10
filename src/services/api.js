// src/services/api.js
import axios from "axios";
import { UserAssembler} from "@/Rental/application/assembler/user.assembler.js";
import { ComboAssembler } from "@/Rental/application/assembler/combo.assembler.js";
import { PropertyAssembler } from "@/Rental/application/assembler/property.assembler.js";


const API_URL = "http://localhost:3000";

export async function getUser() {
    const response = await axios.get(`${API_URL}/user`);
    return UserAssembler.toEntityFromResponse(response);
}

export async function updateUser(data) {
    const response = await axios.patch(`${API_URL}/user`, data);
    return UserAssembler.toEntityFromResponse(response);
}

export async function getCombos() {
    const response = await axios.get(`${API_URL}/combos`);
    return ComboAssembler.toEntitiesFromResponse(response);
}
export async function addProperty(newProperty) {
    const userResponse = await axios.get(`${API_URL}/user`);
    const user = userResponse.data;

    const updatedProperties = [...user.properties, newProperty];

    const response = await axios.patch(`${API_URL}/user`, { properties: updatedProperties });
    return PropertyAssembler.toEntitiesFromResponse(response);
}
export async function addPaymentMethod(newMethod) {
    const userResponse = await axios.get(`${API_URL}/user`);
    const user = userResponse.data;

    const updatedMethods = [...user.paymentMethods, newMethod];

    const response = await axios.patch(`${API_URL}/user`, { paymentMethods: updatedMethods });
    return UserAssembler.toEntityFromResponse(response);
}

