/// <reference types="@cloudflare/workers-types" />

interface Env {
  SHARE_CHAIN: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const postId = url.searchParams.get('id');
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing id param' }), { status: 400 });
    }

    const stored = await env.SHARE_CHAIN.get(postId);
    if (stored) {
      const chain = JSON.parse(stored);
      return new Response(JSON.stringify({ chain }), { status: 200 });
    }

    // If not in KV, return empty — frontend falls back to post prop
    return new Response(JSON.stringify({ chain: null }), { status: 200 });
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

    let chain: string[];
    const stored = await env.SHARE_CHAIN.get(postId);

    if (stored) {
      chain = JSON.parse(stored);
    } else if (currentChain && currentChain.length > 0) {
      chain = [...currentChain];
    } else {
      chain = [];
    }

    if (chain.includes(username)) {
      return new Response(JSON.stringify({ error: 'Username already in chain', chain }), { status: 409 });
    }

    chain.push(username);
    await env.SHARE_CHAIN.put(postId, JSON.stringify(chain));

    return new Response(JSON.stringify({ chain }), { status: 200 });
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

    await env.SHARE_CHAIN.put(postId, JSON.stringify(chain));
    return new Response(JSON.stringify({ chain }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
};
