"use client";

import * as React from "react";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUsers,
  IconCalendarCheck,
  IconCreditCard,
  IconBell,
  IconMessageDots,
  IconMessageChatbot,
  IconBuilding,
  IconUserPlus,
  IconReceipt2,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ClientOnly from "./client-only";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMainStudent: [
    {
      title: "Dashboard",
      url: "/dashboard/s",
      icon: IconDashboard,
    },
    {
      title: "Attendence",
      url: "/dashboard/s/attendence",
      icon: IconCalendarCheck,
    },
    {
      title: "Fees",
      url: "/dashboard/s/fees",
      icon: IconCreditCard,
    },
    {
      title: "Notifications",
      url: "/dashboard/s/notifications",
      icon: IconBell,
    },
    {
      title: "Complaints",
      url: "/dashboard/s/complaints",
      icon: IconMessageDots,
    },
    {
      title: "Ask me?",
      url: "/dashboard/s/askme",
      icon: IconMessageChatbot,
    },
  ],
  navMainAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard/a",
      icon: IconDashboard,
    },
    {
      title: "Students",
      url: "/dashboard/a/students",
      icon: IconUsers,
    },
    {
      title: "Rooms",
      url: "/dashboard/a/rooms",
      icon: IconBuilding,
    },
    {
      title: "Register Student",
      url: "/dashboard/a/register-student",
      icon: IconUserPlus,
    },
    {
      title: "Attendence",
      url: "/dashboard/a/attendence",
      icon: IconCalendarCheck,
    },
    {
      title: "Notifications",
      url: "/dashboard/a/notification",
      icon: IconBell, // unchanged
    },
    {
      title: "Vouchers",
      url: "/dashboard/a/assign-voucher",
      icon: IconReceipt2,
    },
    {
      title: "Complaints",
      url: "/dashboard/a/complaints",
      icon: IconMessageDots, // unchanged
    },
  ],
  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: IconCamera,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     items: [],
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nav, setNav] = React.useState<any>([]);
  const router = useRouter();
  const [render, setRender] = React.useState(false)
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/logout");

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        router.push("/login")
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const whichToShow = localStorage.getItem("data");

    if (whichToShow) {
      try {
        const decision = JSON.parse(whichToShow);
        if (decision?.isAdmin) {
          setNav(data.navMainAdmin);
        } else {
          setNav(data.navMainStudent);
        }
      } catch (error) {
        console.error("Error parsing localStorage 'data':", error);
        setNav(data.navMainStudent);
      }
    }
  }, []);

  return (
    <ClientOnly>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <span>
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">Gravity</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={nav} />
        </SidebarContent>
        <SidebarFooter>
          <Button
            disabled={isLoading}
            onClick={() => {
              handleLogout();
              setRender(!render)
            }}
            className="bg-transparent hover:bg-white/5 text-red-500"
          >
            {" "}
            {isLoading && <Loader2 className="animate-spin" />}Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </ClientOnly>
  );
}
