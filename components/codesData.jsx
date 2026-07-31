// Master list of 100+ secret codes - store in component folder as data file
export const ALL_CODES = {
  'ss': { name: 'Social Studies', desc: 'Unlock history & geography games', cost: 0, breadPowered: true },
  'banan': { name: 'Fun Zone', desc: 'Fun games & coding challenges', cost: 0, breadPowered: true },
  'library': { name: 'Library', desc: 'Access digital book collection', cost: 0, breadPowered: true },
  'tech': { name: 'Tech Lab', desc: 'Coding games & tutorials', cost: 0, breadPowered: true },
  'nexus': { name: 'Infinite BananBucks', desc: 'Get unlimited BananBucks!', cost: 0, breadPowered: true },
  'adam': { name: 'YouTube Access', desc: 'Watch educational videos', cost: 100, breadPowered: true },
  'ai': { name: 'AI Assistant', desc: 'Your personal study helper', cost: 0, breadPowered: true },
  'infinitebanan': { name: 'Infinite BananBucks', desc: 'Unlimited points forever!', cost: 0, breadPowered: true },
  'see codes': { name: 'Code Viewer', desc: 'View all secret codes', cost: 0, breadPowered: true },
  'penn': { name: 'Code Creator', desc: 'Create custom codes with AI', cost: 0, breadPowered: false },
  'jam': { name: 'Jam Creator', desc: 'Create your own featured jam', cost: 0, breadPowered: false },
  'books': { name: 'Book Editor', desc: 'Edit and create library books', cost: 0, breadPowered: false },
  'editing': { name: 'Website Editor', desc: 'Edit anything on the website (needs approval)', cost: 0, breadPowered: false },
  'algebra': { name: 'Algebra Pro', desc: 'Advanced algebra games', cost: 75, breadPowered: true },
  'geometry': { name: 'Geometry Master', desc: 'Shape challenges', cost: 75, breadPowered: true },
  'physics': { name: 'Physics Lab', desc: 'Motion & forces', cost: 75, breadPowered: true },
  'chemistry': { name: 'Chem Master', desc: 'Element mixing', cost: 75, breadPowered: true },
  'retro': { name: 'Retro Games', desc: 'Classic arcade games', cost: 50, breadPowered: true },
  'arcade': { name: 'Arcade Zone', desc: 'Premium arcade', cost: 100, breadPowered: true },
  'vip': { name: 'VIP Access', desc: 'Exclusive content', cost: 200, breadPowered: true },
  'premium': { name: 'Premium Games', desc: 'Best games unlocked', cost: 250, breadPowered: true },
  'rainbow': { name: 'Rainbow Mode', desc: 'Colorful interface', cost: 30, breadPowered: true },
  'dark': { name: 'Dark Master', desc: 'Dark mode themes', cost: 25, breadPowered: true },
  'double': { name: 'Double Points', desc: '2x BananBucks', cost: 150, breadPowered: true },
  'triple': { name: 'Triple Points', desc: '3x BananBucks', cost: 300, breadPowered: true },
  'legend': { name: 'Legend Status', desc: 'Ultimate perks', cost: 1000, breadPowered: true },
  'god': { name: 'God Mode', desc: 'All access pass', cost: 2000, breadPowered: true },
  'banana': { name: 'Banana Language', desc: 'Unlock the Banana coding language IDE!', cost: 0, breadPowered: true },
  'party': { name: 'Party Mode', desc: 'Celebration effects', cost: 35, breadPowered: true },
  'secret': { name: 'Secret Vault', desc: 'Hidden content', cost: 100, breadPowered: true },
  'mystery': { name: 'Mystery Box', desc: 'Random rewards', cost: 50, breadPowered: true },
  'expert': { name: 'Expert Level', desc: 'Advanced challenges', cost: 120, breadPowered: true },
  'masterclass': { name: 'Master Class', desc: 'Top tier content', cost: 150, breadPowered: true },
  'champion': { name: 'Champion Mode', desc: 'Elite status', cost: 200, breadPowered: true },
  'fire': { name: 'Fire Mode', desc: 'Hot streak bonus', cost: 45, breadPowered: true },
  'lightning': { name: 'Lightning Fast', desc: 'Speed bonus', cost: 50, breadPowered: true },
  'star': { name: 'Star Power', desc: 'Shine bright', cost: 55, breadPowered: true },
  'crown': { name: 'Royal Crown', desc: 'VIP treatment', cost: 180, breadPowered: true },
  'diamond': { name: 'Diamond Tier', desc: 'Premium status', cost: 300, breadPowered: true },
  'turbo': { name: 'Turbo Mode', desc: 'Extra speed', cost: 85, breadPowered: true },
  'flash': { name: 'Flash Speed', desc: 'Lightning quick', cost: 95, breadPowered: true },
  'boost': { name: 'Mega Boost', desc: 'Power surge', cost: 80, breadPowered: true },
  'shield': { name: 'Shield Up', desc: 'Protection mode', cost: 60, breadPowered: true },
  'unicorn': { name: 'Unicorn Magic', desc: 'Magical powers', cost: 99, breadPowered: true },
  'dragon': { name: 'Dragon Rider', desc: 'Epic mount', cost: 150, breadPowered: true },
  'ninja': { name: 'Ninja Skills', desc: 'Stealth mode', cost: 130, breadPowered: true },
  'bread': { name: 'Master Code', desc: 'Unlock everything for free!', cost: 0, breadPowered: true },
  'apr': { name: 'APR Access', desc: 'Full rank & moderation permissions', cost: 0, breadPowered: false },
  'bananacoder': { name: 'Banana Language', desc: 'Advanced custom coding language + IDE + tutorials', cost: 0, breadPowered: false },
};

export const getCodeInfo = (code) => {
  const lowerCode = code.toLowerCase().trim();
  // Check AI code
  const aiCode = localStorage.getItem('currentAICodeValue');
  if (aiCode && lowerCode === aiCode.toLowerCase()) {
    return { name: 'AI Generated Code', desc: 'Special hourly AI code', cost: 0, breadPowered: true };
  }
  // Check custom codes
  const customCodes = JSON.parse(localStorage.getItem('customCodes') || '{}');
  if (customCodes[lowerCode]) return customCodes[lowerCode];
  return ALL_CODES[lowerCode] || null;
};

export const isValidCode = (code) => {
  const lowerCode = code.toLowerCase().trim();
  const customCodes = JSON.parse(localStorage.getItem('customCodes') || '{}');
  const aiCode = localStorage.getItem('currentAICodeValue');
  return lowerCode in ALL_CODES || lowerCode in customCodes || (aiCode && lowerCode === aiCode.toLowerCase());
};

export const getAllCodeNames = () => {
  const customCodes = JSON.parse(localStorage.getItem('customCodes') || '{}');
  return [...Object.keys(ALL_CODES), ...Object.keys(customCodes)];
};