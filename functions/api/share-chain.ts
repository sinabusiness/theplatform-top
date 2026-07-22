/// <reference types="@cloudflare/workers-types" />

interface Env {
  SHARE_CHAIN: KVNamespace;
}

interface StoredChain {
  chain: string[];
  version: number;
}

const MAX_RETRIES = 3;

async function getChain(kv: KVNamespace, postId: string): Promise<StoredChain | null> {
  const raw = await kv.get(postId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredChain;
  } catch {
    return null;
  }
}

async function addToChain(kv: KVNamespace, postId: string, username: string, initialChain?: string[]): Promise<{ chain: string[]; version: number } | { error: string; status: number }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const stored = await getChain(kv, postId);

    let chain: string[];
    let version = 1;

    if (stored) {
      chain = stored.chain;
      version = stored.version;
    } else if (initialChain && initialChain.length > 0) {
      chain = [...initialChain];
    } else {
      chain = [];
    }

    if (chain.includes(username)) {
      return { error: 'Username already in chain', status: 409 };
    }

    const newChain = [...chain, username];
    const newVersion = version + 1;

    // Optimistic write — if another request wrote between our read and write,
    // one will overwrite the other. KV does not support CAS natively.
    await kv.put(postId, JSON.stringify({ chain: newChain, version: newVersion }));

    // Read back to detect races
    const verify = await getChain(kv, postId);
    if (verify && verify.version === newVersion) {
      return { chain: newChain, version: newVersion };
    }
    // Version mismatch — another write happened, retry
  }
  return { error: 'Too many concurrent writes — try again', status: 429 };
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const postId = url.searchParams.get('id');
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing id param' }), { status: 400 });
    }

    const stored = await getChain(env.SHARE_CHAIN, postId);
    return new Response(JSON.stringify({ chain: stored ? stored.chain : null }), { status: 200 });
  }

  if (request.method === 'POST') {
    let body: { postId?: string; username?: string; currentChain?: string[] };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const { postId, username, currentChain } = body;
    if (!postId || !username) {
      return new Response(JSON.stringify({ error: 'Missing postId or username' }), { status: 400 });
    }

    const result = await addToChain(env.SHARE_CHAIN, postId, username, currentChain);
    if ('error' in result) {
      return new Response(JSON.stringify(result), { status: result.status });
    }
    return new Response(JSON.stringify({ chain: result.chain }), { status: 200 });
  }

  if (request.method === 'PUT') {
    let body: { postId?: string; chain?: string[] };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const { postId, chain } = body;
    if (!postId || !chain) {
      return new Response(JSON.stringify({ error: 'Missing postId or chain' }), { status: 400 });
    }

    const stored = await getChain(env.SHARE_CHAIN, postId);
    const version = stored ? stored.version : 0;

    await env.SHARE_CHAIN.put(postId, JSON.stringify({ chain, version: version + 1 }));
    return new Response(JSON.stringify({ chain }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
};
