import type { Donor, Drive, Forecast, DriveOutcome } from '../types'

export const DRIVE: Drive = {
  id: 'drv-johnstown-nov15',
  name: 'Johnstown HS · Community Blood Drive',
  addr: '222 Central Ave, Johnstown, PA 15902',
  coords: { lat: 40.3267, lng: -78.9219 },
  date: '2026-11-15',
  targetUnits: 42,
  slots: [], // populated below from DONORS
}

export const FORECAST: Forecast = {
  updatedAt: new Date().toISOString(),
  highF: 44,
  lowF: 31,
  summary: 'Mostly cloudy morning; rain likely 3-5pm',
  hours: [
    { hour: '12p', tempF: 40, precipPct: 12, condition: 'Cloudy', confidence: 'high' },
    { hour: '1p', tempF: 41, precipPct: 15, condition: 'Cloudy', confidence: 'high' },
    { hour: '2p', tempF: 41, precipPct: 22, condition: 'Cloudy', confidence: 'high' },
    { hour: '3p', tempF: 40, precipPct: 68, condition: 'Rain', confidence: 'high' },
    { hour: '4p', tempF: 39, precipPct: 72, condition: 'Rain', confidence: 'high' },
    { hour: '5p', tempF: 38, precipPct: 45, condition: 'Rain likely', confidence: 'medium' },
  ],
}

