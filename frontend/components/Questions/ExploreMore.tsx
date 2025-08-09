

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ExploreMore() {
  return (
    <div className="w-full flex justify-center py-8">
      <Link href="/explore">
        <Button variant="default" size="lg" className="flex items-center gap-2">
          Explore More Questions
          <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
}
