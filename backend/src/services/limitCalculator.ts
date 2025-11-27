// Dynamic limit calculator for Debt Guard

export type LimitStatus = "green" | "yellow" | "red"

export interface LimitResult {
  newDailyLimit: number // neues Tageslimit ab morgen
  status: LimitStatus   // "green" | "yellow" | "red"
  block: boolean        // true = Karte blockieren
}

/**
 * Dynamischer Limit-Rechner für Debt Guard.
 *
 * B           = Monatsbudget
 * N           = Anzahl Tage im Monat
 * t           = aktueller Tag (1 = erster Tag)
 * S_ist       = bisher kumuliert ausgegebener Betrag
 * softLimit   = weiche Abweichungsgrenze (z.B. 0.05 = 5 %)
 * hardLimit   = harte Abweichungsgrenze (z.B. 0.15 = 15 %)
 * penaltyFactor = wie stark Limit in gelber Zone abgesenkt wird (z.B. 0.2 = 20 %)
 */
export function calculateDailyLimit(
  B: number,
  N: number,
  t: number,
  S_ist: number,
  softLimit: number = 0.05,
  hardLimit: number = 0.15,
  penaltyFactor: number = 0.2
): LimitResult {
  // Sicherheits-Check: keine Division durch 0
  const remainingDays = N - t
  if (remainingDays <= 0) {
    return {
      newDailyLimit: 0,
      status: "red",
      block: true,
    }
  }

  // 1) Planned spend bis heute (lineare Verteilung)
  const S_plan = B * (t / N)

  // 2) Abweichung absolut und relativ
  const delta = S_ist - S_plan   // >0 = über Plan, <0 = unter Plan
  const deltaRel = delta / B     // relative Abweichung am Gesamtbudget

  // 3) Basislimit für die restlichen Tage:
  // Restbudget wird gleichmäßig auf Resttage verteilt
  const baseLimit = (B - S_ist) / remainingDays

  // 4) Zonenlogik
  // green  = alles im Rahmen
  // yellow = spürbar drüber, aber noch kein harter Stopp
  // red    = harte Schmerzensgrenze -> Blockierung
  if (Math.abs(deltaRel) <= softLimit) {
    // 🟢 Grün: normale Anpassung, kein Block
    return {
      newDailyLimit: Math.max(baseLimit, 0),
      status: "green",
      block: false,
    }
  }

  if (deltaRel > softLimit && deltaRel <= hardLimit) {
    // 🟡 Gelb: über Plan, Limit zusätzlich prozentual senken
    const adjustedLimit = baseLimit * (1 - penaltyFactor)
    return {
      newDailyLimit: Math.max(adjustedLimit, 0),
      status: "yellow",
      block: false,
    }
  }

  if (deltaRel > hardLimit) {
    // 🔴 Rot: deutlich über Plan -> Blockierung
    // Hier blocken wir (oder lassen nur Whitelist-Zahlungen zu)
    return {
      newDailyLimit: 0,
      status: "red",
      block: true,
    }
  }

  // Fall: deutlich unter Plan (deltaRel < -softLimit):
  // optional: Limit leicht erhöhen (Reward)
  // -> hier sehr konservativ: kleines Plus
  const rewardFactor = 0.1 // z.B. +10 % bei deutlichem Unterverbrauch
  const rewardedLimit = baseLimit * (1 + rewardFactor)

  return {
    newDailyLimit: Math.max(rewardedLimit, 0),
    status: "green",
    block: false,
  }
}

