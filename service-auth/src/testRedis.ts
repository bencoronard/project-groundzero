import { RedisSessionStore } from './detachables/RedisSessionStore';
import { Authorization } from './entities/Authorization';
import { ISession } from './entities/Session';
import dotenv from 'dotenv';
import path from 'path';
import { SessionStore } from './entities/SessionStore';

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (process.env.REDIS) {
  const configs = JSON.parse(process.env.REDIS);
  const storage = new RedisSessionStore(configs);
  test(storage);
}

async function test(storage: SessionStore) {
  const session: ISession = {
    sessionId: 'session:911',
    userId: 'user-sudo',
    permissions: Authorization.superUser(),
    created: Date.now(),
    expires: Date.now() + 1 * 60 * 1000,
  };

  try {
    const result = await storage.createSession(session);
    if (result) {
      console.log(
        'Retrieved: ',
        await storage.verifySession(session.sessionId)
      );
      setTimeout(async () => {
        await storage.terminateSession(session.sessionId);
        console.log(
          'Retrieved (timeout): ',
          await storage.verifySession(session.sessionId)
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
