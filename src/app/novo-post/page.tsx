
import { NewPostForm } from '@/components/new-post-form';

export default function NovoPostPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4 text-center">
        <h1 className="font-headline font-bold text-4xl text-primary">Criar Nova Publicação</h1>
        <p className="text-lg text-muted-foreground">Partilhe novidades, eventos ou receitas com a comunidade.</p>
      </div>
      <NewPostForm />
    </div>
  );
}
