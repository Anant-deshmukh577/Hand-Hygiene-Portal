import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_SLIDES = 6;

const COLORS = {
  emerald: { primary: "#059669", light: "#ecfdf5", muted: "rgba(5,150,105,0.08)", ring: "#a7f3d0", gradient: ["#059669", "#047857"] },
  indigo: { primary: "#6366f1", light: "#eef2ff", muted: "rgba(99,102,241,0.08)", ring: "#c7d2fe", gradient: ["#6366f1", "#4f46e5"] },
  amber: { primary: "#f59e0b", light: "#fffbeb", muted: "rgba(245,158,11,0.08)", ring: "#fde68a", gradient: ["#f59e0b", "#d97706"] },
  rose: { primary: "#f43f5e", light: "#fff1f2", muted: "rgba(244,63,94,0.08)", ring: "#fecdd3", gradient: ["#f43f5e", "#e11d48"] },
  violet: { primary: "#8b5cf6", light: "#f5f3ff", muted: "rgba(139,92,246,0.08)", ring: "#ddd6fe", gradient: ["#8b5cf6", "#7c3aed"] },
  cyan: { primary: "#06b6d4", light: "#ecfeff", muted: "rgba(6,182,212,0.08)", ring: "#a5f3fc", gradient: ["#06b6d4", "#0891b2"] },
};

// ─── Compact Card — tighter padding, fixed max height ───
const SlideCard = ({ children }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      paddingHorizontal: 20,
      paddingVertical: 40,
    }}
  >
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4,
        paddingHorizontal: 24,
        paddingVertical: 32,
      }}
    >
      {children}
    </View>
  </View>
);

