import dotenv from 'dotenv';
import path from 'path';
import { RedisCache } from './detachables/RedisCache';
import { Authorization } from './entities/Authorization';
import { ISession } from './entities/Session';
import { CacheStorage } from './shared/CacheStorage';

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (process.env.REDIS) {
  const configs = JSON.parse(process.env.REDIS);
  const storage = new RedisCache(configs);
  test(storage);
}

async function test(storage: CacheStorage) {
  const session: ISession = {
    sessionId: 'session:911',
    userId: 'user-sudo',
    permissions: Authorization.superUser(),
    created: Date.now(),
    expires: Date.now() + 1 * 60 * 1000,
  };

  try {
    const result = await storage.set(
      session.sessionId,
      JSON.stringify({
        sessionId: session.sessionId,
        userId: session.userId,
        permissions: session.permissions,
      }),
      session.expires
    );
    if (result) {
      console.log('Retrieved: ', await storage.get(session.sessionId));
      setTimeout(async () => {
        await storage.delete(session.sessionId);
        console.log(
          'Retrieved (timeout): ',
          await storage.get(session.sessionId)
        );
        await storage.closeConnection();
      }, 10000);
    }
  } catch (error) {
    console.log('Error >>> ', (error as Error).message);
  }
}

// Console results
// Retrieved:  {
//   userId: 'user-sudo',
//   permissions: {
//     service1: { operation1: false },
//     service2: { operation1: true, operation2: true },
//     service3: { operation1: true, operation2: true, operation3: true }
//   },
//   created: 1716092836311
// }
// Retrieved (timeout):  null
