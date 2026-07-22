// Run: npx wrangler kv:key put --binding=SHARE_CHAIN "post_1" '["beethoven_official","brahms_jr","liszt_fan","modern_classical_guy","investor_guest_user"]' --preview
// This script is run via: npx tsx scripts/seed-kv.ts

import { execSync } from 'child_process';

const seeds: Record<string, string[]> = {
  'post_1': ['beethoven_official', 'brahms_jr', 'liszt_fan', 'modern_classical_guy', 'investor_guest_user'],
  'post_ae': ['albert_einstein', 'openheimer_colleague', 'feynman_student', 'physics_major_33'],
  'post_2': ['nike', 'marathon_john', 'sara_runs_fast', 'fit_community_hub', 'local_sf_runner'],
  'post_3': ['aerogym_national', 'gym_rat_mark', 'denver_coach', 'fit_blogger_colorado'],
  'post_4': ['sourdough_bake_sf', 'mission_foodie_jen', 'sf_baking_club', 'user_is_hungry_too'],
  'post_5': ['altitude_hops', 'skier_shred_99', 'larimer_resident'],
};

for (const [id, chain] of Object.entries(seeds)) {
  const cmd = `npx wrangler kv key put --binding=SHARE_CHAIN "${id}" '${JSON.stringify(chain)}'`;
  console.log(`Seeding ${id}...`);
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`  ✓ ${id}`);
  } catch (e: any) {
    console.error(`  ✗ ${id}: ${e.stderr?.toString() || e.message}`);
  }
}
