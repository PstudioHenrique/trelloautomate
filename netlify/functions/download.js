import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405 });
  }

  try {
    // Lê o parâmetro de volta usando searchParams (Evita o travamento do Netlify)
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return new Response(JSON.stringify({ error: "Parâmetro 'file' ausente" }), { status: 400 });
    }

    const store = getStore("trello-temp-attachments");
    const blobData = await store.get(fileName, { type: "arrayBuffer" });

    if (!blobData) {
      return new Response(JSON.stringify({ error: "Arquivo não encontrado" }), { status: 404 });
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
