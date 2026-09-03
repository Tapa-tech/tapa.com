'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface CoreValueItem {
  id?: string;
  number: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface SourceItem {
  id?: string;
  source: string;
  score: string;
  sortOrder: number;
}

interface PointItem {
  id?: string;
  title: string;
  description: string;
  sortOrder: number;
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onChange(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151' }}>
        {label}
      </label>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label
          style={{
            background: '#DE1B59',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(222, 27, 89, 0.2)',
          }}
        >
          📁 Upload Image File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        <input
          type="text"
          placeholder="Or paste image URL (https://...)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: '240px', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
        />
      </div>

      {value && (
        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '8px 12px', borderRadius: '8px' }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
          <div style={{ flex: 1, fontSize: '11px', color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value.startsWith('data:') ? 'Uploaded Local File (Base64 Data URL)' : value}
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}

function AboutAdminContent() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<'hero' | 'why' | 'values' | 'editorial' | 'kits' | 'purohit' | 'circle'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Main Form Data State
  const [formData, setFormData] = useState<any>({
    heroEyebrow: '',
    heroTitle: '',
    heroStandfirst: '',
    heroParagraph1: '',
    heroParagraph2: '',
    heroPullQuote: '',
    filmLogo: '',
    filmSpec: '',

    whySectionNumber: '3',
    whyTitleDevanagari: 'तप्',
    whyDevanagariDesc: '',
    whyParagraph2: '',
    founderTrayTitle: '',
    founderName: '',
    founderDesignation: '',
    founderLetterTitle: '',
    founderLetterP1: '',
    founderLetterP2: '',
    founderLetterP3: '',
    founderLetterP4: '',
    founderLetterP5: '',
    founderFamilyImage: '',
    founderFamilyCaption: '',
    founderPullQuote1: '',
    founderLetterP6: '',
    founderLetterP7: '',
    founderLetterP8: '',
    founderSignatureName: '',
    founderSignatureTitle: '',
    founderSignatureCompany: '',
    founderPullQuote2: '',
    founderLetterP9: '',
    founderLetterP10: '',
    founderAvatar: '',
    coreValuesHeading: '',
    coreValuesSubtitle: '',
    coreValuesIntro: '',

    editorialSectionNumber: '4',
    editorialTitle: '',
    editorialStandfirst: '',
    editorialDharmaTitle: '',
    editorialDharmaSub: '',
    editorialDharmaDesc: '',
    editorialPrathaTitle: '',
    editorialPrathaSub: '',
    editorialPrathaDesc: '',
    editorialBhrantiTitle: '',
    editorialBhrantiSub: '',
    editorialBhrantiDesc: '',
    editorialRuleText: '',
    editorialConsensusText: '',
    editorialSeparatedText: '',
    editorialWeighTitle: '',
    editorialWeighP1: '',
    editorialWeighP2: '',
    editorialCtaText: '',
    editorialCtaUrl: '',

    glossarySectionNumber: '5',
    glossaryTitle: '',
    glossaryStandfirst: '',
    glossaryParagraph1: '',
    glossaryParagraph2: '',
    glossaryCtaText: '',
    glossaryCtaUrl: '',

    kitsSectionNumber: '7',
    kitsTitle: '',
    kitsStandfirst: '',
    kitsParagraph1: '',
    kitsParagraph2: '',
    kitsHeading: '',
    kitsNote: '',
    kitsCtaText: '',
    kitsCtaUrl: '',

    purohitSectionNumber: '8',
    purohitTitle: '',
    purohitChipText: '',
    purohitParagraph: '',
    purohitBookingHeading: '',
    purohitArrangeHeading: '',
    purohitNotHappenHeading: '',
    purohitNotHappenDesc: '',
    purohitNotifyCtaText: '',

    circleSectionNumber: '9',
    circleTitle: '',
    circlePriceChip: '',
    circleStandfirst: '',
    circleParagraph1: '',
    circleParagraph2: '',
    circleTrayTitle: '',
    circleLeavingNote: '',
    circleJoinCtaText: '',

    closingLabel: '',
    closingPreText: '',
    closingText: '',
    closingLogo: '',
  });

  // Repeatable Lists State
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>([]);
  const [editorialSources, setEditorialSources] = useState<SourceItem[]>([]);
  const [kitPoints, setKitPoints] = useState<PointItem[]>([]);
  const [purohitBookingPoints, setPurohitBookingPoints] = useState<PointItem[]>([]);
  const [purohitArrangementPoints, setPurohitArrangementPoints] = useState<PointItem[]>([]);
  const [circleSteps, setCircleSteps] = useState<PointItem[]>([]);

  const fetchAboutData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/about');
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const {
          coreValues: cvList = [],
          editorialSources: esList = [],
          kitPoints: kpList = [],
          purohitBookingPoints: pbpList = [],
          purohitArrangementPoints: papList = [],
          circleSteps: csList = [],
          ...main
        } = json.data;

        setFormData(main);
        setCoreValues(cvList);
        setEditorialSources(esList);
        setKitPoints(kpList);
        setPurohitBookingPoints(pbpList);
        setPurohitArrangementPoints(papList);
        setCircleSteps(csList);
      }
    } catch (err) {
      console.error('Failed to fetch about data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchAboutData();
    }
  }, [authStatus, fetchAboutData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionMsg(null);

    const payload = {
      ...formData,
      coreValues,
      editorialSources,
      kitPoints,
      purohitBookingPoints,
      purohitArrangementPoints,
      circleSteps,
    };

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: 'About page content updated successfully!' });
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to update content.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const updateMainField = (field: string, val: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      <AdminSidebar userEmail={session?.user?.email || 'admin@tapa.co'} userRole="SUPER_ADMIN" />

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
              About Page CMS
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Manage all hero text, founder letter, images, core values, editorial sources, and section points on `/about`.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 22px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(222, 27, 89, 0.25)',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>

        {/* Action Alert Banner */}
        {actionMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
              background: actionMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8',
              color: actionMsg.type === 'success' ? '#03543F' : '#9B1C1C',
              border: actionMsg.type === 'success' ? '1px solid #BCF0DA' : '1px solid #F8B4B4',
            }}
          >
            {actionMsg.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '24px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'hero', label: '1. Hero & Film Spec' },
            { id: 'why', label: '2. Why Tapa & Founder' },
            { id: 'values', label: '3. Core Values' },
            { id: 'editorial', label: '4. Editorial & Sources' },
            { id: 'kits', label: '5. Glossary & Ritual Kits' },
            { id: 'purohit', label: '6. Puja with Purohit' },
            { id: 'circle', label: '7. Circle & Closing' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 700 : 600,
                color: activeTab === tab.id ? '#DE1B59' : '#4B5563',
                borderBottom: activeTab === tab.id ? '2px solid #DE1B59' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#DE1B59', fontWeight: 700, fontSize: '14px' }}>
            Loading About page content...
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* TAB 1: HERO */}
            {activeTab === 'hero' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Hero Section</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    value={formData.heroEyebrow || ''}
                    onChange={(e) => updateMainField('heroEyebrow', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle || ''}
                    onChange={(e) => updateMainField('heroTitle', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Standfirst
                  </label>
                  <textarea
                    rows={2}
                    value={formData.heroStandfirst || ''}
                    onChange={(e) => updateMainField('heroStandfirst', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroParagraph1 || ''}
                    onChange={(e) => updateMainField('heroParagraph1', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroParagraph2 || ''}
                    onChange={(e) => updateMainField('heroParagraph2', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Hero Pull Quote
                  </label>
                  <input
                    type="text"
                    value={formData.heroPullQuote || ''}
                    onChange={(e) => updateMainField('heroPullQuote', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Film Specification Label
                  </label>
                  <input
                    type="text"
                    value={formData.filmSpec || ''}
                    onChange={(e) => updateMainField('filmSpec', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <ImageUploadField
                  label="Film Logo Image"
                  value={formData.filmLogo || ''}
                  onChange={(val) => updateMainField('filmLogo', val)}
                />
              </div>
            )}

            {/* TAB 2: WHY TAPA & FOUNDER LETTER */}
            {activeTab === 'why' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Why Tapa &amp; Founder Letter</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Devanagari Root Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whyDevanagariDesc || ''}
                    onChange={(e) => updateMainField('whyDevanagariDesc', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Why Tapa Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whyParagraph2 || ''}
                    onChange={(e) => updateMainField('whyParagraph2', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>Founder Letter</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                      Founder Name
                    </label>
                    <input
                      type="text"
                      value={formData.founderName || ''}
                      onChange={(e) => updateMainField('founderName', e.target.value)}
                      style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                      Founder Designation
                    </label>
                    <input
                      type="text"
                      value={formData.founderDesignation || ''}
                      onChange={(e) => updateMainField('founderDesignation', e.target.value)}
                      style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Founder Avatar Image"
                  value={formData.founderAvatar || ''}
                  onChange={(val) => updateMainField('founderAvatar', val)}
                />

                <ImageUploadField
                  label="Family Photo Image"
                  value={formData.founderFamilyImage || ''}
                  onChange={(val) => updateMainField('founderFamilyImage', val)}
                />

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Founder Letter Pull Quote 1
                  </label>
                  <textarea
                    rows={2}
                    value={formData.founderPullQuote1 || ''}
                    onChange={(e) => updateMainField('founderPullQuote1', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: CORE VALUES */}
            {activeTab === 'values' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Core Values</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCoreValues([
                        ...coreValues,
                        { number: `0${coreValues.length + 1}`, title: 'New Core Value', description: 'Description...', sortOrder: coreValues.length + 1 },
                      ])
                    }
                    style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Core Value
                  </button>
                </div>

                {coreValues.map((item, idx) => (
                  <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px', background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="01"
                        value={item.number}
                        onChange={(e) => {
                          const copy = [...coreValues];
                          copy[idx].number = e.target.value;
                          setCoreValues(copy);
                        }}
                        style={{ width: '60px', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: 700 }}
                      />
                      <input
                        type="text"
                        placeholder="Value title"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...coreValues];
                          copy[idx].title = e.target.value;
                          setCoreValues(copy);
                        }}
                        style={{ flex: 1, border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => setCoreValues(coreValues.filter((_, i) => i !== idx))}
                        style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Value description..."
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...coreValues];
                        copy[idx].description = e.target.value;
                        setCoreValues(copy);
                      }}
                      style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: EDITORIAL & SOURCES */}
            {activeTab === 'editorial' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Editorial Method &amp; Source Table</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Standfirst
                  </label>
                  <input
                    type="text"
                    value={formData.editorialStandfirst || ''}
                    onChange={(e) => updateMainField('editorialStandfirst', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Editorial Rule Text
                  </label>
                  <textarea
                    rows={2}
                    value={formData.editorialRuleText || ''}
                    onChange={(e) => updateMainField('editorialRuleText', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>Source Table Rows</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setEditorialSources([
                        ...editorialSources,
                        { source: 'New Source Name', score: '3 / 5', sortOrder: editorialSources.length + 1 },
                      ])
                    }
                    style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Source Row
                  </button>
                </div>

                {editorialSources.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Source name..."
                      value={item.source}
                      onChange={(e) => {
                        const copy = [...editorialSources];
                        copy[idx].source = e.target.value;
                        setEditorialSources(copy);
                      }}
                      style={{ flex: 1, border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Score (e.g. 5 / 5)"
                      value={item.score}
                      onChange={(e) => {
                        const copy = [...editorialSources];
                        copy[idx].score = e.target.value;
                        setEditorialSources(copy);
                      }}
                      style={{ width: '100px', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', fontWeight: 700 }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditorialSources(editorialSources.filter((_, i) => i !== idx))}
                      style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', borderRadius: '6px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: KITS */}
            {activeTab === 'kits' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Ritual Kits Store Section</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Kits Standfirst
                  </label>
                  <input
                    type="text"
                    value={formData.kitsStandfirst || ''}
                    onChange={(e) => updateMainField('kitsStandfirst', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>How Each Kit is Built (Points)</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setKitPoints([
                        ...kitPoints,
                        { title: 'New Kit Point', description: 'Point description...', sortOrder: kitPoints.length + 1 },
                      ])
                    }
                    style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Kit Point
                  </button>
                </div>

                {kitPoints.map((item, idx) => (
                  <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px', background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Point title"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...kitPoints];
                          copy[idx].title = e.target.value;
                          setKitPoints(copy);
                        }}
                        style={{ flex: 1, border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => setKitPoints(kitPoints.filter((_, i) => i !== idx))}
                        style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Point description..."
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...kitPoints];
                        copy[idx].description = e.target.value;
                        setKitPoints(copy);
                      }}
                      style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: PUROHIT */}
            {activeTab === 'purohit' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Puja with Purohit Section</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Coming Soon Chip Text
                  </label>
                  <input
                    type="text"
                    value={formData.purohitChipText || ''}
                    onChange={(e) => updateMainField('purohitChipText', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Purohit Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={formData.purohitParagraph || ''}
                    onChange={(e) => updateMainField('purohitParagraph', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 7: CIRCLE & CLOSING */}
            {activeTab === 'circle' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Tapa Circle &amp; Closing Statement</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Circle Price Chip (e.g. ₹499/year)
                  </label>
                  <input
                    type="text"
                    value={formData.circlePriceChip || ''}
                    onChange={(e) => updateMainField('circlePriceChip', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: 0 }}>Closing One Sentence &amp; Logo</h4>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Closing Statement Text
                  </label>
                  <textarea
                    rows={3}
                    value={formData.closingText || ''}
                    onChange={(e) => updateMainField('closingText', e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <ImageUploadField
                  label="Closing Section Brand Logo"
                  value={formData.closingLogo || ''}
                  onChange={(val) => updateMainField('closingLogo', val)}
                />
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

export default function AboutAdminPage() {
  return (
    <SessionProvider>
      <AboutAdminContent />
    </SessionProvider>
  );
}
