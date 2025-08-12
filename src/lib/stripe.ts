import { loadStripe } from "@stripe/stripe-js";

// Stripeの公開キーを環境変数から取得
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error(
    "Stripe publishable key is not defined in environment variables"
  );
}

// Stripeインスタンスを初期化
export const stripePromise = loadStripe(stripePublishableKey);

// 決済セッションを作成する関数
export const createCheckoutSession = async (
  cartItems: any[],
  successUrl: string,
  cancelUrl: string
) => {
  try {
    const response = await fetch("/api/create-checkout-session", {
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
        })),
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
