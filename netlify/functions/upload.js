import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // 1. Bloqueia qualquer método que não seja POST (vido do Power Automate)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 2. Extrai o nome do arquivo enviado pelo cabeçalho customizado x-filename
    const fileName = req.headers.get("x-filename");
    if (!fileName) {
      return new Response(JSON.stringify({ error: "Cabeçalho x-filename ausente" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Lê o corpo da requisição diretamente como dados binários puros (ArrayBuffer)
    const fileBuffer = await req.arrayBuffer();
    if (!fileBuffer || fileBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Nenhum arquivo ou binário foi enviado no corpo" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Conecta à sua área de armazenamento privada do Netlify Blobs
    const store = getStore("trello-temp-attachments");

    // 5. Salva o arquivo binário usando o nome dele como chave de busca
    await store.set(fileName, fileBuffer, {
      metadata: { contentType: "image/png" }
    });

    // 6. Descobre dinamicamente a URL base do seu site publicado no Netlify
    const siteUrl = process.env.URL || new URL(req.url).origin;
    
    // Constrói o link público temporário apontando para a sua função de download
    const publicUrl = `${siteUrl}/.netlify/functions/download?file=${encodeURIComponent(fileName)}`;

    // 7. Devolve a URL em formato JSON para o Power Automate usar no próximo passo
    return new Response(JSON.stringify({ url_publica: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
