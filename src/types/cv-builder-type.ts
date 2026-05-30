// src/types/cv-builder-type.ts

export const LS_KEY = "cv_draft_v2";

/* ── Address block type ── */
export interface AddressBlock {
  village: string;
  post: string;
  postCode: string;
  zila: string;
  upazila: string;
}

export const defaultAddress = (): AddressBlock => ({
  village: "",
  post: "",
  postCode: "",
  zila: "",
  upazila: "",
});

/* ── Academic row ── */
export interface AcademicRow {
  id: string;
  examTitle: string;
  groupDept: string;
  result: string;
  passingYear: string;
  board: string;
}

export const defaultAcademic = (): AcademicRow => ({
  id: crypto.randomUUID(),
  examTitle: "",
  groupDept: "",
  result: "",
  passingYear: "",
  board: "",
});

/* ── Language row ── */
export interface LanguageRow {
  id: string;
  language: string;
  reading: string;
  writing: string;
  speaking: string;
}

export const defaultLanguage = (): LanguageRow => ({
  id: crypto.randomUUID(),
  language: "",
  reading: "",
  writing: "",
  speaking: "",
});

export const proficiencyOptions = ["High", "Medium", "Low"] as const;

/* ── Full CV ── */
export interface CvData {
  name: string;
  photo: string;

  // Main address (section 1)
  mainAddress: AddressBlock;

  cellPhone: string;
  careerSummary: string;
  highlights: string[];
  academics: AcademicRow[];

  // Personal
  fatherName: string;
  motherName: string;
  gender: string;
  height: string;
  dob: string;
  weight: string;
  maritalStatus: string;
  nationality: string;

  // Present & Permanent address
  presentAddress: AddressBlock;
  permanentAddress: AddressBlock;
  sameAsPresent: boolean;

  religion: string;
  email: string;
  nationalId: string;

  languages: LanguageRow[];
  declarationDate: string;
}

export const initialData: CvData = {
  name: "",
  photo: "",

  mainAddress: defaultAddress(),

  cellPhone: "",
  careerSummary: "",
  highlights: [""],
  academics: [defaultAcademic()],

  fatherName: "",
  motherName: "",
  gender: "",
  height: "",
  dob: "",
  weight: "",
  maritalStatus: "",
  nationality: "",

  presentAddress: defaultAddress(),
  permanentAddress: defaultAddress(),
  sameAsPresent: false,

  religion: "",
  email: "",
  nationalId: "",

  languages: [defaultLanguage()],
  declarationDate: "",
};
