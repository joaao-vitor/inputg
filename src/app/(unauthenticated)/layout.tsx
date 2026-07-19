import { Footer } from "@/components/unauth/footer";
import { Navbar } from "@/components/unauth/navbar";

export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full w-full flex flex-col">
      <Navbar />
      <main className=" w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
