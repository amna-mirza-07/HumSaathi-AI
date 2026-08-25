import { PrismaClient } from '@prisma/client';
import { getActivityContent } from '../src/activities/registry.js';

const prisma = new PrismaClient();

const PERSONAS = ['child', 'teen', 'adult'];
const LANGUAGES = ['en', 'ur', 'ur_rm'];
const DIFFICULTIES = ['beginner', 'easy', 'medium'];

const ACTIVITY_DEFS = [
  { type: 'letter', topic: 'letters', titles: { en: 'Letter Learning', ur: 'حروف سیکھیں', ur_rm: 'Harf Seekhein' } },
  { type: 'number', topic: 'numbers', titles: { en: 'Number Learning', ur: 'نمبر سیکھیں', ur_rm: 'Number Seekhein' } },
  { type: 'shape_color_match', topic: 'colors', titles: { en: 'Shape & Color Match', ur: 'شکل اور رنگ', ur_rm: 'Shape aur Rang' } },
  { type: 'shape_color_match', topic: 'shapes', titles: { en: 'Shape Matching', ur: 'شکل ملائیں', ur_rm: 'Shape Milayein' } },
  { type: 'counting', topic: 'counting', titles: { en: 'Object Counting', ur: 'چیزیں گنیں', ur_rm: 'Cheezein Ginein' } },
  { type: 'animal_matching', topic: 'animals', titles: { en: 'Animal Matching', ur: 'جانوروں کا ملاپ', ur_rm: 'Janwaron Ka Milaap' } },
  { type: 'emotion_learning', topic: 'emotions', titles: { en: 'Emotion Learning', ur: 'جذبات و احساسات', ur_rm: 'Jazbaat o Ehsaasaat' } },
  { type: 'routine_sequencing', topic: 'routines', titles: { en: 'Daily Routine Sequence', ur: 'روزمرہ معمولات', ur_rm: 'Rozmarrah Maamulaat' } },
];

async function main() {
  await prisma.attempt.deleteMany();
  await prisma.aiRecommendation.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();

  const demoUsers = [
    { name: 'Ayesha (Strong)', persona: 'child', language: 'en' },
    { name: 'Bilal (Practice)', persona: 'child', language: 'ur_rm' },
  ];

  for (const demo of demoUsers) {
    await prisma.user.create({
      data: {
        name: demo.name,
        persona: demo.persona,
        language: demo.language,
        sensoryPrefs: JSON.stringify({
          textSize: 'medium',
          soundEnabled: false,
          animationsEnabled: true,
          reducedMotion: false,
          highContrast: false,
          calmMode: true,
        }),
        setupComplete: false,
        parentPin: '1234',
      },
    });
  }

  for (const def of ACTIVITY_DEFS) {
    for (const language of LANGUAGES) {
      for (const difficulty of DIFFICULTIES) {
        const content = getActivityContent(def.type, difficulty, language);
        await prisma.activity.create({
          data: {
            type: def.type,
            topic: def.topic,
            title: def.titles[language] || def.titles.en,
            difficulty,
            language,
            personas: JSON.stringify(PERSONAS),
            content: JSON.stringify(content),
            isActive: true,
          },
        });
      }
    }
  }

  const count = await prisma.activity.count();
  console.log(`Seeded ${count} activities and ${demoUsers.length} demo user placeholders.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
