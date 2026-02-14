
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* --- SVG Icons --- */
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

/* --- WHO 5 Moments Icons --- */
const HandRaisedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15" />
  </svg>
);

const BeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const DropletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 1013.5 0c0-3.75-6.75-12-6.75-12z" />
  </svg>
);

const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ChartIcon />,
      title: 'Real-Time Tracking',
      description: 'Monitor hand hygiene compliance across all departments and wards with live dashboards.',
      color: 'teal',
    },
    {
      icon: <TrophyIcon />,
      title: 'Gamified Leaderboards',
      description: 'Compete with colleagues and climb the rankings through consistent compliance.',
      color: 'amber',
    },
    {
      icon: <GiftIcon />,
      title: 'Rewards & Recognition',
      description: 'Earn points, unlock badges, and get recognized for excellent hygiene practices.',
      color: 'purple',
    },
    {
      icon: <ShieldCheckIcon />,
      title: 'Audit & Compliance',
      description: 'Comprehensive audit trails and actionable insights for infection control teams.',
      color: 'blue',
    },
    {
      icon: <UsersIcon />,
      title: 'Team Collaboration',
      description: 'Department-wise analytics and team challenges to boost collective compliance.',
      color: 'rose',
    },
    {
      icon: <ClockIcon />,
      title: 'WHO 5 Moments',
      description: 'Built around WHO guidelines with structured tracking of critical hygiene moments.',
      color: 'indigo',
    },
  ];

  const whoMoments = [
    { 
      num: 1, 
      text: 'Before touching a patient', 
      icon: <HandRaisedIcon />,
      color: 'teal',
      badgeColor: 'bg-teal-600'
    },
    { 
      num: 2, 
      text: 'Before aseptic procedure', 
      icon: <BeakerIcon />,
      color: 'blue',
      badgeColor: 'bg-blue-600'
    },
    { 
      num: 3, 
      text: 'After body fluid exposure risk', 
      icon: <DropletIcon />,
      color: 'rose',
      badgeColor: 'bg-rose-600'
    },
    { 
      num: 4, 
      text: 'After touching a patient', 
      icon: <UserCheckIcon />,
      color: 'amber',
      badgeColor: 'bg-amber-600'
    },
    { 
      num: 5, 
      text: 'After touching patient surroundings', 
      icon: <BuildingIcon />,
      color: 'purple',
      badgeColor: 'bg-purple-600'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      teal: 'bg-teal-100 text-teal-600 group-hover:bg-teal-200',
      amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
      purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      rose: 'bg-rose-100 text-rose-600 group-hover:bg-rose-200',
      indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
    };
    return colors[color] || colors.teal;
  };

  const getWhoIconClasses = (color) => {
    const colors = {
      teal: 'bg-teal-100 text-teal-600',
      blue: 'bg-blue-100 text-blue-600',
      rose: 'bg-rose-100 text-rose-600',
      amber: 'bg-amber-100 text-amber-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color] || colors.teal;
  };

  return (
    <div className="landing-page w-full overflow-x-hidden">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen w-full flex items-start overflow-hidden bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
        
        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-4 lg:py-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
            
            {/* LEFT SIDE - Content */}
            <div className="order-2 lg:order-1">
              
              {/* Hospital Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-md shadow-black/5 mb-6">
                <img 
                  src="/AIIMS.png" 
                  alt="AIIMS Logo" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-gray-600 text-sm font-medium">AIIMS Hand Hygiene Initiative</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.25] mb-6">
                <span className="text-gray-900">Championing</span>{' '}
                <span className="inline-block px-3 py-0.5 mt-1 bg-teal-600 text-white rounded-full shadow-md">
                  Hand Hygiene
                </span>
                <br />
                <span className="text-gray-900">Excellence Across</span>{' '}
                <span className="inline-block px-3 py-0.5 bg-teal-600 text-white rounded-full shadow-md">
                  AIIMS
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl">
                A comprehensive digital platform dedicated to advancing hand hygiene practices, monitoring compliance in real-time, and empowering healthcare professionals with evidence-based protocols to protect every patient, every time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/register"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all duration-300"
                    >
                      Register Now
                      <ArrowRightIcon />
                    </Link>
                    <Link 
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all duration-300"
                    >
                      Staff Login
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all duration-300"
                  >
                    Go to Dashboard
                    <ArrowRightIcon />
                  </Link>
                )}
              </div>

              {/* Info Points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>WHO Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Gamified Experience</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Video Container */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/30 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                <video 
                  className="w-full h-full object-contain"
                  autoPlay 
                  muted
                  playsInline
                  poster="/hand-hygiene-poster.jpg"
                >
                  <source src="/hero video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-32 h-32 sm:w-44 sm:h-44 bg-teal-500 rounded-2xl sm:rounded-3xl -z-10 shadow-lg shadow-teal-500/30"></div>
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-40 h-40 sm:w-52 sm:h-52 bg-gray-300 rounded-2xl sm:rounded-3xl -z-10 shadow-lg shadow-gray-300/50"></div>
            </div>
          </div>
        </div>
      </section>

  {/* ==================== IMPACT / MISSION SECTION ==================== */}
<section className="w-full bg-gradient-to-b from-gray-50/50 to-white py-16 lg:py-20 overflow-hidden">
  <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
    
    {/* Section Header - CENTERED */}
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
        Our Mission
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Clean Hands,
        <span className="text-teal-600"> Safer Care</span>
      </h2>
      <p className="text-gray-500 text-lg sm:text-xl">
        Every hand hygiene moment is an opportunity to prevent infection and save lives.
      </p>
    </div>

    {/* Content Grid */}
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">
      
      {/* Left - Image Grid */}
      <div className="relative order-2 lg:order-1">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          
          {/* Video 1 - Large Left */}
          <div className="impact-image-1 col-span-7 row-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/15 h-full min-h-[280px] sm:min-h-[380px]">
              <video 
                src="/healthcare team video.mp4" 
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
            </div>
          </div>

          {/* Video 2 - Top Right */}
          <div className="impact-image-2 col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-black/15 aspect-square">
              <video 
                src="/nurse video.mp4" 
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>
          </div>

          {/* Video 3 - Bottom Right */}
          <div className="impact-image-3 col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-black/15 aspect-square">
              <video 
                src="/doctor video.mp4" 
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="impact-badge absolute -bottom-2 -right-2 sm:bottom-4 sm:-right-4 bg-white rounded-xl p-3 shadow-lg shadow-black/15 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">98%</p>
              <p className="text-[10px] text-gray-500">Compliance Goal</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-24 h-24 sm:w-32 sm:h-32 bg-teal-50 rounded-2xl -z-10"></div>
      </div>

      {/* Right - Key Points */}
      <div className="order-1 lg:order-2">
        <div className="impact-text-4 space-y-4">
          <div className="flex items-start gap-4 text-left bg-white rounded-xl p-4 shadow-md shadow-black/8 border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Reduce Infections</h4>
              <p className="text-gray-500 text-sm sm:text-base">Proper hand hygiene can prevent up to 50% of healthcare-associated infections.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left bg-white rounded-xl p-4 shadow-md shadow-black/8 border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Empower Staff</h4>
              <p className="text-gray-500 text-sm sm:text-base">Equip healthcare workers with tools and motivation to maintain best practices.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left bg-white rounded-xl p-4 shadow-md shadow-black/8 border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Build Excellence</h4>
              <p className="text-gray-500 text-sm sm:text-base">Create a culture of continuous improvement in patient safety and care quality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need for better compliance
            </h2>
            <p className="text-gray-500 text-lg sm:text-xl">
              A comprehensive platform designed for AIIMS staff to track and improve hand hygiene practices.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-black/8 hover:shadow-2xl hover:shadow-black/15 hover:border-teal-200 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-5 sm:mb-6 transition-colors duration-200 ${getColorClasses(feature.color)}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHO 5 MOMENTS SECTION ==================== */}
      <section id="who-guidelines" className="w-full bg-gradient-to-b from-gray-50/50 to-white py-16 lg:py-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              WHO Guidelines
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The 5 Moments of Hand Hygiene
            </h2>
            <p className="text-gray-500 text-lg sm:text-xl">
              Our platform is built around the World Health Organization's proven framework.
            </p>
          </div>

          {/* 5 Moments Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {whoMoments.map((moment) => (
              <div 
                key={moment.num}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 pt-10 sm:pt-12 text-center border border-gray-100 shadow-lg shadow-black/8 hover:shadow-2xl hover:shadow-black/15 hover:border-teal-200 hover:-translate-y-3 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className={`absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 w-9 h-9 sm:w-11 sm:h-11 ${moment.badgeColor} text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shadow-lg shadow-black/25`}>
                  {moment.num}
                </div>
                
                {/* Icon */}
                <div className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 rounded-2xl transition-colors duration-200 ${getWhoIconClasses(moment.color)}`}>
                  {moment.icon}
                </div>
                
                {/* Text */}
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
                  {moment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section id="testimonials" className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What our staff says
            </h2>
            <p className="text-gray-500 text-lg sm:text-xl">
              Hear from doctors, nurses, and administrators at AIIMS.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Dr. Anant Deshmukh',
                role: 'Infection Control Lead',
                quote: 'This portal has transformed how we approach hand hygiene. Staff engagement has increased by over 60%.',
                image: '/default profile.png',
              },
              {
                name: 'Nurse Priya Sharma',
                role: 'ICU Head Nurse',
                quote: 'The real-time tracking and rewards system have made compliance a habit rather than a chore.',
                image: '/default profile.png',
              },
              {
                name: 'Dr. Rajesh Kumar',
                role: 'Hospital Director',
                quote: 'We\'ve seen a 42% reduction in hospital-acquired infections since implementing this system.',
                image: '/default profile.png',
              },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-black/8 hover:shadow-2xl hover:shadow-black/15 hover:border-teal-200 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-5 sm:mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-teal-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                {/* Quote */}
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4 pt-5 sm:pt-6 border-t border-gray-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg shadow-black/20"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm sm:text-base">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION (CONTACT) ==================== */}
      {!isAuthenticated && (
        <section id="contact" className="w-full bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
            
            {/* CTA Container */}
            <div className="relative bg-teal-50 rounded-3xl border border-teal-100 shadow-xl shadow-black/10 overflow-hidden">
              
              {/* Content */}
              <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  
                  {/* Left Content */}
                  <div className="text-center lg:text-left">
                    <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
                      Get Started Today
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                      Ready to make a difference in patient safety?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                      Join thousands of healthcare professionals at AIIMS who are already using our platform to improve hand hygiene compliance.
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link 
                        to="/register"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-300"
                      >
                        Get Started Free
                        <ArrowRightIcon />
                      </Link>
                      <Link 
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all duration-300"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                  
                  {/* Right Content - Quick Benefits */}
                  <div className="hidden lg:block">
                    <div className="space-y-4">
                      {[
                        { 
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ), 
                          title: 'Quick Setup', 
                          desc: 'Get started in under 2 minutes' 
                        },
                        { 
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          ), 
                          title: 'Track Progress', 
                          desc: 'Real-time compliance monitoring' 
                        },
                        { 
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          ), 
                          title: 'Earn Rewards', 
                          desc: 'Get recognized for excellence' 
                        },
                        { 
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ), 
                          title: 'View Insights', 
                          desc: 'Detailed analytics dashboard' 
                        },
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-4 bg-white hover:bg-gray-50 rounded-xl p-4 border border-gray-300 transition-colors duration-200"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
