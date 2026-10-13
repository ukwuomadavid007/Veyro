/**
 * Veyro // LocalStorage Persistence Layer
 * Manages user workout history, stats, custom routines, streak calculation, and achievement badges.
 */

const STORAGE_KEYS = {
  SETTINGS: 'kinetic_settings_v1',
  STATS: 'kinetic_stats_v1',
  HISTORY: 'kinetic_history_v1',
  CUSTOM_ROUTINES: 'kinetic_custom_routines_v1',
  UNLOCKED_BADGES: 'kinetic_unlocked_badges_v1'
};

class StorageManager {
  constructor() {
    this.defaultSettings = {
      voiceEnabled: true,
      soundFxEnabled: true,
      metronomeEnabled: false,
      motivationCues: true,
      speechRate: 1.05,
      voiceName: '',
      defaultPrepSec: 8
    };

    this.defaultStats = {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCalories: 0,
      streakDays: 0,
      lastWorkoutDate: null
    };
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...this.defaultSettings, ...JSON.parse(data) } : { ...this.defaultSettings };
    } catch (e) {
      console.warn('Error reading settings from localStorage', e);
      return { ...this.defaultSettings };
    }
  }

  saveSettings(newSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Error saving settings to localStorage', e);
    }
  }

  // Stats
  getStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? { ...this.defaultStats, ...JSON.parse(data) } : { ...this.defaultStats };
    } catch (e) {
      return { ...this.defaultStats };
    }
  }

  saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error saving stats', e);
    }
  }

  // History
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveHistory(historyList) {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyList));
    } catch (e) {
      console.warn('Error saving history', e);
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      // Reset summary stats partially
      const stats = this.getStats();
      stats.totalWorkouts = 0;
      stats.totalMinutes = 0;
      stats.totalCalories = 0;
      this.saveStats(stats);
    } catch (e) {
      console.warn('Error clearing history', e);
    }
  }

  // Custom Routines
  getCustomRoutines() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROUTINES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomRoutine(routine) {
    const list = this.getCustomRoutines();
    // Check if updating existing
    const existingIdx = list.findIndex(r => r.id === routine.id);
    if (existingIdx >= 0) {
      list[existingIdx] = routine;
    } else {
      list.unshift(routine);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTINES, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving custom routine', e);
    }
    return list;
  }

  deleteCustomRoutine(id) {
    let list = this.getCustomRoutines();
    list = list.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTINES, JSON.stringify(list));
    } catch (e) {
      console.warn('Error deleting custom routine', e);
    }
    return list;
  }

  // Badges
  getUnlockedBadges() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_BADGES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveUnlockedBadges(badges) {
    try {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_BADGES, JSON.stringify(badges));
    } catch (e) {
      console.warn('Error saving badges', e);
    }
  }

  // Log a finished workout session
  logWorkoutSession(sessionData) {
    const history = this.getHistory();
    const newEntry = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      dateString: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      routineId: sessionData.routineId,
      routineTitle: sessionData.routineTitle,
      category: sessionData.category || 'workout',
      durationSec: sessionData.durationSec,
      durationMinutes: Math.max(1, Math.round(sessionData.durationSec / 60)),
      exerciseCount: sessionData.exerciseCount,
      caloriesBurned: sessionData.caloriesBurned,
      completed: true
    };

    history.unshift(newEntry);
    this.saveHistory(history);

    // Update aggregate stats and streak
    const stats = this.getStats();
    stats.totalWorkouts += 1;
    stats.totalMinutes += newEntry.durationMinutes;
    stats.totalCalories += newEntry.caloriesBurned;

    // Streak calculation
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!stats.lastWorkoutDate) {
      stats.streakDays = 1;
    } else {
      const lastDate = new Date(stats.lastWorkoutDate);
      const today = new Date(todayStr);
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        stats.streakDays += 1;
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
      // If diffDays === 0, same day workout, streak stays intact
    }
    stats.lastWorkoutDate = todayStr;
    this.saveStats(stats);

    // Evaluate badges
    const newBadges = this.checkBadges(stats, history, sessionData);
    return { entry: newEntry, stats, newBadges };
  }

  // Check achievements
  checkBadges(stats, history, currentSession) {
    const currentUnlocked = new Set(this.getUnlockedBadges());
    const newlyAwarded = [];

    const award = (id) => {
      if (!currentUnlocked.has(id)) {
        currentUnlocked.add(id);
        const b = ACHIEVEMENTS_LIST.find(x => x.id === id);
        if (b) newlyAwarded.push(b);
      }
    };

    if (stats.totalWorkouts >= 1) award('first_blood');
    if (stats.streakDays >= 3) award('streak_3');
    if (stats.streakDays >= 7) award('streak_7');
    if (stats.totalCalories >= 500) award('calorie_500');
    if (stats.totalMinutes >= 100) award('centurion');
    if (stats.totalWorkouts >= 10) award('master_coach');

    // Count HIIT sessions
    const hiitCount = history.filter(h => h.category === 'hiit').length;
    if (hiitCount >= 3) award('hiit_king');

    // Custom workout check
    if (currentSession && currentSession.isCustom) {
      award('custom_builder');
    }

    if (newlyAwarded.length > 0) {
      this.saveUnlockedBadges(Array.from(currentUnlocked));
    }

    return newlyAwarded;
  }
}

window.StorageManager = new StorageManager();
