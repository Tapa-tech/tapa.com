'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Rituals & Puja' | 'Panchang & Dates' | 'Accounts & Orders' | 'General';
  helpfulVotes: number;
}

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How are Panchang Tithi timings calculated for different cities?',
    answer: 'Panchang timings are calculated using local sunrise and astronomical ephemeris algorithms for exact geographic coordinates.',
    category: 'Panchang & Dates',
    helpfulVotes: 142,
  },
  {
    id: 'faq-2',
    question: 'Can I perform Ghatasthapana if I miss the morning Abhijit Muhurta?',
    answer: 'If Abhijit Muhurta is missed, Pradosh Kaal or auspicious Choghadiya timings recommended in scripture can be utilized.',
    category: 'Rituals & Puja',
    helpfulVotes: 98,
  },
  {
    id: 'faq-3',
    question: 'What items are included in the Tapa Puja Kit?',
    answer: 'Each Puja Kit contains scripturally prescribed samagri including Kalash, Gangajal, Akshat, Haldi, Kumkum, and authentic herbs.',
    category: 'Accounts & Orders',
    helpfulVotes: 76,
  },
];

function FAQsLibraryContent() {
  const { data: session, status } = useSession();
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'Rituals & Puja' | 'Panchang & Dates' | 'Accounts & Orders' | 'General'>('Rituals & Puja');

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading FAQs Library...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
      category,
      helpfulVotes: 0,
    };
    setFaqs([newFaq, ...faqs]);
    setQuestion('');
    setAnswer('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ entry?')) {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; FAQS LIBRARY
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              FAQs &amp; Help Library
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Manage frequently asked questions, ritual queries, and platform help documentation shown on Tapa.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)',
            }}
          >
            + Add FAQ
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search FAQs by question or answer keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', background: '#FFFFFF' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Rituals & Puja">Rituals &amp; Puja</option>
            <option value="Panchang & Dates">Panchang &amp; Dates</option>
            <option value="Accounts & Orders">Accounts &amp; Orders</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* FAQs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFaqs.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', background: '#FDF2F5', padding: '3px 8px', borderRadius: '6px' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>👍 {item.helpfulVotes} votes</span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                {item.question}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.6, margin: '0 0 16px' }}>
                {item.answer}
              </p>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                  Delete FAQ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleCreate} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #EFEAE4' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Add FAQ Entry</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Question</label>
                <input type="text" required value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How to select auspicious muhurta?" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="Rituals & Puja">Rituals &amp; Puja</option>
                  <option value="Panchang & Dates">Panchang &amp; Dates</option>
                  <option value="Accounts & Orders">Accounts &amp; Orders</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Answer</label>
                <textarea rows={4} required value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Detailed explanation answer..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save FAQ</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FAQsLibraryPage() {
  return (
    <SessionProvider>
      <FAQsLibraryContent />
    </SessionProvider>
  );
}
