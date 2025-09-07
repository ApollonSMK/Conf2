
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
          <h1 className="font-headline font-bold text-4xl text-primary">Termos de Serviço</h1>
          <div className="prose mt-6">
            <p>O conteúdo dos termos de serviço será adicionado aqui.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
