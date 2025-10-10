/*
* {
      "id": 1,
      "fullName": "Mario Vargas",
      "email": "mario@example.com",
      "password": "1234",
      "phone": "999999999",
      "createdAt": "2025-10-01T06:00:00Z"
    }*/

export class User{
    constructor({id, fullName, email, password, phone, createdAt}){
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.createdAt = createdAt;
    }
}