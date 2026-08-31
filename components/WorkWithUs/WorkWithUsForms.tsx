'use client';

import React, { useState, useEffect, useRef } from 'react';
import "./workwithus.css"

type ModalType = 'careers' | 'purohit' | 'retail' | null;


export default function WorkWithUsForms() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const openedAtRef = useRef<number>(0);
  const firstInputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  // Success states
  const [careersDone, setCareersDone] = useState(false);
  const [purohitDone, setPurohitDone] = useState(false);
  const [retailDone, setRetailDone] = useState(false);

  // Form error top banners
  const [careersErrorTop, setCareersErrorTop] = useState(false);
  const [purohitErrorTop, setPurohitErrorTop] = useState(false);
  const [retailErrorTop, setRetailErrorTop] = useState(false);

  // Field error maps
  const [careersBadFields, setCareersBadFields] = useState<Record<string, boolean>>({});
  const [purohitBadFields, setPurohitBadFields] = useState<Record<string, boolean>>({});
  const [retailBadFields, setRetailBadFields] = useState<Record<string, boolean>>({});

  // Careers form fields
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cArea, setCArea] = useState('');
  const [cCity, setCCity] = useState('');
  const [cLink, setCLink] = useState('');
  const [cCv, setCCv] = useState<File | null>(null);
  const [cConsent, setCConsent] = useState(false);
  const [cHoneypot, setCHoneypot] = useState('');

  // Purohit form fields
  const [pName, setPName] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pArea, setPArea] = useState('');
  const [pYears, setPYears] = useState('');
  const [pGuru, setPGuru] = useState('');
  const [pLang, setPLang] = useState<string[]>([]);
  const [pWeekend, setPWeekend] = useState('');
  const [pUndertaking, setPUndertaking] = useState(false);
  const [pHoneypot, setPHoneypot] = useState('');

  // Retail form fields
  const [rBusiness, setRBusiness] = useState('');
  const [rPerson, setRPerson] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rType, setRType] = useState('');
  const [rCity, setRCity] = useState('');
  const [rInterest, setRInterest] = useState<string[]>([]);
  const [rVolume, setRVolume] = useState('');
  const [rNotes, setRNotes] = useState('');
  const [rHoneypot, setRHoneypot] = useState('');

  // Manage body scroll and focus trap / ESC listener
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      openedAtRef.current = Date.now();
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  const openModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Helper validation functions
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Handle Careers Submit
  const handleCareersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad: Record<string, boolean> = {};

    if (!cName.trim() || cName.trim().length < 2 || cName.trim().length > 80) bad.name = true;
    if (!cEmail.trim() || !isValidEmail(cEmail.trim())) bad.email = true;
    if (!cPhone.trim() || !isValidPhone(cPhone.trim())) bad.phone = true;
    if (!cArea) bad.area = true;
    if (!cCity.trim() || cCity.trim().length < 2 || cCity.trim().length > 60) bad.city = true;
    if (cLink.trim() && !isValidUrl(cLink.trim())) bad.link = true;
    if (!cCv || cCv.size > 5 * 1024 * 1024) bad.cv = true;
    if (!cConsent) bad.consent = true;

    setCareersBadFields(bad);

    const isSpam = cHoneypot !== '' || (Date.now() - openedAtRef.current < 3000);
    const hasError = Object.keys(bad).length > 0;

    if (hasError || isSpam) {
      setCareersErrorTop(true);
      return;
    }

    setCareersErrorTop(false);
    setCareersDone(true);
  };

  // Handle Purohit Submit
  const handlePurohitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad: Record<string, boolean> = {};

    if (!pName.trim() || pName.trim().length < 2 || pName.trim().length > 80) bad.name = true;
    if (!pPhone.trim() || !isValidPhone(pPhone.trim())) bad.phone = true;
    if (pEmail.trim() && !isValidEmail(pEmail.trim())) bad.email = true;
    if (!pArea.trim() || pArea.trim().length < 2 || pArea.trim().length > 80) bad.area = true;
    if (!pYears) bad.years = true;
    if (pLang.length === 0) bad.lang = true;
    if (!pWeekend) bad.weekend = true;
    if (!pUndertaking) bad.undertaking = true;

    setPurohitBadFields(bad);

    const isSpam = pHoneypot !== '' || (Date.now() - openedAtRef.current < 3000);
    const hasError = Object.keys(bad).length > 0;

    if (hasError || isSpam) {
      setPurohitErrorTop(true);
      return;
    }

    setPurohitErrorTop(false);
    setPurohitDone(true);
  };

  // Handle Retail Submit
  const handleRetailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad: Record<string, boolean> = {};

    if (!rBusiness.trim() || rBusiness.trim().length < 2 || rBusiness.trim().length > 120) bad.business = true;
    if (!rPerson.trim() || rPerson.trim().length < 2 || rPerson.trim().length > 80) bad.person = true;
    if (!rPhone.trim() || !isValidPhone(rPhone.trim())) bad.phone = true;
    if (!rEmail.trim() || !isValidEmail(rEmail.trim())) bad.email = true;
    if (!rType) bad.type = true;
    if (!rCity.trim() || rCity.trim().length < 2 || rCity.trim().length > 80) bad.city = true;
    if (rInterest.length === 0) bad.interest = true;

    setRetailBadFields(bad);

    const isSpam = rHoneypot !== '' || (Date.now() - openedAtRef.current < 3000);
    const hasError = Object.keys(bad).length > 0;

    if (hasError || isSpam) {
      setRetailErrorTop(true);
      return;
    }

    setRetailErrorTop(false);
    setRetailDone(true);
  };

  const togglePLang = (langVal: string) => {
    setPLang(prev =>
      prev.includes(langVal) ? prev.filter(l => l !== langVal) : [...prev, langVal]
    );
  };

  const toggleRInterest = (intVal: string) => {
    setRInterest(prev =>
      prev.includes(intVal) ? prev.filter(i => i !== intVal) : [...prev, intVal]
    );
  };

  return (
    <div className="work-with-us-scope">
      {/* <style dangerouslySetInnerHTML={{ __html: MODAL_STYLES }} /> */}

      {/* ═══ SECTION SHELL ═══ */}
      <section className="sec">
        <div className="sec-h">
          <span className="sec-n">10</span>
          <h2 className="sec-t">Work with us</h2>
          <span className="sec-r"></span>
        </div>
        <div className="work">
          <div className="wc">
            <b>Join the Team</b>
            <p>We are small, in Delhi-NCR, and building something that has to be right before it is big. Editorial, operations, design and engineering. If the standard on this page appeals to you more than the pace does, we would like to hear from you.</p>
            <button type="button" className="btn gh" onClick={() => openModal('careers')}>Apply ›</button>
          </div>
          <div className="wc">
            <b>Purohit Network</b>
            <p>For purohits and acharyas across Delhi-NCR who want to perform pujas in full, explain what they are doing, and be paid properly for it.</p>
            <button type="button" className="btn gh" onClick={() => openModal('purohit')}>Apply ›</button>
          </div>
          <div className="wc">
            <b>For Retailers</b>
            <p>For temple shops, samagri retailers, RWAs and institutions who want to stock Tapa kits. Wholesale terms and the current catalogue on request.</p>
            <button type="button" className="btn gh" onClick={() => openModal('retail')}>Enquire ›</button>
          </div>
        </div>
      </section>

      {/* ══════ MODAL 1 · CAREERS ══════ */}
      {activeModal === 'careers' && (
        <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="mod" role="dialog" aria-modal="true" aria-labelledby="t-careers">
            <div className="mod-h">
              <div>
                <p className="mod-ey">JOIN THE TEAM</p>
                <h2 className="mod-t" id="t-careers">Tell us about yourself</h2>
              </div>
              <button type="button" className="mod-x" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {!careersDone ? (
              <form className={`mod-b ${careersBadFields.consent ? 'bad-chk' : ''}`} noValidate onSubmit={handleCareersSubmit}>
                {careersErrorTop && <p className="err-top">Some fields still need attention.</p>}

                <div className={`fld ${careersBadFields.name ? 'bad' : ''}`}>
                  <label htmlFor="c-name">Full name <i>*</i></label>
                  <input
                    ref={firstInputRef as React.RefObject<HTMLInputElement>}
                    id="c-name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    onBlur={() => setCareersBadFields(prev => ({ ...prev, name: !cName.trim() || cName.trim().length < 2 }))}
                  />
                  <span className="err">Please enter your name</span>
                </div>

                <div className="row">
                  <div className={`fld ${careersBadFields.email ? 'bad' : ''}`}>
                    <label htmlFor="c-email">Email <i>*</i></label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      onBlur={() => setCareersBadFields(prev => ({ ...prev, email: !cEmail.trim() || !isValidEmail(cEmail.trim()) }))}
                    />
                    <span className="err">That doesn't look like an email address</span>
                  </div>
                  <div className={`fld ${careersBadFields.phone ? 'bad' : ''}`}>
                    <label htmlFor="c-phone">Phone <i>*</i></label>
                    <input
                      id="c-phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      value={cPhone}
                      onChange={(e) => setCPhone(e.target.value)}
                      onBlur={() => setCareersBadFields(prev => ({ ...prev, phone: !cPhone.trim() || !isValidPhone(cPhone.trim()) }))}
                    />
                    <span className="err">Enter a 10-digit mobile number</span>
                  </div>
                </div>

                <div className="row">
                  <div className={`fld ${careersBadFields.area ? 'bad' : ''}`}>
                    <label htmlFor="c-area">Area of work <i>*</i></label>
                    <select
                      id="c-area"
                      name="area"
                      required
                      value={cArea}
                      onChange={(e) => setCArea(e.target.value)}
                      onBlur={() => setCareersBadFields(prev => ({ ...prev, area: !cArea }))}
                    >
                      <option value="">Select one</option>
                      <option>Editorial</option>
                      <option>Operations</option>
                      <option>Design</option>
                      <option>Engineering</option>
                      <option>Something else</option>
                    </select>
                    <span className="err">Choose an area</span>
                  </div>
                  <div className={`fld ${careersBadFields.city ? 'bad' : ''}`}>
                    <label htmlFor="c-city">Current city <i>*</i></label>
                    <input
                      id="c-city"
                      name="city"
                      type="text"
                      required
                      minLength={2}
                      maxLength={60}
                      value={cCity}
                      onChange={(e) => setCCity(e.target.value)}
                      onBlur={() => setCareersBadFields(prev => ({ ...prev, city: !cCity.trim() || cCity.trim().length < 2 }))}
                    />
                    <span className="err">Which city are you in?</span>
                  </div>
                </div>

                <div className={`fld ${careersBadFields.link ? 'bad' : ''}`}>
                  <label htmlFor="c-link">Portfolio or LinkedIn</label>
                  <input
                    id="c-link"
                    name="link"
                    type="url"
                    placeholder="https://"
                    value={cLink}
                    onChange={(e) => setCLink(e.target.value)}
                    onBlur={() => setCareersBadFields(prev => ({ ...prev, link: cLink.trim() !== '' && !isValidUrl(cLink.trim()) }))}
                  />
                  <span className="err">Check the link</span>
                </div>

                <div className={`fld ${careersBadFields.cv ? 'bad' : ''}`}>
                  <label htmlFor="c-cv">CV <i>*</i></label>
                  <input
                    id="c-cv"
                    name="cv"
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                      setCCv(file);
                      setCareersBadFields(prev => ({ ...prev, cv: !file || file.size > 5 * 1024 * 1024 }));
                    }}
                  />
                  <span className="hint">PDF or Word, under 5 MB</span>
                  <span className="err">PDF or Word, under 5 MB</span>
                </div>

                <label className="chk">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={cConsent}
                    onChange={(e) => {
                      setCConsent(e.target.checked);
                      setCareersBadFields(prev => ({ ...prev, consent: !e.target.checked }));
                    }}
                  />
                  <span>I'm happy for Tapa to keep my details on file for this and future roles.</span>
                </label>
                <span className="err err-chk">Please tick this to continue</span>

                <input
                  type="text"
                  name="website"
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={cHoneypot}
                  onChange={(e) => setCHoneypot(e.target.value)}
                />

                <div className="mod-f">
                  <button type="submit" className="btn">Send application ›</button>
                  <button type="button" className="btn gh" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="done">
                <div className="done-i">✓</div>
                <h3>Thank you — it's with us.</h3>
                <p>We read every application ourselves. If there's a fit, you'll hear from someone on the team within two weeks. If you don't hear back, it isn't a comment on your work — we are a small team and the roles are few.</p>
                <button type="button" className="btn gh" onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ MODAL 2 · PUROHIT (Hindi) ══════ */}
      {activeModal === 'purohit' && (
        <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="mod" role="dialog" aria-modal="true" aria-labelledby="t-purohit">
            <div className="mod-h">
              <div>
                <p className="mod-ey">पुरोहित नेटवर्क</p>
                <h2 className="mod-t hi" id="t-purohit">अपनी जानकारी भरें</h2>
              </div>
              <button type="button" className="mod-x" onClick={closeModal} aria-label="बंद करें">✕</button>
            </div>

            {!purohitDone ? (
              <form className="mod-b hi" noValidate onSubmit={handlePurohitSubmit}>
                {purohitErrorTop && <p className="err-top">कुछ जानकारी अभी बाकी है।</p>}

                <div className={`fld ${purohitBadFields.name ? 'bad' : ''}`}>
                  <label htmlFor="p-name">पूरा नाम <i>*</i></label>
                  <input
                    ref={firstInputRef as React.RefObject<HTMLInputElement>}
                    id="p-name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    onBlur={() => setPurohitBadFields(prev => ({ ...prev, name: !pName.trim() || pName.trim().length < 2 }))}
                  />
                  <span className="err">कृपया अपना नाम लिखें</span>
                </div>

                <div className="row">
                  <div className={`fld ${purohitBadFields.phone ? 'bad' : ''}`}>
                    <label htmlFor="p-phone">फ़ोन / व्हाट्सऐप नंबर <i>*</i></label>
                    <input
                      id="p-phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      inputMode="numeric"
                      maxLength={10}
                      value={pPhone}
                      onChange={(e) => setPPhone(e.target.value)}
                      onBlur={() => setPurohitBadFields(prev => ({ ...prev, phone: !pPhone.trim() || !isValidPhone(pPhone.trim()) }))}
                    />
                    <span className="err">10 अंकों का मोबाइल नंबर लिखें</span>
                  </div>
                  <div className={`fld ${purohitBadFields.email ? 'bad' : ''}`}>
                    <label htmlFor="p-email">ईमेल <span className="opt">(ज़रूरी नहीं)</span></label>
                    <input
                      id="p-email"
                      name="email"
                      type="email"
                      value={pEmail}
                      onChange={(e) => setPEmail(e.target.value)}
                      onBlur={() => setPurohitBadFields(prev => ({ ...prev, email: pEmail.trim() !== '' && !isValidEmail(pEmail.trim()) }))}
                    />
                    <span className="err">ईमेल सही नहीं लग रहा</span>
                  </div>
                </div>

                <div className={`fld ${purohitBadFields.area ? 'bad' : ''}`}>
                  <label htmlFor="p-area">आप किन इलाकों में जा सकते हैं? <i>*</i></label>
                  <input
                    id="p-area"
                    name="area"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="जैसे — द्वारका, जनकपुरी, गुड़गांव"
                    value={pArea}
                    onChange={(e) => setPArea(e.target.value)}
                    onBlur={() => setPurohitBadFields(prev => ({ ...prev, area: !pArea.trim() || pArea.trim().length < 2 }))}
                  />
                  <span className="err">इलाकों के नाम लिखें</span>
                </div>

                <div className="row">
                  <div className={`fld ${purohitBadFields.years ? 'bad' : ''}`}>
                    <label htmlFor="p-yrs">कितने साल से पूजा करा रहे हैं? <i>*</i></label>
                    <select
                      id="p-yrs"
                      name="years"
                      required
                      value={pYears}
                      onChange={(e) => setPYears(e.target.value)}
                      onBlur={() => setPurohitBadFields(prev => ({ ...prev, years: !pYears }))}
                    >
                      <option value="">चुनें</option>
                      <option>5 साल से कम</option>
                      <option>5 से 10 साल</option>
                      <option>10 से 20 साल</option>
                      <option>20 साल से ज़्यादा</option>
                    </select>
                    <span className="err">एक विकल्प चुनें</span>
                  </div>
                  <div className="fld">
                    <label htmlFor="p-guru">शिक्षा किससे ली / परंपरा <span className="opt">(ज़रूरी नहीं)</span></label>
                    <input
                      id="p-guru"
                      name="guru"
                      type="text"
                      maxLength={120}
                      value={pGuru}
                      onChange={(e) => setPGuru(e.target.value)}
                    />
                  </div>
                </div>

                <fieldset className={`fld ${purohitBadFields.lang ? 'bad' : ''}`}>
                  <legend>आप कौन सी भाषाएँ बोलते हैं? <i>*</i></legend>
                  <div className="chks">
                    {['हिंदी', 'संस्कृत', 'अंग्रेज़ी', 'पंजाबी', 'बंगाली', 'अन्य'].map((langItem) => (
                      <label key={langItem} className="chk sm">
                        <input
                          type="checkbox"
                          name="lang"
                          value={langItem}
                          checked={pLang.includes(langItem)}
                          onChange={() => togglePLang(langItem)}
                        />
                        <span>{langItem}</span>
                      </label>
                    ))}
                  </div>
                  <span className="err">कम से कम एक भाषा चुनें</span>
                </fieldset>

                <fieldset className={`fld ${purohitBadFields.weekend ? 'bad' : ''}`}>
                  <legend>क्या आप शनिवार–रविवार उपलब्ध रहते हैं? <i>*</i></legend>
                  <div className="chks">
                    {['हाँ', 'नहीं', 'देखकर बता सकते हैं'].map((wkndOption) => (
                      <label key={wkndOption} className="chk sm">
                        <input
                          type="radio"
                          name="weekend"
                          value={wkndOption}
                          checked={pWeekend === wkndOption}
                          onChange={(e) => {
                            setPWeekend(e.target.value);
                            setPurohitBadFields(prev => ({ ...prev, weekend: false }));
                          }}
                        />
                        <span>{wkndOption}</span>
                      </label>
                    ))}
                  </div>
                  <span className="err">एक विकल्प चुनें</span>
                </fieldset>

                <div className={`vachan ${purohitBadFields.undertaking ? 'bad' : ''}`}>
                  <p className="vachan-h">वचन</p>
                  <label className="chk">
                    <input
                      type="checkbox"
                      name="undertaking"
                      required
                      checked={pUndertaking}
                      onChange={(e) => {
                        setPUndertaking(e.target.checked);
                        setPurohitBadFields(prev => ({ ...prev, undertaking: !e.target.checked }));
                      }}
                    />
                    <span>मैं हर पूजा पूरी विधि से कराऊँगा। पूछे जाने पर विधि समझाऊँगा। और किसी परिवार से यह कभी नहीं कहूँगा कि कुछ कम रह गया है, कुछ और ज़रूरी है, या कुछ अशुभ हो जाएगा।</span>
                  </label>
                  <span className="err err-chk">आगे बढ़ने के लिए यह ज़रूरी है</span>
                </div>

                <input
                  type="text"
                  name="website"
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={pHoneypot}
                  onChange={(e) => setPHoneypot(e.target.value)}
                />

                <div className="mod-f">
                  <button type="submit" className="btn">जानकारी भेजें ›</button>
                  <button type="button" className="btn gh" onClick={closeModal}>रहने दें</button>
                </div>
              </form>
            ) : (
              <div className="done hi">
                <div className="done-i">✓</div>
                <h3>धन्यवाद — आपकी जानकारी हमें मिल गई।</h3>
                <p>हमारी टीम सात दिन के भीतर आपसे फ़ोन पर बात करेगी। बातचीत के बाद एक बार आपसे मिलकर ही आगे की बात तय होगी।</p>
                <button type="button" className="btn gh" onClick={closeModal}>बंद करें</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ MODAL 3 · RETAILERS ══════ */}
      {activeModal === 'retail' && (
        <div className="ov" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="mod" role="dialog" aria-modal="true" aria-labelledby="t-retail">
            <div className="mod-h">
              <div>
                <p className="mod-ey">FOR RETAILERS</p>
                <h2 className="mod-t" id="t-retail">Stock Tapa kits</h2>
              </div>
              <button type="button" className="mod-x" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {!retailDone ? (
              <form className="mod-b" noValidate onSubmit={handleRetailSubmit}>
                {retailErrorTop && <p className="err-top">Some fields still need attention.</p>}

                <div className="row">
                  <div className={`fld ${retailBadFields.business ? 'bad' : ''}`}>
                    <label htmlFor="r-biz">Business name <i>*</i></label>
                    <input
                      ref={firstInputRef as React.RefObject<HTMLInputElement>}
                      id="r-biz"
                      name="business"
                      type="text"
                      required
                      minLength={2}
                      maxLength={120}
                      value={rBusiness}
                      onChange={(e) => setRBusiness(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, business: !rBusiness.trim() || rBusiness.trim().length < 2 }))}
                    />
                    <span className="err">Please enter the business name</span>
                  </div>
                  <div className={`fld ${retailBadFields.person ? 'bad' : ''}`}>
                    <label htmlFor="r-person">Contact person <i>*</i></label>
                    <input
                      id="r-person"
                      name="person"
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      value={rPerson}
                      onChange={(e) => setRPerson(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, person: !rPerson.trim() || rPerson.trim().length < 2 }))}
                    />
                    <span className="err">Who should we speak to?</span>
                  </div>
                </div>

                <div className="row">
                  <div className={`fld ${retailBadFields.phone ? 'bad' : ''}`}>
                    <label htmlFor="r-phone">Phone <i>*</i></label>
                    <input
                      id="r-phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      value={rPhone}
                      onChange={(e) => setRPhone(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, phone: !rPhone.trim() || !isValidPhone(rPhone.trim()) }))}
                    />
                    <span className="err">Enter a 10-digit mobile number</span>
                  </div>
                  <div className={`fld ${retailBadFields.email ? 'bad' : ''}`}>
                    <label htmlFor="r-email">Email <i>*</i></label>
                    <input
                      id="r-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={rEmail}
                      onChange={(e) => setREmail(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, email: !rEmail.trim() || !isValidEmail(rEmail.trim()) }))}
                    />
                    <span className="err">That doesn't look like an email address</span>
                  </div>
                </div>

                <div className="row">
                  <div className={`fld ${retailBadFields.type ? 'bad' : ''}`}>
                    <label htmlFor="r-type">Business type <i>*</i></label>
                    <select
                      id="r-type"
                      name="type"
                      required
                      value={rType}
                      onChange={(e) => setRType(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, type: !rType }))}
                    >
                      <option value="">Select one</option>
                      <option>Temple shop</option>
                      <option>Puja samagri retailer</option>
                      <option>General store / kirana</option>
                      <option>RWA or society</option>
                      <option>Institution</option>
                      <option>Other</option>
                    </select>
                    <span className="err">Choose a type</span>
                  </div>
                  <div className={`fld ${retailBadFields.city ? 'bad' : ''}`}>
                    <label htmlFor="r-city">City / locality <i>*</i></label>
                    <input
                      id="r-city"
                      name="city"
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      value={rCity}
                      onChange={(e) => setRCity(e.target.value)}
                      onBlur={() => setRetailBadFields(prev => ({ ...prev, city: !rCity.trim() || rCity.trim().length < 2 }))}
                    />
                    <span className="err">Which locality?</span>
                  </div>
                </div>

                <fieldset className={`fld ${retailBadFields.interest ? 'bad' : ''}`}>
                  <legend>Interested in <i>*</i></legend>
                  <div className="chks">
                    {['Festive kits', 'All-year kits', 'Diya range', 'Full catalogue'].map((interestItem) => (
                      <label key={interestItem} className="chk sm">
                        <input
                          type="checkbox"
                          name="interest"
                          value={interestItem}
                          checked={rInterest.includes(interestItem)}
                          onChange={() => toggleRInterest(interestItem)}
                        />
                        <span>{interestItem}</span>
                      </label>
                    ))}
                  </div>
                  <span className="err">Select at least one</span>
                </fieldset>

                <div className="fld">
                  <label htmlFor="r-vol">Expected monthly volume <span className="opt">(optional)</span></label>
                  <select
                    id="r-vol"
                    name="volume"
                    value={rVolume}
                    onChange={(e) => setRVolume(e.target.value)}
                  >
                    <option value="">Select one</option>
                    <option>Under 25 units</option>
                    <option>25 – 100 units</option>
                    <option>100 – 500 units</option>
                    <option>Over 500 units</option>
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="r-notes">Anything else <span className="opt">(optional)</span></label>
                  <textarea
                    id="r-notes"
                    name="notes"
                    rows={3}
                    maxLength={600}
                    value={rNotes}
                    onChange={(e) => setRNotes(e.target.value)}
                  ></textarea>
                </div>

                <input
                  type="text"
                  name="website"
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={rHoneypot}
                  onChange={(e) => setRHoneypot(e.target.value)}
                />

                <div className="mod-f">
                  <button type="submit" className="btn">Send enquiry ›</button>
                  <button type="button" className="btn gh" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="done">
                <div className="done-i">✓</div>
                <h3>Thank you — we have your enquiry.</h3>
                <p>Someone from the team will call within three working days with wholesale terms, minimum order quantities and the current season's catalogue.</p>
                <button type="button" className="btn gh" onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
