import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { setupSchema } from '../validators/requestSchemas.js';
import { DEFAULT_SENSORY, stringifyJson, parseJson } from '../utils/constants.js';

const router = Router();

router.post('/setup', async (req, res) => {
  try {
    const data = setupSchema.parse(req.body);
    const sensoryPrefs = { ...DEFAULT_SENSORY, ...(data.sensoryPrefs || {}) };

    let user;
    if (req.body.userId) {
      user = await prisma.user.update({
        where: { id: req.body.userId },
        data: {
          name: data.name,
          persona: data.persona,
          language: data.language,
          sensoryPrefs: stringifyJson(sensoryPrefs),
          setupComplete: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: data.name,
          persona: data.persona,
          language: data.language,
          sensoryPrefs: stringifyJson(sensoryPrefs),
          setupComplete: true,
        },
      });
    }

    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: formatUser(user) });
});

router.patch('/:userId/sensory', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const current = parseJson(user.sensoryPrefs, DEFAULT_SENSORY);
    const updated = { ...current, ...req.body };
    const saved = await prisma.user.update({
      where: { id: req.params.userId },
      data: { sensoryPrefs: stringifyJson(updated) },
    });
    res.json({ user: formatUser(saved) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    persona: user.persona,
    language: user.language,
    sensoryPrefs: parseJson(user.sensoryPrefs, DEFAULT_SENSORY),
    setupComplete: user.setupComplete,
    role: user.role,
  };
}

export default router;
