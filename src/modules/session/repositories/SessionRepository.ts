import { ISessionRepository, Session } from "@/modules/session";

import { redis } from "@/libs";

export class SessionRepository implements ISessionRepository {
  async findById(id: string): Promise<Session | null> {
    const key = await redis.call("JSON.GET", `session:${id}`, ".");
    if (typeof key === "string") {
      const session: Session = JSON.parse(key);
      return session;
    }

    return null;
  }
  async findByAccessToken(at: string): Promise<Session | null> {
    const searchResults = await redis.call(
      "FT.SEARCH",
      "idx:session",
      `@accessToken:(${at})`
    );

    /**
     * FT.SEARCH return data:
     *  [
     *    1,
     *    'keyName',
     *    [
     *      '$',
     *      'keyData'
     *    ]
     *  ]
     */
    if (Array.isArray(searchResults)) {
      const key = searchResults[2]?.[1];

      if (typeof key === "string") {
        const session: Session = JSON.parse(key);
        return session;
      }
    }

    return null;
  }
  async findByRefreshToken(rt: string): Promise<Session | null> {
    const searchResults = await redis.call(
      "FT.SEARCH",
      "idx:session",
      `@refreshToken:(${rt})`
    );

    if (Array.isArray(searchResults)) {
      const key = searchResults[2]?.[1];

      if (typeof key === "string") {
        const session: Session = JSON.parse(key);
        return session;
      }
    }

    return null;
  }
}
