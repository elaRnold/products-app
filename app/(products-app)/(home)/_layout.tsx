import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Productos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: 'Detalle del Producto',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="create-product"
        options={{
          title: 'Crear Producto',
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
