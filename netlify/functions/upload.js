import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const body = await req.text();

    if (!body) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Corpo vazio"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const store = getStore("trello-temp-attachments");

    const fileName = `imagem-${Date.now()}.png`;

    // O Power Automate está enviando Base64.
    // Removemos possíveis prefixos caso existam.
    const base64 = body
      .replace(/^data:[^;]+;base64,/, "")
      .trim();

    const binary = Uint8Array.from(
      atob(base64),
      c => c.charCodeAt(0)
    );

    await store.set(fileName, binary, {
      metadata: {
        contentType: "image/png"
      }
    });

    const downloadUrl =
      `${new URL(req.url).origin}/.netlify/functions/download?file=${encodeURIComponent(fileName)}`;

    return new Response(
      JSON.stringify({
        success: true,
        fileName: fileName,
        size: binary.length,
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
