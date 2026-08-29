// In-memory store helper to retain Ritual Guides on globalThis when PostgreSQL DB is unavailable

const globalForGuides = globalThis as unknown as {
  inMemoryRitualGuides: any[] | undefined;
  inMemoryDharmicConcepts: any[] | undefined;
};

if (!globalForGuides.inMemoryRitualGuides) {
  globalForGuides.inMemoryRitualGuides = [];
}
if (!globalForGuides.inMemoryDharmicConcepts) {
  globalForGuides.inMemoryDharmicConcepts = [];
}

export function getInMemoryGuides(): any[] {
  return globalForGuides.inMemoryRitualGuides || [];
}

export function saveInMemoryGuide(guide: any): void {
  if (!globalForGuides.inMemoryRitualGuides) {
    globalForGuides.inMemoryRitualGuides = [];
  }
  const idx = globalForGuides.inMemoryRitualGuides.findIndex(
    (g) => (guide.id && g.id === guide.id) || (guide.slug && g.slug === guide.slug)
  );
  if (idx >= 0) {
    globalForGuides.inMemoryRitualGuides[idx] = {
      ...globalForGuides.inMemoryRitualGuides[idx],
      ...guide,
      updatedAt: new Date().toISOString(),
    };
  } else {
    globalForGuides.inMemoryRitualGuides.unshift({
      ...guide,
      createdAt: guide.createdAt || new Date().toISOString(),
      updatedAt: guide.updatedAt || new Date().toISOString(),
    });
  }
}

export function deleteInMemoryGuide(id: string): void {
  if (!globalForGuides.inMemoryRitualGuides) return;
  globalForGuides.inMemoryRitualGuides = globalForGuides.inMemoryRitualGuides.filter(
    (g) => g.id !== id
  );
}

export function findInMemoryGuide(idOrSlug: string): any | null {
  const guides = getInMemoryGuides();
  return guides.find((g) => g.id === idOrSlug || g.slug === idOrSlug || (g.slug && g.slug.includes(idOrSlug))) || null;
}

export function getInMemoryDharmicConcepts(): any[] {
  return globalForGuides.inMemoryDharmicConcepts || [];
}

export function saveInMemoryDharmicConcept(concept: any): void {
  if (!globalForGuides.inMemoryDharmicConcepts) {
    globalForGuides.inMemoryDharmicConcepts = [];
  }
  const idx = globalForGuides.inMemoryDharmicConcepts.findIndex(
    (c) => (concept.id && c.id === concept.id) || (concept.slug && c.slug === concept.slug)
  );
  if (idx >= 0) {
    globalForGuides.inMemoryDharmicConcepts[idx] = {
      ...globalForGuides.inMemoryDharmicConcepts[idx],
      ...concept,
      updatedAt: new Date().toISOString(),
    };
  } else {
    globalForGuides.inMemoryDharmicConcepts.unshift({
      ...concept,
      id: concept.id || `concept-${Date.now()}`,
      createdAt: concept.createdAt || new Date().toISOString(),
      updatedAt: concept.updatedAt || new Date().toISOString(),
    });
  }
}

export function deleteInMemoryDharmicConcept(id: string): void {
  if (!globalForGuides.inMemoryDharmicConcepts) return;
  globalForGuides.inMemoryDharmicConcepts = globalForGuides.inMemoryDharmicConcepts.filter(
    (c) => c.id !== id
  );
}

export function findInMemoryDharmicConcept(idOrSlug: string): any | null {
  const concepts = getInMemoryDharmicConcepts();
  return concepts.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
}