// 30 seeded donors. Mix designed to produce a realistic risk distribution
// (roughly 12 HIGH, 11 MED, 7 LOW) so the demo path is interesting.
export const DONORS: Donor[] = [
  {
    id: 'd01', name: 'Sarah T.', phone: '555-0101', email: 's.t@example.com',
    bloodType: 'A+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 4.2, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd02', name: 'Marcus L.', phone: '555-0102', email: 'm.l@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['community'],
    donationCount: 5, cadenceDaysAvg: 210, distanceMi: 6.1, pastNoShows: 2,
    lastDonation: '2026-04-20', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd03', name: 'Priya K.', phone: '555-0103', email: 'p.k@example.com',
    bloodType: 'B+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 3.8, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd04', name: 'Kevin M.', phone: '555-0104', email: 'k.m@example.com',
    bloodType: 'A-', firstTime: true, cohortTags: ['workplace', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 2.1, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd05', name: 'Alicia R.', phone: '555-0105', email: 'a.r@example.com',
    bloodType: 'O-', firstTime: true, cohortTags: ['community', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 7.9, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'both', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd06', name: 'James H.', phone: '555-0106', email: 'j.h@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['workplace', 'high_value'],
    donationCount: 18, cadenceDaysAvg: 96, distanceMi: 3.4, pastNoShows: 0,
    lastDonation: '2026-08-14', confirmedAt: '2026-11-14T18:22:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd07', name: 'Elena V.', phone: '555-0107', email: 'e.v@example.com',
    bloodType: 'A+', firstTime: false, cohortTags: ['community'],
    donationCount: 3, cadenceDaysAvg: 320, distanceMi: 9.2, pastNoShows: 1,
    lastDonation: '2026-01-11', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd08', name: 'David P.', phone: '555-0108', email: 'd.p@example.com',
    bloodType: 'B+', firstTime: false, cohortTags: ['workplace', 'high_value'],
    donationCount: 11, cadenceDaysAvg: 112, distanceMi: 4.7, pastNoShows: 0,
    lastDonation: '2026-07-30', confirmedAt: '2026-11-14T20:05:00Z', preferredChannel: 'email', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd09', name: 'Rachel B.', phone: '555-0109', email: 'r.b@example.com',
    bloodType: 'O+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 5.5, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd10', name: 'Tomás G.', phone: '555-0110', email: 't.g@example.com',
    bloodType: 'A-', firstTime: false, cohortTags: ['community'],
    donationCount: 7, cadenceDaysAvg: 180, distanceMi: 8.6, pastNoShows: 1,
    lastDonation: '2026-05-04', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd11', name: 'Hannah W.', phone: '555-0111', email: 'h.w@example.com',
    bloodType: 'AB+', firstTime: false, cohortTags: ['workplace'],
    donationCount: 4, cadenceDaysAvg: 240, distanceMi: 2.8, pastNoShows: 0,
    lastDonation: '2026-03-15', confirmedAt: '2026-11-14T19:12:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd12', name: 'Michael O.', phone: '555-0112', email: 'm.o@example.com',
    bloodType: 'O-', firstTime: false, cohortTags: ['community', 'high_value'],
    donationCount: 22, cadenceDaysAvg: 88, distanceMi: 5.9, pastNoShows: 0,
    lastDonation: '2026-08-19', confirmedAt: '2026-11-13T09:44:00Z', preferredChannel: 'both', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd13', name: 'Nina F.', phone: '555-0113', email: 'n.f@example.com',
    bloodType: 'A+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 4.9, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd14', name: 'Carlos M.', phone: '555-0114', email: 'c.m@example.com',
    bloodType: 'B+', firstTime: false, cohortTags: ['workplace'],
    donationCount: 6, cadenceDaysAvg: 175, distanceMi: 3.2, pastNoShows: 1,
    lastDonation: '2026-05-24', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd15', name: 'Julie A.', phone: '555-0115', email: 'j.a@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['community'],
    donationCount: 2, cadenceDaysAvg: 400, distanceMi: 11.3, pastNoShows: 2,
    lastDonation: '2025-10-20', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd16', name: 'Benjamin K.', phone: '555-0116', email: 'b.k@example.com',
    bloodType: 'A+', firstTime: false, cohortTags: ['workplace', 'high_value'],
    donationCount: 14, cadenceDaysAvg: 95, distanceMi: 4.0, pastNoShows: 0,
    lastDonation: '2026-08-05', confirmedAt: '2026-11-14T21:30:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd17', name: 'Sophia D.', phone: '555-0117', email: 's.d@example.com',
    bloodType: 'O-', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 6.4, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd18', name: 'Robert N.', phone: '555-0118', email: 'r.n@example.com',
    bloodType: 'B-', firstTime: false, cohortTags: ['community', 'lapsed_6mo'],
    donationCount: 8, cadenceDaysAvg: 260, distanceMi: 8.1, pastNoShows: 1,
    lastDonation: '2026-05-05', confirmedAt: null, preferredChannel: 'email', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd19', name: 'Grace L.', phone: '555-0119', email: 'g.l@example.com',
    bloodType: 'A+', firstTime: false, cohortTags: ['workplace'],
    donationCount: 3, cadenceDaysAvg: 300, distanceMi: 3.7, pastNoShows: 0,
    lastDonation: '2026-04-02', confirmedAt: '2026-11-14T17:18:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd20', name: 'Isaac R.', phone: '555-0120', email: 'i.r@example.com',
    bloodType: 'O+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 5.1, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd21', name: 'Maya S.', phone: '555-0121', email: 'm.s@example.com',
    bloodType: 'A-', firstTime: false, cohortTags: ['workplace', 'high_value'],
    donationCount: 16, cadenceDaysAvg: 90, distanceMi: 2.4, pastNoShows: 0,
    lastDonation: '2026-08-16', confirmedAt: '2026-11-14T22:05:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd22', name: 'Ethan V.', phone: '555-0122', email: 'e.v2@example.com',
    bloodType: 'B+', firstTime: false, cohortTags: ['community'],
    donationCount: 5, cadenceDaysAvg: 220, distanceMi: 12.7, pastNoShows: 2,
    lastDonation: '2026-04-11', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd23', name: 'Olivia P.', phone: '555-0123', email: 'o.p@example.com',
    bloodType: 'AB-', firstTime: false, cohortTags: ['workplace'],
    donationCount: 4, cadenceDaysAvg: 200, distanceMi: 3.9, pastNoShows: 0,
    lastDonation: '2026-05-13', confirmedAt: '2026-11-14T18:55:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd24', name: 'Nathan B.', phone: '555-0124', email: 'n.b@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['community'],
    donationCount: 9, cadenceDaysAvg: 145, distanceMi: 6.8, pastNoShows: 0,
    lastDonation: '2026-06-28', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd25', name: 'Zoe C.', phone: '555-0125', email: 'z.c@example.com',
    bloodType: 'A+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 4.6, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd26', name: 'Andre J.', phone: '555-0126', email: 'a.j@example.com',
    bloodType: 'B+', firstTime: false, cohortTags: ['community'],
    donationCount: 6, cadenceDaysAvg: 190, distanceMi: 9.9, pastNoShows: 1,
    lastDonation: '2026-05-08', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd27', name: 'Chloe T.', phone: '555-0127', email: 'c.t@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['workplace'],
    donationCount: 8, cadenceDaysAvg: 130, distanceMi: 3.3, pastNoShows: 0,
    lastDonation: '2026-07-05', confirmedAt: '2026-11-14T16:45:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd28', name: 'Diego M.', phone: '555-0128', email: 'd.m@example.com',
    bloodType: 'A+', firstTime: false, cohortTags: ['community', 'lapsed_6mo'],
    donationCount: 5, cadenceDaysAvg: 260, distanceMi: 7.5, pastNoShows: 1,
    lastDonation: '2026-05-01', confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd29', name: 'Aisha W.', phone: '555-0129', email: 'a.w@example.com',
    bloodType: 'O+', firstTime: false, cohortTags: ['workplace', 'high_value'],
    donationCount: 12, cadenceDaysAvg: 105, distanceMi: 2.9, pastNoShows: 0,
    lastDonation: '2026-08-01', confirmedAt: '2026-11-14T19:40:00Z', preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
  {
    id: 'd30', name: 'Ryan F.', phone: '555-0130', email: 'r.f@example.com',
    bloodType: 'B+', firstTime: true, cohortTags: ['campus', 'first_time'],
    donationCount: 0, cadenceDaysAvg: null, distanceMi: 5.7, pastNoShows: 0,
    lastDonation: null, confirmedAt: null, preferredChannel: 'sms', optOutReminders: false, lastDeferral: null,
  },
]

// Deliberate slot assignments so canned SMS templates reference real times.
// Weighted toward 3-5pm for the "rain hits during peak slots" story.
const SLOT_ASSIGNMENTS: Record<string, string> = {
  d01: '3:15p',  // Sarah T. — first-time, rain
  d02: '3:45p',  // Marcus L. — 2 no-shows, rain
  d03: '4:00p',  // Priya K. — first-time, rain
  d04: '2:00p',  // Kevin M. — first-time
  d05: '4:30p',  // Alicia R. — first-time O-neg
  d06: '2:15p',  // James H. — confirmed returning
  d07: '3:30p',  // Elena V. — 1 past no-show
  d08: '1:00p',  // David P. — confirmed returning
  d09: '5:00p',  // Rachel B. — first-time
  d10: '4:45p',  // Tomás G. — 1 no-show
  d11: '2:30p',  // Hannah W. — confirmed
  d12: '1:15p',  // Michael O. — high-value confirmed
  d13: '3:00p',  // Nina F. — first-time, rain
  d14: '3:15p',  // Carlos M. — 1 no-show, rain
  d15: '3:30p',  // Julie A. — 2 no-shows, rain
  d16: '2:45p',  // Benjamin K. — high-value confirmed
  d17: '4:15p',  // Sophia D. — first-time O-neg, rain
  d18: '4:45p',  // Robert N. — lapsed, rain
  d19: '1:30p',  // Grace L. — confirmed
  d20: '12:00p', // Isaac R. — first-time
  d21: '1:45p',  // Maya S. — high-value confirmed
  d22: '4:00p',  // Ethan V. — 2 no-shows, rain
  d23: '2:00p',  // Olivia P. — confirmed
  d24: '5:15p',  // Nathan B. — returning
  d25: '12:30p', // Zoe C. — first-time
  d26: '4:15p',  // Andre J. — 1 no-show, rain
  d27: '1:00p',  // Chloe T. — confirmed
  d28: '5:30p',  // Diego M. — lapsed
  d29: '2:30p',  // Aisha W. — high-value confirmed
  d30: '2:45p',  // Ryan F. — first-time
}

DRIVE.slots = DONORS.map(donor => ({
  time: SLOT_ASSIGNMENTS[donor.id] ?? '12:00p',
  donorId: donor.id,
}))

export function slotTimeForDonor(donorId: string): string {
  return SLOT_ASSIGNMENTS[donorId] ?? '—'
}

// Mock post-drive outcomes for the Recap screen (v0)
export const MOCK_OUTCOMES: DriveOutcome[] = [
  { driveId: DRIVE.id, donorId: 'd01', predictedTier: 'High', actualStatus: 'no_show', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd02', predictedTier: 'High', actualStatus: 'attended', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd03', predictedTier: 'High', actualStatus: 'no_show', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd04', predictedTier: 'Med', actualStatus: 'no_show', smsSent: false, smsSource: null, overrideApplied: true },
  { driveId: DRIVE.id, donorId: 'd05', predictedTier: 'Med', actualStatus: 'attended', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd06', predictedTier: 'Low', actualStatus: 'attended', smsSent: false, smsSource: null, overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd07', predictedTier: 'Med', actualStatus: 'attended', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd08', predictedTier: 'Low', actualStatus: 'attended', smsSent: false, smsSource: null, overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd09', predictedTier: 'High', actualStatus: 'no_show', smsSent: true, smsSource: 'canned', overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd10', predictedTier: 'Med', actualStatus: 'attended', smsSent: false, smsSource: null, overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd12', predictedTier: 'Low', actualStatus: 'attended', smsSent: false, smsSource: null, overrideApplied: false },
  { driveId: DRIVE.id, donorId: 'd11', predictedTier: 'Low', actualStatus: 'attended', smsSent: false, smsSource: null, overrideApplied: false },
]
