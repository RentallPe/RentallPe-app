import axios from "axios";

export class BaseEndpoint {
  constructor(api, path) {
    if (!path) throw new Error('[BaseEndpoint] path indefinido');
    this.api = api;
    this.http = api.http;
    this.path = path.startsWith('/') ? path : `/${path}`;
  }

  getAll()           { return this.http.get(this.path).then(r => r.data); }
  getById(id)        { return this.http.get(`${this.path}/${id}`).then(r => r.data); }
  create(resource)   { return this.http.post(this.path, resource).then(r => r.data); }
  update(id, data)   { return this.http.put(`${this.path}/${id}`, data).then(r => r.data); }
  patch(id, data)    { return this.http.patch(`${this.path}/${id}`, data).then(r => r.data); } 
  delete(id)         { return this.http.delete(`${this.path}/${id}`).then(r => r.data); }
  customPost(subPath, payload) {
    return this.http.post(`${this.path}/${subPath}`, payload).then(r => r.data);
  }


}