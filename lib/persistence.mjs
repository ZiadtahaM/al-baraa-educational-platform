import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HourPackLedger } from "./domain/hour-pack-ledger.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const STORE_PATH = path.resolve(DATA_DIR, "albaraa-store.json");

const SEED_DATA = {
  meta: {
    system: "Al-Baraa OS",
    version: "2.0.0",
    lastSyncedAt: new Date().toISOString(),
  },
  plans: [
    { id: "plan-8h", name: "باقة 8 ساعات", hours: 8, priceMinor: 20000, currency: "SAR", description: "باقة أساسية للمراجعة والتثبيت" },
    { id: "plan-16h", name: "باقة 16 ساعة", hours: 16, priceMinor: 35000, currency: "SAR", description: "باقة شهرية شاملة للتدريس المكثف" },
    { id: "plan-30h", name: "باقة 30 ساعة", hours: 30, priceMinor: 60000, currency: "SAR", description: "باقة الإجازة والتميز القرآني" },
  ],
  teachers: [
    {
      id: "teacher-1",
      fullNameAr: "الشيخة سارة الأحمد",
      fullNameEn: "Sheikha Sarah Al-Ahmad",
      email: "sarah@albaraa.edu.sa",
      timezone: "Africa/Cairo",
      hourlyRateMinor: 5000,
      teacherHourlySplitMinor: 3500,
      academyCommissionMinor: 1500,
      currency: "SAR",
    },
    {
      id: "teacher-2",
      fullNameAr: "الشيخ محمد الفهيد",
      fullNameEn: "Sheikh Mohammed Al-Fahaid",
      email: "mohammed@albaraa.edu.sa",
      timezone: "Asia/Riyadh",
      hourlyRateMinor: 4000,
      teacherHourlySplitMinor: 2800,
      academyCommissionMinor: 1200,
      currency: "SAR",
    },
  ],
  ledgers: {
    "student-1": {
      studentId: "student-1",
      studentName: "أحمد محمد العلي",
      parentPhone: "+966501234567",
      parentTimezone: "Asia/Riyadh",
      currency: "SAR",
      hourlyRateMinor: 5000,
      teacherHourlySplitMinor: 3500,
      academyCommissionMinor: 1500,
      totalMinutesPurchased: 960, // 16 hours
      minutesUsed: 360,           // 6 hours
      minutesRemaining: 600,      // 10 hours
      version: 7,
      lowBalanceAlert: false,
      whatsappReupLink: null,
      transactions: [
        {
          id: "tx_init_1",
          type: "PURCHASE_PACK",
          packId: "plan-16h",
          hours: 16,
          minutes: 960,
          priceMinor: 35000,
          currency: "SAR",
          teacherId: "teacher-1",
          subjectId: "quran-hifz",
          timestamp: "2026-09-01T08:00:00.000Z",
          fencingToken: 1,
        },
        {
          id: "tx_sess_1",
          type: "SESSION_DEBIT",
          sessionId: "sess_101",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 1 إلى 25",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "ممتاز في مخارج الحروف",
          timestamp: "2026-09-03T16:00:00.000Z",
          fencingToken: 2,
        },
        {
          id: "tx_sess_2",
          type: "SESSION_DEBIT",
          sessionId: "sess_102",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 26 إلى 50",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "تطبيق أحكام النون الساكنة",
          timestamp: "2026-09-07T16:00:00.000Z",
          fencingToken: 3,
        },
        {
          id: "tx_sess_3",
          type: "SESSION_DEBIT",
          sessionId: "sess_103",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 51 إلى 75",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "مراجعة الربع الأول",
          timestamp: "2026-09-10T16:00:00.000Z",
          fencingToken: 4,
        },
        {
          id: "tx_sess_4",
          type: "SESSION_DEBIT",
          sessionId: "sess_104",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 76 إلى 100",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "إتقان الإظهار الحلقي",
          timestamp: "2026-09-14T16:00:00.000Z",
          fencingToken: 5,
        },
        {
          id: "tx_sess_5",
          type: "SESSION_DEBIT",
          sessionId: "sess_105",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 101 إلى 125",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "تنبيه على تفخيم الراء",
          timestamp: "2026-09-18T16:00:00.000Z",
          fencingToken: 6,
        },
        {
          id: "tx_sess_6",
          type: "SESSION_DEBIT",
          sessionId: "sess_106",
          durationMinutes: 60,
          teacherId: "teacher-1",
          topic: "سورة البقرة - الآيات 126 إلى 141",
          teacherPayoutMinor: 3500,
          academyFeeMinor: 1500,
          currency: "SAR",
          notes: "ختام الحزب الأول",
          timestamp: "2026-09-22T16:00:00.000Z",
          fencingToken: 7,
        },
      ],
    },
    "student-2": {
      studentId: "student-2",
      studentName: "عمر خالد الحربي",
      parentPhone: "+966509876543",
      parentTimezone: "Asia/Riyadh",
      currency: "SAR",
      hourlyRateMinor: 4000,
      teacherHourlySplitMinor: 2800,
      academyCommissionMinor: 1200,
      totalMinutesPurchased: 480, // 8 hours
      minutesUsed: 390,           // 6.5 hours
      minutesRemaining: 90,       // 1.5 hours <= 120 min -> Alert!
      version: 6,
      lowBalanceAlert: true,
      whatsappReupLink: "https://wa.me/966509876543?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D9%88%D8%B1%D8%AD%D9%85%D8%A9%20%D8%A7%D9%84%D9%84%D9%87%20%D9%88%D8%A8%D8%B1%D9%83%D8%A7%D8%AA%D9%87%D8%8C%0A%D9%88%D9%84%D9%8A%20%D8%A3%D9%85%D8%B1%20%D8%A7%D9%84%D8%B7%D8%A7%D9%84%D8%A8%2F%D8%A9%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85%3A%20%D8%B9%D9%85%D8%B1%20%D8%AE%D8%A7%D9%84%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B1%D8%A8%D9%8A.%0A%D9%86%D9%88%D8%AF%20%D8%A5%D9%81%D8%A7%D8%AF%D8%AA%D9%83%D9%85%20%D8%AParse%D8%A3%D9%86%20%D8%A7%D9%84%D8%B1%D8%B5%D9%8A%D8%AF%20%D8%A7%D9%84%D9%85%D8%AA%D8%A8%D9%82%D9%8A%20%D9%85%D9%86%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%AF%D8%B1%D9%88%D8%B3%20%D9%84%D8%AF%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%A7%D9%84%D8%A8%D8%B1%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9%20%D9%82%D8%AF%20%D9%88%D8%B5%D9%84%20%D8%A5%D9%84%D9%89%20(1.5)%20%D8%B3%D8%A7%D8%B9%D8%A9%20%D9%81%D9%82%D8%B7.%0A%D9%84%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A8%D8%A7%D9%82%D8%A9%20%D9%88%D8%B6%D9%85%D8%A7%D9%86%20%D8%A7%D8%B3%D8%AA%D9%85%D8%B1%D8%A7%D8%B1%20%D8%AC%D8%AF%D9%88%D9%84%20%D8%A7%D9%84%D8%AD%D8%B5%D8%B5%20%D8%AF%D9%88%D9%86%20%D8%A7%D9%86%D9%82%D8%B7%D8%A7%D8%B9%D8%8C%20%D9%8A%D9%85%D9%83%D9%86%D9%83%D9%85%20%D8%A7%D9%84%D8%B3%D8%AF%D8%A7%D8%AF%20%D9%85%D8%A8%D8%A7%D8%B4%D8%B1%D8%A9%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D8%B1%D8%A7%D8%A8%D8%B7%20%D8%A7%D9%84%D8%AA%D8%A7%D9%84%D9%8A%3A%0Ahttps%3A%2F%2Falbaraa.edu.sa%2Frenew%3Fstudent%3Dstudent-2%0A%D8%B4%D8%A7%D9%83%D8%B1%D9%8A%D9%86%20%D9%88%D9%85%D9%82%D8%AF%D8%B1%D9%8A%D9%86%20%D8%AD%D8%B3%D9%86%20%D8%AA%D8%B9%D8%A7%D9%88%D9%86%D9%83%D9%85.",
      transactions: [
        {
          id: "tx_init_2",
          type: "PURCHASE_PACK",
          packId: "plan-8h",
          hours: 8,
          minutes: 480,
          priceMinor: 20000,
          currency: "SAR",
          teacherId: "teacher-2",
          subjectId: "quran-tajweed",
          timestamp: "2026-09-02T10:00:00.000Z",
          fencingToken: 1,
        },
        {
          id: "tx_sess_201",
          type: "SESSION_DEBIT",
          sessionId: "sess_201",
          durationMinutes: 90,
          teacherId: "teacher-2",
          topic: "تحفة الأطفال - باب النون والميم المشددتين",
          teacherPayoutMinor: 4200,
          academyFeeMinor: 1800,
          currency: "SAR",
          notes: "تطبيق ممتاز",
          timestamp: "2026-09-04T18:00:00.000Z",
          fencingToken: 2,
        },
        {
          id: "tx_sess_202",
          type: "SESSION_DEBIT",
          sessionId: "sess_202",
          durationMinutes: 100,
          teacherId: "teacher-2",
          topic: "تحفة الأطفال - باب أحكام الميم الساكنة",
          teacherPayoutMinor: 4667,
          academyFeeMinor: 2000,
          currency: "SAR",
          notes: "تدريب على الإخفاء الشفوي",
          timestamp: "2026-09-08T18:00:00.000Z",
          fencingToken: 3,
        },
        {
          id: "tx_sess_203",
          type: "SESSION_DEBIT",
          sessionId: "sess_203",
          durationMinutes: 100,
          teacherId: "teacher-2",
          topic: "تحفة الأطفال - باب الإدغام وأقسامه",
          teacherPayoutMinor: 4667,
          academyFeeMinor: 2000,
          currency: "SAR",
          notes: "تمييز المتماثلين والمتقاربين",
          timestamp: "2026-09-12T18:00:00.000Z",
          fencingToken: 4,
        },
        {
          id: "tx_sess_204",
          type: "SESSION_DEBIT",
          sessionId: "sess_204",
          durationMinutes: 100,
          teacherId: "teacher-2",
          topic: "تحفة الأطفال - باب المدود وأحكامها",
          teacherPayoutMinor: 4667,
          academyFeeMinor: 2000,
          currency: "SAR",
          notes: "المد المتصل والمنفصل واللازم",
          timestamp: "2026-09-16T18:00:00.000Z",
          fencingToken: 5,
        },
      ],
    },
  },
  studySheets: [],
};

export class PersistenceManager {
  static async init() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(STORE_PATH);
    } catch {
      await this.save(SEED_DATA);
    }
  }

  static async load() {
    await this.init();
    const content = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(content);
  }

  static async save(data) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    data.meta.lastSyncedAt = new Date().toISOString();
    const tempPath = `${STORE_PATH}.tmp.${Date.now()}`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempPath, STORE_PATH);
  }

  static async getLedger(studentId) {
    const data = await this.load();
    const ledgerData = data.ledgers[studentId];
    if (!ledgerData) return null;
    return new HourPackLedger(ledgerData);
  }

  static async saveLedger(ledger) {
    const data = await this.load();
    data.ledgers[ledger.studentId] = ledger.toJSON();
    await this.save(data);
  }

  static async saveStudySheet(sheet) {
    const data = await this.load();
    data.studySheets.push(sheet);
    await this.save(data);
    return sheet;
  }

  static async getStudySheets(studentName) {
    const data = await this.load();
    if (!studentName) return data.studySheets;
    return data.studySheets.filter((s) => s.studentName === studentName);
  }

  static async getPlans() {
    const data = await this.load();
    return data.plans;
  }

  static async getTeachers() {
    const data = await this.load();
    return data.teachers;
  }
}
