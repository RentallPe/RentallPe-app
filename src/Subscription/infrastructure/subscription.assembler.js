// src/Subscription/infrastructure/subscription.assembler.js
import { SubscriptionEntity } from "../domain/model/subscription.entity.js";

export function toEntity(dto) {
    return new SubscriptionEntity({
        id: dto.id,
        customerId: dto.customerId,   // usa customerId en lugar de userId
        plan: dto.plan,
        price: dto.price,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate
    });
}

export function toDTO(entity) {
    return {
        id: entity.id,
        customerId: entity.customerId,
        plan: entity.plan,
        price: entity.price,
        status: entity.status,
        startDate: entity.startDate,
        endDate: entity.endDate
    };
}