'use server';

import { suggestTagsForPost } from '@/ai/flows/suggest-tags-for-post';

export async function getTagSuggestions(content: string) {
  if (!content) {
    return { tags: [] };
  }
  try {
    const result = await suggestTagsForPost({ content });
    return result;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return { tags: [], error: 'Falha ao sugerir tags. Tente novamente.' };
  }
}
