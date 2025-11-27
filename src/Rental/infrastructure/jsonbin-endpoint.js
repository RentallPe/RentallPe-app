
export class JsonBinEndpoint {
  constructor(api, collectionKey) {
    if (!collectionKey) throw new Error('[JsonBinEndpoint] key requerida');
    this.http = api.http;         
    this.key = collectionKey;     
  }

  async #readBin() {
    
    const { data } = await this.http.get('/latest');
    return data.record || {};
  }
  async #writeBin(record) {
    
    const { data } = await this.http.put('/', record);
    return data.record || record;
  }

  async getAll() {
    const bin = await this.#readBin();
    return Array.isArray(bin[this.key]) ? bin[this.key] : [];
  }

  async getById(id) {
    const all = await this.getAll();
    return all.find(x => String(x.id) === String(id));
  }

  async create(resource) {
    const bin = await this.#readBin();
    const arr = Array.isArray(bin[this.key]) ? bin[this.key] : [];
    const entity = { id: resource.id ?? Date.now(), ...resource };
    arr.push(entity);
    bin[this.key] = arr;
    await this.#writeBin(bin);
    return entity;
  }

  async update(id, resource) {
    const bin = await this.#readBin();
    const arr = Array.isArray(bin[this.key]) ? bin[this.key] : [];
    const idx = arr.findIndex(x => String(x.id) === String(id));
    if (idx === -1) throw new Error(`[JsonBinEndpoint] ${this.key} id ${id} no existe`);
    arr[idx] = { ...arr[idx], ...resource, id };
    bin[this.key] = arr;
    await this.#writeBin(bin);
    return arr[idx];
  }

  async delete(id) {
    const bin = await this.#readBin();
    const arr = Array.isArray(bin[this.key]) ? bin[this.key] : [];
    const next = arr.filter(x => String(x.id) !== String(id));
    bin[this.key] = next;
    await this.#writeBin(bin);
    return { id };
  }
}
