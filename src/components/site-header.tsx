"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* <h1 className="text-base font-medium">Welcome, Ahmad</h1> */}
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm font-medium">Dark Mode</p>
          <Switch
            checked={mounted && resolvedTheme === "dark"}
            onCheckedChange={handleTheme}
            disabled={!mounted}
          />
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          </Button> */}
        </div>
      </div>
    </header>
  )
}
