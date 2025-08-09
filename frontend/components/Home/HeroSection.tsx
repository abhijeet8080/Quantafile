
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full py-20 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Ask, Answer & Connect with the Community
          </h1>
          <p className="text-muted-foreground text-lg">
            A platform where curious minds come together to ask meaningful questions,
            share knowledge, and grow collectively.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <Link href="/explore">
              <Button size="lg">Explore Questions</Button>
            </Link>
            <Link href="/ask">
              <Button variant="outline" size="lg">Ask a Question</Button>
            </Link>
          </div>
        </div>

        {/* Optional Right Illustration */}
        <div className="hidden md:block">
          <Image 
            width={200}
            height={200}
            src="/assets/hero.svg" // Replace with your own or use placeholder
            alt="Q&A Illustration"
            className="w-[400px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
