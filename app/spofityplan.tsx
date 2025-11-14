// app/spofityplan.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Color palette
const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  gradientStart: '#4C63E9',
  gradientEnd: '#9747FF',
  logoBg: '#444444',
  surface: '#F7F7FA',
  surfaceDark: '#121212',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  accent: '#1DB954', // Verde Spotify
};

type PlanType = 'free' | 'premium';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

const PLANS: Record<PlanType, Plan> = {
  free: {
    name: 'Gratis',
    price: '$0/mes',
    description: 'Plan básico con limitaciones',
    features: [
      'Acceso a catálogo completo',
      'Anuncios publicitarios',
      'Calidad estándar (96 kbps)',
      'Saltar canciones limitado',
      'Sin descargas',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$9.99/mes',
    description: 'Experiencia sin límites',
    features: [
      'Sin anuncios',
      'Calidad premium (320 kbps)',
      'Saltar canciones ilimitadas',
      'Descargas offline',
      'Reproducción en cualquier dispositivo',
      'Letra sincronizada',
    ],
    badge: 'MÁS POPULAR',
  },
};

export default function SpofityPlanScreen() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  // Animación de escala para el plan actual
  useEffect(() => {
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ]).start(() => pulseAnimation());
    };

    pulseAnimation();
  }, [scaleAnim]);

  const handleUpgradePlan = (plan: PlanType) => {
    if (plan === currentPlan) return;

    setIsProcessing(true);
    
    Animated.sequence([
      Animated.spring(buttonAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      setCurrentPlan(plan);
      setIsProcessing(false);
      console.log(`Plan cambiado a: ${plan}`);
    }, 1200);
  };

  const renderFeatures = (features: string[]) => {
    return features.map((feature, index) => (
      <View key={index} style={styles.featureRow}>
        <Text style={styles.featureCheck}>✓</Text>
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ));
  };

  const renderPlanCard = (plan: PlanType) => {
    const planData = PLANS[plan];
    const isCurrentPlan = plan === currentPlan;

    return (
      <Animated.View
        key={plan}
        style={[
          styles.planCard,
          isCurrentPlan && { transform: [{ scale: scaleAnim }] },
          isCurrentPlan && styles.planCardActive,
        ]}
      >
        {/* Badge */}
        {planData.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{planData.badge}</Text>
          </View>
        )}

        {/* Plan Header */}
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{planData.name}</Text>
          <Text style={styles.planPrice}>{planData.price}</Text>
          <Text style={styles.planDescription}>{planData.description}</Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresList}>
          {renderFeatures(planData.features)}
        </View>

        {/* Action Button */}
        <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.planButton,
              isCurrentPlan && styles.planButtonCurrent,
              { opacity: pressed || isProcessing ? 0.8 : 1 }
            ]}
            onPress={() => handleUpgradePlan(plan)}
            disabled={isCurrentPlan || isProcessing}
          >
            <Text
              style={[
                styles.planButtonText,
                isCurrentPlan && styles.planButtonTextCurrent
              ]}
            >
              {isCurrentPlan ? 'Plan Actual' : isProcessing ? 'Procesando...' : 'Seleccionar'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Current Plan Indicator */}
        {isCurrentPlan && (
          <View style={styles.currentPlanIndicator}>
            <Text style={styles.currentPlanText}>Tu plan actual</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tu Plan</Text>
          <Text style={styles.headerSubtitle}>Elige el plan perfecto para ti</Text>
        </View>

        {/* Current Plan Summary */}
        <View style={styles.currentPlanSummary}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Plan Actual:</Text>
            <Text style={styles.summaryPlan}>{PLANS[currentPlan].name}</Text>
            <Text style={styles.summaryPrice}>{PLANS[currentPlan].price}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>🎵</Text>
          </View>
        </View>

        {/* Plans Comparison */}
        <View style={styles.plansContainer}>
          {(Object.keys(PLANS) as PlanType[]).map((plan) => renderPlanCard(plan))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>¿Tienes preguntas?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Renovación:</Text>
            <Text style={styles.infoText}>Tu suscripción se renueva automáticamente cada mes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cancelación:</Text>
            <Text style={styles.infoText}>Puedes cancelar en cualquier momento sin penalización</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Métodos de pago:</Text>
            <Text style={styles.infoText}>Tarjeta de crédito, PayPal, Apple Pay</Text>
          </View>
        </View>

        {/* Cancel Button */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <Text style={styles.cancelButtonText}>Cancelar Suscripción</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 84,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  currentPlanSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryPlan: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  summaryPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 32,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 28,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  planCardActive: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  featuresList: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureCheck: {
    fontSize: 16,
    color: COLORS.accent,
    marginRight: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 18,
  },
  planButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planButtonCurrent: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  planButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  planButtonTextCurrent: {
    color: COLORS.gradientStart,
  },
  currentPlanIndicator: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  currentPlanText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    lineHeight: 18,
  },
  cancelButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF4444',
  },
});
