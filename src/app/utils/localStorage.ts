/**
 * LocalStorage utilities for TuneCent Indonesia
 * Handles saving/loading user-created music and campaigns
 */

export interface LocalMusicData {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description: string;
  duration: number;
  coverImageUrl: string;
  audioFileUrl: string;
  creatorAddress: string;
  tokenId?: string;
  txHash?: string;
  createdAt: string;
  fingerprint?: string;
}

export interface LocalCampaignData {
  id: string;
  musicTokenId: string;
  musicTitle: string;
  goal: string; // in ETH
  royaltyPercentage: number;
  deadline: string; // ISO date string
  lockupPeriod: number; // in days
  currentAmount: string; // in ETH
  backers: number;
  creatorAddress: string;
  description: string;
  createdAt: string;
  status: 'active' | 'successful' | 'failed' | 'cancelled';
  campaignId?: string;
  txHash?: string;
}

const MUSIC_STORAGE_KEY = 'tunecent_user_music';
const CAMPAIGN_STORAGE_KEY = 'tunecent_user_campaigns';

// ============= MUSIC FUNCTIONS =============

/**
 * Save music to localStorage
 */
export const saveMusic = (music: LocalMusicData): void => {
  try {
    const existing = getLocalMusic();
    const updated = [music, ...existing];
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving music to localStorage:', error);
  }
};

/**
 * Get all music from localStorage
 */
export const getLocalMusic = (): LocalMusicData[] => {
  try {
    const data = localStorage.getItem(MUSIC_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting music from localStorage:', error);
    return [];
  }
};

/**
 * Get single music by ID
 */
export const getMusicById = (id: string): LocalMusicData | null => {
  const allMusic = getLocalMusic();
  return allMusic.find(music => music.id === id) || null;
};

/**
 * Update music in localStorage
 */
export const updateMusic = (id: string, updates: Partial<LocalMusicData>): void => {
  try {
    const existing = getLocalMusic();
    const updated = existing.map(music =>
      music.id === id ? { ...music, ...updates } : music
    );
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating music in localStorage:', error);
  }
};

/**
 * Delete music from localStorage
 */
export const deleteMusic = (id: string): void => {
  try {
    const existing = getLocalMusic();
    const filtered = existing.filter(music => music.id !== id);
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting music from localStorage:', error);
  }
};

/**
 * Get music by creator address
 */
export const getMusicByCreator = (address: string): LocalMusicData[] => {
  const allMusic = getLocalMusic();
  return allMusic.filter(music =>
    music.creatorAddress.toLowerCase() === address.toLowerCase()
  );
};

// ============= CAMPAIGN FUNCTIONS =============

/**
 * Save campaign to localStorage
 */
export const saveCampaign = (campaign: LocalCampaignData): void => {
  try {
    const existing = getLocalCampaigns();
    const updated = [campaign, ...existing];
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving campaign to localStorage:', error);
  }
};

/**
 * Get all campaigns from localStorage
 */
export const getLocalCampaigns = (): LocalCampaignData[] => {
  try {
    const data = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting campaigns from localStorage:', error);
    return [];
  }
};

/**
 * Get single campaign by ID
 */
export const getCampaignById = (id: string): LocalCampaignData | null => {
  const allCampaigns = getLocalCampaigns();
  return allCampaigns.find(campaign => campaign.id === id) || null;
};

/**
 * Get campaigns by music token ID
 */
export const getCampaignsByMusic = (musicTokenId: string): LocalCampaignData[] => {
  const allCampaigns = getLocalCampaigns();
  return allCampaigns.filter(campaign => campaign.musicTokenId === musicTokenId);
};

/**
 * Update campaign in localStorage
 */
export const updateCampaign = (id: string, updates: Partial<LocalCampaignData>): void => {
  try {
    const existing = getLocalCampaigns();
    const updated = existing.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates } : campaign
    );
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating campaign in localStorage:', error);
  }
};

/**
 * Add contribution to campaign
 */
export const addContributionToCampaign = (
  campaignId: string,
  amount: string
): void => {
  try {
    const campaign = getCampaignById(campaignId);
    if (campaign) {
      const currentAmount = parseFloat(campaign.currentAmount);
      const contributionAmount = parseFloat(amount);
      const newAmount = (currentAmount + contributionAmount).toString();

      updateCampaign(campaignId, {
        currentAmount: newAmount,
        backers: campaign.backers + 1,
      });
    }
  } catch (error) {
    console.error('Error adding contribution to campaign:', error);
  }
};

