import NodeCache from "node-cache";

class CacheService {
  private competitionCache: NodeCache;
  private teamsCache: NodeCache;
  private matchesCache: NodeCache;
  private standingsCache: NodeCache;

  constructor() {
    this.competitionCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
    this.teamsCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
    this.matchesCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
    this.standingsCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
  }

  getCompetition<T>(key: string): T | undefined {
    return this.competitionCache.get<T>(key);
  }

  setCompetition<T>(key: string, data: T): void {
    this.competitionCache.set(key, data);
  }

  getTeams<T>(key: string): T | undefined {
    return this.teamsCache.get<T>(key);
  }

  setTeams<T>(key: string, data: T): void {
    this.teamsCache.set(key, data);
  }

  getMatches<T>(key: string): T | undefined {
    return this.matchesCache.get<T>(key);
  }

  setMatches<T>(key: string, data: T): void {
    this.matchesCache.set(key, data);
  }

  getStandings<T>(key: string): T | undefined {
    return this.standingsCache.get<T>(key);
  }

  setStandings<T>(key: string, data: T): void {
    this.standingsCache.set(key, data);
  }

  flushAll(): void {
    this.competitionCache.flushAll();
    this.teamsCache.flushAll();
    this.matchesCache.flushAll();
    this.standingsCache.flushAll();
  }
}

export const cacheService = new CacheService();
