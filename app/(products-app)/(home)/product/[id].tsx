import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productsActions } from "@/core/products/actions/products-actions";
import { useProductsStore } from "@/presentation/products/store/useProductsStore";
import type { Product } from "@/core/products/interfaces/product";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { localProducts } = useProductsStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const productId = Number(id);

      // Check if it's a local product (negative ID)
      if (productId < 0) {
        const localProduct = localProducts.find(p => p.id === productId);
        if (localProduct) {
          setProduct(localProduct);
        } else {
          setError("Producto local no encontrado");
        }
      } else {
        // Fetch from API for normal products
        const data = await productsActions.fetchProduct(productId);
        setProduct(data);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || "Producto no encontrado"}
        </Text>
      </View>
    );
  }

  const isLocal = product.isLocal || false;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        {isLocal && (
          <View style={styles.localBadge}>
            <Ionicons name="phone-portrait-outline" size={16} color="#fff" />
            <Text style={styles.localBadgeText}>Producto Local</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.tint }]}>
          {product.category.toUpperCase()}
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.tint }]}>
            ${product.price.toFixed(2)}
          </Text>
          {product.rating.count > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ⭐ {product.rating.rate} ({product.rating.count} reseñas)
              </Text>
            </View>
          )}
        </View>

        {isLocal && (
          <View
            style={[
              styles.localInfoCard,
              {
                backgroundColor: colorScheme === 'dark' ? '#1a3a1a' : '#e8f5e9',
                borderColor: '#4CAF50',
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <View style={styles.localInfoText}>
              <Text style={[styles.localInfoTitle, { color: colors.text }]}>
                Guardado en tu dispositivo
              </Text>
              <Text style={[styles.localInfoDescription, { color: colors.icon }]}>
                Este producto fue creado por ti y está almacenado localmente en tu teléfono.
              </Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Descripción
        </Text>
        <Text style={[styles.description, { color: colors.icon }]}>
          {product.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  localBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  localBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
  },
  ratingBadge: {
    backgroundColor: "rgba(255,215,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    color: "#b8860b",
  },
  localInfoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  localInfoText: {
    flex: 1,
  },
  localInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  localInfoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});
