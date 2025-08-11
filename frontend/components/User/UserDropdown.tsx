import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { User2 } from "lucide-react";
import { User} from "@/types/user";
export default function UserDropdown({ user, handleLogout }: { user: User|null; handleLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full border border-border"
            />
          ) : (
            <User2 className="w-6 h-6" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user?._id}`}>My Profile</Link>
        </DropdownMenuItem>
        {/* Optional */}
        {/* <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem> */}
        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin-dashboard">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
