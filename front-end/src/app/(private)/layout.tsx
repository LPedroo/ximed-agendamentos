import { redirect } from "next/navigation"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { USER_ROLE_LABEL } from "@/constants/labels"
import { NAV_ITEMS } from "@/constants/navigation"
import { getCurrentUser } from "@/lib/session"

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?expired=1")

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role)).map(({ label, href }) => ({ label, href }))

  return (
    <div className="flex min-h-screen flex-col">
      <Header items={items} userName={user.name} roleLabel={USER_ROLE_LABEL[user.role]} />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 pt-28 pb-16">{children}</main>
      <Footer />
    </div>
  )
}
