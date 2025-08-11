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
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-purple-600/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
          aria-label="QnA Platform Home"
        >
           AskIt
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700 dark:text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group px-2 py-1 rounded-lg hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 transition-all duration-300"
            >
              {link.label}
              <span
                className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                aria-hidden="true"
              />
            </Link>
          ))}
          <ModeToggle />
          {isAuthenticated ? (
            <UserDropdown user={user} handleLogout={handleLogout} />
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:brightness-110 text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800 transition"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={26} className="text-purple-600" />
          ) : (
            <Menu size={26} className="text-purple-600" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-purple-600/40 shadow-lg px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-lg font-semibold text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:text-white transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-purple-600/30 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${user?._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800 transition"
                >
                  <Image
                    src={user?.avatar || "/assets/default-avatar.png"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-purple-600">{user?.username}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-800 transition"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:brightness-110 text-white transition"
                  >
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
