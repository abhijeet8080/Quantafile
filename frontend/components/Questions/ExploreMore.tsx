import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ExploreMore() {
  return (
    <div className="w-full flex justify-center py-10">
      <Link href="/explore" passHref>
        <Button
          variant="default"
          size="lg"
          className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white shadow-lg hover:brightness-110 transition-transform hover:scale-105"
        >
          Explore More Questions
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );
}
