import { Subscription} from "../domain/model/subscription.entity.js";

export function toEntity(dto) {
    return new Subscription({
        id: dto.id,
        userId: dto.userId,
        plan: dto.plan,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate
    });
}

export function toDTO(entity) {
    return {
        id: entity.id,
        userId: entity.userId,
        plan: entity.plan,
        status: entity.status,
        startDate: entity.startDate,
        endDate: entity.endDate
    };
}