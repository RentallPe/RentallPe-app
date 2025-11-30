/* {
      "id": 1,
      "providerId": 1,
      "name": "Smart Kitchen Pack",
      "description": "Includes smart oven, water filter, and lighting.",
      "price": 1200,
      "installDays": 5,
      "image": "https://picsum.photos/400/250?random=1"
    },*/

    export class Combo {
        constructor({ id, providerId, name, description, price, installDays, image }) {
            this.id = id;
            this.providerId = providerId;
            this.name = name;
            this.description = description;
            this.price = price;
            this.installDays = installDays;
            this.image = image;
        } 
    }