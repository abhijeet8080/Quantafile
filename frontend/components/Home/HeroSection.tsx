import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-tr from-purple-700 via-pink-600 to-orange-500 text-white overflow-hidden">
      {/* Decorative Background Shapes */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-pink-400 opacity-30 blur-3xl -translate-x-1/3 -translate-y-1/4"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500 opacity-30 blur-3xl translate-x-1/3 translate-y-1/3"
      />

      <div className="max-w-7xl mx-auto px-6 py-28 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Discover, Ask & Share
            <br />
            <span className="bg-gradient-to-r from-pink-300 via-white to-orange-300 bg-clip-text text-transparent">
              Knowledge that Empowers
            </span>
          </h1>
          <p className="text-lg text-pink-100 max-w-md drop-shadow-sm">
            Join a vibrant community where your curiosity sparks meaningful
            conversations, and every question leads to new insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 pt-6">
            <Link href="/explore" passHref>
              <Button
                size="lg"
                className="bg-white text-purple-700 font-bold shadow-lg hover:bg-gray-300 transition"
              >
                Explore Questions
              </Button>
            </Link>
            <Link href="/ask" passHref>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-500 bg-purple-700 text-white  font-bold hover:bg-white  transition"
              >
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:block max-w-[450px] w-full drop-shadow-2xl">
          <Image
            src="/assets/hero.svg"
            alt="Q&A Illustration"
            width={450}
            height={450}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
