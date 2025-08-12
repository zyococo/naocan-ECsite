// Stripe顧客ポータルセッション作成APIの例
// 実際の実装では、このAPIをサーバーサイドで実装する必要があります

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-portal-session", async (req, res) => {
  try {
    const { customer_id, return_url } = req.body;

    // 顧客IDが提供されていない場合は、新しい顧客を作成
    let customerId = customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.body.email || "customer@example.com",
        name: req.body.name || "Customer",
      });
      customerId = customer.id;
    }

    // 顧客ポータルセッションを作成
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url || "https://your-domain.com",
      configuration: {
        business_profile: {
          headline: "naocan - 花屋のECサイト",
        },
        features: {
          payment_method_update: {
            enabled: true,
          },
          subscription_cancel: {
            enabled: true,
            mode: "at_period_end",
          },
          subscription_pause: {
            enabled: true,
          },
        },
      },
    });

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: error.message });
  }
});

// 商品購入用のチェックアウトセッション作成API
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items, success_url, cancel_url } = req.body;

    // 商品データをStripeの形式に変換
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
      customer_creation: "always", // 新しい顧客を作成
      metadata: {
        order_type: "one_time_purchase",
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});
