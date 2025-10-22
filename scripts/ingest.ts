import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const CONTENT_DIR = process.env.CONTENT_DIR || path.resolve(process.cwd(), 'content');
const OUTPUT_PATH = process.env.VECTOR_STORE_PATH || path.resolve(process.cwd(), 'data/embeddings.json');
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function readAllFiles(dir: string): Promise<Array<{ filePath: string; text: string }>> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: Array<{ filePath: string; text: string }> = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await readAllFiles(full)));
    } else if (/\.(md|txt|mdx)$/i.test(entry.name)) {
      const raw = await fs.readFile(full, 'utf-8');
      results.push({ filePath: full, text: raw });
    }
  }
  return results;
}

function chunkText(text: string, chunkSize = 1200, overlap = 150): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }
  return chunks;
}

async function embed(texts: string[]) {
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
  return res.data.map((d) => d.embedding as unknown as number[]);
}

async function main() {
  await ensureDir(path.dirname(OUTPUT_PATH));
  await ensureDir(CONTENT_DIR);

  const files = await readAllFiles(CONTENT_DIR);
  if (files.length === 0) {
    console.log(`[ingest] No files in ${CONTENT_DIR}. Add .md or .txt files and rerun.`);
    return;
  }

  const docs: Array<{ id: string; text: string; metadata?: Record<string, unknown>; embedding: number[] }> = [];

  for (const file of files) {
    const chunks = chunkText(file.text);
    console.log(`[ingest] ${path.basename(file.filePath)} -> ${chunks.length} chunks`);
    // Embed in batches to respect limits
    const batchSize = 64;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await embed(batch);
      for (let j = 0; j < batch.length; j++) {
        docs.push({ id: uuidv4(), text: batch[j]!, metadata: { source: file.filePath }, embedding: embeddings[j]! });
      }
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify({ docs }, null, 2), 'utf-8');
  console.log(`[ingest] Wrote ${docs.length} chunks to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
