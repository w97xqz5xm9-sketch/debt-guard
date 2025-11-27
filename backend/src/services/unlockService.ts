// Unlock service - manages payment blocking unlocks
export interface UnlockStatus {
  unlocksRemaining: number
  totalUnlocks: number
  requiresAccessCode: boolean
}

let unlocksRemaining = 3
const totalUnlocks = 3

export function getUnlockStatus(): UnlockStatus {
  return {
    unlocksRemaining,
    totalUnlocks,
    requiresAccessCode: unlocksRemaining === 0,
  }
}

export function useUnlock(): { success: boolean; unlocksRemaining: number; requiresAccessCode: boolean } {
  if (unlocksRemaining > 0) {
    unlocksRemaining--
    return {
      success: true,
      unlocksRemaining,
      requiresAccessCode: unlocksRemaining === 0,
    }
  }
  return {
    success: false,
    unlocksRemaining: 0,
    requiresAccessCode: true,
  }
}

export function resetUnlocks(accessCode?: string): boolean {
  // In production, this would validate the access code
  // For now, we'll accept any code or allow purchase
  if (accessCode || true) {
    unlocksRemaining = totalUnlocks
    return true
  }
  return false
}

export function canUnlock(): boolean {
  return unlocksRemaining > 0
}

