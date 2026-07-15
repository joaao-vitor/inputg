import { Navbar } from "@/components/unauth/navbar";

export default function UnauthenticatedLayout({children} : {children: React.ReactNode}) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar/>
    </div>
  )
}
