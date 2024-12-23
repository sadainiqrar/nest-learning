import { Injectable } from '@nestjs/common';
import {
  readFileAsync,
  readFileSync,
  blockingOperation,
  nonBlocking1,
  eventLoopExample1,
  eventLoopExample2,
} from '../utils/utils';

@Injectable()
export class AppService {
  getData(): { message: string } {
    // readFileAsync()
    console.log('1. Start of getData');

    // Simulate a long-running computation
    setTimeout(() => {

      setImmediate(() => {
        console.log('7. Low-priority setImmediate task');
      });
      // Add tasks to execute after the computation
      process.nextTick(() => {
        console.log('6. High-priority nextTick task');
      });
      console.log('5. Long-running task finished');

    }, 0);

    setImmediate(() => {
      console.log('4. Immediate setImmediate task');
    });

    // Add tasks to execute immediately
    process.nextTick(() => {
      console.log('3. Immediate nextTick task');
    });
    
    console.log('2. End of getData');

    return { message: 'Hello API' };
  }
}
