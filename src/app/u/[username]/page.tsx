import { notFound } from "next/navigation";
import Link from "next/link";
import { BASE_URL, APP_NAME } from "@/lib/constants";

interface UserProfile {
  username: string;
  displayName: string | null;
  bio: string | null;
}

interface PinnedLink {
  slug: string;
  shortUrl: string;
  title: string | null;
  originalUrl: string;
  totalClicks: number;
}

async function getUserProfile(username: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${username}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getPinnedLinks(username: string): Promise<PinnedLink[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${username}/links`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function getInitials(displayName: string | null, username: string): string {
  const name = displayName || username;
  return name
    .split(/[\s_-]+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserProfile(username);
  if (!user) return { title: "Not Found" };

  const displayName = user.displayName || `@${user.username}`;
  return {
    title: `${displayName} | ${APP_NAME}`,
    description: user.bio || `Check out ${displayName}'s links on ${APP_NAME}.`,
  };
}

export default async function UserBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [user, links] = await Promise.all([
    getUserProfile(username),
    getPinnedLinks(username),
  ]);

  if (!user) {
    notFound();
  }

  const initials = getInitials(user.displayName, user.username);
  const displayName = user.displayName || `@${user.username}`;

  return (
    <main className="bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 select-none">
            {initials}
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>

          {/* Username */}
          <p className="text-sm text-violet-600 font-medium mt-0.5">
            @{user.username}
          </p>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-xs">
              {user.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">No pinned links yet.</p>
            </div>
          ) : (
            links.map((link) => (
              <a
                key={link.slug}
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-slate-800 truncate group-hover:text-violet-700 transition-colors">
                    {link.title || link.slug}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {link.shortUrl}
                  </p>
                </div>

                {/* Clicks badge */}
                <span className="ml-4 shrink-0 inline-flex items-center gap-1 text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {link.totalClicks.toLocaleString()}
                </span>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-violet-600 transition-colors"
          >
            Powered by{" "}
            <span className="font-semibold text-violet-600">{APP_NAME}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
