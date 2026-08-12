import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return new Response(JSON.stringify({ error: "Parâmetro 'file' ausente na URL" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const store = getStore("trello-temp-attachments");
    const blobData = await store.get(fileName, { type: "arrayBuffer" });

    if (!blobData) {
      return new Response(JSON.stringify({ error: "Arquivo expirado ou não encontrado" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Identifica dinamicamente a extensão para devolver o Content-Type perfeito para o Trello
    let contentType = "image/png"; // Padrão
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerName.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (lowerName.endsWith(".webp")) {
      contentType = "image/webp";
    }

    // Retorna o arquivo binário com cabeçalhos limpos de exibição em linha (inline)
    return new Response(blobData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline", 
        "Cache-Control": "public, max-age=120" // Dá tempo extra para o Trello indexar a imagem
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
