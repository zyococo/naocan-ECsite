// テスト用のモックStripe API
// 実際の運用では、サーバーサイドでStripeの秘密キーを使用する必要があります

export const createMockCheckoutSession = async (
  cartItems: any[],
  successUrl: string,
  cancelUrl: string
) => {
  // 実際のStripe APIの代わりにモックレスポンスを返す
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `cs_test_${Date.now()}`,
        url: successUrl,
        amount_total: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        currency: "jpy",
        status: "open",
      });
    }, 1000);
  });
};

// 顧客ポータルセッションを作成する関数
export const createCustomerPortalSession = async (customerId?: string) => {
  try {
    console.log("Creating customer portal session...");

    // Netlify FunctionsのAPIを呼び出す
    const response = await fetch("/.netlify/functions/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: window.location.origin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Failed to create portal session");
    }

    const session = await response.json();
    console.log("Portal session created:", session);
    return session;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
};

// 決済セッション作成関数
export const createCheckoutSession = async (
  cartItems: any[],
  successUrl: string,
  cancelUrl: string
) => {
  try {
    console.log("Creating checkout session...");

    // Netlify FunctionsのAPIを呼び出す
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            description: item.description,
          })),
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Failed to create checkout session");
    }

    const session = await response.json();
    console.log("Checkout session created:", session);
    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
