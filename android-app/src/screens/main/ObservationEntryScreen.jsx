import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { observationService } from '../../services/observationService';
import { sessionService } from '../../services/sessionService';
import { userService } from '../../services/userService';
import {
  WHO_MOMENTS,
  ADHERENCE_OPTIONS,
  ACTION_OPTIONS,
  DEPARTMENTS,
  DESIGNATIONS,
  RISK_FACTORS,
  WARDS,
} from '../../utils/constants';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ObservationEntryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [observations, setObservations] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Timer states for hand hygiene compliance
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMethod, setTimerMethod] = useState(''); // 'alcohol_rub' or 'soap_water'
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [completedTime, setCompletedTime] = useState(null);

  // Session form
  const [sessionForm, setSessionForm] = useState({
    auditorName: '',
    ward: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  // Observation form with all 10 fields
  const [obsForm, setObsForm] = useState({
    identifyStaff: false,
    observedStaff: '',
    department: '',
    designation: '',
    whoMoment: '',
    adherence: '',
    action: '',
    glove: 'off',
    remarks: '',
    riskFactors: {
      jewellery: false,
      watch: false,
      ring: false,
      long_nails: false,
    },
    hygieneSteps: {
      rub_palm_to_palm: false,
      rub_right_dorsum_left_palm: false,
      rub_palm_to_palm_interlaced: false,
      rub_backs_fingers: false,
      rub_thumb_rotation: false,
      rub_fingers_rotation: false,
    },
  });
  const selectedStaff = staffUsers.find(user => user._id === obsForm.observedStaff);

  // Fetch staff users on mount
  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const response = await userService.getStaffUsers();
        setStaffUsers(response.users || []);
      } catch (error) {
        console.error('Failed to load staff users:', error);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Timer control functions
  const startTimer = (method) => {
    setTimerMethod(method);
    setTimerActive(true);
    setTimerSeconds(0);
    setTimerStartTime(new Date());
    setCompletedTime(null);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setCompletedTime(timerSeconds);
    
    // Auto-calculate adherence based on time and method
    const adherence = calculateAdherence(timerMethod, timerSeconds);
    setObsForm(prev => ({ ...prev, adherence: adherence.value, action: adherence.action }));
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    setTimerMethod('');
    setTimerStartTime(null);
    setCompletedTime(null);
  };

  // Calculate adherence based on method and time
  const calculateAdherence = (method, seconds) => {
    if (!method) return { value: '', action: '' };

    const timeRanges = {
      alcohol_rub: { min: 20, max: 30, optimal: 25 },
      soap_water: { min: 40, max: 60, optimal: 50 },
    };

    const range = timeRanges[method];
    
    if (seconds >= range.min && seconds <= range.max) {
      // Full compliance - within optimal range
      return {
        value: 'adherence',
        action: method === 'alcohol_rub' ? 'rub' : 'wash',
        points: 2,
        status: 'Full Compliance'
      };
    } else if (seconds >= (range.min - 5) && seconds <= (range.max + 10)) {
      // Partial compliance - slightly outside range
      return {
        value: 'partial',
        action: method === 'alcohol_rub' ? 'rub' : 'wash',
        points: 1,
        status: 'Partial Compliance'
      };
    } else {
      // Missed - too short or too long
      return {
        value: 'missed',
        action: method === 'alcohol_rub' ? 'rub' : 'wash',
        points: 0,
        status: 'Missed'
      };
    }
  };

  // Get compliance status for display
  const getComplianceStatus = () => {
    if (!completedTime || !timerMethod) return null;
    return calculateAdherence(timerMethod, completedTime);
  };

  // Handle staff selection - auto-fill department and designation
  const handleStaffSelect = (staffId) => {
    const selected = staffUsers.find(user => user._id === staffId);
    setObsForm(prev => ({
      ...prev,
      observedStaff: staffId,
      department: selected?.department || prev.department,
      designation: selected?.designation || prev.designation,
    }));
  };

  // Start observation session
  const handleStartSession = async () => {
    if (!sessionForm.auditorName.trim()) {
      Alert.alert('Error', 'Please enter auditor name');
      return;
    }
    if (!sessionForm.ward.trim()) {
      Alert.alert('Error', 'Please select ward');
      return;
    }

    setLoading(true);
    try {
      const response = await sessionService.createSession({
        auditorName: sessionForm.auditorName,
        ward: sessionForm.ward,
        date: sessionForm.date,
        startTime: sessionForm.time,
      });
      setSessionData(response.session);
      setSessionActive(true);
      setObservations([]);
      Alert.alert('Success', 'Observation session started');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  // Add observation to session
  const handleAddObservation = async () => {
    // Validation
    if (obsForm.identifyStaff && !obsForm.observedStaff) {
      Alert.alert('Error', 'Please select a staff member');
      return;
    }
    if (!obsForm.department) {
      Alert.alert('Error', 'Please select department');
      return;
    }
    if (!obsForm.designation) {
      Alert.alert('Error', 'Please select designation');
      return;
    }
    if (!obsForm.whoMoment) {
      Alert.alert('Error', 'Please select WHO 5 Moment');
      return;
    }
    if (!obsForm.adherence) {
      Alert.alert('Error', 'Please select hand hygiene status');
      return;
    }
    if (!obsForm.action) {
      Alert.alert('Error', 'Please select action');
      return;
    }

    setLoading(true);
    try {
      const observationData = {
        session: sessionData._id,
        department: obsForm.department,
        designation: obsForm.designation,
        ward: sessionData.ward,
        whoMoment: obsForm.whoMoment,
        adherence: obsForm.adherence,
        action: obsForm.action,
        glove: obsForm.glove,
        riskFactors: obsForm.riskFactors,
        remarks: obsForm.remarks,
        hygieneSteps: obsForm.hygieneSteps,
        duration: completedTime || 0,
      };

      // Add observedStaff if staff identification is enabled
      if (obsForm.identifyStaff && obsForm.observedStaff) {
        observationData.observedStaff = obsForm.observedStaff;
      }

      const response = await observationService.createObservation(observationData);

      setObservations([...observations, response.observation]);

      // Reset form
      setObsForm({
        identifyStaff: false,
        observedStaff: '',
        department: '',
        designation: '',
        whoMoment: '',
        adherence: '',
        action: '',
        glove: 'off',
        remarks: '',
        riskFactors: {
          jewellery: false,
          watch: false,
          ring: false,
          long_nails: false,
        },
        hygieneSteps: {
          rub_palm_to_palm: false,
          rub_right_dorsum_left_palm: false,
          rub_palm_to_palm_interlaced: false,
          rub_backs_fingers: false,
          rub_thumb_rotation: false,
          rub_fingers_rotation: false,
        },
      });
      setStaffSearchQuery(''); // Clear search query
      resetTimer(); // Reset timer

      Alert.alert('Success', 'Observation added to session');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add observation');
    } finally {
      setLoading(false);
    }
  };

  // End session and submit all observations
  const handleEndSession = async () => {
    if (observations.length === 0) {
      Alert.alert('Error', 'Please add at least one observation before ending session');
      return;
    }

    setLoading(true);
    try {
      await sessionService.endSession(sessionData._id);
      Alert.alert('Success', 'Session completed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      setSessionActive(false);
      setSessionData(null);
      setObservations([]);
      setSessionForm({ 
        auditorName: '', 
        ward: '', 
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Premium Header */}
        <LinearGradient
          colors={COLORS.cyan.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 32,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                New Observation
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Record hand hygiene compliance
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Session Summary (when active) */}
        {sessionActive && sessionData && (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 16,
              backgroundColor: COLORS.emerald.light,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.emerald.ring,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: COLORS.emerald.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={COLORS.emerald.primary} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.emerald.primary }}>
                Session Active
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <View style={{ minWidth: '45%' }}>
                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Auditor</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                  {sessionData.auditorName || 'N/A'}
                </Text>
              </View>
              <View style={{ minWidth: '45%' }}>
                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Ward</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                  {sessionData.ward}
                </Text>
              </View>
              <View style={{ minWidth: '45%' }}>
                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Observations</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                  {observations.length}
                </Text>
              </View>
              <View style={{ minWidth: '45%' }}>
                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Date</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                  {sessionData.date ? new Date(sessionData.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short'
                  }) : 'Today'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Start Session Form (when no active session) */}
        {!sessionActive && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: COLORS.indigo.muted,
                    borderWidth: 1,
                    borderColor: COLORS.indigo.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="clipboard-outline" size={20} color={COLORS.indigo.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#0f172a' }}>
                    Audit Session Details
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Configure your observation session
                  </Text>
                </View>
              </View>

              {/* Auditor Name */}
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                Auditor Name *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="person-outline" size={18} color="#64748b" style={{ marginRight: 10 }} />
                <TextInput
                  value={sessionForm.auditorName}
                  onChangeText={(text) => setSessionForm({ ...sessionForm, auditorName: text })}
                  placeholder="Enter your name"
                  placeholderTextColor="#94a3b8"
                  style={{ flex: 1, fontSize: 14, color: '#0f172a' }}
                />
              </View>

              {/* Ward */}
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                Ward *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 12,
                  paddingLeft: 16,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="business-outline" size={18} color="#64748b" style={{ marginRight: 10 }} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, paddingVertical: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 8, paddingRight: 16 }}>
                    {WARDS.map((ward) => (
                      <Pressable
                        key={ward}
                        onPress={() => setSessionForm({ ...sessionForm, ward })}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 10,
                          backgroundColor: sessionForm.ward === ward ? COLORS.indigo.primary : '#ffffff',
                          borderWidth: 1,
                          borderColor: sessionForm.ward === ward ? COLORS.indigo.primary : '#cbd5e1',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: sessionForm.ward === ward ? '#ffffff' : '#475569',
                          }}
                        >
                          {ward}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Date and Time Row */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                {/* Date */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                    Date *
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: '#e2e8f0',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#64748b" style={{ marginRight: 10 }} />
                    <TextInput
                      value={sessionForm.date}
                      onChangeText={(text) => setSessionForm({ ...sessionForm, date: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94a3b8"
                      style={{ flex: 1, fontSize: 14, color: '#0f172a' }}
                    />
                  </View>
                </View>

                {/* Time */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                    Time *
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: '#e2e8f0',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                  >
                    <Ionicons name="time-outline" size={18} color="#64748b" style={{ marginRight: 10 }} />
                    <TextInput
                      value={sessionForm.time}
                      onChangeText={(text) => setSessionForm({ ...sessionForm, time: text })}
                      placeholder="HH:MM"
                      placeholderTextColor="#94a3b8"
                      style={{ flex: 1, fontSize: 14, color: '#0f172a' }}
                    />
                  </View>
                </View>
              </View>

              {/* Session Preview (when form is complete) */}
              {sessionForm.auditorName && sessionForm.ward && sessionForm.date && sessionForm.time && (
                <View
                  style={{
                    padding: 14,
                    backgroundColor: COLORS.indigo.light,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: COLORS.indigo.ring,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: COLORS.indigo.muted,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.indigo.primary} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.indigo.primary }}>
                      Session Preview
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    <View style={{ minWidth: '45%' }}>
                      <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Auditor</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                        {sessionForm.auditorName}
                      </Text>
                    </View>
                    <View style={{ minWidth: '45%' }}>
                      <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Ward</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                        {sessionForm.ward}
                      </Text>
                    </View>
                    <View style={{ minWidth: '45%' }}>
                      <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Date</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                        {new Date(sessionForm.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={{ minWidth: '45%' }}>
                      <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Time</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                        {sessionForm.time}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Start Session Button */}
              <Pressable
                onPress={handleStartSession}
                disabled={loading || !sessionForm.auditorName || !sessionForm.ward}
                style={{ opacity: (loading || !sessionForm.auditorName || !sessionForm.ward) ? 0.6 : 1 }}
              >
                <LinearGradient
                  colors={COLORS.indigo.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    shadowColor: COLORS.indigo.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="play-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                        Start Session
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Footer Tip */}
              <View
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: '#f8fafc',
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: COLORS.indigo.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    marginTop: 2,
                  }}
                >
                  <Ionicons name="information" size={12} color={COLORS.indigo.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 2 }}>
                    Quick Tip
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', lineHeight: 16 }}>
                    Once started, you can add multiple observations to this session. All fields are required.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Observation Form (when session active) */}
        {sessionActive && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 20 }}>
                Add Observation
              </Text>

              {/* Field 1: Identify Staff Toggle */}
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 4 }}>
                      Identify Staff Member
                    </Text>
                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                      Enable to record specific staff details
                    </Text>
                  </View>
                  <Switch
                    value={obsForm.identifyStaff}
                    onValueChange={(value) => {
                      setObsForm({ ...obsForm, identifyStaff: value });
                      if (!value) {
                        setStaffSearchQuery(''); // Clear search when toggling off
                      }
                    }}
                    trackColor={{ false: '#e2e8f0', true: COLORS.cyan.ring }}
                    thumbColor={obsForm.identifyStaff ? COLORS.cyan.primary : '#cbd5e1'}
                  />
                </View>
              </View>

              {/* Field 2: Select Staff Member (Conditional) */}
              {obsForm.identifyStaff && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                    Select Staff Member *
                  </Text>
                  
                  {/* Search Field */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: '#e2e8f0',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 8 }} />
                    <TextInput
                      value={staffSearchQuery}
                      onChangeText={setStaffSearchQuery}
                      placeholder="Search staff by name..."
                      placeholderTextColor="#94a3b8"
                      style={{ flex: 1, fontSize: 14, color: '#0f172a' }}
                    />
                    {staffSearchQuery.length > 0 && (
                      <Pressable onPress={() => setStaffSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#94a3b8" />
                      </Pressable>
                    )}
                  </View>

                  {loadingStaff ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <ActivityIndicator color={COLORS.cyan.primary} />
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {staffUsers
                          .filter(staff => 
                            staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
                          )
                          .map((staff) => (
                          <Pressable
                            key={staff._id}
                            onPress={() => handleStaffSelect(staff._id)}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 10,
                              borderRadius: 12,
                              backgroundColor: obsForm.observedStaff === staff._id ? COLORS.cyan.primary : '#f8fafc',
                              borderWidth: 1,
                              borderColor: obsForm.observedStaff === staff._id ? COLORS.cyan.primary : '#e2e8f0',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: obsForm.observedStaff === staff._id ? '#ffffff' : '#475569',
                              }}
                            >
                              {staff.name}
                            </Text>
                            {staff.department && (
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: obsForm.observedStaff === staff._id ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                                  marginTop: 2,
                                }}
                              >
                                {staff.department}
                              </Text>
                            )}
                          </Pressable>
                        ))}
                        {staffUsers.filter(staff => 
                          staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, color: '#94a3b8' }}>
                              No staff found matching "{staffSearchQuery}"
                            </Text>
                          </View>
                        )}
                      </View>
                    </ScrollView>
                  )}
                </View>
              )}

              {/* Field 3: Department */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Department *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {DEPARTMENTS.map((dept) => (
                      <Pressable
                        key={dept}
                        onPress={() => setObsForm({ ...obsForm, department: dept })}
                        disabled={obsForm.identifyStaff && Boolean(obsForm.department)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: obsForm.department === dept ? COLORS.indigo.primary : '#f8fafc',
                          borderWidth: 1,
                          borderColor: obsForm.department === dept ? COLORS.indigo.primary : '#e2e8f0',
                          opacity: obsForm.identifyStaff && obsForm.department ? 0.6 : 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: obsForm.department === dept ? '#ffffff' : '#475569',
                          }}
                        >
                          {dept}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
                {obsForm.observedStaff && obsForm.department && (
                  <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                    Auto-filled from staff selection
                  </Text>
                )}
                {obsForm.observedStaff && selectedStaff && !selectedStaff.department && (
                  <Text style={{ fontSize: 10, color: '#b45309', marginTop: 4 }}>
                    Selected staff has no department on record. Please choose manually.
                  </Text>
                )}
              </View>

              {/* Field 4: Designation */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Designation *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {DESIGNATIONS.map((desig) => (
                      <Pressable
                        key={desig}
                        onPress={() => setObsForm({ ...obsForm, designation: desig })}
                        disabled={obsForm.identifyStaff && Boolean(obsForm.designation)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: obsForm.designation === desig ? COLORS.violet.primary : '#f8fafc',
                          borderWidth: 1,
                          borderColor: obsForm.designation === desig ? COLORS.violet.primary : '#e2e8f0',
                          opacity: obsForm.identifyStaff && obsForm.designation ? 0.6 : 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: obsForm.designation === desig ? '#ffffff' : '#475569',
                          }}
                        >
                          {desig}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
                {obsForm.observedStaff && obsForm.designation && (
                  <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                    Auto-filled from staff selection
                  </Text>
                )}
                {obsForm.observedStaff && selectedStaff && !selectedStaff.designation && (
                  <Text style={{ fontSize: 10, color: '#b45309', marginTop: 4 }}>
                    Selected staff has no designation on record. Please choose manually.
                  </Text>
                )}
              </View>

              {/* Field 5: Glove Status (Moved up) */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Glove Status
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={() => setObsForm({ ...obsForm, glove: 'on' })}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: obsForm.glove === 'on' ? COLORS.amber.primary : '#f8fafc',
                      borderWidth: 1,
                      borderColor: obsForm.glove === 'on' ? COLORS.amber.primary : '#e2e8f0',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="hand-left"
                      size={18}
                      color={obsForm.glove === 'on' ? '#ffffff' : '#64748b'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: obsForm.glove === 'on' ? '#ffffff' : '#475569',
                      }}
                    >
                      Gloves On
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setObsForm({ ...obsForm, glove: 'off' })}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: obsForm.glove === 'off' ? '#64748b' : '#f8fafc',
                      borderWidth: 1,
                      borderColor: obsForm.glove === 'off' ? '#64748b' : '#e2e8f0',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="hand-left-outline"
                      size={18}
                      color={obsForm.glove === 'off' ? '#ffffff' : '#64748b'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: obsForm.glove === 'off' ? '#ffffff' : '#475569',
                      }}
                    >
                      Gloves Off
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Field 6: WHO 5 Moment with Timer */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  WHO 5 Moment *
                </Text>
                
                {/* WHO Moment Selection */}
                <View style={{ gap: 10, marginBottom: 16 }}>
                  {WHO_MOMENTS.map((moment) => {
                    const momentIcons = {
                      'moment_1': 'person-outline',
                      'moment_2': 'medical-outline',
                      'moment_3': 'water-outline',
                      'moment_4': 'person-outline',
                      'moment_5': 'bed-outline',
                    };
                    
                    return (
                      <Pressable
                        key={moment.value}
                        onPress={() => {
                          setObsForm({ ...obsForm, whoMoment: moment.value });
                          resetTimer(); // Reset timer when changing moment
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 14,
                          borderRadius: 12,
                          backgroundColor: obsForm.whoMoment === moment.value ? COLORS.cyan.light : '#f8fafc',
                          borderWidth: 1,
                          borderColor: obsForm.whoMoment === moment.value ? COLORS.cyan.primary : '#e2e8f0',
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: obsForm.whoMoment === moment.value ? COLORS.cyan.primary : '#e2e8f0',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                          }}
                        >
                          <Ionicons
                            name={momentIcons[moment.value] || 'hand-right-outline'}
                            size={20}
                            color={obsForm.whoMoment === moment.value ? '#ffffff' : '#64748b'}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: obsForm.whoMoment === moment.value ? COLORS.cyan.primary : '#94a3b8',
                              marginBottom: 2,
                            }}
                          >
                            Moment {moment.id}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '600',
                              color: obsForm.whoMoment === moment.value ? COLORS.cyan.primary : '#475569',
                            }}
                          >
                            {moment.label}
                          </Text>
                        </View>
                        {obsForm.whoMoment === moment.value && (
                          <Ionicons name="checkmark-circle" size={20} color={COLORS.cyan.primary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Hand Hygiene Timer Section - Only show when WHO moment is selected */}
                {obsForm.whoMoment && (
                  <View
                    style={{
                      backgroundColor: COLORS.indigo.light,
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 2,
                      borderColor: COLORS.indigo.ring,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          backgroundColor: COLORS.indigo.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                      >
                        <Ionicons name="timer-outline" size={18} color={COLORS.indigo.primary} />
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.indigo.primary }}>
                        Hand Hygiene Timer
                      </Text>
                    </View>

                    {/* Method Selection */}
                    {!timerActive && !completedTime && (
                      <View>
                        <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                          Select hand hygiene method:
                        </Text>
                        <View style={{ gap: 10 }}>
                          <Pressable
                            onPress={() => startTimer('alcohol_rub')}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: 12,
                              backgroundColor: '#ffffff',
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: COLORS.emerald.light,
                            }}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                              <View
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 10,
                                  backgroundColor: COLORS.emerald.muted,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 10,
                                }}
                              >
                                <Ionicons name="water" size={18} color={COLORS.emerald.primary} />
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                                  🧴 Alcohol Hand Rub
                                </Text>
                                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  Required: 20-30 seconds
                                </Text>
                              </View>
                            </View>
                            <Ionicons name="play-circle" size={28} color={COLORS.emerald.primary} />
                          </Pressable>

                          <Pressable
                            onPress={() => startTimer('soap_water')}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: 12,
                              backgroundColor: '#ffffff',
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: COLORS.cyan.light,
                            }}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                              <View
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 10,
                                  backgroundColor: COLORS.cyan.muted,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 10,
                                }}
                              >
                                <Ionicons name="water-outline" size={18} color={COLORS.cyan.primary} />
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                                  🧼 Soap & Water
                                </Text>
                                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  Required: 40-60 seconds
                                </Text>
                              </View>
                            </View>
                            <Ionicons name="play-circle" size={28} color={COLORS.cyan.primary} />
                          </Pressable>
                        </View>
                      </View>
                    )}

                    {/* Timer Display - Active */}
                    {timerActive && (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                          {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}
                        </Text>
                        <View
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: '#ffffff',
                            borderWidth: 6,
                            borderColor: timerSeconds >= (timerMethod === 'alcohol_rub' ? 20 : 40) 
                              ? COLORS.emerald.primary 
                              : COLORS.amber.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                          }}
                        >
                          <Text style={{ fontSize: 36, fontWeight: '800', color: COLORS.indigo.primary }}>
                            {timerSeconds}
                          </Text>
                          <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            seconds
                          </Text>
                        </View>

                        {/* Progress indicator */}
                        <View style={{ width: '100%', marginBottom: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ fontSize: 10, color: '#64748b' }}>
                              Min: {timerMethod === 'alcohol_rub' ? '20s' : '40s'}
                            </Text>
                            <Text style={{ fontSize: 10, color: '#64748b' }}>
                              Max: {timerMethod === 'alcohol_rub' ? '30s' : '60s'}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 8,
                              backgroundColor: '#e2e8f0',
                              borderRadius: 4,
                              overflow: 'hidden',
                            }}
                          >
                            <View
                              style={{
                                height: '100%',
                                width: `${Math.min((timerSeconds / (timerMethod === 'alcohol_rub' ? 30 : 60)) * 100, 100)}%`,
                                backgroundColor: timerSeconds >= (timerMethod === 'alcohol_rub' ? 20 : 40)
                                  ? COLORS.emerald.primary
                                  : COLORS.amber.primary,
                              }}
                            />
                          </View>
                        </View>

                        <Pressable
                          onPress={stopTimer}
                          style={{
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            backgroundColor: COLORS.rose.primary,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons name="stop-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                          <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                            Stop Timer
                          </Text>
                        </Pressable>

                        {/* 6 Steps Checklist - visible during active timer */}
                        <View style={{ marginTop: 16, padding: 14, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.indigo.ring }}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.indigo.primary, marginBottom: 10 }}>
                            ✅ 6 Steps Checklist (+1 pt each)
                          </Text>
                          {[
                            { key: 'rub_palm_to_palm', label: 'Rub hands palm to palm' },
                            { key: 'rub_right_dorsum_left_palm', label: 'Right palm over left dorsum with interlaced fingers and vice versa' },
                            { key: 'rub_palm_to_palm_interlaced', label: 'Palm to palm with fingers interlaced' },
                            { key: 'rub_backs_fingers', label: 'Backs of fingers to opposing palms with fingers interlocked' },
                            { key: 'rub_thumb_rotation', label: 'Rotational rubbing of left thumb clasped in right palm and vice versa' },
                            { key: 'rub_fingers_rotation', label: 'Rotational rubbing, backwards and forwards with clasped fingers of right hand in left palm and vice versa' },
                          ].map((step) => (
                            <Pressable
                              key={step.key}
                              onPress={() => setObsForm(prev => ({
                                ...prev,
                                hygieneSteps: {
                                  ...prev.hygieneSteps,
                                  [step.key]: !prev.hygieneSteps[step.key],
                                },
                              }))}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.light : '#f8fafc',
                                borderWidth: 1,
                                borderColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#e2e8f0',
                                marginBottom: 6,
                              }}
                            >
                              <View
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 4,
                                  borderWidth: 2,
                                  borderColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#cbd5e1',
                                  backgroundColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#ffffff',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 10,
                                  marginTop: 1,
                                }}
                              >
                                {obsForm.hygieneSteps[step.key] && (
                                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                                )}
                              </View>
                              <Text style={{ flex: 1, fontSize: 12, color: obsForm.hygieneSteps[step.key] ? '#065f46' : '#475569', lineHeight: 17 }}>
                                {step.label}
                              </Text>
                            </Pressable>
                          ))}
                          <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                            {Object.values(obsForm.hygieneSteps).filter(Boolean).length} / 6 steps checked
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Timer Result - Completed */}
                    {!timerActive && completedTime && (
                      <View>
                        {(() => {
                          const status = getComplianceStatus();
                          const statusColors = {
                            'Full Compliance': { bg: COLORS.emerald.light, border: COLORS.emerald.primary, text: COLORS.emerald.primary },
                            'Partial Compliance': { bg: COLORS.amber.light, border: COLORS.amber.primary, text: COLORS.amber.primary },
                            'Missed': { bg: COLORS.rose.light, border: COLORS.rose.primary, text: COLORS.rose.primary },
                          };
                          const colors = statusColors[status?.status] || statusColors['Missed'];

                          return (
                            <View>
                              <View
                                style={{
                                  backgroundColor: colors.bg,
                                  borderRadius: 12,
                                  padding: 16,
                                  borderWidth: 2,
                                  borderColor: colors.border,
                                  marginBottom: 12,
                                }}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                  <Ionicons
                                    name={status?.status === 'Full Compliance' ? 'checkmark-circle' : 
                                          status?.status === 'Partial Compliance' ? 'alert-circle' : 'close-circle'}
                                    size={24}
                                    color={colors.text}
                                    style={{ marginRight: 8 }}
                                  />
                                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                                    {status?.status}
                                  </Text>
                                </View>
                                <Text style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                                  Method: {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}
                                </Text>
                                <Text style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                                  Time Completed: {completedTime} seconds
                                </Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                                  Steps Checked: {Object.values(obsForm.hygieneSteps).filter(Boolean).length} / 6
                                </Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                                  Points: {(() => {
                                    const previewAction = timerMethod === 'alcohol_rub' ? 'rub' : 'wash';
                                    const stepKeys = ['rub_palm_to_palm','rub_right_dorsum_left_palm','rub_palm_to_palm_interlaced','rub_backs_fingers','rub_thumb_rotation','rub_fingers_rotation'];
                                    const stepsP = stepKeys.filter(k => obsForm.hygieneSteps[k]).length;
                                    let timeP = 0;
                                    if (previewAction === 'rub' && completedTime > 20) timeP = 1;
                                    else if (previewAction === 'wash' && completedTime > 40) timeP = 1;
                                    const riskD = ['jewellery','watch','ring','long_nails'].filter(k => obsForm.riskFactors[k]).length;
                                    return Math.max(0, stepsP + timeP - riskD);
                                  })()} / 7
                                </Text>
                              </View>

                              {/* 6 Steps Checklist - still editable after timer stops */}
                              <View style={{ padding: 14, backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: COLORS.indigo.ring, marginBottom: 12 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.indigo.primary, marginBottom: 10 }}>
                                  ✅ 6 Steps Checklist (+1 pt each)
                                </Text>
                                {[
                                  { key: 'rub_palm_to_palm', label: 'Rub hands palm to palm' },
                                  { key: 'rub_right_dorsum_left_palm', label: 'Right palm over left dorsum with interlaced fingers and vice versa' },
                                  { key: 'rub_palm_to_palm_interlaced', label: 'Palm to palm with fingers interlaced' },
                                  { key: 'rub_backs_fingers', label: 'Backs of fingers to opposing palms with fingers interlocked' },
                                  { key: 'rub_thumb_rotation', label: 'Rotational rubbing of left thumb clasped in right palm and vice versa' },
                                  { key: 'rub_fingers_rotation', label: 'Rotational rubbing, backwards and forwards with clasped fingers of right hand in left palm and vice versa' },
                                ].map((step) => (
                                  <Pressable
                                    key={step.key}
                                    onPress={() => setObsForm(prev => ({
                                      ...prev,
                                      hygieneSteps: {
                                        ...prev.hygieneSteps,
                                        [step.key]: !prev.hygieneSteps[step.key],
                                      },
                                    }))}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'flex-start',
                                      padding: 10,
                                      borderRadius: 10,
                                      backgroundColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.light : '#f8fafc',
                                      borderWidth: 1,
                                      borderColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#e2e8f0',
                                      marginBottom: 6,
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#cbd5e1',
                                        backgroundColor: obsForm.hygieneSteps[step.key] ? COLORS.emerald.primary : '#ffffff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10,
                                        marginTop: 1,
                                      }}
                                    >
                                      {obsForm.hygieneSteps[step.key] && (
                                        <Ionicons name="checkmark" size={14} color="#ffffff" />
                                      )}
                                    </View>
                                    <Text style={{ flex: 1, fontSize: 12, color: obsForm.hygieneSteps[step.key] ? '#065f46' : '#475569', lineHeight: 17 }}>
                                      {step.label}
                                    </Text>
                                  </Pressable>
                                ))}
                                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                                  {Object.values(obsForm.hygieneSteps).filter(Boolean).length} / 6 steps checked
                                </Text>
                              </View>

                              <Pressable
                                onPress={resetTimer}
                                style={{
                                  paddingVertical: 10,
                                  backgroundColor: '#ffffff',
                                  borderRadius: 10,
                                  borderWidth: 1,
                                  borderColor: '#e2e8f0',
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b' }}>
                                  Reset Timer
                                </Text>
                              </Pressable>
                            </View>
                          );
                        })()}
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Field 7: Hand Hygiene Status/Adherence - Only show if timer completed or no timer used */}
              {(completedTime || !obsForm.whoMoment) && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                    Hand Hygiene Status / Adherence *
                  </Text>
                  
                  {/* Show timer result if completed */}
                  {completedTime && (() => {
                    const status = getComplianceStatus();
                    const statusColors = {
                      'Full Compliance': { bg: COLORS.emerald.light, border: COLORS.emerald.primary, text: COLORS.emerald.primary },
                      'Partial Compliance': { bg: COLORS.amber.light, border: COLORS.amber.primary, text: COLORS.amber.primary },
                      'Missed': { bg: COLORS.rose.light, border: COLORS.rose.primary, text: COLORS.rose.primary },
                    };
                    const colors = statusColors[status?.status] || statusColors['Missed'];

                    return (
                      <View
                        style={{
                          backgroundColor: colors.bg,
                          borderRadius: 12,
                          padding: 16,
                          borderWidth: 2,
                          borderColor: colors.border,
                          marginBottom: 12,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <Ionicons
                            name={status?.status === 'Full Compliance' ? 'checkmark-circle' : 
                                  status?.status === 'Partial Compliance' ? 'alert-circle' : 'close-circle'}
                            size={24}
                            color={colors.text}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                            {status?.status}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                          Method: {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                          Time: {completedTime} seconds
                        </Text>
                        <Text style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>
                          Steps Checked: {Object.values(obsForm.hygieneSteps).filter(Boolean).length} / 6
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                          Adherence: {ADHERENCE_OPTIONS.find(opt => opt.value === obsForm.adherence)?.label || 'N/A'}
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                          Points: {(() => {
                            const previewAction = timerMethod === 'alcohol_rub' ? 'rub' : 'wash';
                            const stepKeys = ['rub_palm_to_palm','rub_right_dorsum_left_palm','rub_palm_to_palm_interlaced','rub_backs_fingers','rub_thumb_rotation','rub_fingers_rotation'];
                            const stepsP = stepKeys.filter(k => obsForm.hygieneSteps[k]).length;
                            let timeP = 0;
                            if (previewAction === 'rub' && completedTime > 20) timeP = 1;
                            else if (previewAction === 'wash' && completedTime > 40) timeP = 1;
                            const riskD = ['jewellery','watch','ring','long_nails'].filter(k => obsForm.riskFactors[k]).length;
                            return Math.max(0, stepsP + timeP - riskD);
                          })()} / 7
                        </Text>
                      </View>
                    );
                  })()}

                  {/* Manual selection only if no timer was used */}
                  {!completedTime && (
                    <View style={{ gap: 10 }}>
                      {ADHERENCE_OPTIONS.map((option) => {
                        const pointsColor = option.points === 2 ? COLORS.emerald.primary : option.points === 1 ? COLORS.amber.primary : COLORS.rose.primary;
                        const pointsBg = option.points === 2 ? COLORS.emerald.light : option.points === 1 ? COLORS.amber.light : COLORS.rose.light;
                        
                        return (
                          <Pressable
                            key={option.value}
                            onPress={() => setObsForm({ ...obsForm, adherence: option.value })}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 14,
                              borderRadius: 12,
                              backgroundColor: obsForm.adherence === option.value ? pointsBg : '#f8fafc',
                              borderWidth: 1,
                              borderColor: obsForm.adherence === option.value ? pointsColor : '#e2e8f0',
                            }}
                          >
                            <View
                              style={{
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 8,
                                backgroundColor: obsForm.adherence === option.value ? pointsColor : '#e2e8f0',
                                marginRight: 12,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: '700',
                                  color: obsForm.adherence === option.value ? '#ffffff' : '#64748b',
                                }}
                              >
                                {option.points} pts
                              </Text>
                            </View>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 13,
                                fontWeight: '600',
                                color: obsForm.adherence === option.value ? pointsColor : '#475569',
                              }}
                            >
                              {option.label}
                            </Text>
                            {obsForm.adherence === option.value && (
                              <Ionicons name="checkmark-circle" size={20} color={pointsColor} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* Field 8: Action */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Action *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {ACTION_OPTIONS.map((action) => (
                      <Pressable
                        key={action.value}
                        onPress={() => setObsForm({ ...obsForm, action: action.value })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: obsForm.action === action.value ? COLORS.emerald.primary : '#f8fafc',
                          borderWidth: 1,
                          borderColor: obsForm.action === action.value ? COLORS.emerald.primary : '#e2e8f0',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: obsForm.action === action.value ? '#ffffff' : '#475569',
                          }}
                        >
                          {action.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Field 8: Risk Factors */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Risk Factors
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {RISK_FACTORS.map((factor) => (
                    <Pressable
                      key={factor.id}
                      onPress={() =>
                        setObsForm({
                          ...obsForm,
                          riskFactors: {
                            ...obsForm.riskFactors,
                            [factor.id]: !obsForm.riskFactors[factor.id],
                          },
                        })
                      }
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: obsForm.riskFactors[factor.id] ? COLORS.rose.primary : '#f8fafc',
                        borderWidth: 1,
                        borderColor: obsForm.riskFactors[factor.id] ? COLORS.rose.primary : '#e2e8f0',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {obsForm.riskFactors[factor.id] && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#ffffff"
                          style={{ marginRight: 6 }}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: obsForm.riskFactors[factor.id] ? '#ffffff' : '#475569',
                        }}
                      >
                        {factor.label}
                      </Text>
                      {obsForm.riskFactors[factor.id] && (
                        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>-1 pt</Text>
                      )}
                      {!obsForm.riskFactors[factor.id] && (
                        <Text style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>-1 pt</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Field 9: Remarks */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                  Remarks (Optional)
                </Text>
                <TextInput
                  value={obsForm.remarks}
                  onChangeText={(text) => setObsForm({ ...obsForm, remarks: text })}
                  placeholder="Add any additional notes..."
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: '#0f172a',
                    textAlignVertical: 'top',
                    minHeight: 80,
                  }}
                />
              </View>

              {/* Add Observation Button */}
              <Pressable onPress={handleAddObservation} disabled={loading}>
                <LinearGradient
                  colors={COLORS.emerald.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                    Add Observation
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}

        {/* Observations List */}
        {sessionActive && observations.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: COLORS.indigo.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="list" size={16} color={COLORS.indigo.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>
                  Observations ({observations.length})
                </Text>
              </View>

              {observations.map((obs, index) => (
                <View
                  key={obs._id || obs.id || `${obs.whoMoment}-${index}`}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: index < observations.length - 1 ? 10 : 0,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: COLORS.cyan.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                      {obs.department} - {obs.designation}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    <View
                      style={{
                        backgroundColor: COLORS.cyan.light,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: COLORS.cyan.primary, fontWeight: '600' }}>
                        {WHO_MOMENTS.find(m => m.value === obs.whoMoment)?.short}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: COLORS.emerald.light,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: COLORS.emerald.primary, fontWeight: '600' }}>
                        {obs.action}
                      </Text>
                    </View>
                    {obs.glove === 'on' && (
                      <View
                        style={{
                          backgroundColor: COLORS.amber.light,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 10, color: COLORS.amber.primary, fontWeight: '600' }}>
                          Gloves
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* End Session Button */}
        {sessionActive && observations.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Pressable onPress={handleEndSession} disabled={loading}>
              <LinearGradient
                colors={COLORS.rose.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="stop-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                      End Session & Submit
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Instructions */}
        {!sessionActive && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.indigo.light,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.indigo.ring,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: COLORS.indigo.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="information-circle" size={18} color={COLORS.indigo.primary} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.indigo.primary }}>
                  How to Record Observations
                </Text>
              </View>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 13, color: COLORS.indigo.primary, marginRight: 8, fontWeight: '700' }}>
                    1.
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 }}>
                    Start a new observation session by entering the ward/location
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 13, color: COLORS.indigo.primary, marginRight: 8, fontWeight: '700' }}>
                    2.
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 }}>
                    Record multiple observations during your session
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 13, color: COLORS.indigo.primary, marginRight: 8, fontWeight: '700' }}>
                    3.
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 }}>
                    Fill in all required fields for each observation
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 13, color: COLORS.indigo.primary, marginRight: 8, fontWeight: '700' }}>
                    4.
                  </Text>
                  <Text style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 }}>
                    End the session to submit all observations at once
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ObservationEntryScreen;
