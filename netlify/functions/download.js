import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405 });
  }

  try {
    // Captura o nome do arquivo direto do final do caminho da URL (ex: /download/foto.png)
    const urlParts = req.url.split("/");
    const fileName = decodeURIComponent(urlParts[urlParts.length - 1].split("?")[0]);

    if (!fileName || fileName === "download") {
      return new Response(JSON.stringify({ error: "Nome do arquivo inválido" }), { status: 400 });
    }

    const store = getStore("trello-temp-attachments");
    const blobData = await store.get(fileName, { type: "arrayBuffer" });

    if (!blobData) {
      return new Response(JSON.stringify({ error: "Arquivo não encontrado no storage" }), { status: 404 });
    }

    let contentType = "image/png";
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerName.endsWith(".gif")) {
      contentType = "image/gif";
    }

    return new Response(blobData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
