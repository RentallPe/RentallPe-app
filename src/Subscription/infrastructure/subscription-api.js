import axios from "axios";
import { toEntity, toDTO } from "./subscription.assembler.js";

const BASE_URL = "http://localhost:3000/subscription";

export async function fetchSubscriptions(userId) {
    const res = await axios.get(BASE_URL);
    return res.data.filter(s => s.customerId === userId).map(toEntity);
}

export async function createSubscription(entity) {
    const dto = toDTO(entity);
    const res = await axios.post(BASE_URL, dto);
    return toEntity(res.data);
}

export async function updateSubscription(entity) {
    const dto = toDTO(entity);
    const res = await axios.patch(`${BASE_URL}/${entity.id}`, dto);
    return toEntity(res.data);
}