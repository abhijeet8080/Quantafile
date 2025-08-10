"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import Image from "next/image";
import { ModeToggle } from "../ThemeToggle";
import UserDropdown from "../User/UserDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Ask Question", href: "/ask" },
  ];

  return (
    <nav className="w-full bg-background border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold text-primary">
          QnA Platform
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition"
            >
              {link.label}
            </Link>
          ))}
          <ModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <UserDropdown user={user} handleLogout={handleLogout} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 px-2 pb-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-muted-foreground hover:text-foreground transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${user?._id}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 py-2">
                    <Image
                      src={user?.avatar || "/default-avatar.png"}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <span>{user?.username}</span>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
