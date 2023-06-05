import fs from 'fs';
import { Transform } from 'stream';
import process from 'process';

function detectOperation(inputFilePath, outputFilePath, operation) {
  const readableStream = fs.createReadStream(inputFilePath);
  const writableStream = fs.createWriteStream(outputFilePath);

  readableStream.on('error', () => {
    console.log('Some issue with streams');
  });

  writableStream.on('error', () => {
    console.log('Some issue with streams');
  });

  const transformStream = new Transform({
    transform(chunk) {
      let transformedChunk;
      switch (operation) {
        case 'uppercase':
          transformedChunk = chunk.toString().toUpperCase();
          break;
        case 'lowercase':
          transformedChunk = chunk.toString().toLowerCase();
          break;
        case 'reverse':
          transformedChunk = chunk.toString().split('').reverse().join('');
          break;
        default:
          throw new Error('Invalid operation');
          return;
      }
      this.push(transformedChunk);
    }
  });

  readableStream.pipe(transformStream).pipe(writableStream);

  process.on('SIGINT',() =>{
    writableStream.destroy();
    readableStream.destroy();
  });
}

process.stdin.setEncoding('utf-8');

process.stdin.on('data',(data) => {
    const input = data.trim();

    const parts = input.split(' ');
    const inputFile = parts[0];
    const outputFile = parts[1];
    const operation = parts[2];

    if (!inputFile || !outputFile || !operation) {
      throw new Error('Invalid input');
    }
  
    if (!fs.existsSync(inputFile)) {
      throw new Error('Input file not found');
    }
    
    detectOperation(inputFile, outputFile, operation);

});
