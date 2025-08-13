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
    const { items, success_url, cancel_url } = JSON.parse(event.body);

    // 商品データをStripeの形式に変換
    const lineItems = items.map((item) => {
      // 画像URLを完全なURLに変換
      let imageUrl = item.image;
      if (imageUrl && !imageUrl.startsWith("http")) {
        // 相対パスの場合、現在のドメインを追加
        const baseUrl =
          process.env.URL ||
          (process.env.NODE_ENV === "development"
            ? "http://localhost:8888"
            : "https://naocan-ecsite.netlify.app");
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      const productData = {
        name: item.name,
        images: [imageUrl],
      };

      // descriptionが存在し、空でない場合のみ追加
      if (item.description && item.description.trim() !== "") {
        productData.description = item.description;
      }

      return {
        price_data: {
          currency: "jpy",
          product_data: productData,
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
      customer_creation: "always", // 新しい顧客を作成
      metadata: {
        order_type: "one_time_purchase",
        source: "naocan-ecsite",
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      locale: "ja",
      currency: "jpy",
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: session.id,
        url: session.url,
        customer_id: session.customer,
      }),
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        details: "Failed to create checkout session",
      }),
    };
  }
};
