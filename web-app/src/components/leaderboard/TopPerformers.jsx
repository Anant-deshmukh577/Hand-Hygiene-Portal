import { getInitials } from '../../utils/helpers';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const TopPerformers = ({ performers = [], title = "Top Performers", showStats = true }) => {
  
  // Empty State
  if (performers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <InboxIcon className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">No Performers Yet</h4>
          <p className="text-gray-500 max-w-sm">
            Top performers will appear here once users start earning points.
          </p>
        </div>
      </div>
    );
  }

  const topThree = performers.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
      
      {/* ==================== HEADER ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <TrophyIcon />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">This month's champions</p>
          </div>
        </div>
      </div>

      {/* ==================== PODIUM SECTION ==================== */}
      <div className="relative px-4 sm:px-6 pt-8 pb-6 bg-gradient-to-b from-amber-50/50 to-white">
        
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-amber-200 opacity-50">
          <SparklesIcon />
        </div>
        <div className="absolute top-4 right-4 text-amber-200 opacity-50">
          <SparklesIcon />
        </div>
        
        {/* Podium Container */}
        <div className="flex items-end justify-center gap-2 sm:gap-4">
          
          {/* ===== SECOND PLACE ===== */}
          {topThree[1] && (
            <div className="flex flex-col items-center group">
              {/* Avatar */}
              <div className="relative mb-3">
                <div className="
                  w-16 h-16 sm:w-20 sm:h-20 
                  rounded-2xl 
                  bg-gradient-to-br from-gray-300 to-gray-400 
                  flex items-center justify-center 
                  text-white font-bold text-xl sm:text-2xl
                  shadow-xl shadow-gray-400/30
                  border-4 border-white
                  overflow-hidden
                  transition-transform duration-300 group-hover:scale-105
                ">
                  {topThree[1].avatar ? (
                    <img 
                      src={topThree[1].avatar} 
                      alt={topThree[1].name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getInitials(topThree[1].name)
                  )}
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                  2
                </div>
              </div>

              {/* Podium */}
              <div className="
                w-24 sm:w-28 
                bg-gradient-to-b from-gray-300 to-gray-400 
                rounded-t-2xl 
                pt-4 pb-4 px-2
                text-center
                shadow-lg
                transition-all duration-300 group-hover:shadow-xl
              ">
                <div className="text-3xl sm:text-4xl mb-2">🥈</div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate px-1 mb-1" title={topThree[1].name}>
                  {topThree[1].name?.split(' ')[0]}
                </h4>
                <div className="flex items-center justify-center gap-1 text-white">
                  <StarIcon className="h-3 w-3" />
                  <span className="text-base sm:text-lg font-bold">
                    {topThree[1].totalPoints?.toLocaleString() || 0}
                  </span>
                </div>
                {showStats && topThree[1].complianceRate !== undefined && (
                  <div className="mt-2 px-2 py-1 bg-white/20 rounded-lg">
                    <span className="text-[10px] text-white/80">{topThree[1].complianceRate}% rate</span>
                  </div>
                )}
              </div>
              
              {/* Podium Height */}
              <div className="w-24 sm:w-28 h-12 sm:h-16 bg-gradient-to-b from-gray-400 to-gray-500 rounded-b-lg shadow-inner" />
            </div>
          )}

          {/* ===== FIRST PLACE ===== */}
          {topThree[0] && (
            <div className="flex flex-col items-center group -mt-6">
              {/* Crown */}
              <div className="text-amber-400 mb-1 animate-bounce">
                <CrownIcon />
              </div>
              
              {/* Avatar */}
              <div className="relative mb-3">
                <div className="
                  w-20 h-20 sm:w-24 sm:h-24 
                  rounded-2xl 
                  bg-gradient-to-br from-yellow-400 to-amber-500 
                  flex items-center justify-center 
                  text-white font-bold text-2xl sm:text-3xl
                  shadow-xl shadow-amber-500/40
                  border-4 border-white
                  overflow-hidden
                  transition-transform duration-300 group-hover:scale-105
                  ring-4 ring-amber-300/30
                ">
                  {topThree[0].avatar ? (
                    <img 
                      src={topThree[0].avatar} 
                      alt={topThree[0].name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getInitials(topThree[0].name)
                  )}
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                  1
                </div>
              </div>

              {/* Podium */}
              <div className="
                w-28 sm:w-36 
                bg-gradient-to-b from-yellow-400 to-amber-500 
                rounded-t-2xl 
                pt-5 pb-5 px-3
                text-center
                shadow-xl shadow-amber-500/30
                transition-all duration-300 group-hover:shadow-2xl
              ">
                <div className="text-4xl sm:text-5xl mb-2">🥇</div>
                <h4 className="text-sm sm:text-base font-bold text-amber-900 truncate px-1 mb-1" title={topThree[0].name}>
                  {topThree[0].name?.split(' ')[0]}
                </h4>
                <div className="flex items-center justify-center gap-1 text-amber-900">
                  <StarIcon className="h-4 w-4" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {topThree[0].totalPoints?.toLocaleString() || 0}
                  </span>
                </div>
                {showStats && topThree[0].complianceRate !== undefined && (
                  <div className="mt-2 px-2 py-1 bg-white/30 rounded-lg">
                    <span className="text-xs text-amber-900/80">{topThree[0].complianceRate}% rate</span>
                  </div>
                )}
              </div>
              
              {/* Podium Height */}
              <div className="w-28 sm:w-36 h-20 sm:h-24 bg-gradient-to-b from-amber-500 to-amber-600 rounded-b-lg shadow-inner" />
            </div>
          )}

          {/* ===== THIRD PLACE ===== */}
          {topThree[2] && (
            <div className="flex flex-col items-center group">
              {/* Avatar */}
              <div className="relative mb-3">
                <div className="
                  w-16 h-16 sm:w-20 sm:h-20 
                  rounded-2xl 
                  bg-gradient-to-br from-amber-600 to-amber-700 
                  flex items-center justify-center 
                  text-white font-bold text-xl sm:text-2xl
                  shadow-xl shadow-amber-700/30
                  border-4 border-white
                  overflow-hidden
                  transition-transform duration-300 group-hover:scale-105
                ">
                  {topThree[2].avatar ? (
                    <img 
                      src={topThree[2].avatar} 
                      alt={topThree[2].name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getInitials(topThree[2].name)
                  )}
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                  3
                </div>
              </div>

              {/* Podium */}
              <div className="
                w-24 sm:w-28 
                bg-gradient-to-b from-amber-600 to-amber-700 
                rounded-t-2xl 
                pt-4 pb-4 px-2
                text-center
                shadow-lg
                transition-all duration-300 group-hover:shadow-xl
              ">
                <div className="text-3xl sm:text-4xl mb-2">🥉</div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate px-1 mb-1" title={topThree[2].name}>
                  {topThree[2].name?.split(' ')[0]}
                </h4>
                <div className="flex items-center justify-center gap-1 text-white">
                  <StarIcon className="h-3 w-3" />
                  <span className="text-base sm:text-lg font-bold">
                    {topThree[2].totalPoints?.toLocaleString() || 0}
                  </span>
                </div>
                {showStats && topThree[2].complianceRate !== undefined && (
                  <div className="mt-2 px-2 py-1 bg-white/20 rounded-lg">
                    <span className="text-[10px] text-white/80">{topThree[2].complianceRate}% rate</span>
                  </div>
                )}
              </div>
              
              {/* Podium Height */}
              <div className="w-24 sm:w-28 h-8 sm:h-10 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-lg shadow-inner" />
            </div>
          )}
        </div>
      </div>

      {/* ==================== DETAILS SECTION ==================== */}
      {showStats && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {topThree.map((performer, index) => (
              <div 
                key={performer.id || performer._id || index}
                className="text-center"
              >
                <p className="text-xs text-gray-500 mb-1 truncate">{performer.name}</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                    ${performer.complianceRate >= 90 ? 'bg-green-50 text-green-600' :
                      performer.complianceRate >= 75 ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'}
                  `}>
                    <ChartBarIcon />
                    {performer.complianceRate || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
              <span className="text-xs">Gold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <span className="text-xs">Silver</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700"></div>
              <span className="text-xs">Bronze</span>
            </div>
          </div>
          
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline transition-colors">
            View All Rankings →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;