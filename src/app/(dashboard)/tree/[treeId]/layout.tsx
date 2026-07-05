export default function TreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Parent (dashboard)/layout.tsx zaten Navbar ve main içeriyor.
  // Burada sadece children'ı geçiriyoruz, çift Navbar önlüyor.
  return <>{children}</>;
}
