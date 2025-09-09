
'use client';

import { useState, useTransition } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getTagSuggestions, createPost } from '@/app/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface NewPostFormProps {
    confrariaId: string;
    onPostCreated?: () => void;
}

export function NewPostForm({ confrariaId, onPostCreated }: NewPostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, startSuggestion] = useTransition();
  const [isSubmitting, startSubmission] = useTransition();
  const { toast } = useToast();
  const auth = getAuth();
  const router = useRouter();


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

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
        setTags([...tags, tag]);
    }
    setSuggestedTags(current => current.filter(t => t !== tag));
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(current => current.filter(t => t !== tagToRemove));
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({ title: 'Erro', description: 'Necessita de estar autenticado.', variant: 'destructive'});
        return;
    }

    startSubmission(async () => {
        const postData = {
            confrariaId,
            authorId: user.uid,
            authorName: user.displayName,
            authorAvatar: user.photoURL,
            title,
            content,
            tags,
        };
        const result = await createPost(postData);

        if (result.success) {
            toast({
            title: 'Publicação Criada!',
            description: 'A sua publicação foi submetida com sucesso.',
            });
            if(onPostCreated) {
                onPostCreated();
            }
            // Reset form
            setTitle('');
            setContent('');
            setTags([]);
            setSuggestedTags([]);
            router.refresh(); // Refresh server components on the current route
        } else {
            toast({
                title: 'Erro ao Publicar',
                description: result.error,
                variant: 'destructive',
            });
        }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Um título cativante para a sua publicação" value={title} onChange={e => setTitle(e.target.value)} required/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
            id="content"
            placeholder="Escreva aqui sobre o que quiser partilhar..."
            className="min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            />
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
            <Label htmlFor="tags">Tags</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting || !content}>
                {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Sugerir Tags
            </Button>
            </div>
             <div className="p-4 border rounded-md min-h-[6rem] bg-muted/50">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant="default" className="cursor-pointer text-sm font-normal" onClick={() => handleRemoveTag(tag)}>
                            {tag} &times;
                        </Badge>
                    ))}
                </div>
             </div>
             {suggestedTags.length > 0 && <Separator className="my-4"/>}
            <div className="p-4 border rounded-md min-h-[6rem] bg-muted/50">
                {isSuggesting && <p className="text-sm text-muted-foreground">A gerar sugestões...</p>}
                {!isSuggesting && suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer text-sm font-normal" onClick={() => handleAddTag(tag)}>
                                + {tag}
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
            <Button type="submit" className="ml-auto" disabled={isSubmitting || !title || !content}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar
            </Button>
        </div>
      </div>
    </form>
  );
}
