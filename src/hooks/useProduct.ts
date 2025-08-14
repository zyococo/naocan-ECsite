import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { mockProducts } from "../lib/mockProducts";

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  description: string;
  tags: string[];
  rating: number;
  reviews: number;
  color: string;
  size: string;
  flower: string;
  specifications?: {
    dimensions: string;
    weight: string;
    vase_material: string;
    flower_types: string;
    preservation_method: string;
    care_instructions: string;
    lifespan: string;
    packaging: string;
  };
  is_new: boolean;
  is_sale: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("商品IDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", productId);

        // 開発環境でモックデータを使用するかチェック
        if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
          console.log("Using mock data for product detail");
          console.log(
            "Available mock products:",
            mockProducts.map((p) => p.id)
          );
          console.log("Looking for product ID:", productId);

          const mockProduct = mockProducts.find((p) => p.id === productId);

          if (mockProduct) {
            console.log("Mock product found:", mockProduct);
            setProduct(mockProduct);
          } else {
            console.log("Product not found in mock data");
            setError("商品が見つかりません");
          }
          return;
        }

        // 本番環境ではSupabaseから取得
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .eq("is_active", true)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setError("商品の取得に失敗しました");
          return;
        }

        if (!data) {
          setError("商品が見つかりません");
          return;
        }

        console.log("Product data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error in fetchProduct:", err);
        setError("商品の取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};
