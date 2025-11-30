/* {
      "id": 1,
      "propertyId": 1,
      "userId": 1,
      "name": "House Renovation 1",
      "status": "in_progress",
      "startDate": "2025-10-01",
      "endDate": "2025-12-01",
      "createdAt": "2025-10-01T08:00:00Z"
    }*/
import {Property} from "@/Property/domain/model/property.entity.js";
import {User} from "@/IAM/domain/model/user.entity.js";

export class Project {
  constructor({id, propertyId, userId, name, status, startDate, endDate, createdAt}){
    this.id = id;
    this.propertyId = new Property();
    this.userId = new User();
    this.name = name;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
  }

  setPropertie(propertie){
    if(propertie instanceof Propertie){
      this.propertie = propertie;
    }else{
      throw new Error("Invalid Propertie");
    }
  }
  getPropertie(){
    return this.propertie;
  }

  setUser(user){
    if(user instanceof User){
      this.user = user;
    }else{
      throw new Error("Invalid User");
    }
  }
  getUser(){
    return this.user;
  }
}