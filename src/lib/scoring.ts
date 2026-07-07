import type { Donor, Forecast, RiskFactor, RiskScore, Tier } from '../types'
import { DRIVE, slotTimeForDonor } from '../data/seed'

const BASE_RATE = 20

function parseSlotHour(slotTime: string): number {
  // "3:15p" -> 15, "12:00p" -> 12, "1:00p" -> 13
  const [hm, ampm] = [slotTime.slice(0, -1), slotTime.slice(-1)]
  const [h] = hm.split(':').map(Number)
  if (ampm === 'p') return h === 12 ? 12 : h + 12
  return h === 12 ? 0 : h
}

function forecastAtHour(forecast: Forecast, hour24: number) {
  const label = hour24 === 12 ? '12p' : `${hour24 - 12}p`
  return forecast.hours.find(h => h.hour === label)
}

export function scoreDonor(donor: Donor, forecast: Forecast): RiskScore {
  const slotTime = slotTimeForDonor(donor.id)
  const slotHour = parseSlotHour(slotTime)
  const slotHourFcst = forecastAtHour(forecast, slotHour)
  const commuteFcst = forecastAtHour(forecast, slotHour - 1) ?? slotHourFcst

  const rawFactors: RiskFactor[] = []

  // + First-time donor
  rawFactors.push({
    label: 'First-time donor',
    contribution: 15,
    applied: donor.firstTime,
  })

  // + Precipitation during appointment window
  rawFactors.push({
    label: `${slotTime} slot · rain ${slotHourFcst?.precipPct ?? 0}% forecast`,
    contribution: 10,
    applied: (slotHourFcst?.precipPct ?? 0) > 40,
  })

  // + Precipitation during commute hour
  rawFactors.push({
    label: `Rain during commute hour`,
    contribution: 8,
    applied: (commuteFcst?.precipPct ?? 0) > 40 && (slotHourFcst?.precipPct ?? 0) <= 40,
  })

  // + Past no-shows (capped)
  const noShowContribution = Math.min(donor.pastNoShows * 12, 24)
  rawFactors.push({
    label: `${donor.pastNoShows} past no-show${donor.pastNoShows === 1 ? '' : 's'}`,
    contribution: noShowContribution,
    applied: donor.pastNoShows > 0,
  })

  // + Extreme temperature
  const tempAtSlot = slotHourFcst?.tempF ?? 60
  rawFactors.push({
    label: `Cold snap (${tempAtSlot}°F at slot time)`,
    contribution: 5,
    applied: tempAtSlot > 90 || tempAtSlot < 40,
  })

  // − Confirmed in last 24h
  rawFactors.push({
    label: 'Confirmed within last 24h',
    contribution: -8,
    applied: donor.confirmedAt !== null,
  })

  // − Returning donor (2+ prior donations)
  rawFactors.push({
    label: `Returning donor (${donor.donationCount} prior)`,
    contribution: -5,
    applied: donor.donationCount >= 2,
  })

  const contributionSum = rawFactors
    .filter(f => f.applied)
    .reduce((acc, f) => acc + f.contribution, 0)

  const score = Math.max(0, Math.min(100, BASE_RATE + contributionSum))

  let tier: Tier
  if (score >= 45) tier = 'High'
  else if (score >= 25) tier = 'Med'
  else tier = 'Low'

  const topFactors = rawFactors
    .filter(f => f.applied)
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 2)
    .map(f => f.label)

  const recommendedAction =
    tier === 'High'
      ? 'Draft personalized SMS with weather-aware context'
      : tier === 'Med'
      ? 'Consider a lightweight reminder'
      : 'No outreach needed'

  return {
    donorId: donor.id,
    score,
    tier,
    factors: rawFactors,
    topFactors,
    recommendedAction,
  }
}

export function scoreAll(donors: Donor[], forecast: Forecast): RiskScore[] {
  return donors.map(d => scoreDonor(d, forecast))
}

export function summarizeRoster(scores: RiskScore[]) {
  const high = scores.filter(s => s.tier === 'High').length
  const med = scores.filter(s => s.tier === 'Med').length
  const low = scores.filter(s => s.tier === 'Low').length
  const predictedNoShows = Math.round(
    scores.reduce((acc, s) => acc + s.score / 100, 0)
  )
  const overbookRecommendation = Math.max(0, predictedNoShows - Math.floor(scores.length * 0.15))
  return { high, med, low, predictedNoShows, overbookRecommendation, driveTarget: DRIVE.targetUnits }
}
