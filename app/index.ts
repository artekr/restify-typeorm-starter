import 'module-alias/register';
import { App } from './app';
import { Registry } from './registry';

Registry.getContainer().then((container) => {
  const app = container.get(App);

  process.on('uncaughtException', (err: Error) => {
    process.exit(1);
  });

  app.start().catch(err => {
    process.exit(1);
  });
});
