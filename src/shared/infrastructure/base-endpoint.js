
export class BaseEndpoint {
  constructor(api, path) {
    
    if (!path) throw new Error('[BaseEndpoint] path indefinido');
    this.http = api.http;
    this.path = path.startsWith('/') ? path : `/${path}`;
  }
  getAll()           { return this.http.get(this.path).then(r => r.data); }
  getById(id)        { return this.http.get(`${this.path}/${id}`).then(r => r.data); }
  create(resource)   { return this.http.post(this.path, resource).then(r => r.data); }
  update(arg1, arg2) {
        let id, data;
        if (typeof arg1 === 'object' && arg1 !== null && arg2 === undefined) {
            id = arg1.id ?? arg1['id'];
            data = arg1;
        } else {
            id = arg1;
            data = arg2;
        }
        if (id == null) throw new Error('[BaseEndpoint.update] id is required');
        return this.http.put(`${this.path}/${encodeURIComponent(String(id))}`, data).then(r => r.data);
    }
  delete(id)         { return this.http.delete(`${this.path}/${id}`).then(r => r.data); }
}
