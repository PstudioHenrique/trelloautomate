import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const contentType =
      req.headers.get("content-type") || "application/octet-stream";

    const url = new URL(req.url);

    // Por enquanto usamos um nome fixo para testar o armazenamento.
    const fileName =
      url.searchParams.get("file") || `teste-${Date.now()}.png`;

    const body = await req.arrayBuffer();

    if (!body || body.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum arquivo recebido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const store = getStore("trello-temp-attachments");

    await store.set(fileName, body, {
      metadata: {
        contentType: contentType
      }
    });

    const downloadUrl =
      `${url.origin}/.netlify/functions/download?file=${encodeURIComponent(fileName)}`;

    return new Response(
      JSON.stringify({
        success: true,
        fileName: fileName,
        size: body.byteLength,
        url: downloadUrl
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
