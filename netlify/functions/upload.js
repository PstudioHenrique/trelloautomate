export default async (req, context) => {
  try {
    const body = await req.text();

    return new Response(
      JSON.stringify({
        success: true,
        bodyLength: body.length,
        bodyStart: body.substring(0, 30)
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
