'use server';
/**
 * @fileOverview AI agent that suggests tags for a post based on its content.
 *
 * - suggestTagsForPost - A function that suggests tags for a given post content.
 * - SuggestTagsForPostInput - The input type for the suggestTagsForPost function.
 * - SuggestTagsForPostOutput - The return type for the suggestTagsForPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsForPostInputSchema = z.object({
  content: z.string().describe('The content of the post to suggest tags for.'),
});
export type SuggestTagsForPostInput = z.infer<typeof SuggestTagsForPostInputSchema>;

const SuggestTagsForPostOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the post content.'),
});
export type SuggestTagsForPostOutput = z.infer<typeof SuggestTagsForPostOutputSchema>;

export async function suggestTagsForPost(
  input: SuggestTagsForPostInput
): Promise<SuggestTagsForPostOutput> {
  return suggestTagsForPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsForPostPrompt',
  input: {schema: SuggestTagsForPostInputSchema},
  output: {schema: SuggestTagsForPostOutputSchema},
  prompt: `You are a tag suggestion expert for a food and beverage community.

  Given the following content of a post, suggest a list of relevant tags that can be used to categorize the post and make it easily discoverable by users.

  Content: {{{content}}}

  Return only a JSON array of tags. Do not include any explanation.`,
});

const suggestTagsForPostFlow = ai.defineFlow(
  {
    name: 'suggestTagsForPostFlow',
    inputSchema: SuggestTagsForPostInputSchema,
    outputSchema: SuggestTagsForPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
