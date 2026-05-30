import Link from "next/link";
import {
  ArrowRight,
  Download,
  FileText,
  Layers3,
  Sparkles,
} from "lucide-react";

export default function Banner() {
  return (
    <section className="overflow-hidden bg-(--color-bg) text-(--color-text)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* left */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--color-active-border) bg-(--color-active-bg) px-4 py-2 text-sm font-medium text-(--color-active-text)">
              <Sparkles className="h-4 w-4" />
              Modern CV Builder
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              CVs that look
              <span className="block">
                ready
                <span className="mx-3 inline-block h-2 w-2 rounded-full bg-(--color-text)" />
                from the start
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-(--color-gray) sm:text-lg">
              Create a professional CV in minutes with our intuitive builder.
              Just fill in your details, choose a template, and download your
              polished CV ready to impress employers. No design skills needed!
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cv-builder"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-(--color-text) px-6 py-3.5 text-sm font-semibold text-(--color-bg)"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="inline-flex items-center justify-center gap-2 rounded-2xl border border-(--color-active-border) bg-(--color-bg) px-6 py-3.5 text-sm font-semibold text-(--color-text)">
                Browse Templates
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-(--color-active-border) p-4">
                <p className="text-sm font-medium text-(--color-text)">
                  Live editing
                </p>
                <p className="mt-1 text-sm text-(--color-gray)">
                  Write and preview instantly
                </p>
              </div>

              <div className="rounded-2xl border border-(--color-active-border) p-4">
                <p className="text-sm font-medium text-(--color-text)">
                  Clean structure
                </p>
                <p className="mt-1 text-sm text-(--color-gray)">
                  Simple sections that scale
                </p>
              </div>

              <div className="rounded-2xl border border-(--color-active-border) p-4">
                <p className="text-sm font-medium text-(--color-text)">
                  Fast export
                </p>
                <p className="mt-1 text-sm text-(--color-gray)">
                  Ready to download as PDF
                </p>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="relative mx-auto w-full max-w-125">
            <div className="absolute left-2 top-12 h-24 w-24 rounded-[28px] border border-(--color-active-border)" />
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-(--color-active-bg)" />
            <div className="absolute bottom-10 left-8 h-16 w-16 rounded-full border border-(--color-active-border)" />

            <div className="relative aspect-[4/4.8]">
              {/* back card 1 */}
              <div className="absolute left-0 top-16 w-[68%] -rotate-6 rounded-[28px] border border-(--color-active-border) bg-(--color-bg) p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
                  <Layers3 className="h-4 w-4" />
                  Template
                </div>

                <div className="mt-4 space-y-3">
                  <div className="h-3 w-24 rounded-full bg-(--color-active-bg)" />
                  <div className="h-10 rounded-2xl bg-(--color-active-bg)" />
                  <div className="h-10 rounded-2xl bg-(--color-active-bg)" />
                  <div className="h-16 rounded-2xl border border-dashed border-(--color-active-border)" />
                </div>
              </div>

              {/* back card 2 */}
              <div className="absolute right-0 top-0 w-[56%] rotate-6 rounded-[28px] border border-(--color-active-border) bg-(--color-active-bg) p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-(--color-active-text)">
                  <Download className="h-4 w-4" />
                  Export
                </div>

                <div className="mt-5 rounded-2xl bg-(--color-bg) p-3">
                  <div className="h-3 w-16 rounded-full bg-(--color-active-bg)" />
                  <div className="mt-3 h-9 rounded-xl bg-(--color-active-bg)" />
                </div>

                <div className="mt-3 rounded-2xl bg-(--color-bg) p-3">
                  <div className="h-3 w-20 rounded-full bg-(--color-active-bg)" />
                  <div className="mt-3 h-14 rounded-xl bg-(--color-active-bg)" />
                </div>
              </div>

              {/* main card */}
              <div className="absolute inset-x-8 bottom-0 rounded-4xl border border-(--color-active-border) bg-(--color-bg) p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-text) text-(--color-bg)">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="rounded-full border border-(--color-active-border) px-3 py-1.5 text-xs font-medium text-(--color-gray)">
                    PDF
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-(--color-text) p-5 text-(--color-bg)">
                  <div className="h-2.5 w-16 rounded-full bg-(--color-bg) opacity-20" />
                  <div className="mt-3 h-6 w-40 rounded-full bg-(--color-bg) opacity-90" />
                  <div className="mt-2 h-2.5 w-28 rounded-full bg-(--color-bg) opacity-25" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-(--color-active-bg) p-3">
                    <div className="h-2.5 w-10 rounded-full bg-(--color-active-border)" />
                    <div className="mt-3 h-8 rounded-xl bg-(--color-active-border)" />
                  </div>

                  <div className="rounded-2xl bg-(--color-active-bg) p-3">
                    <div className="h-2.5 w-10 rounded-full bg-(--color-active-border)" />
                    <div className="mt-3 h-8 rounded-xl bg-(--color-active-border)" />
                  </div>

                  <div className="rounded-2xl bg-(--color-active-bg) p-3">
                    <div className="h-2.5 w-10 rounded-full bg-(--color-active-border)" />
                    <div className="mt-3 h-8 rounded-xl bg-(--color-active-border)" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-(--color-active-bg) p-4">
                  <div className="h-3 w-24 rounded-full bg-(--color-active-border)" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2.5 rounded-full bg-(--color-active-border)" />
                    <div className="h-2.5 w-11/12 rounded-full bg-(--color-active-border)" />
                    <div className="h-2.5 w-8/12 rounded-full bg-(--color-active-border)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right end */}
        </div>
      </div>
    </section>
  );
}
