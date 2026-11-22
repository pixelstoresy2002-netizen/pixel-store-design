import 'dotenv/config';

import { betterAuth } from 'better-auth';

import { isAllowlistedAdminEmail } from '../src/lib/admin-allowlist';
import { createAuthOptions } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';

function prompt(label: string, hidden = false): Promise<string> {
  if (!process.stdin.isTTY) {
    return Promise.reject(new Error('Run this command in an interactive terminal.'));
  }

  process.stdout.write(label);
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = '';
    const finish = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      resolve(value);
    };
    const cancel = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      reject(new Error('Provisioning cancelled.'));
    };
    const onData = (chunk: string) => {
      for (const character of chunk) {
        if (character === '\u0003') return cancel();
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
          if (!hidden) process.stdout.write('\b \b');
          continue;
        }
        value += character;
        if (!hidden) process.stdout.write(character);
      }
    };
    process.stdin.on('data', onData);
  });
}

async function main() {
  const name = (await prompt('Administrator name: ')).trim();
  const email = (await prompt('Administrator email: ')).trim().toLowerCase();
  const password = await prompt('Password (hidden): ', true);

  if (name.length < 2 || name.length > 100) throw new Error('Name must be 2 to 100 characters.');
  if (!isAllowlistedAdminEmail(email)) throw new Error('This email is not in ADMIN_EMAILS.');
  if (password.length < 10 || password.length > 128) throw new Error('Password must be 10 to 128 characters.');

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    console.log('An administrator with this email already exists. No changes were made.');
    return;
  }

  const provisioningAuth = betterAuth(
    createAuthOptions({ disableSignUp: false, includeNextCookies: false }),
  );
  await provisioningAuth.api.signUpEmail({ body: { name, email, password } });
  console.log('Administrator account created.');
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Provisioning failed.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
