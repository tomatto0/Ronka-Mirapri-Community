class LocalDB {
  db_name: string;
  store_name: string;
  autoIncrement: boolean | undefined;
  db: IDBDatabase | undefined;

  constructor(db_name: string, store_name: string, autoIncrement?: boolean) {
    this.db_name = db_name;
    this.store_name = store_name;
    this.autoIncrement = autoIncrement ?? true;
  }

  open(version: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.db) {
        return resolve();
      }
      const DBrequest = indexedDB.open(this.db_name, version);
      DBrequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBRequest<IDBDatabase>).result;
        if (!db.objectStoreNames.contains(this.store_name)) {
          db.createObjectStore(this.store_name, {
            keyPath: "id",
            autoIncrement: this.autoIncrement,
          });
        }
      };

      DBrequest.onsuccess = (e: Event) => {
        const db = (e.target as IDBRequest<IDBDatabase>).result;
        this.db = db;
        resolve();
      };

      DBrequest.onerror = () => {
        reject(new Error(DBrequest.error?.message || "IndexDB open Error"));
      };
    });
  }

  clear(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        return reject(new Error("IndexDB open Error"));
      }

      const transaction = this.db.transaction(this.store_name, "readwrite");
      const store = transaction.objectStore(this.store_name);

      const clear_request = store.clear();

      clear_request.onsuccess = (e: Event) => {
        resolve();
      };
      clear_request.onerror = (e: Event) => {
        reject(new Error("indexedDB clear Error"));
      };
    });
  }
  add(value: any, key?: IDBValidKey): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        return reject(new Error("IndexDB open Error"));
      }
      const transaction = this.db.transaction(this.store_name, "readwrite");
      const store = transaction.objectStore(this.store_name);

      const add_request = store.add(key ? { image: value, id: key } : value);

      add_request.onsuccess = (e: Event) => {
        resolve();
      };
      add_request.onerror = (e: Event) => {
        reject(new Error("indexedDB add Error"));
      };
    });
  }
  put(value: Object, key: IDBValidKey) {
    return new Promise<void>(async (resolve, reject) => {
      if (!this.db) {
        return reject(new Error("indexDB open Error"));
      }
      try {
        const item = await this.get(key);
        const transaction = this.db.transaction(this.store_name, "readwrite");
        const store = transaction.objectStore(this.store_name);

        const put_request = (data: Object) => {
          const put_request = store.put(data);
          put_request.onsuccess = (e: Event) => {
            resolve();
          };
          put_request.onerror = (e: Event) => {
            reject(new Error("indexedDB put Error"));
          };
        };
        if (item) {
          put_request({ ...item, ...value, id: key });
        } else {
          put_request({ ...value, id: key });
        }
      } catch (e) {
        reject(new Error("unknown error"));
      }
    });
  }
  get(key: IDBValidKey): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      if (!this.db) {
        return reject(new Error("IndexDB open Error"));
      }
      const transaction = this.db.transaction(this.store_name, "readonly");
      const store = transaction.objectStore(this.store_name);

      const get_request = store.get(key);

      get_request.onsuccess = (e: Event) => {
        const item = (e.target as IDBRequest).result;
        resolve(item);
      };
      get_request.onerror = (e: Event) => {
        reject(new Error("indexedDB get Error"));
      };
    });
  }
  getAll(): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
      if (!this.db) {
        return reject(new Error("IndexDB open Error"));
      }
      const transaction = this.db.transaction(this.store_name, "readonly");
      const store = transaction.objectStore(this.store_name);

      const get_request = store.getAll();

      get_request.onsuccess = (e: Event) => {
        const item = (e.target as IDBRequest).result;
        resolve(item);
      };
      get_request.onerror = (e: Event) => {
        reject(new Error("indexedDB get Error"));
      };
    });
  }
}

export { LocalDB };
