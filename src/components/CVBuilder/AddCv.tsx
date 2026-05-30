// src/components/CVBuilder/AddCv.tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import SearchableSelect from "@/src/components/ui/SearchableSelect";
import {
  AcademicRow,
  AddressBlock,
  CvData,
  defaultAcademic,
  defaultLanguage,
  initialData,
  LanguageRow,
  LS_KEY,
  proficiencyOptions,
} from "@/src/types/cv-builder-type";
import {
  allZilas,
  educationBoards,
  upazilasByZila,
} from "@/src/data/bd-locations";

export type { CvData, AcademicRow, LanguageRow };

interface AddCvProps {
  onPreview?: (data: CvData) => void;
}

/* ── Static option arrays (avoids re-creating every render) ── */
const genderOptions = ["Male", "Female", "Other"];
const maritalOptions = ["Unmarried", "Married", "Divorced", "Widowed"];
const religionOptions = ["Muslim", "Hindu", "Christian", "Buddhist", "Other"];

const AddCv = ({ onPreview }: AddCvProps) => {
  const [data, setData] = useState<CvData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Hydrate from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CvData>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  /* ── Debounced persist ── */
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      } catch {
        /* full */
      }
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 1500);
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  /* ── Setters ── */
  const set = useCallback(
    <K extends keyof CvData>(key: K, value: CvData[K]) =>
      setData((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setAddressField = useCallback(
    (
      block: "mainAddress" | "presentAddress" | "permanentAddress",
      field: keyof AddressBlock,
      value: string,
    ) => {
      setData((prev) => {
        const updated = {
          ...prev,
          [block]: { ...prev[block], [field]: value },
        };
        if (field === "zila")
          updated[block] = { ...updated[block], upazila: "" };
        if (block === "presentAddress" && prev.sameAsPresent) {
          updated.permanentAddress = { ...updated[block] };
          if (field === "zila") updated.permanentAddress.upazila = "";
        }
        return updated;
      });
    },
    [],
  );

  const handleSameAsPresent = useCallback((checked: boolean) => {
    setData((prev) => ({
      ...prev,
      sameAsPresent: checked,
      permanentAddress: checked
        ? { ...prev.presentAddress }
        : prev.permanentAddress,
    }));
  }, []);

  const handlePhoto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => set("photo", reader.result as string);
      reader.readAsDataURL(file);
    },
    [set],
  );

  /* Highlights */
  const setHighlight = useCallback((i: number, val: string) => {
    setData((prev) => {
      const arr = [...prev.highlights];
      arr[i] = val;
      return { ...prev, highlights: arr };
    });
  }, []);

  const addHighlight = useCallback(
    () =>
      setData((prev) => ({ ...prev, highlights: [...prev.highlights, ""] })),
    [],
  );

  const removeHighlight = useCallback((i: number) => {
    setData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== i),
    }));
  }, []);

  /* Academics */
  const setAcademic = useCallback(
    (id: string, key: keyof AcademicRow, val: string) => {
      setData((prev) => ({
        ...prev,
        academics: prev.academics.map((r) =>
          r.id === id ? { ...r, [key]: val } : r,
        ),
      }));
    },
    [],
  );

  const addAcademic = useCallback(() => {
    setData((prev) => ({
      ...prev,
      academics: [...prev.academics, defaultAcademic()],
    }));
  }, []);

  const removeAcademic = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      academics: prev.academics.filter((r) => r.id !== id),
    }));
  }, []);

  /* Languages */
  const setLanguage = useCallback(
    (id: string, key: keyof LanguageRow, val: string) => {
      setData((prev) => ({
        ...prev,
        languages: prev.languages.map((r) =>
          r.id === id ? { ...r, [key]: val } : r,
        ),
      }));
    },
    [],
  );

  const addLanguage = useCallback(() => {
    setData((prev) => ({
      ...prev,
      languages: [...prev.languages, defaultLanguage()],
    }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.filter((r) => r.id !== id),
    }));
  }, []);

  const handleClear = useCallback(() => {
    if (confirm("সব data মুছে ফেলবে?")) {
      localStorage.removeItem(LS_KEY);
      setData(initialData);
    }
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-(--color-bg) py-6 px-3 sm:px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-(--color-text)">
              CV তথ্য পূরণ করুন
            </h1>
            <p className="text-xs sm:text-sm text-(--color-gray) mt-1">
              সব তথ্য স্বয়ংক্রিয়ভাবে সেভ হচ্ছে
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {saved && (
              <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full animate-pulse">
                ✓ সেভ হয়েছে
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              সব মুছুন
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* ── 1: মূল তথ্য ── */}
          <Section title="১. মূল তথ্য ও ঠিকানা">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <Label>পুরো নাম (FULL NAME — বড় হাতে লিখুন)</Label>
                <Input
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="MD. ISTIAK AHAMMED"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>ছবি আপলোড করুন</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center gap-2 bg-(--color-bg) border-2 border-dashed border-(--color-active-border) hover:border-blue-400 rounded-xl px-4 py-3 text-sm text-(--color-gray) transition-colors">
                    <span>📷</span>
                    <span>ছবি বেছে নিন</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhoto}
                    />
                  </label>
                  {data.photo && (
                    <Image
                      src={data.photo}
                      alt="preview"
                      className="w-14 object-cover rounded-lg border border-(--color-active-border) shadow-sm"
                      style={{ height: "72px" }}
                      width={56}
                      height={72}
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-(--color-gray) uppercase tracking-wide mb-2">
                  ঠিকানা
                </p>
              </div>

              <AddressFields
                address={data.mainAddress}
                onChange={(f, v) => setAddressField("mainAddress", f, v)}
              />

              <div>
                <Label>মোবাইল নম্বর</Label>
                <Input
                  value={data.cellPhone}
                  onChange={(e) => set("cellPhone", e.target.value)}
                  placeholder="+8801769-*******"
                />
              </div>
            </div>
          </Section>

          {/* ── 2: Career Summary ── */}
          <Section title="২. Career Summary">
            <Label>সংক্ষিপ্ত পেশাদার পরিচয়</Label>
            <textarea
              value={data.careerSummary}
              onChange={(e) => set("careerSummary", e.target.value)}
              rows={4}
              placeholder="To work as part of a dynamic team..."
              className="w-full border border-(--color-active-border) rounded-xl px-4 py-3 text-sm text-(--color-text) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all placeholder:text-(--color-gray)"
            />
          </Section>

          {/* ── 3: Highlights ── */}
          <Section title="৩. Highlights of Qualification">
            <div className="space-y-2">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-(--color-gray) text-sm shrink-0">
                    ➤
                  </span>
                  <input
                    value={h}
                    onChange={(e) => setHighlight(i, e.target.value)}
                    placeholder={`যোগ্যতা ${i + 1}`}
                    className="flex-1 min-w-0 border border-(--color-active-border) rounded-lg px-3 py-2 text-sm text-(--color-text) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-(--color-gray)"
                  />
                  {data.highlights.length > 1 && (
                    <button
                      onClick={() => removeHighlight(i)}
                      className="text-red-400 hover:text-red-600 text-xl leading-none shrink-0 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <AddBtn onClick={addHighlight} label="+ আরো যোগ করুন" />
            </div>
          </Section>

          {/* ── 4: Academic ── */}
          <Section title="৪. Academic Qualification">
            <div className="space-y-3">
              {data.academics.map((row, i) => (
                <div
                  key={row.id}
                  className="bg-(--color-active-bg) border border-(--color-active-border) rounded-xl p-3 sm:p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-(--color-gray) uppercase tracking-wide">
                      পরীক্ষা {i + 1}
                    </span>
                    {data.academics.length > 1 && (
                      <button
                        onClick={() => removeAcademic(row.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        মুছুন
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Exam Title</Label>
                      <Input
                        value={row.examTitle}
                        onChange={(e) =>
                          setAcademic(row.id, "examTitle", e.target.value)
                        }
                        placeholder="B.B.A (Hon's)"
                      />
                    </div>
                    <div>
                      <Label>Group / Dept.</Label>
                      <Input
                        value={row.groupDept}
                        onChange={(e) =>
                          setAcademic(row.id, "groupDept", e.target.value)
                        }
                        placeholder="Management"
                      />
                    </div>
                    <div>
                      <Label>Result</Label>
                      <Input
                        value={row.result}
                        onChange={(e) =>
                          setAcademic(row.id, "result", e.target.value)
                        }
                        placeholder="3.22 (Out of 4.00)"
                      />
                    </div>
                    <div>
                      <Label>Passing Year</Label>
                      <Input
                        value={row.passingYear}
                        onChange={(e) =>
                          setAcademic(row.id, "passingYear", e.target.value)
                        }
                        placeholder="2023"
                      />
                    </div>
                    <div>
                      <Label>Board / University</Label>
                      <SearchableSelect
                        value={row.board}
                        onChange={(val) => setAcademic(row.id, "board", val)}
                        options={educationBoards}
                        placeholder="Board বেছে নিন"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <AddBtn onClick={addAcademic} label="+ পরীক্ষা যোগ করুন" />
            </div>
          </Section>

          {/* ── 5: Personal Details ── */}
          <Section title="৫. Personal Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label>পিতার নাম</Label>
                <Input
                  value={data.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                  placeholder="Md. Samsul Alom"
                />
              </div>
              <div>
                <Label>মাতার নাম</Label>
                <Input
                  value={data.motherName}
                  onChange={(e) => set("motherName", e.target.value)}
                  placeholder="Mst. Salma Sultana"
                />
              </div>
              <div>
                <Label>লিঙ্গ (Gender)</Label>
                <SearchableSelect
                  value={data.gender}
                  onChange={(val) => set("gender", val)}
                  options={genderOptions}
                  placeholder="বেছে নিন"
                />
              </div>
              <div>
                <Label>উচ্চতা (Height)</Label>
                <Input
                  value={data.height}
                  onChange={(e) => set("height", e.target.value)}
                  placeholder="5 Feet 8 Inch"
                />
              </div>
              <div>
                <Label>জন্মতারিখ (DOB)</Label>
                <Input
                  type="date"
                  value={data.dob}
                  onChange={(e) => set("dob", e.target.value)}
                />
              </div>
              <div>
                <Label>ওজন (Weight)</Label>
                <Input
                  value={data.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  placeholder="60 KG"
                />
              </div>
              <div>
                <Label>বৈবাহিক অবস্থা</Label>
                <SearchableSelect
                  value={data.maritalStatus}
                  onChange={(val) => set("maritalStatus", val)}
                  options={maritalOptions}
                  placeholder="বেছে নিন"
                />
              </div>
              <div>
                <Label>জাতীয়তা</Label>
                <Input
                  value={data.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                  placeholder="Bangladeshi by birth"
                />
              </div>

              {/* Present Address */}
              <div className="sm:col-span-2 mt-2">
                <p className="text-sm font-semibold text-(--color-text) mb-3 border-b border-(--color-active-border) pb-2">
                  বর্তমান ঠিকানা (Present Address)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AddressFields
                    address={data.presentAddress}
                    onChange={(f, v) => setAddressField("presentAddress", f, v)}
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="sm:col-span-2 mt-2">
                <div className="flex items-center justify-between mb-3 border-b border-(--color-active-border) pb-2">
                  <p className="text-sm font-semibold text-(--color-text)">
                    স্থায়ী ঠিকানা (Permanent Address)
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={data.sameAsPresent}
                        onChange={(e) => handleSameAsPresent(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-(--color-active-border) rounded-md bg-(--color-bg) peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        {data.sameAsPresent && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-(--color-gray)">
                      বর্তমান ঠিকানার মতো
                    </span>
                  </label>
                </div>
                <div
                  className={
                    data.sameAsPresent ? "opacity-50 pointer-events-none" : ""
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AddressFields
                      address={data.permanentAddress}
                      onChange={(f, v) =>
                        setAddressField("permanentAddress", f, v)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>ধর্ম (Religion)</Label>
                <SearchableSelect
                  value={data.religion}
                  onChange={(val) => set("religion", val)}
                  options={religionOptions}
                  placeholder="বেছে নিন"
                />
              </div>
              <div>
                <Label>ইমেইল</Label>
                <Input
                  type="email"
                  autoComplete="off"
                  suppressHydrationWarning
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <Label>জাতীয় পরিচয়পত্র নং</Label>
                <Input
                  value={data.nationalId}
                  onChange={(e) => set("nationalId", e.target.value)}
                  placeholder="NID Number"
                />
              </div>
            </div>
          </Section>

          {/* ── 6: Language Proficiency ── */}
          <Section title="৬. Language Proficiency">
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-4 gap-2 px-1">
                {["ভাষা", "Reading", "Writing", "Speaking"].map((h) => (
                  <span
                    key={h}
                    className="text-xs font-semibold text-(--color-gray) uppercase tracking-wide"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {data.languages.map((row) => (
                <div
                  key={row.id}
                  className="border border-(--color-active-border) rounded-xl p-3 sm:p-0 sm:border-0 sm:rounded-none space-y-2 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-2 sm:items-center"
                >
                  <div>
                    <span className="sm:hidden text-xs text-(--color-gray) block mb-1">
                      ভাষা
                    </span>
                    <Input
                      value={row.language}
                      onChange={(e) =>
                        setLanguage(row.id, "language", e.target.value)
                      }
                      placeholder="Bengali"
                    />
                  </div>
                  {(["reading", "writing", "speaking"] as const).map(
                    (skill) => (
                      <div key={skill}>
                        <span className="sm:hidden text-xs text-(--color-gray) block mb-1 capitalize">
                          {skill}
                        </span>
                        <SearchableSelect
                          value={row[skill]}
                          onChange={(val) => setLanguage(row.id, skill, val)}
                          options={[...proficiencyOptions]}
                          placeholder="—"
                        />
                      </div>
                    ),
                  )}
                  {data.languages.length > 1 && (
                    <button
                      onClick={() => removeLanguage(row.id)}
                      className="sm:hidden text-xs text-red-400 hover:text-red-600 text-right w-full transition-colors"
                    >
                      মুছুন
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-1">
                <AddBtn onClick={addLanguage} label="+ ভাষা যোগ করুন" />
                {data.languages.length > 1 && (
                  <button
                    onClick={() =>
                      removeLanguage(
                        data.languages[data.languages.length - 1].id,
                      )
                    }
                    className="hidden sm:block text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    শেষটা মুছুন
                  </button>
                )}
              </div>
            </div>
          </Section>

          {/* ── 7: Declaration ── */}
          <Section title="৭. Declaration">
            <div className="bg-(--color-active-bg) rounded-xl p-4 text-sm text-(--color-gray) italic border border-(--color-active-border)">
              I do solemnly affirm that the information contained herein is
              correct to the best of my knowledge and belief. If any false or
              incorrect information is quoted from this curriculum vitae, under
              signed will be liable and take full responsibility.
            </div>
            <div className="mt-4">
              <Label>তারিখ (Date)</Label>
              <Input
                type="date"
                value={data.declarationDate}
                onChange={(e) => set("declarationDate", e.target.value)}
              />
            </div>
          </Section>

          {/* ── Preview ── */}
          <div className="pb-8">
            <button
              onClick={() => onPreview?.(data)}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
            >
              CV প্রিভিউ দেখুন →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   ADDRESS FIELDS — reusable for main / present / permanent
   ══════════════════════════════════════════════════════════════════════════════ */
const AddressFields = ({
  address,
  onChange,
}: {
  address: AddressBlock;
  onChange: (field: keyof AddressBlock, value: string) => void;
}) => {
  const upazilas = address.zila ? upazilasByZila[address.zila] || [] : [];

  return (
    <>
      <div>
        <Label>গ্রাম (Village)</Label>
        <Input
          value={address.village}
          onChange={(e) => onChange("village", e.target.value)}
          placeholder="Bonbaria"
        />
      </div>
      <div>
        <Label>পোস্ট অফিস (Post)</Label>
        <Input
          value={address.post}
          onChange={(e) => onChange("post", e.target.value)}
          placeholder="Sirajganj"
        />
      </div>
      <div>
        <Label>পোস্ট কোড (Post Code)</Label>
        <Input
          value={address.postCode}
          onChange={(e) => onChange("postCode", e.target.value)}
          placeholder="6700"
        />
      </div>
      <div>
        <Label>জেলা (Zila)</Label>
        <SearchableSelect
          value={address.zila}
          onChange={(val) => onChange("zila", val)}
          options={allZilas}
          placeholder="জেলা বেছে নিন"
        />
      </div>
      <div>
        <Label>উপজেলা (Upazila)</Label>
        <SearchableSelect
          value={address.upazila}
          onChange={(val) => onChange("upazila", val)}
          options={upazilas}
          placeholder={address.zila ? "উপজেলা বেছে নিন" : "আগে জেলা বেছে নিন"}
          disabled={!address.zila}
        />
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ══════════════════════════════════════════════════════════════════════════════ */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-(--color-bg) rounded-2xl shadow-sm border border-(--color-active-border) overflow-hidden">
    <div className="bg-linear-to-r from-slate-700 to-slate-600 px-4 sm:px-5 py-3">
      <h2 className="text-white font-semibold text-xs sm:text-sm tracking-wide">
        {title}
      </h2>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-(--color-gray) mb-1.5 uppercase tracking-wide">
    {children}
  </label>
);

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    suppressHydrationWarning
    {...props}
    className={`w-full border border-(--color-active-border) rounded-xl px-3 sm:px-4 py-2.5 text-sm text-(--color-text) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-(--color-gray) ${className ?? ""}`}
  />
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors mt-1"
  >
    {label}
  </button>
);

export default AddCv;
