import { site } from "@/lib/site";

const messages = [
  { href: "/shipping", text: "Stitched in Lahore, delivered across Pakistan and the United States" },
  { href: `tel:${site.uan.tel}`, text: `Call us at: ${site.uan.label}`, primary: true },
  { href: `tel:${site.concierge.tel}`, text: `For bespoke concierge: ${site.concierge.label}` },
];

// The track slides left by half its width, so it holds four copies: two are always on screen.
const copies = [0, 1, 2, 3];

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Contact"
      className="caps overflow-hidden border-b border-neutral-900 bg-black py-2.5 text-sm leading-[1.65] text-white"
    >
      {/* With reduced motion the bar is static and shows only the primary message. */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        {copies.map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0}
            className={`flex shrink-0 ${copy > 0 ? "motion-reduce:hidden" : ""}`}
          >
            {messages.map((message) => (
              <li
                key={message.text}
                className={`whitespace-nowrap px-14 ${message.primary ? "" : "motion-reduce:hidden"}`}
              >
                <a href={message.href} tabIndex={copy > 0 ? -1 : undefined}>
                  {message.text}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}
