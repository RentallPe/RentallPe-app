import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import { RentalApi } from '@/Rental/infrastructure/rental-api.js';
import { UserAssembler } from '@/Rental/infrastructure/user.assembler.js';
import { PropertyAssembler } from '@/Rental/infrastructure/property.assembler.js';
import { OwnerAssembler } from '@/Rental/infrastructure/owner.assembler.js';
import { ProviderAssembler } from '@/Rental/infrastructure/provider.assembler.js';
import { ProjectAssembler } from '@/Rental/infrastructure/project.assembler.js';
import { TaskAssembler } from '@/Rental/infrastructure/task.assembler.js';
import { IncidentAssembler } from '@/Rental/infrastructure/incident.assembler.js';
import { DocumentAssembler } from '@/Rental/infrastructure/document.assembler.js';
import { InvoiceAssembler } from '@/Rental/infrastructure/invoice.assembler.js';
import { IotDeviceAssembler } from '@/Rental/infrastructure/iotDevice.assembler.js';
import { NotificationAssembler } from '@/Rental/infrastructure/notification.assembler.js';
import { OwnerTypeAssembler } from '@/Rental/infrastructure/ownerType.assembler.js';
import { PaymentAssembler } from '@/Rental/infrastructure/payment.assembler.js';
import { RemodelPlanAssembler } from '@/Rental/infrastructure/remodelPlan.assembler.js';
import { BudgetAssembler } from '@/Rental/infrastructure/budget.assembler.js';
import { ComboAssembler } from '@/Rental/infrastructure/combo.assembler.js';

const api = new RentalApi();

const assemblers = {
    users: UserAssembler,
    properties: PropertyAssembler,
    owners: OwnerAssembler,
    providers: ProviderAssembler,
    projects: ProjectAssembler,
    tasks: TaskAssembler,
    incidents: IncidentAssembler,
    documents: DocumentAssembler,
    invoices: InvoiceAssembler,
    iot_devices: IotDeviceAssembler,
    notifications: NotificationAssembler,
    payments: PaymentAssembler,
    owner_types: OwnerTypeAssembler,
    remodel_plans: RemodelPlanAssembler,
    budgets: BudgetAssembler,
    combos: ComboAssembler
};

export const useRentalStore = defineStore('rental', () => {

    const lists    = shallowRef({});      
    const loaded   = ref({});             
    const indexes  = shallowRef({});     
    const errors   = shallowRef([]);     


    const inflight = new Map();           

    function ensureBuckets(name) {
        if (!lists.value[name])   lists.value[name] = [];
        if (!loaded.value[name])  loaded.value[name] = false;
        if (!indexes.value[name]) indexes.value[name] = new Map();
    }

    function getAssembler(name) {
        const A = assemblers[name];
        if (!A) throw new Error(`Assembler no registrado para: ${name}`);
        return A;
    }

    function endpoint(name) {
        const ep = api.getEndpoint(name);
        if (!ep) throw new Error(`Endpoint no registrado: ${name}`);
        return ep;
    }


    async function fetchAll(name, { force = false } = {}) {
        ensureBuckets(name);
        if (loaded.value[name] && !force) return;

        if (inflight.has(name)) { await inflight.get(name); return; }

        const ep = endpoint(name);
        const A  = getAssembler(name);

        const p = ep.getAll()
            .then((resp) => {
                const entities = A.toEntitiesFromResponse(resp);
                lists.value[name] = entities;
                loaded.value[name] = true;

                const map = new Map();
                for (let i = 0; i < entities.length; i++) {
                    const id = entities[i]?.id ?? entities[i]?.['id'];
                    if (id !== undefined) map.set(id, i);
                }
                indexes.value[name] = map;
            })
            .catch((e) => {
                errors.value.push({ name, op: 'getAll', error: e });
                lists.value[name] = [];
                loaded.value[name] = false;
                indexes.value[name] = new Map();
            })
            .finally(() => inflight.delete(name));

        inflight.set(name, p);
        await p;
    }


    async function fetchById(name, id) {
        ensureBuckets(name);


        const idx = indexes.value[name].get(id);
        if (typeof idx === 'number') return lists.value[name][idx];

        const ep = endpoint(name);
        const A  = getAssembler(name);

        try {
            const resp = await ep.getById(id);
            const resource = resp.data ?? resp;
            const ent = A.toEntityFromResource(resource);
            const list = lists.value[name];

            const i = indexes.value[name].get(ent.id);
            if (typeof i === 'number') list[i] = ent;
            else {
                list.push(ent);
                indexes.value[name].set(ent.id, list.length - 1);
            }
            return ent;
        } catch (e) {
            errors.value.push({ name, op: 'getById', id, error: e });
            return null;
        }
    }


    async function create(name, payload) {
        ensureBuckets(name);
        const ep = endpoint(name);
        const A  = getAssembler(name);

        try {
            const resp = await ep.create(payload);
            const resource = resp.data ?? resp;
            const ent = A.toEntityFromResource(resource);

            lists.value[name].push(ent);
            indexes.value[name].set(ent.id, lists.value[name].length - 1);
            return ent;
        } catch (e) {
            errors.value.push({ name, op: 'create', error: e });
            throw e;
        }
    }


    async function update(name, payload) {
        ensureBuckets(name);
        const ep = endpoint(name);
        const A  = getAssembler(name);

        try {
            const resp = await ep.update(payload);
            const resource = resp.data ?? resp;
            const ent = A.toEntityFromResource(resource);

            const idx = indexes.value[name].get(ent.id);
            if (typeof idx === 'number') lists.value[name][idx] = ent;
            else {
                lists.value[name].push(ent);
                indexes.value[name].set(ent.id, lists.value[name].length - 1);
            }
            return ent;
        } catch (e) {
            errors.value.push({ name, op: 'update', error: e });
            throw e;
        }
    }


    async function remove(name, id) {
        ensureBuckets(name);
        const ep = endpoint(name);

        try {
            await ep.delete(id);
            const idx = indexes.value[name].get(id);
            if (typeof idx === 'number') {
                lists.value[name].splice(idx, 1);
                indexes.value[name].delete(id);

                for (let i = idx; i < lists.value[name].length; i++) {
                    const itemId = lists.value[name][i]?.id ?? lists.value[name][i]?.['id'];
                    if (itemId !== undefined) indexes.value[name].set(itemId, i);
                }
            }
        } catch (e) {
            errors.value.push({ name, op: 'delete', id, error: e });
            throw e;
        }
    }


    function list(name) {
        ensureBuckets(name);
        return computed(() => lists.value[name]);
    }

    function isLoaded(name) {
        ensureBuckets(name);
        return computed(() => !!loaded.value[name]);
    }

    function count(name) {
        ensureBuckets(name);
        return computed(() => (loaded.value[name] ? lists.value[name].length : 0));
    }

    function getLocalById(name, id) {
        ensureBuckets(name);
        const idx = indexes.value[name].get(id);
        return idx !== undefined ? lists.value[name][idx] : undefined;
    }

    return {

        lists, loaded, indexes, errors,

        fetchAll, fetchById, list, isLoaded, count, getLocalById,

        create, update, remove
    };
});
