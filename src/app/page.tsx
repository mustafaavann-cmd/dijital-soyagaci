"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TreePine,
  Users,
  Shield,
  Share2,
  ArrowRight,
  Github,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: TreePine,
      title: "İnteraktif Ağaç Görselleştirme",
      description:
        "Aile ağacınızı sürükle-bırak destekli interaktif bir grafik üzerinde görüntüleyin ve düzenleyin.",
    },
    {
      icon: Users,
      title: "Aile Üyelerini Yönetin",
      description:
        "Her aile üyesi için detaylı bilgiler, fotoğraflar ve biyografiler ekleyin.",
    },
    {
      icon: Shield,
      title: "Güvenli Veri Saklama",
      description:
        "Verileriniz Supabase altyapısı ile güvenli bir şekilde şifrelenerek saklanır.",
    },
    {
      icon: Share2,
      title: "Kolay Paylaşım",
      description:
        "Soyağacınızı aile üyeleriyle paylaşın veya herkese açık olarak yayınlayın.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Dijital Soyağacı</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TreePine className="h-4 w-4" />
            Modern Soyağacı Platformu
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Aile Ağacınızı
            <span className="text-green-600"> Dijital Dünyaya</span> Taşıyın
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aile geçmişinizi modern ve interaktif bir şekilde oluşturun,
            düzenleyin ve gelecek nesillere aktarın. Kolay kullanım, güvenli
            saklama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Ücretsiz Başlayın
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neler Sunuyoruz?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dijital Soyağacı ile aile geçmişinizi modern bir şekilde
              yönetmenin keyfini çıkarın.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Ücretsiz hesap oluşturun ve aile ağacınızı oluşturmaya başlayın.
            Hiçbir teknik bilgi gerektirmez.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Ücretsiz Kayıt Ol
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-green-600" />
            <span className="font-semibold">Dijital Soyağacı</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Dijital Soyağacı. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
