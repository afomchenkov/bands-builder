import NodeCache from 'node-cache';
import { logger } from '../logger';

const DEFAULT_CACHE_TTL =  60 * 60 * 1; // cache for 1 Hour

export default class CacheService {
  #cache = null;

  constructor(ttlSeconds = DEFAULT_CACHE_TTL) {
    this.#cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  async getAsync(key, fetch) {
    const value = this.#cache.get(key);

    if (value) {
      logger.info(`Cache: [key:${key} - ${value}}]`);
      return Promise.resolve(value);
    }

    let result = null;
    try {
      result = await fetch();
      this.#cache.set(key, result);
    } catch (error) {
      logger.info(`Cache:Error: [key:${key} - ${error.message}}]`);
      throw error;
    }

    return result;
  }

  get(key) {
    return this.#cache.get(key);
  }

  set(key, value) {
    this.#cache.set(key, value);
  }

  remove(keys) {
    this.#cache.del(keys);
  }

  removeStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.#cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.#cache.flushAll();
  }
}
