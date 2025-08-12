import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/supabase";
import { mockProducts } from "../lib/mockProducts";

type Tables = Database["public"]["Tables"];

// Products hook
export function useProducts() {
  const [products, setProducts] = useState<Tables["products"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      console.log("Supabase client:", supabase);
      console.log("Supabase URL:", supabase.supabaseUrl);
      console.log("Supabase Key length:", supabase.supabaseKey?.length);

      // 開発環境でモックデータを使用するオプション
      if (
        import.meta.env.DEV &&
        import.meta.env.VITE_USE_MOCK_DATA === "true"
      ) {
        console.log("Using mock data in development mode");
        setProducts(mockProducts);
        setLoading(false);
        return;
      }

      setLoading(true);

      // タイムアウトを設定（30秒に延長）
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000);
      });

      // まず、Supabaseの接続状況を確認
      console.log("Testing basic connection...");

      try {
        // より短いタイムアウトでテスト
        const quickTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Quick timeout")), 5000);
        });

        const testPromise = supabase.from("products").select("id").limit(1);

        console.log("Executing test query...");
        const { data: testData, error: testError } = await Promise.race([
          testPromise,
          quickTimeout,
        ]);

        console.log("Test query result:", { testData, testError });

        if (testError) {
          console.error("Test query failed:", testError);
          throw testError;
        }

        // テストが成功したら、実際の商品データを取得
        console.log("Test successful, fetching full product data...");
        const productsPromise = supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        const { data, error } = await Promise.race([
          productsPromise,
          timeoutPromise,
        ]);

        console.log("Products fetch response:", { data, error });
        console.log("Data length:", data?.length);
        console.log("Error details:", error);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Products loaded:", data?.length || 0, "items");
        console.log("First product:", data?.[0]);
        setProducts(data || []);
      } catch (testErr) {
        console.error("Test failed:", testErr);
        throw testErr;
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "An error occurred");

      // エラーが発生した場合、空の配列を設定してローディングを停止
      console.log("Setting empty products array due to error");
      setProducts([]);

      // ネットワークエラーの場合は、再試行を提案
      if (err instanceof Error && err.message.includes("timeout")) {
        console.log(
          "Network timeout detected. Consider checking your internet connection."
        );
        console.log("Using mock products as fallback...");
        setProducts(mockProducts);
        setError(null);
      }
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}

export const useAvailableSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        console.log("Fetching available slots...");
        console.log("Supabase client:", supabase);
        setLoading(true);
        const { data, error } = await supabase
          .from("available_slots")
          .select("*")
          .eq("is_active", true)
          .order("date", { ascending: true });

        console.log("Supabase response:", { data, error });

        if (error) {
          console.warn("Error fetching slots:", error);
          setError(error.message);
        } else {
          console.log("Slots fetched successfully:", data);
          console.log("Number of slots:", data?.length || 0);
          setSlots(data || []);
        }
      } catch (err) {
        console.warn("Exception fetching slots:", err);
        setError("Failed to fetch slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const refetch = async () => {
    try {
      console.log("Refetching available slots...");
      setLoading(true);
      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true });

      console.log("Supabase refetch response:", { data, error });

      if (error) {
        console.warn("Error refetching slots:", error);
        setError(error.message);
      } else {
        console.log("Slots refetched successfully:", data);
        setSlots(data || []);
      }
    } catch (err) {
      console.warn("Exception refetching slots:", err);
      setError("Failed to refetch slots");
    } finally {
      setLoading(false);
    }
  };

  return { slots, loading, error, refetch };
};

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("reservations")
          .select(
            `
            *,
            available_slots (*)
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Error fetching reservations:", error);
          setError(error.message);
        } else {
          setReservations(data || []);
        }
      } catch (err) {
        console.warn("Exception fetching reservations:", err);
        setError("Failed to fetch reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const addReservation = async (reservationData: any) => {
    try {
      console.log("Adding reservation:", reservationData);
      const { data, error } = await supabase
        .from("reservations")
        .insert(reservationData)
        .select()
        .single();

      if (error) {
        console.warn("Error adding reservation:", error);
        throw error;
      } else {
        console.log("Reservation added successfully:", data);
        setReservations((prev) => [data, ...prev]);
        return { success: true, data };
      }
    } catch (err) {
      console.warn("Exception adding reservation:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add reservation",
      };
    }
  };

  return { reservations, loading, error, addReservation };
};

// User profile hook
export function useProfile() {
  const [profile, setProfile] = useState<Tables["profiles"]["Row"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Tables["profiles"]["Update"]) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...updates })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}

// Cart hook
export function useCart() {
  const [cartItems, setCartItems] = useState<
    (Tables["cart_items"]["Row"] & { product: Tables["products"]["Row"] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCartItems([]);
        return;
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(*)
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("cart_items")
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })
        .select(
          `
          *,
          product:products(*)
        `
        )
        .single();

      if (error) throw error;

      setCartItems((prev) => {
        const existing = prev.find((item) => item.product_id === productId);
        if (existing) {
          return prev.map((item) =>
            item.product_id === productId ? data : item
          );
        }
        return [...prev, data];
      });

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .select(
          `
          *,
          product:products(*)
        `
        )
        .single();

      if (error) throw error;
      setCartItems((prev) =>
        prev.map((item) => (item.product_id === productId ? data : item))
      );
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const clearCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setCartItems([]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    loading,
    error,
    total,
    itemCount,
    refetch: fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

// Favorites hook
export function useFavorites() {
  const [favorites, setFavorites] = useState<
    (Tables["favorites"]["Row"] & { product: Tables["products"]["Row"] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFavorites([]);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          *,
          product:products(*)
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: productId })
        .select(
          `
          *,
          product:products(*)
        `
        )
        .single();

      if (error) throw error;
      setFavorites((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      setFavorites((prev) =>
        prev.filter((fav) => fav.product_id !== productId)
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An error occurred",
      };
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.product_id === productId);
  };

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
}
