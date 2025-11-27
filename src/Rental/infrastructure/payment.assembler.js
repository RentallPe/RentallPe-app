import {Payment} from "@/Rental/domain/model/payment.entity.js";

export class PaymentAssembler {
    static toEntityFromResource(r) {
        const src = r?.data ?? r;
        if (!src) return null;

        return {
            id: src.id,
            projectId: src.projectId ?? null,
            propertyId: src.propertyId ?? null,
            amount: Number(src.amount ?? 0),
            installment: Number(src.installment ?? 1),
            status: src.status ?? 'pending',
            date: src.date ?? null,
            dueDate: src.dueDate ?? null,
            maturityDate: src.maturityDate ?? null,
            createdAt: src.createdAt ?? null,
            currency: src.currency ?? null,
            currencySymbol: src.currencySymbol ?? null,
        };
    }

    static toEntitiesFromResponse(resp) {
        const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp) ?? [];
        return arr
            .map((x) => PaymentAssembler.toEntityFromResource(x))
            .filter(Boolean);
    }
}
