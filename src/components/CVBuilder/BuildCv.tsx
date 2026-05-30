// src/components/CVBuilder/BuildCv.tsx
"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { CvData } from "./AddCv";
import { AddressBlock, LS_KEY } from "@/src/types/cv-builder-type";

/* ── helpers ── */
const formatDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

const formatAddressLines = (a: AddressBlock | undefined): string[] => {
  if (!a) return [];
  const lines: string[] = [];
  const line1Parts: string[] = [];
  if (a.village) line1Parts.push(`Vill: ${a.village}`);
  if (a.post)
    line1Parts.push(`Post: ${a.post}${a.postCode ? ` - ${a.postCode}` : ""}`);
  if (line1Parts.length) lines.push(line1Parts.join(", ") + ",");

  const line2Parts: string[] = [];
  if (a.upazila) line2Parts.push(`Upazilla: ${a.upazila}`);
  if (a.zila) line2Parts.push(`Dist. ${a.zila}`);
  if (line2Parts.length) lines.push(line2Parts.join(", ") + ".");

  return lines;
};

interface BuildCvProps {
  data?: CvData;
  onBack?: () => void;
}

const BuildCv = ({ data: propData, onBack }: BuildCvProps) => {
  const [lsData] = useState<CvData | null>(() => {
    if (propData) return null;
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as CvData) : null;
    } catch {
      return null;
    }
  });

  const [downloading, setDownloading] = useState(false);
  const data: CvData | null = propData ?? lsData;
  const printRef = useRef<HTMLDivElement>(null);

  /* ── pdf download ── */
  const handleDownload = async () => {
    if (!printRef.current || !data || downloading) return;
    setDownloading(true);
    try {
      const el = printRef.current;
      const { toPng } = await import("html-to-image");
      const { default: jsPDF } = await import("jspdf");

      const A4W = 210;
      const A4H = 297;

      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (n) => !(n instanceof HTMLScriptElement),
      });

      const img = new window.Image();
      img.src = dataUrl;
      await new Promise<void>((r) => {
        img.onload = () => r();
      });

      const imgWmm = A4W;
      const imgHmm = (img.height / img.width) * A4W;
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      let y = 0;
      let page = 0;
      while (y < imgHmm) {
        if (page > 0) pdf.addPage();
        const srcY = (y / imgHmm) * img.height;
        const srcH = Math.min((A4H / imgHmm) * img.height, img.height - srcY);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = srcH;
        canvas.getContext("2d")!.drawImage(img, 0, -srcY);
        const pageUrl = canvas.toDataURL("image/jpeg", 0.96);
        const phMm = (srcH / img.height) * imgHmm;
        pdf.addImage(pageUrl, "JPEG", 0, 0, imgWmm, phMm);
        y += A4H;
        page++;
      }

      pdf.save(`${data.name?.trim() || "CV"}_CV.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-(--color-gray) text-sm">
            কোনো CV data পাওয়া যায়নি।
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-blue-500 hover:text-blue-700 underline"
            >
              ← তথ্য পূরণ করতে যান
            </button>
          )}
        </div>
      </div>
    );
  }

  /* personal rows */
  const personalRows: [string, string | string[]][] = (
    [
      ["Name", data.name],
      ["Father's Name", data.fatherName],
      ["Mother's Name", data.motherName],
      ["Gender", data.gender],
      ["Height", data.height],
      ["Date of birth", formatDate(data.dob)],
      ["Weight", data.weight],
      ["Marital Status", data.maritalStatus],
      ["Nationality", data.nationality],
      ["Present Address", formatAddressLines(data.presentAddress)],
      [
        "Permanent Address",
        data.sameAsPresent
          ? formatAddressLines(data.presentAddress)
          : formatAddressLines(data.permanentAddress),
      ],
      ["Religion", data.religion],
      ["Phone", data.cellPhone],
      ["Email", data.email],
      ["National Id", data.nationalId],
    ] as [string, string | string[]][]
  ).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));

  return (
    <div className="min-h-screen bg-(--color-bg) py-6 px-3 sm:px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-(--color-gray) hover:text-(--color-text) border border-(--color-active-border) px-4 py-2 rounded-xl transition-all hover:bg-(--color-active-bg)"
            >
              ← তথ্য সম্পাদনা করুন
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {downloading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                তৈরি হচ্ছে...
              </>
            ) : (
              "⬇ PDF ডাউনলোড করুন"
            )}
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CV PAPER
            ════════════════════════════════════════════════════════════════ */}
        <div
          ref={printRef}
          className="bg-white text-black font-serif text-[13px] leading-[1.35] px-12.5 py-7.5"
        >
          {/* ── BANNER: 3-layer purple bands ── */}
          <div className="relative h-17.5 mt-10 mb-0">
            {/* Title text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[cursive] text-[42px] italic text-[#5a5d80] font-normal tracking-[1px] leading-none">
                Curriculum Vitae
              </span>
            </div>
          </div>

          {/* ── INFO ROW: Name | Address Box | Photo ── */}
          <div className="flex items-start gap-5 pt-10 pb-6">
            {/* Name */}
            <div className="flex-1 flex items-center justify-center min-h-35">
              <h2 className="m-0 text-2xl font-bold tracking-[1.5px] text-black uppercase font-serif">
                {data.name || "YOUR NAME"}
              </h2>
            </div>

            {/* Address Box */}
            <div className="flex-[1.1_1_0] border border-black px-4 py-3 text-sm leading-relaxed bg-white min-h-30">
              <div className="font-bold mb-1.5 underline underline-offset-2">
                Address:
              </div>

              {/* ১ম লাইন: Village & Post */}
              <div className="flex flex-wrap items-center justify-start gap-x-6 mb-0.5">
                {data.mainAddress?.village && (
                  <div>Vill: {data.mainAddress.village},</div>
                )}
                {data.mainAddress?.post && (
                  <div>
                    Post: {data.mainAddress.post}
                    {data.mainAddress?.postCode
                      ? ` - ${data.mainAddress.postCode}`
                      : ""}
                    ,
                  </div>
                )}
              </div>

              {/* ২য় লাইন: Upazilla & Zila */}
              <div className="flex flex-wrap items-center justify-start gap-x-6">
                {data.mainAddress?.upazila && (
                  <div>Upazilla: {data.mainAddress.upazila},</div>
                )}
                {data.mainAddress?.zila && (
                  <div>Dist: {data.mainAddress.zila}.</div>
                )}
              </div>

              {/* ৩য় লাইন: Phone Number */}
              {data.cellPhone && (
                <div className="mt-2 font-medium">
                  Cell Phone: {data.cellPhone}
                </div>
              )}
            </div>

            {/* Photo */}
            <div className="shrink-0 pt-0">
              {data.photo ? (
                <Image
                  src={data.photo}
                  alt="Photo"
                  width={120}
                  height={140}
                  className="w-30 h-35 object-cover block"
                />
              ) : (
                <div className="w-30 h-35 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-[11px]">
                  Photo
                </div>
              )}
            </div>
          </div>

          {/* ── BODY SECTIONS ── */}
          <div className="flex flex-col gap-0 text-sm">
            {/* CAREER SUMMARY */}
            {data.careerSummary && (
              <>
                <SectionTitle>Career Summary:</SectionTitle>
                <GreyBlock>{data.careerSummary}</GreyBlock>
                <Spacer />
              </>
            )}

            {/* HIGHLIGHTS */}
            {data.highlights.some((h) => h.trim()) && (
              <>
                <SectionTitle>Highlights of Qualification:</SectionTitle>
                <GreyBlock>
                  <div className="pl-7.5 pt-1">
                    {data.highlights
                      .filter((h) => h.trim())
                      .map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3.5 mb-0.75"
                        >
                          <span className="shrink-0 text-sm leading-[1.4]">
                            ➢
                          </span>
                          <span>{h}</span>
                        </div>
                      ))}
                  </div>
                </GreyBlock>
                <Spacer />
              </>
            )}

            {/* ACADEMIC */}
            {data.academics.some((a) => a.examTitle) && (
              <>
                <SectionTitle>Academic Qualification:</SectionTitle>
                <div className="h-2.5" />
                <table className="w-full border-collapse text-[13px] border border-[#9a9a9a]">
                  <thead>
                    <tr>
                      {[
                        "Exam Title",
                        "Group/Dept.",
                        "Result",
                        "Passing Year",
                        "Board",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border border-[#9a9a9a] px-2 py-2.5 text-center font-bold text-[#5b9bd5] bg-white"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.academics
                      .filter((a) => a.examTitle)
                      .map((row) => (
                        <tr key={row.id}>
                          {[
                            row.examTitle,
                            row.groupDept,
                            row.result,
                            row.passingYear,
                            row.board,
                          ].map((val, j) => (
                            <td
                              key={j}
                              className="border border-[#9a9a9a] px-2 py-3 text-center text-black"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Spacer />
              </>
            )}

            {/* PERSONAL DETAILS */}
            {personalRows.length > 0 && (
              <div>
                <SectionTitle>Personal Details:</SectionTitle>
                <div className="h-1" />
                <table className="w-full border-separate border-spacing-y-1 text-sm">
                  <tbody>
                    {personalRows.map(([label, value]) => {
                      const isDateOfBirth = label === "Date of birth";

                      return (
                        <Fragment key={label}>
                          {isDateOfBirth && (
                            <tr>
                              <td colSpan={2} className="h-28" />
                            </tr>
                          )}

                          <tr>
                            <td className="bg-[#e9ebee] px-3.5 py-2 text-right text-[#5b9bd5] w-[32%] align-top">
                              {label} :
                            </td>
                            <td className="bg-[#e9ebee] px-3.5 py-2 text-black align-top">
                              {Array.isArray(value)
                                ? value.map((line, i) => (
                                    <div key={i}>{line}</div>
                                  ))
                                : value}
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <Spacer />
              </div>
            )}

            {/* LANGUAGE */}
            {data.languages.some((l) => l.language) && (
              <>
                <SectionTitle>Language Proficiency:</SectionTitle>
                <div className="h-2.5" />
                <table className="w-full border-collapse text-sm border border-[#9a9a9a]">
                  <thead>
                    <tr>
                      {["Language", "Reading", "Writing", "Speaking"].map(
                        (h) => (
                          <th
                            key={h}
                            className="border border-[#9a9a9a] px-2 py-2.5 text-center font-bold text-[#5b9bd5] bg-white"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.languages
                      .filter((l) => l.language)
                      .map((row, i) => (
                        <tr key={row.id}>
                          <td className="border border-[#9a9a9a] px-2 py-2.5 text-center text-[#5b9bd5] text-sm">
                            {i + 1}. {row.language}
                          </td>
                          {[row.reading, row.writing, row.speaking].map(
                            (val, j) => (
                              <td
                                key={j}
                                className="border border-[#9a9a9a] px-2 py-2.5 text-center text-black"
                              >
                                {val}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Spacer />
              </>
            )}

            {/* DECLARATION */}
            <SectionTitle>Declaration:</SectionTitle>
            <GreyBlock>
              I do solemnly affirm that the information contained herein is
              correct to the best of my knowledge and belief. If any false or
              incorrect information is quoted from this curriculum vitae, under
              signed will be liable and take full responsibility.
            </GreyBlock>

            {/* Signature block */}
            <div className="mt-7.5 pl-5 text-sm">
              <p className="m-0 mb-9 ">Faithfully yours,</p>
              <p className="m-0 mb-2.5 mt-20 tracking-[1px] font-mono text-sm    ">
                ----------------------
              </p>
              <p className="m-0">
                Date:{" "}
                {data.declarationDate ? formatDate(data.declarationDate) : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom download */}
        <div className="mt-6 pb-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded shadow-lg transition-all hover:shadow-xl text-sm tracking-wide"
          >
            {downloading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                PDF তৈরি হচ্ছে...
              </span>
            ) : (
              <>⬇ {data.name ? `${data.name}_CV.pdf` : "CV.pdf"} ডাউনলোড করুন</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════════════ */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#d9dceb] px-4 py-1.75 w-full box-border">
    <span className="text-[#1f7a1f] font-bold text-base underline underline-offset-[3px] font-serif tracking-[0.3px]">
      {children}
    </span>
  </div>
);

const GreyBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#e9ebee] px-4.5 py-3 text-sm leading-[1.55] text-black">
    {children}
  </div>
);

const Spacer = () => <div className="h-3.5" />;

export default BuildCv;
