
import { getDiscoveryById } from "@/app/actions";
import { DiscoveryClientPage } from "@/components/discovery-client-page";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { notFound } from "next/navigation";

// Mock data, in a real app this would come from a database based on the slug
const descobertaDetails = {
    id: 1,
    slug: 'mercearia-do-ze',
    title: 'Mercearia do Zé',
    description: 'Uma pequena mercearia com os melhores queijos e enchidos da região. O Zé conhece todos os produtores! É um espaço acolhedor, com produtos de alta qualidade e um atendimento personalizado que faz toda a diferença. Recomendo vivamente uma visita para provar os queijos curados e o presunto caseiro.',
    images: [
        { id: 1, url: 'https://picsum.photos/800/600?random=31', data_ai_hint: 'grocery store interior' },
        { id: 2, url: 'https://picsum.photos/400/300?random=32', data_ai_hint: 'cheese selection' },
        { id: 3, url: 'https://picsum.photos/400/300?random=33', data_ai_hint: 'cured meats' },
    ],
    author: 'Maria Costa',
    authorAvatar: 'https://picsum.photos/100/100?random=51',
    data_ai_hint_author: 'woman portrait',
    category: 'Lugar',
    tags: ['Mercearia', 'Produtos Locais', 'Queijo', 'Trás-os-Montes'],
    selos: 1,
    comments: [
        { id: 1, author: 'António Silva', text: 'Confirmo! O queijo de cabra é divinal.', avatar: 'https://picsum.photos/100/100?random=52' },
        { id: 2, author: 'João Pereira', text: 'Fui lá na semana passada por causa desta partilha. Não desiludiu! Obrigado!', avatar: 'https://picsum.photos/100/100?random=53' },
    ],
    location: {
      address: 'Rua do Comércio, 123, 5300-000, Bragança',
      lat: 41.8058,
      lng: -6.7573,
    },
    contact: {
      phone: '+351 273 123 456',
      email: 'geral@merceariadoze.pt',
      website: 'https://www.merceariadoze.pt',
    },
    social: {
      facebook: 'https://facebook.com/merceariadoze',
      instagram: 'https://instagram.com/merceariadoze',
    },
    hours: [
        { day: 'Segunda - Sexta', time: '09:00 - 19:00' },
        { day: 'Sábado', time: '09:00 - 13:00' },
        { day: 'Domingo', time: 'Fechado' },
    ],
    amenities: [
        { name: 'Wi-Fi Grátis', icon: 'Wifi' },
        { name: 'Estacionamento', icon: 'ParkingSquare' },
        { name: 'Acessível a Cadeira de Rodas', icon: 'Accessibility' },
        { name: 'Aceita Animais', icon: 'Dog' },
        { name: 'Aceita Cartão', icon: 'CreditCard' },
        { name: 'Esplanada/Terraço', icon: 'Umbrella' },
        { name: 'Bom para Crianças', icon: 'ToyBrick' },
    ]
};


export default async function DescobertaPage({ params }: { params: { slug: string } }) {
    const descoberta = await getDiscoveryById(params.slug);

    let pageContent;

    if (!descoberta) {
        // Fallback to mock data if not found, or use notFound()
        // notFound(); 
        pageContent = <DiscoveryClientPage discovery={descobertaDetails as any} />;
    } else {
        pageContent = <DiscoveryClientPage discovery={descoberta as any} />;
    }

    return (
        <>
            <Header />
            <main className="flex-grow">{pageContent}</main>
            <Footer />
        </>
    )
}
