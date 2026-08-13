export default async (req) => {
  const body = await req.arrayBuffer();

  return new Response(
    JSON.stringify({
      success: true,
      size: body.byteLength
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};
