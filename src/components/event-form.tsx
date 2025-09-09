
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, ImageUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { createEvent, updateEvent, uploadImage } from '@/app/actions';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    imageUrl?: string;
}

interface EventFormProps {
    confrariaId: string;
    event?: Event | null;
    onEventCreated: () => void;
    onEventUpdated: () => void;
}

export function EventForm({ confrariaId, event, onEventCreated, onEventUpdated }: EventFormProps) {
    const isEditMode = !!event;
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isSubmitting, startSubmission] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        if (isEditMode && event) {
            setTitle(event.title);
            setLocation(event.location);
            setDate(new Date(event.date));
            setDescription(event.description);
            if (event.imageUrl) {
                setImagePreview(event.imageUrl);
            }
        } else {
            // Reset form for creation
            setTitle('');
            setLocation('');
            setDate(undefined);
            setDescription('');
            setImageFile(null);
            setImagePreview(null);
        }
    }, [event, isEditMode]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else if (isEditMode && event?.imageUrl) {
            setImagePreview(event.imageUrl);
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) {
            toast({ title: 'Erro', description: 'Por favor, selecione uma data para o evento.', variant: 'destructive'});
            return;
        }

        startSubmission(async () => {
            try {
                let imageUrl = isEditMode ? event?.imageUrl : undefined;

                if (imageFile) {
                    const compressedFile = await imageCompression(imageFile, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' });
                    const formData = new FormData();
                    formData.append('file', compressedFile);
                    const uploadResult = await uploadImage(formData);
                    if (uploadResult.success && uploadResult.url) {
                        imageUrl = uploadResult.url;
                    } else {
                        throw new Error(uploadResult.error || 'Falha no upload da imagem.');
                    }
                } else if (!imagePreview && isEditMode) {
                    imageUrl = undefined;
                }

                const eventData = {
                    confrariaId,
                    title,
                    location,
                    date,
                    description,
                    imageUrl,
                };
                
                if (isEditMode && event) {
                    await updateEvent(event.id, eventData);
                    toast({ title: 'Sucesso', description: 'Evento atualizado com sucesso.' });
                    onEventUpdated();
                } else {
                    await createEvent(eventData);
                    toast({ title: 'Sucesso', description: 'Novo evento criado!' });
                    onEventCreated();
                }

            } catch (error: any) {
                toast({ title: 'Erro', description: error.message, variant: 'destructive'});
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-2">
                <Label htmlFor="title">Título do Evento *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="date">Data do Evento *</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: pt }) : <span>Escolha uma data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Localização *</Label>
                    <Input id="location" value={location} onChange={e => setLocation(e.target.value)} required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição do Evento</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o que os participantes podem esperar..." />
            </div>

            <div className="space-y-2">
                <Label>Imagem do Evento</Label>
                 {imagePreview ? (
                    <div className="relative">
                        <Image 
                        src={imagePreview}
                        alt="Pré-visualização do evento"
                        width={500}
                        height={300}
                        className="w-full h-auto max-h-60 object-contain rounded-lg border"
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={removeImage} className="absolute top-2 right-2 h-7 w-7">
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                 ) : (
                    <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Clique para carregar</span> ou arraste e solte
                            </p>
                        </div>
                        <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </Label>
                 )}
            </div>

             <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Guardar Alterações' : 'Criar Evento'}
                </Button>
             </div>
        </form>
    );
}
