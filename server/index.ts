import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT || 8787);
const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || path.resolve(process.cwd(), 'data/embeddings.json');
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Types
type DocEmbedding = { id: string; text: string; metadata?: Record<string, unknown>; embedding: number[] };

async function loadIndex(): Promise<DocEmbedding[]> {
  try {
    const raw = await fs.readFile(VECTOR_STORE_PATH, 'utf-8');
    const json = JSON.parse(raw) as { docs: DocEmbedding[] };
    return json.docs ?? [];
  } catch (err) {
    return [];
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const va = a[i];
    const vb = b[i];
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: text });
  return res.data[0].embedding as unknown as number[];
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const ChatRequestSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })).min(1),
  lang: z.string().default('en'),
  topK: z.number().min(1).max(10).optional(),
});

app.post('/api/chat', async (req, res) => {
  const parse = ChatRequestSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    return;
  }
  const { messages, lang, topK = 5 } = parse.data;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');

  try {
    const docs = await loadIndex();
    let context = '';
    if (docs.length > 0) {
      const userContent = messages[messages.length - 1]?.content ?? '';
      const qEmbedding = await embed(userContent);
      const ranked = docs
        .map((d) => ({ doc: d, score: cosineSimilarity(qEmbedding, d.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((x, i) => `# Doc ${i + 1}\n${x.doc.text}`)
        .join('\n\n');
      context = ranked;
    }

    const system = {
      role: 'system' as const,
      content:
        `You are Krishimitra, a helpful multilingual agriculture assistant. Respond in the user's language (${lang}). ` +
        `Use the provided context between <docs> and </docs> to answer. If the context is insufficient, say you don't know and suggest next steps.\n` +
        `<docs>\n${context}\n</docs>`
    };

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      stream: true,
      messages: [system, ...messages],
      temperature: 0.2,
    });

    for await (const part of completion) {
      const delta = part.choices?.[0]?.delta?.content ?? '';
      if (delta) {
        res.write(delta);
      }
    }
    res.end();
  } catch (err: any) {
    res.write(`\n\n[Error] ${err?.message || 'Unknown error'}`);
    res.end();
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT}`);
});
