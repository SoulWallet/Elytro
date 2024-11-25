import { Plugin } from 'vite';
import { renameSync, createWriteStream } from 'fs';
import { format } from 'date-fns';
import archiver from 'archiver';

function renameAndPackOutputPlugin(): Plugin {
  return {
    name: 'rename-and-pack-output-plugin',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const timestamp = format(new Date(), 'yyMMdd-HH:mm');
      const newDirName = `elytro-${timestamp}`;
      const oldDirName = 'build'; // Assuming the default output directory is 'build'

      try {
        renameSync(oldDirName, newDirName);
        console.log(`Output directory renamed to: ${newDirName}`);

        const output = createWriteStream(`${newDirName}.zip`);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
          console.log(
            `Archive created: ${newDirName}.zip (${archive.pointer()} total bytes)`
          );
        });

        archive.on('warning', (err) => {
          if (err.code === 'ENOENT') {
            console.warn('Warning during archiving:', err);
          } else {
            throw err;
          }
        });

        archive.on('error', (err) => {
          throw err;
        });

        archive.pipe(output);
        archive.directory(newDirName, false);
        archive.finalize();
      } catch (error) {
        console.error('Error renaming output directory:', error);
      }
    },
  };
}

export default renameAndPackOutputPlugin;
