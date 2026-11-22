import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDb } from '../data/db';
import { listBrewers, listRecipes } from '../data/repositories';
import type { Db } from '../data/types';
import type { Recipe } from '../content/schema';
import { themes } from '../ui/tokens';

const t = themes.espresso;
type Row = { id: string; name: string; recipes: Recipe[] };

/** Foundation placeholder: proves the database and recipe data load on device. Real screens come next. */
export default function Home() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const db = (await getDb()) as unknown as Db;
      const brewers = await listBrewers(db);
      setRows(await Promise.all(brewers.map(async (b) => ({ id: b.id, name: b.name, recipes: await listRecipes(db, b.id) }))));
    })().catch((e) => setError(String(e)));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <Text style={{ fontFamily: 'Outfit_200ExtraLight', fontSize: 56, color: t.ink }}>Steep</Text>
        <Text style={{ fontFamily: 'Outfit_400Regular', color: t.mute }}>Foundation build. Brewers and recipes loaded from the local database.</Text>
        {error && <Text style={{ color: t.warn }}>{error}</Text>}
        {!rows && !error && <Text style={{ color: t.mute }}>Loading…</Text>}
        {rows?.map((b) => (
          <View key={b.id} style={{ backgroundColor: t.surface, borderRadius: 20, padding: 20, gap: 8 }}>
            <Text style={{ fontFamily: 'Outfit_500Medium', color: t.ink, fontSize: 18 }}>{b.name}</Text>
            {b.recipes.map((r) => (
              <Text key={r.id} style={{ fontFamily: 'Outfit_400Regular', color: t.accent }}>
                {r.name} · {r.steps.length} steps
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
