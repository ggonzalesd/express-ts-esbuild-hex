/* eslint-disable no-console */
import { Umzug } from 'umzug';
import { GenericPool } from '@/domain/repositories/DataAccess';

interface Params {
  context: GenericPool;
  umzug: Umzug<GenericPool>;
}

export const run = async ({ context, umzug }: Params) => {
  const [, , command, arg] = process.argv;

  switch (command) {
    case 'start':
      await context.query(`CREATE TABLE IF NOT EXISTS __migrations (
        name VARCHAR(255) PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      console.log('✅ Tabla de migraciones creada');
      break;

    case 'migrate':
      await umzug.up();
      console.log('✅ Migraciones aplicadas');
      break;

    case 'rollback':
      await umzug.down();
      console.log('🔄 Última migración revertida');
      break;

    case 'destroy':
      await umzug.down({ to: 0 });
      console.log('🗑️ Todas las migraciones revertidas');
      break;

    case 'pending': {
      const pending = await umzug.pending();
      if (pending.length === 0) {
        console.log('✅ No hay migraciones pendientes');
        break;
      } else {
        console.log(
          '🕙 Pending:\n' + pending.map((m) => ` • ${m.name}`).join('\n'),
        );
      }
      break;
    }

    case 'executed': {
      const executed = await umzug.executed();
      if (executed.length === 0) {
        console.log('✅ No hay migraciones ejecutadas');
        break;
      } else {
        console.log(
          '⚡ Executed:\n' + executed.map((m) => ` • ${m.name}`).join('\n'),
        );
      }
      break;
    }

    case 'create':
      if (!arg) {
        console.error('Please provide a migration name.');
        process.exit(1);
      }
      console.log(`📝 Creando migración ${arg}`);
      await umzug.create({ name: arg + '.migration.ts' });
      console.log(`✅ Migración ${arg} creada`);
      break;

    default:
      if (command) {
        console.log(`❓ Comando no reconocido: ${command}`);
      }
      console.log('Comandos disponibles:');
      console.log('  start: Crea la tabla de migraciones');
      console.log('  migrate: Ejecuta las migraciones pendientes');
      console.log('  rollback: Revierte la última migración');
      console.log('  destroy: Revierte todas las migraciones');
      console.log('  pending: Lista las migraciones pendientes');
      console.log('  executed: Lista las migraciones ejecutadas');
      console.log('  create: Crea una nueva migración');
      break;
  }

  process.exit(0);
};
