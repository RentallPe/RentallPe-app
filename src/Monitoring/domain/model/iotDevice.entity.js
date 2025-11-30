/*
* {
      "id": 1,
      "projectId": 1,
      "type": "Temperature Sensor",
      "status": "active",
      "installedAt": "2025-10-01T08:00:00Z"
    }*/

import {Project} from "@/Monitoring/domain/model/project.entity.js";

export class IotDevice {
    constructor({id, projectId, type, status, installedAt}){
        this.id = id;
        this.projectId = new Project();
        this.type = type;
        this.status = status;
        this.installedAt = installedAt;
    }

    setProject(project){
        if(project instanceof Project){
            this.project = project;
        }else{
            throw new Error("Invalid Project");
        }
    }
    getProject(){
        return this.project;
    }
}