import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Método não permitido"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nome do arquivo não informado"
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

    await store.delete(fileName);

    return new Response(
      JSON.stringify({
        success: true,
        deleted: fileName
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
