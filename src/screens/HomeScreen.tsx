import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import OwnerActionRow from '../components/OwnerActionRow';
import SectionTitle from '../components/SectionTitle';
import { ToastContainer, showToast } from '../components/ToastContainer';
import { EditProfileModal, EditContactModal } from '../components/EditModals';
import { downloadResume, sharePortfolio, sendContactMessage, openProjectLink } from '../utils/buttonHandlers';
import { fetchProfileData, saveProfileData, saveContactData, type ProfileData } from '../services/portfolioService';
import {
  achievements,
  certifications,
  contactDetails,
  education,
  experience,
  interests,
  profile as defaultProfile,
  projects,
  skillGroups,
  socialLinks,
  stats,
} from '../data/portfolio';
import { initialAnalyticsCounts, incrementAnalyticsOnce, type AnalyticsCounts, subscribeToAnalytics } from '../services/analyticsService';
import { darkTheme, lightTheme, type AppTheme, type AppThemeMode } from '../theme/colors';
import { subscribeToPortfolioAccess } from '../services/portfolioAccess';

type ThemeMode = AppThemeMode;

export default function HomeScreen() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isAccessLoading, setIsAccessLoading] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editContactVisible, setEditContactVisible] = useState(false);
  const [profileImageVisible, setProfileImageVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [analyticsCounts, setAnalyticsCounts] = useState<AnalyticsCounts>(initialAnalyticsCounts);
  const [profile, setProfile] = useState<ProfileData>({
    name: defaultProfile.name,
    title: defaultProfile.title,
    bio: defaultProfile.bio,
    email: defaultProfile.email,
    phone: defaultProfile.phone,
    address: defaultProfile.address,
    image: defaultProfile.image,
    coverImage: defaultProfile.coverImage,
    status: defaultProfile.status,
    university: defaultProfile.university,
    completion: defaultProfile.completion,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const profileImageFadeAnim = useRef(new Animated.Value(0)).current;
  const profileImageScaleAnim = useRef(new Animated.Value(0.92)).current;

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const canEdit = !isAccessLoading && isOwnerMode;
  const noop = () => undefined;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileData = await fetchProfileData();
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const unsubscribe = subscribeToPortfolioAccess((state) => {
      setIsOwnerMode(state.isOwner);
      setIsAccessLoading(state.isLoading);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAnalytics(setAnalyticsCounts);
    void incrementAnalyticsOnce('visits', 'visit');
    void incrementAnalyticsOnce('profileViews', 'profile-view');
    return unsubscribe;
  }, []);

  const closeProfileImage = () => {
    Animated.parallel([
      Animated.timing(profileImageFadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(profileImageScaleAnim, {
        toValue: 0.92,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setProfileImageVisible(false));
  };

  const openProfileImage = () => {
    setProfileImageVisible(true);
    profileImageFadeAnim.setValue(0);
    profileImageScaleAnim.setValue(0.92);
    Animated.parallel([
      Animated.timing(profileImageFadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(profileImageScaleAnim, {
        toValue: 1,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && profileImageVisible) {
        closeProfileImage();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [profileImageVisible]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => {
      const haystack = `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const filteredSkills = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return skillGroups;

    return skillGroups.filter((group) => {
      const haystack = `${group.title} ${group.items.join(' ')}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const profileData = await fetchProfileData();
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 700);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleDownloadResume = async () => {
    await downloadResume();
  };

  const handleSharePortfolio = async () => {
    await sharePortfolio();
  };

  const handleContactSubmit = async () => {
    setIsContactSubmitting(true);
    const success = await sendContactMessage(contactName, contactEmail, contactMessage, profile.email);
    if (success) {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }
    setIsContactSubmitting(false);
  };

  const handleSaveProfile = async (data: { name: string; title: string; bio: string }) => {
    try {
      await saveProfileData(data);
      setProfile(prev => ({
        ...prev,
        ...data,
      }));
      setEditProfileVisible(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save profile. Please try again.', 'error');
    }
  };

  const handleSaveContact = async (data: { email: string; phone: string; address: string }) => {
    try {
      await saveContactData(data);
      setProfile(prev => ({
        ...prev,
        ...data,
      }));
      setEditContactVisible(false);
      showToast('Contact info updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving contact:', error);
      showToast('Failed to save contact info. Please try again.', 'error');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} colors={[theme.accent]} />}
    >
      <View style={styles.topBar}>
        <Text style={[styles.brandText, { color: theme.textPrimary }]}>Archit Bishnoi Portfolio</Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.textSecondary }]}>Light</Text>
          <Switch value={themeMode === 'dark'} onValueChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} thumbColor={themeMode === 'dark' ? theme.accent : theme.surface} trackColor={{ false: theme.border, true: theme.accentSoft }} />
          <Text style={[styles.toggleLabel, { color: theme.textSecondary }]}>Dark</Text>
        </View>
      </View>

      {canEdit ? (
        <View style={[styles.ownerPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
          <Text style={[styles.ownerPanelTitle, { color: theme.textPrimary }]}>Owner mode</Text>
          <Text style={[styles.ownerPanelText, { color: theme.textSecondary }]}>Only you can manage portfolio content.</Text>
          <OwnerActionRow
            theme={theme}
            actions={[
              { label: 'Edit Profile', onPress: () => setEditProfileVisible(true) },
              { label: 'Edit Cover', onPress: () => showToast('Cover upload coming soon', 'info') },
              { label: 'Upload Resume', onPress: () => showToast('Resume upload coming soon', 'info') },
              { label: 'Update Social', onPress: () => showToast('Social links update coming soon', 'info') },
              { label: 'Update Contact', onPress: () => setEditContactVisible(true) },
            ]}
          />
        </View>
      ) : null}

      <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: profile.coverImage }} style={styles.coverImage} />
        <View style={[styles.coverOverlay, { backgroundColor: theme.overlay }]} />
        {canEdit ? (
          <Pressable style={[styles.imageEditButton, { backgroundColor: theme.surfaceAlt }]} onPress={() => showToast('Cover image upload coming soon', 'info')}> 
            <Text style={styles.imageEditText}>✎</Text>
          </Pressable>
        ) : null}
        <View style={styles.heroContent}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Pressable onPress={openProfileImage} accessibilityRole="button" accessibilityLabel="View profile picture">
                <Image source={{ uri: profile.image }} style={styles.avatar} />
              </Pressable>
              {canEdit ? (
                <Pressable style={[styles.avatarEditButton, { backgroundColor: theme.surfaceAlt }]} onPress={() => showToast('Avatar image upload coming soon', 'info')}> 
                  <Text style={styles.imageEditText}>✎</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.profileMeta}>
              <Text style={[styles.eyebrow, { color: theme.accent }]}>Student & Professional Portfolio</Text>
              <Text style={[styles.heading, { color: theme.textPrimary }]}>{profile.name}</Text>
              <Text style={[styles.title, { color: theme.textSecondary }]}>{profile.title}</Text>
              <View style={[styles.statusPill, { backgroundColor: theme.surfaceAlt }]}> 
                <Text style={[styles.statusText, { color: theme.textPrimary }]}>{profile.status}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>{profile.bio}</Text>

          <View style={[styles.progressCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}> 
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.textPrimary }]}>Profile completion</Text>
              <Text style={[styles.progressValue, { color: theme.accent }]}>{profile.completion}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}> 
              <View style={[styles.progressFill, { width: `${profile.completion}%`, backgroundColor: theme.accent }]} />
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.primaryButton, { backgroundColor: theme.accent }]} onPress={handleDownloadResume}> 
              <Text style={styles.buttonText}>Download Resume</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={handleSharePortfolio}> 
              <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Share Portfolio</Text>
            </Pressable>
          </View>
          {canEdit ? (
            <OwnerActionRow
              theme={theme}
              actions={[
                { label: 'Edit Profile', onPress: () => setEditProfileVisible(true) },
                { label: 'Save Changes', onPress: () => showToast('All changes saved', 'success') },
              ]}
            />
          ) : null}
        </View>
      </Animated.View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Search portfolio" subtitle="Find projects, skills, education, and experience instantly." theme={theme} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search projects or skills"
          placeholderTextColor={theme.muted}
          style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
        />
      </View>

      <View style={styles.section}>
        <SectionTitle title="Personal details" subtitle="A complete snapshot of your professional identity." theme={theme} />
        <View style={[styles.detailCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
          <View style={styles.detailGrid}>
            {[
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Location', profile.address],
              ['University', profile.university],
            ].map(([label, value]) => (
              <View key={label} style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Education" subtitle="Academic milestones and achievements in a timeline." theme={theme} />
        {canEdit ? (
          <OwnerActionRow theme={theme} actions={[{ label: 'Add Education', onPress: () => showToast('Education management coming soon', 'info') }, { label: 'Edit Education', onPress: () => showToast('Education management coming soon', 'info') }, { label: 'Delete Education', onPress: () => showToast('Education management coming soon', 'info') }]} />
        ) : null}
        {education.map((item) => (
          <View key={item.degree} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.institution}</Text>
            <Text style={[styles.cardMeta, { color: theme.accent }]}>{item.degree}</Text>
            <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>{item.period}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{item.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Skills" subtitle="Carefully grouped expertise for modern product teams." theme={theme} />
        {canEdit ? (
          <OwnerActionRow theme={theme} actions={[{ label: 'Add Skills', onPress: () => showToast('Skills management coming soon', 'info') }, { label: 'Edit Skills', onPress: () => showToast('Skills management coming soon', 'info') }, { label: 'Delete Skills', onPress: () => showToast('Skills management coming soon', 'info') }]} />
        ) : null}
        <View style={styles.skillGroups}>
          {filteredSkills.map((group) => (
            <View key={group.title} style={[styles.skillGroupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
              <Text style={[styles.skillGroupTitle, { color: group.accent }]}>{group.title}</Text>
              <View style={styles.skillGrid}>
                {group.items.map((skill) => (
                  <View key={skill} style={[styles.skillChip, { backgroundColor: theme.surfaceAlt }]}> 
                    <Text style={[styles.skillText, { color: theme.textPrimary }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Experience" subtitle="Roles that shaped my product and engineering practice." theme={theme} />
        {canEdit ? (
          <OwnerActionRow theme={theme} actions={[{ label: 'Add Experience', onPress: () => showToast('Experience management coming soon', 'info') }, { label: 'Edit Experience', onPress: () => showToast('Experience management coming soon', 'info') }, { label: 'Delete Experience', onPress: () => showToast('Experience management coming soon', 'info') }]} />
        ) : null}
        {experience.map((item) => (
          <View key={item.role} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.company}</Text>
            <Text style={[styles.cardMeta, { color: theme.accent }]}>{item.role}</Text>
            <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>{item.type} • {item.period}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{item.description}</Text>
            <View style={styles.tagRow}>
              {item.stack.map((tool) => (
                <View key={tool} style={[styles.tagChip, { backgroundColor: theme.surfaceAlt }]}> 
                  <Text style={[styles.tagText, { color: theme.textPrimary }]}>{tool}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Selected projects" subtitle="Recent work designed for impact and user delight." theme={theme} />
        {canEdit ? (
          <OwnerActionRow theme={theme} actions={[{ label: 'Add Project', onPress: () => showToast('Project management coming soon', 'info') }, { label: 'Edit Project', onPress: () => showToast('Project management coming soon', 'info') }, { label: 'Delete Project', onPress: () => showToast('Project management coming soon', 'info') }]} />
        ) : null}
        {filteredProjects.map((project) => (
          <View key={project.title} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{project.title}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{project.description}</Text>
            <Text style={[styles.highlightText, { color: theme.accent }]}>{project.highlight}</Text>
            <View style={styles.tagRow}>
              {project.tags.map((tag) => (
                <View key={tag} style={[styles.tagChip, { backgroundColor: theme.surfaceAlt }]}> 
                  <Text style={[styles.tagText, { color: theme.textPrimary }]}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.actionRow}>
              <Pressable onPress={() => openLink(project.github ?? project.link)}>
                <Text style={[styles.linkText, { color: theme.accent }]}>GitHub</Text>
              </Pressable>
              <Pressable onPress={() => openLink(project.demo ?? project.link)}>
                <Text style={[styles.linkText, { color: theme.accent }]}>Live demo</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Certifications" subtitle="Verified credentials and learning milestones." theme={theme} />
        {canEdit ? (
          <OwnerActionRow theme={theme} actions={[{ label: 'Add Certificate', onPress: () => showToast('Certificate management coming soon', 'info') }, { label: 'Edit Certificates', onPress: () => showToast('Certificate management coming soon', 'info') }, { label: 'Delete Certificates', onPress: () => showToast('Certificate management coming soon', 'info') }]} />
        ) : null}
        {certifications.map((item) => (
          <View key={item.name} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>{item.issuer} • {item.date}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>Credential ID: {item.credential}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Achievements" subtitle="Recognitions that reflect my dedication and craft." theme={theme} />
        <View style={styles.achievementGrid}>
          {achievements.map((item) => (
            <View key={item.title} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{item.detail}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Hobbies & interests" subtitle="Interests that bring balance beyond the screen." theme={theme} />
        <View style={styles.hobbyGrid}>
          {interests.map((item) => (
            <View key={item.label} style={[styles.hobbyChip, { backgroundColor: theme.surfaceAlt }]}> 
              <Text style={styles.hobbyIcon}>{item.icon}</Text>
              <Text style={[styles.hobbyText, { color: theme.textPrimary }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Social links" subtitle="Open the channels where my work and ideas live." theme={theme} />
        <View style={styles.socialRow}>
          {socialLinks.map((item) => (
            <Pressable key={item.label} onPress={() => openLink(item.url)} style={[styles.socialChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.socialText, { color: theme.textPrimary }]}>{item.icon}</Text>
              <Text style={[styles.socialText, { color: theme.textPrimary }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Contact" subtitle="Let’s build something meaningful together." theme={theme} />
        <View style={[styles.contactCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.contactInfo}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{contactDetails.email}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{contactDetails.phone}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{contactDetails.address}</Text>
          </View>

          <View style={styles.contactFormDivider} />

          <View style={styles.contactForm}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>Send me a message</Text>
            
            <TextInput
              style={[styles.formInput, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Your name"
              placeholderTextColor={theme.muted}
              value={contactName}
              onChangeText={setContactName}
              editable={!isContactSubmitting}
            />
            
            <TextInput
              style={[styles.formInput, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="your@email.com"
              placeholderTextColor={theme.muted}
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              editable={!isContactSubmitting}
            />
            
            <TextInput
              style={[styles.formTextArea, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Your message..."
              placeholderTextColor={theme.muted}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
              editable={!isContactSubmitting}
            />
            
            <Pressable
              style={[styles.submitButton, { backgroundColor: theme.accent, opacity: isContactSubmitting ? 0.6 : 1 }]}
              onPress={handleContactSubmit}
              disabled={isContactSubmitting}
            >
              <Text style={styles.submitButtonText}>{isContactSubmitting ? 'Sending...' : 'Send Message'}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Visitor analytics" subtitle="A quick glance at portfolio performance." theme={theme} />
        <View style={styles.analyticsGrid}>
          {[
            { label: 'Visitors', value: analyticsCounts.visits },
            { label: 'Portfolio views', value: analyticsCounts.profileViews },
            { label: 'Resume downloads', value: analyticsCounts.downloads },
            { label: 'Shares', value: analyticsCounts.shares },
          ].map((item) => (
            <View key={item.label} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {canEdit ? (
        <Pressable style={[styles.fab, { backgroundColor: theme.accent }]} onPress={() => showToast('Add new item - coming soon', 'info')}> 
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      ) : null}
      
      <ToastContainer theme={theme} />
      
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        theme={theme}
        onSave={handleSaveProfile}
        initialData={{ name: profile.name, title: profile.title, bio: profile.bio }}
      />
      
      <EditContactModal
        visible={editContactVisible}
        onClose={() => setEditContactVisible(false)}
        theme={theme}
        onSave={handleSaveContact}
        initialData={{ email: profile.email, phone: profile.phone, address: profile.address }}
      />

      <Modal
        visible={profileImageVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeProfileImage}
      >
        <Animated.View style={[styles.profileImageModal, { opacity: profileImageFadeAnim }]}>
          <Pressable style={styles.profileImageBackdrop} onPress={closeProfileImage} />
          <Animated.View style={[styles.profileImageFrame, { transform: [{ scale: profileImageScaleAnim }] }]}>
            <Image source={{ uri: profile.image }} style={styles.profileImageLarge} resizeMode="contain" />
          </Animated.View>
          <Pressable
            style={styles.profileImageCloseButton}
            onPress={closeProfileImage}
            accessibilityRole="button"
            accessibilityLabel="Close profile picture"
          >
            <Text style={styles.profileImageCloseText}>×</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ownerPanel: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  ownerPanelTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  ownerPanelText: {
    fontSize: 12,
    marginBottom: 8,
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 280,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
  },
  heroContent: {
    padding: 20,
    paddingTop: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.36)',
  },
  profileImageModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.82)',
  },
  profileImageBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  profileImageFrame: {
    width: '92%',
    height: '78%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageLarge: {
    width: '100%',
    height: '100%',
  },
  profileImageCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileImageCloseText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
  avatarEditButton: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageEditButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageEditText: {
    fontSize: 12,
    fontWeight: '800',
  },
  profileMeta: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  progressCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButtonText: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statCard: {
    flexBasis: '31%',
    minWidth: 100,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  detailCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  highlightText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
  skillGroups: {
    gap: 12,
  },
  skillGroupCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  skillGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementGrid: {
    gap: 12,
  },
  hobbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hobbyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  hobbyIcon: {
    fontSize: 14,
  },
  hobbyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  socialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '600',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contactInfo: {
    padding: 16,
  },
  contactFormDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  contactForm: {
    padding: 16,
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  formInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  formTextArea: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
  },
});
