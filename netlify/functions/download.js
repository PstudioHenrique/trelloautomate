import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // 1. Permite apenas requisições do tipo GET (que é como o Trello vai acessar a URL)
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 2. Extrai o nome do arquivo dos parâmetros da URL (?file=nome_do_arquivo.png)
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return new Response(JSON.stringify({ error: "Parâmetro 'file' ausente na URL" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Conecta à mesma área de armazenamento do Netlify Blobs
    const store = getStore("trello-temp-attachments");
    
    // 4. Busca o arquivo binário armazenado
    const blobData = await store.get(fileName, { type: "arrayBuffer" });

    if (!blobData) {
      return new Response(JSON.stringify({ error: "Arquivo expirado ou não encontrado" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 5. Devolve o arquivo binário puro com o cabeçalho de imagem correto para o Trello
    return new Response(blobData, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=60" // Cache curto para ajudar o Trello no download
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
