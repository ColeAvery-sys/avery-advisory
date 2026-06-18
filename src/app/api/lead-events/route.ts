import { NextResponse } from 'next/server';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const eventsFile = path.join(dataDir, 'lead-events.ndjson');

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }

  const event = {
    ...(body as Record<string, unknown>),
    receivedAt: new Date().toISOString(),
  };

  await mkdir(dataDir, { recursive: true });
  await appendFile(eventsFile, `${JSON.stringify(event)}\n`, 'utf8');

  return NextResponse.json({ ok: true });
}