const LandingScreen = ({ navigation }) => {
  // Safety check for navigation
  if (!navigation) {
    console.error('Navigation prop is missing in LandingScreen');
    return null;
  }

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(
    Dimensions.get("window").height - 150
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const goToSlide = useCallback((index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < TOTAL_SLIDES - 1) goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goToEnd = useCallback(() => {
    goToSlide(TOTAL_SLIDES - 1);
  }, [goToSlide]);

  const features = [
    { icon: "pulse-outline", title: "Real-Time Tracking", color: COLORS.emerald },
    { icon: "trophy-outline", title: "Gamified Leaderboards", color: COLORS.amber },
    { icon: "diamond-outline", title: "Rewards & Recognition", color: COLORS.violet },
  ];

  const whoMoments = [
    { text: "Before patient contact", icon: "hand-left-outline", color: COLORS.emerald },
    { text: "Before aseptic task", icon: "medkit-outline", color: COLORS.indigo },
    { text: "After fluid exposure", icon: "water-outline", color: COLORS.rose },
    { text: "After patient contact", icon: "body-outline", color: COLORS.amber },
    { text: "After surroundings", icon: "bed-outline", color: COLORS.violet },
  ];

  const testimonial = {
    name: "Dr. Anant Deshmukh",
    role: "Infection Control Lead",
    quote: "Staff engagement has increased by over 60%. This platform truly transformed our approach to hygiene.",
  };

  const missionPoints = [
    { icon: "shield-checkmark-outline", title: "Prevent Infections", color: COLORS.emerald },
    { icon: "people-outline", title: "Empower Staff", color: COLORS.indigo },
    { icon: "trending-up-outline", title: "Drive Excellence", color: COLORS.amber },
  ];

  const slides = [
    { key: "hero" },
    { key: "mission" },
    { key: "features" },
    { key: "who" },
    { key: "testimonials" },
    { key: "cta" },
  ];

  const slideAccentColors = [
    COLORS.emerald.primary,
    COLORS.indigo.primary,
    COLORS.amber.primary,
    COLORS.rose.primary,
    COLORS.violet.primary,
    COLORS.emerald.primary,
  ];

  // ═══════════════════════════════════════════════════════
  //  SLIDE 0 — HERO (Enhanced)
  // ═══════════════════════════════════════════════════════
  const renderHeroSlide = () => (
    <SlideCard>
      {/* Visual anchor with pulse animation effect */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: COLORS.emerald.ring,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.emerald.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Image
            source={require("../../../assets/AIIMS.png")}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Title block with enhanced styling */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", letterSpacing: -1.2, lineHeight: 38, textAlign: 'center' }}>
          <Text style={{ color: "#1e293b" }}>Championing </Text>
          <Text style={{ color: COLORS.emerald.primary }}>Hand Hygiene</Text>
          <Text style={{ color: "#1e293b" }}> at AIIMS</Text>
        </Text>
      </View>

      {/* Subtitle with icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28, gap: 8 }}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.emerald.primary} />
        <Text style={{ fontSize: 14, color: "#64748b", textAlign: "center", fontWeight: '600', letterSpacing: 0.3 }}>
          Monitor. Comply. Protect every patient.
        </Text>
      </View>

      {/* CTA buttons with enhanced styling */}
      <Pressable
        onPress={() => navigation.navigate("Register")}
        className="active:scale-95"
        style={{ transform: [{ scale: 1 }], marginBottom: 12 }}
      >
        <LinearGradient
          colors={COLORS.emerald.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.emerald.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.5, marginRight: 8 }}>
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </LinearGradient>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")} className="active:opacity-70">
        <View
          style={{
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: '#f8fafc',
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748b", letterSpacing: 0.3 }}>
            Staff Login
          </Text>
        </View>
      </Pressable>

      {/* Trust indicators */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.emerald.primary }}>98%</Text>
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600' }}>Target</Text>
        </View>
        <View style={{ width: 1, height: 24, backgroundColor: '#e2e8f0' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.emerald.primary }}>24/7</Text>
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600' }}>Monitor</Text>
        </View>
        <View style={{ width: 1, height: 24, backgroundColor: '#e2e8f0' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.emerald.primary }}>WHO</Text>
          <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600' }}>Standard</Text>
        </View>
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  SLIDE 1 — MISSION (Fixed to match other slides)
  // ═══════════════════════════════════════════════════════
  const renderMissionSlide = () => (
    <SlideCard>
      {/* Visual anchor - matching other slides */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <LinearGradient
          colors={COLORS.indigo.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.indigo.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "800", letterSpacing: -1.5, color: "#ffffff" }}>
            98<Text style={{ fontSize: 18 }}>%</Text>
          </Text>
          <Text style={{ fontSize: 9, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
            TARGET
          </Text>
        </LinearGradient>
      </View>

      {/* Title block */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b", letterSpacing: -0.6, textAlign: 'center' }}>
          Clean Hands, Safer Care
        </Text>
      </View>

      {/* Subtitle */}
      <Text style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 19, fontWeight: '600', marginBottom: 28 }}>
        Every moment prevents infection and saves lives
      </Text>

      {/* List items - simplified */}
      <View style={{ gap: 12 }}>
        {missionPoints.map((point, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 14,
              paddingBottom: 14,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: point.color.ring,
            }}
          >
            <LinearGradient
              colors={point.color.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name={point.icon} size={20} color="#ffffff" />
            </LinearGradient>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b", flex: 1 }}>
              {point.title}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={point.color.primary} />
          </View>
        ))}
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  SLIDE 2 — FEATURES (Matched to Mission UI)
  // ═══════════════════════════════════════════════════════
  const renderFeaturesSlide = () => (
    <SlideCard>
      {/* Visual anchor */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <LinearGradient
          colors={COLORS.amber.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.amber.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Ionicons name="grid-outline" size={40} color="#ffffff" />
        </LinearGradient>
      </View>

      {/* Title block */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b", letterSpacing: -0.6, textAlign: 'center' }}>
          Built for Compliance
        </Text>
      </View>

      {/* Subtitle */}
      <Text style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 19, fontWeight: '600', marginBottom: 28 }}>
        Everything your team needs, nothing they don't
      </Text>

      {/* List items - matched to mission slide */}
      <View style={{ gap: 12 }}>
        {features.map((feature, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 14,
              paddingBottom: 14,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: feature.color.ring,
            }}
          >
            <LinearGradient
              colors={feature.color.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name={feature.icon} size={20} color="#ffffff" />
            </LinearGradient>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b", flex: 1 }}>
              {feature.title}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={feature.color.primary} />
          </View>
        ))}
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  SLIDE 3 — WHO 5 MOMENTS (Matched to Mission UI)
  // ═══════════════════════════════════════════════════════
  const renderWHOSlide = () => (
    <SlideCard>
      {/* Visual anchor */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <LinearGradient
          colors={COLORS.rose.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.rose.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Ionicons name="medical-outline" size={40} color="#ffffff" />
        </LinearGradient>
      </View>

      {/* Title block */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b", letterSpacing: -0.6, textAlign: 'center' }}>
          WHO 5 Moments
        </Text>
      </View>

      {/* Subtitle */}
      <Text style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 19, fontWeight: '600', marginBottom: 28 }}>
        The proven hand hygiene framework
      </Text>

      {/* List items - matched to mission slide with compact sizing */}
      <View style={{ gap: 8 }}>
        {whoMoments.map((moment, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: '#ffffff',
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: moment.color.ring,
            }}
          >
            <LinearGradient
              colors={moment.color.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name={moment.icon} size={16} color="#ffffff" />
            </LinearGradient>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1e293b", flex: 1 }}>
              {moment.text}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={moment.color.primary} />
          </View>
        ))}
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  SLIDE 4 — TESTIMONIAL
  // ═══════════════════════════════════════════════════════
  const renderTestimonialsSlide = () => (
    <SlideCard>
      {/* Visual anchor — quote mark */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 52, color: COLORS.violet.light, fontWeight: "800", lineHeight: 52 }}>
          "
        </Text>
      </View>

      {/* Quote */}
      <Text
        style={{
          fontSize: 15,
          lineHeight: 24,
          fontWeight: "400",
          fontStyle: "italic",
          color: "#475569",
          textAlign: "center",
          paddingHorizontal: 4,
          marginBottom: 24,
        }}
      >
        {testimonial.quote}
      </Text>

      {/* Divider */}
      <View style={{ width: 24, height: 2, backgroundColor: COLORS.violet.ring, borderRadius: 1, alignSelf: "center", marginBottom: 20 }} />

      {/* Author */}
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.violet.muted,
            borderWidth: 1.5,
            borderColor: COLORS.violet.ring,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Ionicons name="person" size={16} color={COLORS.violet.primary} />
        </View>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#1e293b" }}>
          {testimonial.name}
        </Text>
        <Text style={{ fontSize: 9, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginTop: 3, color: COLORS.violet.primary, opacity: 0.5 }}>
          {testimonial.role}
        </Text>
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  SLIDE 5 — CTA (Enhanced & Better)
  // ═══════════════════════════════════════════════════════
  const renderCTASlide = () => (
    <SlideCard>
      {/* Visual anchor with enhanced gradient */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <LinearGradient
          colors={COLORS.emerald.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.emerald.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Ionicons name="rocket" size={40} color="#ffffff" />
        </LinearGradient>
      </View>

      {/* Title block */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b", letterSpacing: -0.6, textAlign: 'center' }}>
          Ready to Begin?
        </Text>
      </View>

      {/* Subtitle */}
      <Text style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 19, fontWeight: '600', marginBottom: 32 }}>
        Join healthcare professionals improving patient safety every day
      </Text>

      {/* Feature highlights - compact grid */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, paddingHorizontal: 8 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: COLORS.emerald.muted,
              borderWidth: 1.5,
              borderColor: COLORS.emerald.ring,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="flash" size={22} color={COLORS.emerald.primary} />
          </View>
          <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '700', textAlign: 'center' }}>Quick{'\n'}Setup</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: COLORS.indigo.muted,
              borderWidth: 1.5,
              borderColor: COLORS.indigo.ring,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="shield-checkmark" size={22} color={COLORS.indigo.primary} />
          </View>
          <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '700', textAlign: 'center' }}>100%{'\n'}Secure</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: COLORS.amber.muted,
              borderWidth: 1.5,
              borderColor: COLORS.amber.ring,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="people" size={22} color={COLORS.amber.primary} />
          </View>
          <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '700', textAlign: 'center' }}>Team{'\n'}Ready</Text>
        </View>
      </View>

      {/* Primary CTA */}
      <Pressable
        onPress={() => navigation.navigate("Register")}
        className="active:scale-95"
        style={{ transform: [{ scale: 1 }], marginBottom: 12 }}
      >
        <LinearGradient
          colors={COLORS.emerald.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.emerald.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.5 }}>
            Get Started Free
          </Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </LinearGradient>
      </Pressable>

      {/* Secondary CTA */}
      <Pressable
        onPress={() => navigation.navigate("Login")}
        className="active:opacity-70"
        style={{
          borderRadius: 16,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: '#f8fafc',
          borderWidth: 1.5,
          borderColor: '#e2e8f0',
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748b", letterSpacing: 0.3 }}>
          Already have an account? Sign In
        </Text>
      </Pressable>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
        <Text style={{ fontSize: 10, color: '#cbd5e1', fontWeight: '700', paddingHorizontal: 12, letterSpacing: 1 }}>STAFF PORTAL</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
      </View>

      {/* Admin links with simple styling */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Pressable
          onPress={() => navigation.navigate("AdminLogin")}
          className="active:opacity-70"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748b", letterSpacing: 0.3 }}>
            Admin Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("AuditorLogin")}
          className="active:opacity-70"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748b", letterSpacing: 0.3 }}>
            Auditor Login
          </Text>
        </Pressable>
      </View>
    </SlideCard>
  );

  // ═══════════════════════════════════════════════════════
  //  RENDERER — UNCHANGED
  // ═══════════════════════════════════════════════════════
  const renderSlide = useCallback(
    ({ item }) => {
      const slideContent = {
        hero: renderHeroSlide,
        mission: renderMissionSlide,
        features: renderFeaturesSlide,
        who: renderWHOSlide,
        testimonials: renderTestimonialsSlide,
        cta: renderCTASlide,
      };
      const Content = slideContent[item.key];
      return (
        <View style={{ width: SCREEN_WIDTH, height: carouselHeight }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {Content()}
          </ScrollView>
        </View>
      );
    },
    [carouselHeight, navigation]
  );

  // ═══════════════════════════════════════════════════════
  //  PAGINATION
  // ═══════════════════════════════════════════════════════
  const PaginationDots = () => {
    const activeColor = slideAccentColors[currentIndex];
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        {slides.map((_, index) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            outputRange: [5, 20, 5],
            extrapolate: "clamp",
          });
          const dotOpacity = scrollX.interpolate({
            inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            outputRange: [0.15, 1, 0.15],
            extrapolate: "clamp",
          });
          return (
            <Pressable key={index} onPress={() => goToSlide(index)}>
              <Animated.View
                style={{
                  width: dotWidth,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: activeColor,
                  opacity: dotOpacity,
                  marginHorizontal: 3,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  const activeColor = slideAccentColors[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setCarouselHeight(e.nativeEvent.layout.height)}
      >
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="center"
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          windowSize={3}
          initialNumToRender={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      <View style={{ backgroundColor: "#ffffff", paddingBottom: 6 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 14,
          }}
        >
          {currentIndex < TOTAL_SLIDES - 1 ? (
            <Pressable onPress={goToEnd} className="active:opacity-60" hitSlop={12}>
              <Text style={{ fontSize: 12, fontWeight: "600", letterSpacing: 1.5, textTransform: "uppercase", color: "#cbd5e1" }}>
                Skip
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: 36 }} />
          )}

          <PaginationDots />

          {currentIndex < TOTAL_SLIDES - 1 ? (
            <Pressable onPress={goNext} className="active:scale-90" hitSlop={8} style={{ transform: [{ scale: 1 }] }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: activeColor,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: activeColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
            </Pressable>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(LandingScreen);
