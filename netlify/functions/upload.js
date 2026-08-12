import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405 });
  }

  try {
    // 1. Lê o JSON leve enviado pelo Power Automate
    const { fileName, sharepointUrl } = await req.json();

    if (!fileName || !sharepointUrl) {
      return new Response(JSON.stringify({ error: "Parâmetros fileName ou sharepointUrl ausentes" }), { status: 400 });
    }

    // 2. O próprio servidor do Netlify faz o download da imagem direto do SharePoint
    const response = await fetch(sharepointUrl);
    if (!response.ok) {
      throw new Error(`Falha ao baixar arquivo do SharePoint: ${response.statusText}`);
    }
    
    const fileBuffer = await response.arrayBuffer();

    // 3. Identifica a extensão para salvar com o tipo correto
    let contentType = "image/png";
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerName.endsWith(".gif")) {
      contentType = "image/gif";
    }

    // 4. Salva os bytes no Netlify Blobs
    const store = getStore("trello-temp-attachments");
    await store.set(fileName, fileBuffer, {
      metadata: { contentType: contentType }
    });

    // 5. Constrói a URL pública temporária para o Trello
    const siteUrl = process.env.URL || new URL(req.url).origin;
    const publicUrl = `${siteUrl}/.netlify/functions/download?file=${encodeURIComponent(fileName)}`;

    return new Response(JSON.stringify({ url_publica: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
