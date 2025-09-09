'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getTagSuggestions } from '@/app/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewPostFormProps {
    onPostCreated?: () => void;
}

export function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const [content, setContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, startSuggestion] = useTransition();
  const [isSubmitting, startSubmission] = useTransition();
  const { toast } = useToast();

  const handleSuggestTags = () => {
    startSuggestion(async () => {
      const result = await getTagSuggestions(content);
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive"
        })
        setSuggestedTags([]);
      } else {
        setSuggestedTags(result.tags);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSubmission(() => {
        // In a real app, this would submit the form data to a server action
        toast({
        title: 'Publicação Criada!',
        description: 'A sua publicação foi submetida com sucesso.',
        });
        if(onPostCreated) {
            onPostCreated();
        }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Um título cativante para a sua publicação" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
            id="content"
            placeholder="Escreva aqui sobre o que quiser partilhar..."
            className="min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
            <Label htmlFor="tags">Tags Sugeridas</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting || !content}>
                {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Sugerir Tags
            </Button>
            </div>
            <div className="p-4 border rounded-md min-h-[6rem] bg-muted/50">
                {isSuggesting && <p className="text-sm text-muted-foreground">A gerar sugestões...</p>}
                {!isSuggesting && suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer text-sm font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                {!isSuggesting && suggestedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Escreva algum conteúdo e clique em "Sugerir Tags" para ver a magia acontecer.
                    </p>
                )}
            </div>
        </div>
        <div className="flex justify-end pt-6">
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar
            </Button>
        </div>
      </div>
    </form>
  );
}
