export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+'

export type CohortTag = 'campus' | 'workplace' | 'community' | 'mobile' | 'lapsed_6mo' | 'high_value' | 'first_time'

export type PreferredChannel = 'sms' | 'email' | 'both'

export type Tier = 'High' | 'Med' | 'Low'

export type Coordinates = { lat: number; lng: number }

export type Donor = {
  id: string
  name: string
  phone: string
  email: string
  bloodType: BloodType
  firstTime: boolean
  cohortTags: CohortTag[]
  donationCount: number
  cadenceDaysAvg: number | null
  distanceMi: number
  pastNoShows: number
  lastDonation: string | null // ISO date
  confirmedAt: string | null
  preferredChannel: PreferredChannel
  optOutReminders: boolean
  lastDeferral: { date: string; reason: string; eligibleAfter: string } | null
}

export type Slot = {
  time: string // e.g. "3:15p"
  donorId: string
}

export type Drive = {
  id: string
  name: string
  addr: string
  coords: Coordinates
  date: string // ISO date
  targetUnits: number
  slots: Slot[]
}

export type ForecastHour = {
  hour: string // "12p", "3p"
  tempF: number
  precipPct: number
  condition: string
  confidence: 'high' | 'medium' | 'low'
}

export type Forecast = {
  updatedAt: string
  hours: ForecastHour[]
  highF: number
  lowF: number
  summary: string
}

export type RiskFactor = {
  label: string
  contribution: number // e.g. +15, -5
  applied: boolean
}

export type RiskScore = {
  donorId: string
  score: number // 0-100
  tier: Tier
  factors: RiskFactor[]
  topFactors: string[]
  recommendedAction: string
}

export type OverrideReason = 'coord_knowledge' | 'donor_confirmed' | 'other'

export type CoordinatorOverride = {
  donorId: string
  driveId: string
  originalTier: Tier
  newTier: Tier
  reason: OverrideReason
  note?: string
  at: string
}

export type LLMSource = 'canned' | 'live'

export type SMSDraft = {
  donorId: string
  text: string
  charCount: number
  toneTags: string[]
  citedFactors: string[]
  source: LLMSource
  generatedAt: string
}

export type BriefContent = {
  text: string
  toneTags: string[]
  source: LLMSource
  generatedAt: string
}

export type DriveOutcome = {
  driveId: string
  donorId: string
  predictedTier: Tier
  actualStatus: 'attended' | 'no_show' | 'walkin' | 'canceled'
  smsSent: boolean
  smsSource: LLMSource | null
  overrideApplied: boolean
}
