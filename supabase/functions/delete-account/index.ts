import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function keyFromJsonEnv(name: string): string {
  const raw = Deno.env.get(name);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return String(parsed.default || Object.values(parsed)[0] || "");
    }
  } catch {
    // A variável pode já conter uma chave simples.
  }
  return raw;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply(405, { error: "Método não permitido." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ||
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || keyFromJsonEnv("SUPABASE_PUBLISHABLE_KEYS");
  const adminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    Deno.env.get("SUPABASE_SECRET_KEY") || keyFromJsonEnv("SUPABASE_SECRET_KEYS");

  if (!supabaseUrl || !publishableKey || !adminKey) {
    return reply(500, { error: "A Edge Function não está configurada. Verifique SUPABASE_URL, a chave pública do projeto e o segredo administrativo SUPABASE_SERVICE_ROLE_KEY." });
  }

  const authorization = req.headers.get("Authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return reply(401, { error: "Sessão autenticada não encontrada. Entre novamente e tente outra vez." });

  let body: { email?: string; password?: string; confirmation?: string };
  try { body = await req.json(); } catch { return reply(400, { error: "Pedido inválido." }); }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const confirmation = String(body.confirmation || "");
  if (!email || !password || confirmation !== "EXCLUIR MINHA CONTA") {
    return reply(400, { error: "Informe e-mail, senha atual e a frase exata de confirmação." });
  }

  const caller = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${tokenMatch[1]}` } },
  });
  const { data: callerData, error: callerError } = await caller.auth.getUser(tokenMatch[1]);
  const user = callerData?.user;
  if (callerError || !user) return reply(401, { error: "Não foi possível validar sua sessão. Entre novamente." });
  if (user.is_anonymous || !user.email) {
    return reply(400, { error: "Esta opção está disponível somente para contas permanentes vinculadas a e-mail." });
  }
  if (user.email.trim().toLowerCase() !== email) {
    return reply(400, { error: "O e-mail informado não corresponde à conta autenticada." });
  }

  // Reautentica com a senha atual em um cliente isolado; não reutiliza nem persiste essa sessão.
  const proofClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const { data: proofData, error: proofError } = await proofClient.auth.signInWithPassword({ email, password });
  if (proofError || proofData?.user?.id !== user.id) {
    return reply(401, { error: "A senha atual não foi confirmada. Verifique a senha e tente novamente." });
  }
  await proofClient.auth.signOut({ scope: "local" }).catch(() => undefined);

  const admin = createClient(supabaseUrl, adminKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  // Nunca apaga uma campanha de outros jogadores por consequência da exclusão de seu mestre.
  const { data: ownedCampaigns, error: campaignsError } = await admin
    .from("campaigns")
    .select("id,name")
    .eq("owner_id", user.id)
    .limit(50);
  if (campaignsError) {
    return reply(500, { error: "Não foi possível verificar as campanhas que pertencem à conta. Nenhum dado foi excluído. Tente novamente." });
  }
  if (ownedCampaigns?.length) {
    const names = ownedCampaigns.map((item) => String(item.name || "Campanha sem nome")).slice(0, 8);
    return reply(409, {
      code: "OWNED_CAMPAIGNS",
      campaigns: names,
      error: `Antes de excluir a conta, exclua as campanhas que você criou: ${names.join("; ")}${ownedCampaigns.length > names.length ? "; e outras campanhas" : ""}. Isso protege os participantes e o progresso dessas crônicas.`,
    });
  }

  // Lista somente arquivos que pertencem ao usuário autenticado; remove-os pela Storage API oficial.
  const ownedObjects: Array<{ bucket_id: string; object_name: string }> = [];
  for (let offset = 0; offset < 100000; offset += 1000) {
    const { data: page, error: objectsError } = await caller
      .rpc("aethra_list_my_storage_objects")
      .range(offset, offset + 999);
    if (objectsError) {
      return reply(500, { error: "Não foi possível verificar os arquivos associados à conta. Confirme se a migração SQL v4.2.5 foi executada. Nenhum dado foi excluído." });
    }
    const rows = (page || []) as Array<{ bucket_id: string; object_name: string }>;
    ownedObjects.push(...rows);
    if (rows.length < 1000) break;
  }
  const grouped = new Map<string, string[]>();
  for (const item of ownedObjects) {
    if (!item?.bucket_id || !item?.object_name) continue;
    const paths = grouped.get(item.bucket_id) || [];
    paths.push(item.object_name);
    grouped.set(item.bucket_id, paths);
  }
  for (const [bucket, paths] of grouped.entries()) {
    for (let i = 0; i < paths.length; i += 1000) {
      const { error: storageError } = await admin.storage.from(bucket).remove(paths.slice(i, i + 1000));
      if (storageError) {
        return reply(500, { error: `Não foi possível remover todos os arquivos pessoais do armazenamento (${bucket}). A conta ainda não foi excluída. Tente novamente ou peça ao administrador do projeto para verificar o Storage.` });
      }
    }
  }

  // A exclusão administrativa remove a identidade Auth e invalida os refresh tokens do usuário.
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, false);
  if (deleteError) {
    return reply(409, { error: "Os arquivos pessoais do Storage já foram removidos, mas o Supabase recusou a exclusão por existir outro vínculo de banco. Sua conta continua ativa. Verifique as referências do usuário no banco antes de tentar novamente." });
  }

  return reply(200, { success: true, message: "Conta excluída." });
});
