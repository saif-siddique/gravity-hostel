"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
} from "@/components/ui/resizable-navbar";
import { IconMessageChatbot } from "@tabler/icons-react";

export function NavbarItem() {
  return (
    <div className="fixed z-30 w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" href="/login">Login</NavbarButton>
            <NavbarButton className="flex justify-around gap-1.5 items-center inline-flex" href="/askme" variant="primary">
              <span>Ask Me</span>
              <IconMessageChatbot size={20} />
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              <NavbarButton variant="secondary" className="px-3 py-1.5 text-xs" href="/login">
                Login
              </NavbarButton>
              <NavbarButton className="flex items-center gap-1 inline-flex px-3 py-1.5 text-xs" href="/askme" variant="primary">
                <span>Ask</span>
                <IconMessageChatbot size={16} />
              </NavbarButton>
            </div>
          </MobileNavHeader>
        </MobileNav>
      </Navbar>
    </div>
  );
}