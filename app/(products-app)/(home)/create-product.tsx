import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useProductsStore } from "@/presentation/products/store/useProductsStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { CreateProductDto } from "@/core/products/interfaces/product";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .required("El título es requerido"),
  price: Yup.number()
    .min(0, "El precio debe ser mayor a 0")
    .required("El precio es requerido"),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es requerida"),
  category: Yup.string().required("La categoría es requerida"),
  image: Yup.string().required("La imagen es requerida"),
});

const CATEGORIES = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

export default function CreateProductScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createLocalProduct } = useProductsStore();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Necesitamos permisos para acceder a la cámara y galería"
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFieldValue("image", imageUri);
    }
  };

  const takePhoto = async (setFieldValue: (field: string, value: any) => void) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFieldValue("image", imageUri);
    }
  };

  const handleSubmit = async (values: CreateProductDto) => {
    try {
      setIsSubmitting(true);
      await createLocalProduct(values);
      Alert.alert("Éxito", "Producto creado correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Formik
          initialValues={{
            title: "",
            price: "",
            description: "",
            category: "",
            image: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit({
              ...values,
              price: parseFloat(values.price as any),
            })
          }
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <Text style={[styles.title, { color: colors.text }]}>
                Crear Producto
              </Text>

              {/* Image Picker */}
              <View style={styles.imageSection}>
                {values.image ? (
                  <Image source={{ uri: values.image }} style={styles.imagePreview} />
                ) : (
                  <View
                    style={[
                      styles.imagePlaceholder,
                      { backgroundColor: colorScheme === "dark" ? "#222" : "#f5f5f5" },
                    ]}
                  >
                    <Ionicons name="image-outline" size={48} color={colors.icon} />
                    <Text style={[styles.imagePlaceholderText, { color: colors.icon }]}>
                      Sin imagen
                    </Text>
                  </View>
                )}

                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={[
                      styles.imageButton,
                      { backgroundColor: colors.tint },
                    ]}
                    onPress={() => pickImageFromGallery(setFieldValue)}
                  >
                    <Ionicons
                      name="images-outline"
                      size={20}
                      color={colorScheme === "dark" ? colors.background : "#fff"}
                    />
                    <Text
                      style={[
                        styles.imageButtonText,
                        { color: colorScheme === "dark" ? colors.background : "#fff" },
                      ]}
                    >
                      Galería
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.imageButton,
                      { backgroundColor: colors.tint },
                    ]}
                    onPress={() => takePhoto(setFieldValue)}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={20}
                      color={colorScheme === "dark" ? colors.background : "#fff"}
                    />
                    <Text
                      style={[
                        styles.imageButtonText,
                        { color: colorScheme === "dark" ? colors.background : "#fff" },
                      ]}
                    >
                      Cámara
                    </Text>
                  </TouchableOpacity>
                </View>

                {touched.image && errors.image && (
                  <Text style={styles.errorText}>{errors.image}</Text>
                )}
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.icon,
                      backgroundColor: colorScheme === "dark" ? "#222" : "#f5f5f5",
                    },
                  ]}
                  placeholder="Nombre del producto"
                  placeholderTextColor={colors.icon}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                />
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              {/* Price */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Precio *</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.icon,
                      backgroundColor: colorScheme === "dark" ? "#222" : "#f5f5f5",
                    },
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={colors.icon}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  value={values.price}
                  keyboardType="decimal-pad"
                />
                {touched.price && errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Categoría *
                </Text>
                <View style={styles.categoryButtons}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor:
                            values.category === cat
                              ? colors.tint
                              : colorScheme === "dark"
                              ? "#222"
                              : "#f5f5f5",
                          borderColor: values.category === cat ? colors.tint : colors.icon,
                        },
                      ]}
                      onPress={() => setFieldValue("category", cat)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          {
                            color:
                              values.category === cat
                                ? colorScheme === "dark"
                                  ? colors.background
                                  : "#fff"
                                : colors.text,
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.category && errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Descripción *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: colors.text,
                      borderColor: colors.icon,
                      backgroundColor: colorScheme === "dark" ? "#222" : "#f5f5f5",
                    },
                  ]}
                  placeholder="Describe el producto"
                  placeholderTextColor={colors.icon}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  multiline
                  numberOfLines={4}
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    color={colorScheme === "dark" ? colors.background : "#fff"}
                  />
                ) : (
                  <Text
                    style={[
                      styles.submitButtonText,
                      { color: colorScheme === "dark" ? colors.background : "#fff" },
                    ]}
                  >
                    Crear Producto
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
