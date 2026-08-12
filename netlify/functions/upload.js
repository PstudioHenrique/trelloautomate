exports.handler = async (event) => {
  console.log("Método:", event.httpMethod);
  console.log("Content-Type:", event.headers["content-type"]);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      success: true,
      method: event.httpMethod,
      contentType: event.headers["content-type"] || null,
      receivedBody: !!event.body
    })
  };
};
