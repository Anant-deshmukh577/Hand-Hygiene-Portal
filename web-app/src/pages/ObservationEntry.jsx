import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { sessionService } from '../services/sessionService';
import { observationService } from '../services/observationService';
import SessionHeader from '../components/observation/SessionHeader';
import ObservationForm from '../components/observation/ObservationForm';
import ObservationCard from '../components/observation/ObservationCard';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';

/* --- SVG Icons --- */
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HandWashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const ObservationEntry = () => {
  const { showSuccess, showError } = useNotification();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [observations, setObservations] = useState([]);
  const [sessionSummary, setSessionSummary] = useState(null);

  const handleSessionCreate = async (sessionFormData) => {
    setLoading(true);
    try {
      const response = await sessionService.createSession({
        auditorName: sessionFormData.auditorName,
        ward: sessionFormData.ward,
        date: sessionFormData.date || new Date().toISOString().split('T')[0],
        startTime: sessionFormData.startTime || new Date().toTimeString().slice(0, 5),
        notes: sessionFormData.notes || '',
      });
      
      setSessionId(response.session._id);
      setSessionData(response.session);
      setSessionActive(true);
      setSessionSummary(null);
      showSuccess('Session started successfully!');
    } catch (error) {
      showError(error.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleObservationSubmit = async (observationData) => {
    setLoading(true);
    try {
      const response = await observationService.createObservation({
        session: sessionId,
        department: observationData.department,
        designation: observationData.designation,
        ward: sessionData?.ward || observationData.ward,
        whoMoment: observationData.whoMoment,
        adherence: observationData.adherence,
        action: observationData.action,
        glove: observationData.glove,
        riskFactors: observationData.riskFactors || {},
        hygieneSteps: observationData.hygieneSteps || {},
        duration: observationData.duration || 0,
        remarks: observationData.remarks || '',
        observedStaff: observationData.observedStaff || undefined,
      });
      
      setObservations(prev => [...prev, {
        id: response.observation._id,
        ...response.observation,
      }]);
      showSuccess('Observation added successfully!');
    } catch (error) {
      showError(error.message || 'Failed to add observation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteObservation = async (id) => {
    try {
      await observationService.deleteObservation(id);
      setObservations(prev => prev.filter(obs => obs.id !== id));
      showSuccess('Observation removed');
    } catch {
      setObservations(prev => prev.filter(obs => obs.id !== id));
      showSuccess('Observation removed');
    }
  };

  const handleEndSession = async () => {
    if (observations.length === 0) {
      showError('Cannot end session without any observations');
      return;
    }
    
    const confirmEnd = window.confirm(
      `Are you sure you want to end this session? You have ${observations.length} observation(s).`
    );
    
    if (confirmEnd) {
      setLoading(true);
      try {
        await sessionService.endSession(sessionId);
        const adherenceCount = observations.filter(obs => obs.adherence === 'adherence').length;
        const compliance = observations.length > 0
          ? Math.round((adherenceCount / observations.length) * 100)
          : 0;
        setSessionSummary({
          totalObservations: observations.length,
          complianceRate: compliance,
        });
        showSuccess(`Session ended with ${observations.length} observations recorded`);
        setSessionActive(false);
        setSessionId(null);
        setSessionData(null);
        setObservations([]);
      } catch (error) {
        showError(error.message || 'Failed to end session');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate live stats
  const adherenceCount = observations.filter(obs => obs.adherence === 'adherence').length;
  const liveCompliance = observations.length > 0
    ? Math.round((adherenceCount / observations.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
                <ClipboardIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Observation Entry
                  </h1>
                  <HandWashIcon />
                </div>
                <p className="text-gray-500">
                  Record hand hygiene observations
                </p>
              </div>
            </div>

            {/* Session Status Badge */}
            <div className="flex items-center gap-3">
              {sessionActive ? (
                <Badge variant="success" size="large" className="animate-pulse">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    Session Active
                  </span>
                </Badge>
              ) : (
                <Badge variant="default" size="large">
                  No Active Session
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Session Summary (after ending) */}
        {!sessionActive && sessionSummary && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200 p-6 shadow-lg shadow-green-500/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    Session Completed Successfully! 🎉
                  </h3>
                  <p className="text-green-700">
                    Great work! Your observations have been recorded and will contribute to compliance tracking.
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{sessionSummary.totalObservations}</p>
                    <p className="text-sm text-green-700">Observations</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${
                      sessionSummary.complianceRate >= 90 ? 'text-green-600' :
                      sessionSummary.complianceRate >= 75 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {sessionSummary.complianceRate}%
                    </p>
                    <p className="text-sm text-green-700">Compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Session Banner */}
        {sessionActive && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <PlayIcon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-800">Session in Progress</h3>
                    <p className="text-sm text-teal-700">
                      Ward: <span className="font-medium">{sessionData?.ward || 'N/A'}</span>
                      {sessionData?.auditorName && (
                        <> • Auditor: <span className="font-medium">{sessionData.auditorName}</span></>
                      )}
                    </p>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-teal-200">
                    <ListIcon className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="text-2xl font-bold text-teal-600">{observations.length}</p>
                      <p className="text-xs text-gray-500">Observations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-teal-200">
                    <ChartIcon className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className={`text-2xl font-bold ${
                        liveCompliance >= 90 ? 'text-green-600' :
                        liveCompliance >= 75 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {liveCompliance}%
                      </p>
                      <p className="text-xs text-gray-500">Compliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Header / Start Session Form */}
        {!sessionActive && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <PlayIcon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Start New Session</h2>
                    <p className="text-sm text-gray-500">Configure your observation session</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <SessionHeader onSessionCreate={handleSessionCreate} loading={loading} />
              </div>
            </div>
          </div>
        )}

        {/* Observation Form */}
        {sessionActive && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Add Observation</h2>
                      <p className="text-sm text-gray-500">Record a new hand hygiene observation</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    WHO 5 Moments
                  </span>
                </div>
              </div>
              <div className="p-6">
                <ObservationForm 
                  sessionId={sessionId}
                  onSubmit={handleObservationSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Observations List */}
        {sessionActive && observations.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <ListIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Recorded Observations
                      </h2>
                      <p className="text-sm text-gray-500">
                        {observations.length} observation{observations.length !== 1 ? 's' : ''} in this session
                      </p>
                    </div>
                  </div>
                  
                  {/* End Session Button */}
                  <button
                    onClick={handleEndSession}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <StopIcon />
                    End Session
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4">
                  {observations.map((observation, index) => (
                    <ObservationCard
                      key={observation.id}
                      observation={observation}
                      index={index}
                      onDelete={handleDeleteObservation}
                    />
                  ))}
                </div>
              </div>

              {/* Session Stats Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Session recording in progress
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Compliant: <span className="font-semibold text-green-600">{adherenceCount}</span>
                    </span>
                    <span className="text-gray-500">
                      Non-compliant: <span className="font-semibold text-red-600">{observations.length - adherenceCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions (when no active session) */}
        {!sessionActive && !sessionSummary && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <InfoIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    How to Record Observations
                  </h3>
                  <ol className="space-y-2 text-blue-700">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center">1</span>
                      <span>Fill in the audit session details above and click <strong>"Start Session"</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center">2</span>
                      <span>For each staff member observed, fill in the observation form with WHO moment and adherence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center">3</span>
                      <span>Click <strong>"Add Observation"</strong> to record each observation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center">4</span>
                      <span>Review all observations before ending the session</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center">5</span>
                      <span>Click <strong>"End Session"</strong> when all observations are recorded</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-1">Quick Tips</h3>
              <p className="text-sm text-amber-700">
                <strong>WHO 5 Moments:</strong> Before patient contact, Before aseptic procedure, After body fluid exposure, After patient contact, After touching surroundings. 
                Each observation helps improve patient safety!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ObservationEntry;