// src/Monitoring/application/monitoring-store.js
import { defineStore } from "pinia";
import { MonitoringApi } from "@/Monitoring/infrastructure/monitoring-api.js";
import { IncidentAssembler } from "@/Monitoring/infrastructure/incident.assembler.js";
import { ProjectAssembler } from "@/Monitoring/infrastructure/project.assembler.js";
import { NotificationAssembler } from "@/Monitoring/infrastructure/notification.assembler.js";
import { IotDeviceAssembler } from "@/Monitoring/infrastructure/iotDevice.assembler.js";
import { ReadingAssembler } from "@/Monitoring/infrastructure/reading.assembler.js";
import { WorkitemAssembler } from "@/Monitoring/infrastructure/workitem.assembler.js";

const api = new MonitoringApi();

export const useMonitoringStore = defineStore("monitoring", {
    state: () => ({
        incidents: [],
        projects: [],
        notifications: [],
        iotDevices: [],
        readings: [],
        workitems: []
    }),
    actions: {
        async fetchIncidents() {
            const res = await api.getEndpoint("incidents").getAll();
            this.incidents = IncidentAssembler.toEntitiesFromResponse(res);
        },
        async createIncident(payload) {
            const res = await api.getEndpoint("incidents").create(payload);
            const incident = IncidentAssembler.toEntityFromResource(res);
            this.incidents.push(incident);
            return incident;
        },
        async fetchProjects() {
            const res = await api.getEndpoint("projects").getAll();

            console.log("RESPUESTA RAW API:", res);


            const rawArray = Array.isArray(res) ? res : res?.data ?? [];

            this.projects = rawArray;
        }

        ,
        async createProject(payload) {
            const res = await api.getEndpoint("projects").create(payload);
            const project = ProjectAssembler.toEntityFromResource(res?.data ?? res);

            if (!project) {
                console.warn("Assembler devolvió null, usando payload como fallback");
                this.projects.push(payload);
                return payload;
            }

            this.projects.push(project);
            return project;
        }
        ,
        async fetchNotifications() {
            const res = await api.getEndpoint("notifications").getAll();
            this.notifications = NotificationAssembler.toEntitiesFromResponse(res);
        },
        async fetchDevices() {
            const res = await api.getEndpoint("iotDevices").getAll();
            this.iotDevices = IotDeviceAssembler.toEntitiesFromResponse(res);
        },
        async createDevice(payload) {
            const res = await api.getEndpoint("iotDevices").create(payload);
            const device = IotDeviceAssembler.toEntityFromResource(res.data);
            this.iotDevices.push(device);
            return device;
        },
        async fetchWorkitems() {
            const res = await api.getEndpoint("workitems").getAll();
            this.workitems = WorkitemAssembler.toEntitiesFromResponse(res);
        }
    }
});