/**
 * Delete campaign from localStorage
 */
export const deleteCampaign = (id: string): void => {
  try {
    const existing = getLocalCampaigns();
    const filtered = existing.filter(campaign => campaign.id !== id);
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting campaign from localStorage:', error);
  }
};

/**
 * Get campaigns by creator address
 */
export const getCampaignsByCreator = (address: string): LocalCampaignData[] => {
  const allCampaigns = getLocalCampaigns();
  return allCampaigns.filter(campaign =>
    campaign.creatorAddress.toLowerCase() === address.toLowerCase()
  );
};

/**
 * Get active campaigns
 */
export const getActiveCampaigns = (): LocalCampaignData[] => {
  const allCampaigns = getLocalCampaigns();
  return allCampaigns.filter(campaign => campaign.status === 'active');
};

// ============= UTILITY FUNCTIONS =============

/**
 * Generate unique ID for local data
 */
export const generateId = (): string => {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clear all local data (for testing)
 */
export const clearAllLocalData = (): void => {
  try {
    localStorage.removeItem(MUSIC_STORAGE_KEY);
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  return {
    totalMusic: getLocalMusic().length,
    totalCampaigns: getLocalCampaigns().length,
    activeCampaigns: getActiveCampaigns().length,
  };
};

// ============= INVESTMENT FUNCTIONS =============

export interface LocalInvestmentData {
  id: string;
  campaignId: string;
  musicTitle: string;
  investorAddress: string;
  amount: string; // in ETH or USD
  investedAt: string;
  royaltyShare: number; // percentage
}

const INVESTMENT_STORAGE_KEY = 'tunecent_investments';

export const saveInvestment = (investment: LocalInvestmentData): void => {
  try {
    const existing = getLocalInvestments();
    const updated = [investment, ...existing];
    localStorage.setItem(INVESTMENT_STORAGE_KEY, JSON.stringify(updated));

    // Update campaign
    addContributionToCampaign(investment.campaignId, investment.amount);
  } catch (error) {
    console.error('Error saving investment to localStorage:', error);
  }
};

export const getLocalInvestments = (): LocalInvestmentData[] => {
  try {
    const data = localStorage.getItem(INVESTMENT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting investments from localStorage:', error);
    return [];
  }
};

export const getInvestmentsByUser = (address: string): LocalInvestmentData[] => {
  const allInvestments = getLocalInvestments();
  return allInvestments.filter(inv =>
    inv.investorAddress.toLowerCase() === address.toLowerCase()
  );
};

export const getInvestmentsByCampaign = (campaignId: string): LocalInvestmentData[] => {
  const allInvestments = getLocalInvestments();
  return allInvestments.filter(inv => inv.campaignId === campaignId);
};

// ============= PLAY HISTORY FUNCTIONS =============

export interface LocalPlayHistoryData {
  id: string;
  musicId: string;
  musicTitle: string;
  userId: string;
  playedAt: string;
  duration: number; // in seconds
}

const PLAY_HISTORY_STORAGE_KEY = 'tunecent_play_history';

export const savePlayHistory = (play: LocalPlayHistoryData): void => {
  try {
    const existing = getLocalPlayHistory();
    const updated = [play, ...existing];
    localStorage.setItem(PLAY_HISTORY_STORAGE_KEY, JSON.stringify(updated));

    // Update music play count
    const music = getMusicById(play.musicId);
    if (music) {
      updateMusic(play.musicId, {
        ...music,
        // You can add playCount field to LocalMusicData if needed
      });
    }
  } catch (error) {
    console.error('Error saving play history to localStorage:', error);
  }
};

export const getLocalPlayHistory = (): LocalPlayHistoryData[] => {
  try {
    const data = localStorage.getItem(PLAY_HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting play history from localStorage:', error);
    return [];
  }
};

export const getPlayHistoryByUser = (userId: string): LocalPlayHistoryData[] => {
  const allPlays = getLocalPlayHistory();
  return allPlays.filter(play => play.userId === userId);
};

export const getPlayHistoryByMusic = (musicId: string): LocalPlayHistoryData[] => {
  const allPlays = getLocalPlayHistory();
  return allPlays.filter(play => play.musicId === musicId);
};

export const getMusicPlayCount = (musicId: string): number => {
  return getPlayHistoryByMusic(musicId).length;
};

// ============= USER PROGRESS FUNCTIONS =============

export interface LocalUserProgressData {
  userId: string;
  userRole: "Creator" | "User";
  totalPlays: number;
  totalInvestments: number;
  totalInvested: string; // in ETH or USD
  totalRoyalty: string; // for creators
  level: string;
  progressPercentage: number;
  lastUpdated: string;
}

const USER_PROGRESS_STORAGE_KEY = 'tunecent_user_progress';

export const updateUserProgress = (userId: string, userRole: "Creator" | "User"): LocalUserProgressData => {
  try {
    const allProgress = getLocalUserProgress();
    let userProgress = allProgress.find(p => p.userId === userId);

    if (!userProgress) {
      userProgress = {
        userId,
        userRole,
        totalPlays: 0,
        totalInvestments: 0,
        totalInvested: "0",
        totalRoyalty: "0",
        level: userRole === "Creator" ? "Emerging Artist" : "Bronze Investor",
        progressPercentage: 0,
        lastUpdated: new Date().toISOString(),
      };
      allProgress.push(userProgress);
    }

    // Calculate stats
    const plays = getPlayHistoryByUser(userId);
    const investments = getInvestmentsByUser(userId);

    userProgress.totalPlays = plays.length;
    userProgress.totalInvestments = investments.length;
    userProgress.totalInvested = investments.reduce((sum, inv) =>
      sum + parseFloat(inv.amount), 0
    ).toString();

    if (userRole === "Creator") {
      // Calculate total plays for creator's music
      const creatorMusic = getMusicByCreator(userId);
      const totalMusicPlays = creatorMusic.reduce((sum, music) =>
        sum + getMusicPlayCount(music.id), 0
      );

      // Calculate royalty (e.g., $0.01 per play)
      userProgress.totalRoyalty = (totalMusicPlays * 0.01).toFixed(2);

      // Update level based on plays
      if (totalMusicPlays >= 1000) {
        userProgress.level = "Platinum Artist";
        userProgress.progressPercentage = 100;
      } else if (totalMusicPlays >= 500) {
        userProgress.level = "Gold Artist";
        userProgress.progressPercentage = 75;
      } else if (totalMusicPlays >= 100) {
        userProgress.level = "Silver Artist";
        userProgress.progressPercentage = 50;
      } else {
        userProgress.level = "Emerging Artist";
        userProgress.progressPercentage = Math.min((totalMusicPlays / 100) * 50, 50);
      }
    } else {
      // Update level based on investments
      if (userProgress.totalInvestments >= 50) {
        userProgress.level = "Diamond Investor";
        userProgress.progressPercentage = 100;
      } else if (userProgress.totalInvestments >= 20) {
        userProgress.level = "Platinum Investor";
        userProgress.progressPercentage = 80;
      } else if (userProgress.totalInvestments >= 10) {
        userProgress.level = "Gold Investor";
        userProgress.progressPercentage = 60;
      } else if (userProgress.totalInvestments >= 5) {
        userProgress.level = "Silver Investor";
        userProgress.progressPercentage = 40;
      } else {
        userProgress.level = "Bronze Investor";
        userProgress.progressPercentage = Math.min((userProgress.totalInvestments / 5) * 40, 40);
      }
    }

    userProgress.lastUpdated = new Date().toISOString();

    // Save back to storage
    const otherProgress = allProgress.filter(p => p.userId !== userId);
    const updated = [userProgress, ...otherProgress];
    localStorage.setItem(USER_PROGRESS_STORAGE_KEY, JSON.stringify(updated));

    return userProgress;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const getLocalUserProgress = (): LocalUserProgressData[] => {
  try {
    const data = localStorage.getItem(USER_PROGRESS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting user progress from localStorage:', error);
    return [];
  }
};

export const getUserProgressById = (userId: string): LocalUserProgressData | null => {
  const allProgress = getLocalUserProgress();
  return allProgress.find(p => p.userId === userId) || null;
};

// ============= ROYALTY CALCULATION FUNCTIONS =============

/**
 * Calculate royalty earnings for a creator from a specific music/campaign
 * 
 * PLAY TRACKING CONDITIONS:
 * - A "valid play" is counted when user listens for at least 30 seconds
 * - OR when the song is played to completion (whichever comes first)
 * - Each play session is tracked only once (no duplicate counting)
 * 
 * ROYALTY FORMULA:
 * Creator Royalty = (Total Plays × $0.01) × (100 - royaltyPercentage)%
 * 
 * Example: 100 plays, 30% to investors
 * - Total revenue: 100 × $0.01 = $1.00
 * - Creator keeps: $1.00 × 70% = $0.70
 * - Investors share: $1.00 × 30% = $0.30
 */
export const calculateCreatorRoyalty = (musicId: string): number => {
  const playCount = getMusicPlayCount(musicId);
  const REVENUE_PER_PLAY = 0.01; // $0.01 per play (mock rate)
  
  // Get campaign for this music to find royalty percentage
  const campaigns = getActiveCampaigns();
  const campaign = campaigns.find(c => c.musicTokenId === musicId);
  
  if (!campaign) return playCount * REVENUE_PER_PLAY;
  
  // Creator keeps (100 - royaltyPercentage)% of revenue
  const creatorShare = (100 - campaign.royaltyPercentage) / 100;
  return playCount * REVENUE_PER_PLAY * creatorShare;
};

/**
 * Calculate royalty earnings for an investor from a specific investment
 * 
 * PLAY TRACKING CONDITIONS:
 * - Same as creator: 30 seconds listened OR song completion
 * - Each valid play generates revenue shared proportionally
 * 
 * ROYALTY FORMULA:
 * Investor Royalty = (Total Plays × $0.01) × royaltyPercentage% × investorShare%
 * 
 * Where investorShare = (Investment Amount / Total Campaign Raised)
 * 
 * Example: Invested $200 of $800 total (25% share), 30% royalty, 100 plays
 * - Total revenue: 100 × $0.01 = $1.00
 * - Investor pool: $1.00 × 30% = $0.30
 * - Your share: $0.30 × 25% = $0.075
 */
export const calculateInvestorRoyalty = (investmentId: string): number => {
  const investment = getInvestmentById(investmentId);
  if (!investment) return 0;
  
  const campaign = getCampaignById(investment.campaignId);
  if (!campaign) return 0;
  
  const playCount = getMusicPlayCount(campaign.musicTokenId);
  const REVENUE_PER_PLAY = 0.01; // $0.01 per play
  
  // Calculate investor's share of the campaign
  const totalRaised = parseFloat(campaign.currentAmount);
  const investorAmount = parseFloat(investment.amount);
  const investorShare = totalRaised > 0 ? investorAmount / totalRaised : 0;
  
  // Investor gets (royaltyPercentage)% of revenue based on their share
  const royaltyPool = playCount * REVENUE_PER_PLAY * (campaign.royaltyPercentage / 100);
  return royaltyPool * investorShare;
};

/**
 * Get total royalty earnings for a user (as investor)
 */
export const getTotalInvestorRoyalty = (userId: string): number => {
  const investments = getInvestmentsByUser(userId);
  return investments.reduce((total: number, inv) => {
    return total + calculateInvestorRoyalty(inv.id);
  }, 0);
};

/**
 * Get total royalty earnings for a creator
 */
export const getTotalCreatorRoyalty = (creatorId: string): number => {
  const music = getLocalMusic();
  const creatorMusic = music.filter(m => m.creatorAddress === creatorId);
  
  return creatorMusic.reduce((total: number, m) => {
    return total + calculateCreatorRoyalty(m.id);
  }, 0);
};

/**
 * Get investment by ID
 */
const getInvestmentById = (investmentId: string): LocalInvestmentData | null => {
  const allInvestments = getLocalInvestments();
  return allInvestments.find(inv => inv.id === investmentId) || null;
};

// Clear all data including new types
export const clearAllLocalDataExtended = (): void => {
  try {
    localStorage.removeItem(MUSIC_STORAGE_KEY);
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
    localStorage.removeItem(INVESTMENT_STORAGE_KEY);
    localStorage.removeItem(PLAY_HISTORY_STORAGE_KEY);
    localStorage.removeItem(USER_PROGRESS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all local data:', error);
  }
};
