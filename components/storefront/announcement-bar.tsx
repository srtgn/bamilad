import { siteConfig } from "@/lib/site-config";

export function AnnouncementBar() {
  return (
    <div className="bg-mocha px-4 pt-3">
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-white/60 via-white to-white/60 px-6 py-2.5 shadow-sm">
          <span className="absolute left-2.5 h-6 w-1.5 rounded-full bg-mocha/60" />
          <p className="text-center text-sm font-medium text-ink">
            {siteConfig.announcement}
          </p>
        </div>
      </div>
    </div>
  );
}
