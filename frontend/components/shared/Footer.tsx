import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-purple-600/30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        {/* Left side: copyright */}
        <p className="select-none">
          &copy; {new Date().getFullYear()} AskIt. All rights reserved.
        </p>

        {/* Right side: links */}
        <div className="flex gap-6">
          {[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/privacy", label: "Privacy" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group text-gray-600 dark:text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 transition-all duration-300"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-[1.5px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
