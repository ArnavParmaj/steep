import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_200ExtraLight, Outfit_400Regular, Outfit_500Medium } from '@expo-google-fonts/outfit';
import { themes } from '../ui/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({ Outfit_200ExtraLight, Outfit_400Regular, Outfit_500Medium });
  if (!loaded) return null;
  const t = themes.espresso;
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }} />
    </>
  );
}
