
export class BaseEndpoint {
  constructor(api, path) {
    
    if (!path) throw new Error('[BaseEndpoint] path indefinido');
    this.http = api.http;
    this.path = path.startsWith('/') ? path : `/${path}`;
  }
  getAll()           { return this.http.get(this.path).then(r => r.data); }
  getById(id)        { return this.http.get(`${this.path}/${id}`).then(r => r.data); }
  create(resource)   { return this.http.post(this.path, resource).then(r => r.data); }
  update(id, data)   { return this.http.put(`${this.path}/${id}`, data).then(r => r.data); }
  delete(id)         { return this.http.delete(`${this.path}/${id}`).then(r => r.data); }
}
