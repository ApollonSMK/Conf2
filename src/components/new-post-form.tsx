
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { createPost, updatePost, uploadImage } from '@/app/actions';
import { Wand2, Loader2, ImageUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
}

interface NewPostFormProps {
    confrariaId: string;
    post?: Post;
    onPostCreated?: () => void;
    onPostUpdated?: () => void;
}

export function NewPostForm({ confrariaId, post, onPostCreated, onPostUpdated }: NewPostFormProps) {
  const isEditMode = !!post;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, startSubmission] = useTransition();
  const { toast } = useToast();
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    if (isEditMode) {
        setTitle(post.title);
        setContent(post.content);
        if (post.imageUrl) {
            setImagePreview(post.imageUrl);
        }
    }
  }, [post, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
        setImagePreview(URL.createObjectURL(file));
    } else {
        setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({ title: 'Erro', description: 'Necessita de estar autenticado.', variant: 'destructive'});
        return;
    }

    startSubmission(async () => {
        try {
            let imageUrl = isEditMode ? post.imageUrl : undefined;

            // If there's a new file, upload it.
            // In edit mode, this will replace the old image.
            if (imageFile) {
                 const compressedFile = await imageCompression(imageFile, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                });
                const formData = new FormData();
                formData.append('file', compressedFile);
                const uploadResult = await uploadImage(formData);
                if (uploadResult.success && uploadResult.url) {
                    imageUrl = uploadResult.url;
                } else {
                    throw new Error(uploadResult.error || 'Falha no upload da imagem.');
                }
            } else if (!imagePreview && isEditMode) {
              // If preview is null in edit mode, it means user removed the image
              imageUrl = undefined;
            }

            const postData = {
                title,
                content,
                imageUrl,
            };

            if(isEditMode) {
                const result = await updatePost(post.id, postData);
                if(result.success) {
                     toast({ title: 'Publicação Atualizada!', description: 'A sua publicação foi atualizada com sucesso.'});
                     if (onPostUpdated) onPostUpdated();
                     router.refresh();
                } else {
                     toast({ title: 'Erro ao Atualizar', description: result.error, variant: 'destructive'});
                }
            } else {
                const newPostData = {
                    ...postData,
                    confrariaId,
                    authorId: user.uid,
                    authorName: user.displayName,
                    authorAvatar: user.photoURL,
                };
                const result = await createPost(newPostData);

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
                    setImageFile(null);
                    setImagePreview(null);
                    router.refresh(); // Refresh server components on the current route
                } else {
                    toast({
                        title: 'Erro ao Publicar',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
            }
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: error.message,
                variant: 'destructive'
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

        {imagePreview && (
          <div className="relative">
            <Image 
              src={imagePreview}
              alt="Pré-visualização da imagem"
              width={500}
              height={300}
              className="w-full h-auto max-h-80 object-contain rounded-lg border"
            />
            <Button type="button" variant="destructive" size="icon" onClick={removeImage} className="absolute top-2 right-2 h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center pt-6">
            <div>
              <Label htmlFor="image-upload" className="inline-flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary">
                <ImageUp />
                <span>Adicionar Foto</span>
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </Label>
            </div>
            <Button type="submit" className="ml-auto" disabled={isSubmitting || !title || !content}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Guardar Alterações' : 'Publicar'}
            </Button>
        </div>
      </div>
    </form>
  );
}
