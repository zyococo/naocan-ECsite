const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // CORSヘッダーを設定
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // OPTIONSリクエスト（プリフライト）の処理
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // POSTリクエストのみ処理
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { customer_id, return_url } = JSON.parse(event.body);

    // 顧客IDが提供されていない場合は、新しい顧客を作成
    let customerId = customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: "customer@example.com",
        name: "Customer",
        metadata: {
          source: "naocan-ecsite",
        },
      });
      customerId = customer.id;
    }

    // 顧客ポータルセッションを作成（設定なし）
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url || "https://naocan-ecsite.netlify.app",
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: session.url,
        id: session.id,
        customer_id: customerId,
      }),
    };
  } catch (error) {
    console.error("Error creating portal session:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        details: "Failed to create portal session",
      }),
    };
  }
};
