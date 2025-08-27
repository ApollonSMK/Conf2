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

export function NewPostForm() {
  const [content, setContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestTags = () => {
    startTransition(async () => {
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
    // In a real app, this would submit the form data
    toast({
      title: 'Publicação Criada!',
      description: 'A sua publicação foi submetida com sucesso.',
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Detalhes da Publicação</CardTitle>
          <CardDescription>Escreva o conteúdo e nós ajudamos com as tags.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Um título cativante para a sua publicação" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              placeholder="Escreva aqui sobre o que quiser partilhar..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="tags">Tags Sugeridas</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isPending || !content}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Sugerir Tags
              </Button>
            </div>
            <div className="p-4 border rounded-md min-h-[6rem] bg-muted/50">
                {isPending && <p className="text-sm text-muted-foreground">A gerar sugestões...</p>}
                {!isPending && suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer text-sm font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                {!isPending && suggestedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Escreva algum conteúdo e clique em "Sugerir Tags" para ver a magia acontecer.
                    </p>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Publicar</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
