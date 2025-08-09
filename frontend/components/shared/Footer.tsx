import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        {/* Left side: copyright */}
        <p>&copy; {new Date().getFullYear()} AskIt. All rights reserved.</p>

        {/* Right side: links */}
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
