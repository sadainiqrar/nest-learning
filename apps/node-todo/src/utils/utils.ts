import fs from 'fs';
import { join } from 'path';

export const blockingOperation = () => {
  console.log('Start');

  // 
  const result = doHeavyComputation(); // This blocks the event loop
  console.log('Result:', result);

  console.log('End');

  function doHeavyComputation() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Simulate a 5-second computation
    }
    return 'Done!';
  }
};

export const nonBlocking1 = () => {
  console.log('Start');

  setTimeout(() => {
    console.log('Inside setTimeout - Non-blocking');
  }, 5000);

  console.log('End');
};

export const eventLoopExample1 = () => {
  console.log('Start');

  setTimeout(() => {
    console.log('setTimeout - 0ms');
  }, 0);

  Promise.resolve().then(() => console.log('Promise - Microtask'));

  console.log('End');
};

export const eventLoopExample2 = () => {
  console.log('Start');

  setImmediate(() => {
    console.log('Immediate'); // Executes in Check Phase (next iteration).
  });

  setTimeout(() => {
    console.log('Timeout'); // Executes in Timers Phase (next iteration).
  }, 0);

  process.nextTick(() => {
    console.log('NextTick'); // Executes before moving to Check Phase (current iteration).
  });

  Promise.resolve().then(() => {
    console.log('Promise'); // Executes as part of the Microtask queue (current iteration).
  });

  console.log('End');
};

export const readFileAsync = () => {
  console.log('Start');

  const filePath = join(__dirname, '..', 'node-todo/assets/file.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('3. File read completed');

    // Schedule tasks after I/O completion
    process.nextTick(() => {
      console.log('4. Inside process.nextTick (after file read)');
    });

    setImmediate(() => {
      console.log('5. Inside setImmediate (after file read)');
    });
  });

  console.log('End');
};

export const readFileSync = () => {
  console.log('Start');
  const filePath = join(__dirname, '..', 'node-todo/assets/file.txt');
  const fileData = fs.readFileSync(filePath, 'utf8');

  console.log('File Read');
  console.log('End');
};
