import { Share, Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { showToast } from '../components/ToastContainer';
import * as portfolioData from '../data/portfolio';
import { incrementAnalytics } from '../services/analyticsService';

let resumeDownloadInFlight = false;
let shareInFlight = false;
let contactSubmitInFlight = false;
const contactSubmitCooldownMs = 60_000;
const contactSubmitTimestampKey = 'portfolio.contact.last-submit';
const contactRecipient = 'architbishnoiportfoliyo@outlook.com';

function buildResumeHtml() {
  const { profile, education, skillGroups, experience, projects, certifications } = portfolioData;
  const section = (title: string, content: string) => `
      <div class="section">
        <h2>${title}</h2>
        ${content}
      </div>
    `;

  const experienceHtml = experience
    .map((item) => `
      <div class="item">
        <div class="item-title">${item.role} @ ${item.company}</div>
        <div class="item-meta">${item.period} • ${item.type}</div>
        <div class="item-text">${item.description}</div>
      </div>
    `)
    .join('');

  const educationHtml = education
    .map((item) => `
      <div class="item">
        <div class="item-title">${item.degree}, ${item.institution}</div>
        <div class="item-meta">${item.period}</div>
        <div class="item-text">${item.description}</div>
      </div>
    `)
    .join('');

  const skillsHtml = skillGroups
    .map((group) => `<div class="item"><span class="item-title">${group.title}:</span> ${group.items.join(', ')}</div>`)
    .join('');

  const projectsHtml = projects
    .map((project) => `
      <div class="item">
        <div class="item-title">${project.title}</div>
        <div class="item-meta">${project.tags.join(', ')}</div>
        <div class="item-text">${project.description}</div>
      </div>
    `)
    .join('');

  const certificationsHtml = certifications
    .map((cert) => `<div class="item"><span class="item-title">${cert.name}</span> • ${cert.issuer} • ${cert.date}</div>`)
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${profile.name} Resume</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #111827; background: #fff; }
          h1 { margin: 0 0 6px; font-size: 28px; color: #111827; }
          h2 { margin: 24px 0 8px; font-size: 16px; color: #1f2937; }
          .header-meta { margin: 8px 0 0; color: #4b5563; font-size: 12px; }
          .section { margin-bottom: 18px; }
          .item { margin-bottom: 12px; }
          .item-title { font-weight: 700; font-size: 12px; color: #111827; }
          .item-meta { font-size: 11px; color: #4b5563; margin-bottom: 6px; }
          .item-text { font-size: 11px; line-height: 1.5; color: #1f2937; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${profile.name}</h1>
          <div class="header-meta">${profile.title}</div>
          <div class="header-meta">${profile.email} • ${profile.phone}</div>
          <div class="header-meta">${profile.address}</div>
        </div>
        <div class="section">
          <h2>Summary</h2>
          <div class="item-text">${profile.bio}</div>
        </div>
        ${section('Experience', experienceHtml)}
        ${section('Education', educationHtml)}
        ${section('Skills', skillsHtml)}
        ${section('Projects', projectsHtml)}
        ${section('Certifications', certificationsHtml)}
      </body>
    </html>
  `;
}

async function createResumePdfWeb() {
  const { jsPDF } = await import('jspdf');
  const { profile, education, skillGroups, experience, projects, certifications } = portfolioData;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addText = (text: string, fontSize = 12, fontStyle: 'normal' | 'bold' = 'normal', lineHeight = 14) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight;
  };

  const addSectionTitle = (title: string) => {
    y += 12;
    addText(title, 14, 'bold', 18);
    y += 6;
  };

  addText(profile.name, 22, 'bold', 26);
  addText(profile.title, 12, 'normal', 16);
  addText(`${profile.email} • ${profile.phone}`, 10, 'normal', 14);
  addText(profile.address, 10, 'normal', 14);
  y += 10;

  addSectionTitle('Summary');
  addText(profile.bio, 11, 'normal', 16);

  addSectionTitle('Experience');
  experience.forEach((item) => {
    addText(`${item.role} @ ${item.company}`, 11, 'bold', 16);
    addText(`${item.period} • ${item.type}`, 10, 'normal', 14);
    addText(item.description, 10, 'normal', 14);
  });

  addSectionTitle('Education');
  education.forEach((item) => {
    addText(`${item.degree}, ${item.institution}`, 11, 'bold', 16);
    addText(`${item.period} • ${item.description}`, 10, 'normal', 14);
  });

  addSectionTitle('Skills');
  skillGroups.forEach((group) => {
    addText(`${group.title}: ${group.items.join(', ')}`, 10, 'normal', 14);
  });

  addSectionTitle('Projects');
  projects.forEach((project) => {
    addText(project.title, 11, 'bold', 16);
    addText(project.description, 10, 'normal', 14);
  });

  addSectionTitle('Certifications');
  certifications.forEach((cert) => {
    addText(`${cert.name} • ${cert.issuer} • ${cert.date}`, 10, 'normal', 14);
  });

  return doc.output('arraybuffer');
}

export async function downloadResume(): Promise<boolean> {
  if (resumeDownloadInFlight) return false;
  resumeDownloadInFlight = true;

  try {
    const fileName = 'Archit_Bishnoi_Resume.pdf';

    if (Platform.OS === 'web') {
      const pdfBuffer = await createResumePdfWeb();
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Resume download started', 'success');
      await incrementAnalytics('downloads');
      return true;
    }

    const html = buildResumeHtml();
    const { uri } = await Print.printToFileAsync({ html });
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    if (uri) {
      await FileSystem.copyAsync({ from: uri, to: fileUri });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download Resume',
        });
        showToast('Resume ready to download', 'success');
        await incrementAnalytics('downloads');
      } else {
        await Linking.openURL(fileUri);
        showToast('Resume saved locally', 'success');
        await incrementAnalytics('downloads');
      }
      return true;
    }

    showToast('Unable to generate resume file', 'error');
    return false;
  } catch (error) {
    showToast('Failed to generate resume', 'error');
    console.error('Resume download error:', error);
    return false;
  } finally {
    resumeDownloadInFlight = false;
  }
}

export async function sharePortfolio(): Promise<boolean> {
  if (shareInFlight) return false;
  shareInFlight = true;

  try {
    const portfolioUrl = 'https://architbishnoi-portfolio.vercel.app/';

    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my portfolio',
          text: 'I built an amazing portfolio showcasing my work and skills.',
          url: portfolioUrl,
        });
      } else {
        await navigator.clipboard.writeText(portfolioUrl);
        showToast('Portfolio URL copied to clipboard', 'success');
      }
    } else {
      await Share.share({
        message: 'Check out my portfolio: ' + portfolioUrl,
        title: 'My Portfolio',
        url: portfolioUrl,
      });
    }
    await incrementAnalytics('shares');
    return true;
  } catch (error) {
    if (String(error).includes('canceled')) {
      return false;
    }
    showToast('Failed to share portfolio', 'error');
    console.error('Share error:', error);
    return false;
  } finally {
    shareInFlight = false;
  }
}

export async function sendContactMessage(
  name: string,
  email: string,
  message: string,
  _ownerEmail: string
) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    showToast('Please fill in your name, email, and message.', 'error');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    showToast('Please enter a valid email address', 'error');
    return false;
  }

  if (trimmedName.length > 100 || trimmedEmail.length > 254 || trimmedMessage.length > 5000) {
    showToast('Please shorten the submitted details and try again.', 'error');
    return false;
  }

  if (contactSubmitInFlight) return false;

  if (typeof window !== 'undefined') {
    const lastSubmit = Number(window.localStorage.getItem(contactSubmitTimestampKey) ?? 0);
    if (Number.isFinite(lastSubmit) && Date.now() - lastSubmit < contactSubmitCooldownMs) {
      showToast('Please wait a moment before sending another message.', 'error');
      return false;
    }
  }

  contactSubmitInFlight = true;
  try {
    const submittedAt = new Date().toISOString();
    const response = await fetch(`https://formsubmit.co/ajax/${contactRecipient}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        submittedAt,
        _subject: `New portfolio message from ${trimmedName}`,
        _replyto: trimmedEmail,
        _template: 'table',
        _honey: '',
      }),
    });

    if (!response.ok) throw new Error(`Contact service returned ${response.status}`);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(contactSubmitTimestampKey, String(Date.now()));
    }
    showToast('Message sent successfully', 'success');
    return true;
  } catch (error) {
    showToast('Failed to send message. Please try again.', 'error');
    console.error('Contact error:', error);
    return false;
  } finally {
    contactSubmitInFlight = false;
  }
}

export async function openProjectLink(url: string, label: string) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    showToast(`Failed to open ${label}`, 'error');
    console.error('Link error:', error);
  }
}

export async function openSocialLink(url: string, platform: string) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    showToast(`Failed to open ${platform}`, 'error');
    console.error('Social link error:', error);
  }
}
