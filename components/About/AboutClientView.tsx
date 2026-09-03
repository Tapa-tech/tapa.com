'use client';

import React from 'react';
import WorkWithUsForms from '@/components/WorkWithUs/WorkWithUsForms';
import { AboutPageFullData } from '@/lib/about-store';
import '@/app/about/about.css';

function SectionHeader({ number, title }: { number: string; title: React.ReactNode }) {
  return (
    <div className="sec-h">
      <span className="sec-n">{number}</span>
      <h2 className="sec-t">{title}</h2>
      <span className="sec-r"></span>
    </div>
  );
}

function SourceRow({ source, score }: { source: string; score: string }) {
  return (
    <tr>
      <td>{source}</td>
      <td className="sc">{score}</td>
    </tr>
  );
}

function Point({ title, description }: { title: string; description: string }) {
  return (
    <div className="pt">
      <span className="pt-k"></span>
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ValueRow({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="vrow">
      <span className="vn">{number}</span>
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

function CircleStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="st">
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function AboutClientView({ aboutData }: { aboutData: AboutPageFullData }) {
  return (
    <>
      <section className="ahero">
        <div className="film">
          <img className="film-logo" src={aboutData.filmLogo} alt="तप्" />
          <div className="film-spec">{aboutData.filmSpec}</div>
        </div>
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="ahero-in px-4 md:px-0">
            <p className="ah-ey">{aboutData.heroEyebrow}</p>
            <h1 className="ah-h1">{aboutData.heroTitle}</h1>
            <p className="ah-stand">{aboutData.heroStandfirst}</p>
            <p className="ah-p">{aboutData.heroParagraph1}</p>
            <p className="ah-p">{aboutData.heroParagraph2}</p>
            <p className="ah-pull">{aboutData.heroPullQuote}</p>
          </div>
        </div>
      </section>
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
        <section className="sec">
          <SectionHeader number={aboutData.whySectionNumber || '3'} title={<>Why <span className="dev">{aboutData.whyTitleDevanagari || 'तप्'}</span></>} />
          <div className="col">
            <div>
              <div className="pane">
                <p><span className="dev" style={{ fontSize: '19px', color: 'var(--gold)' }}>{aboutData.whyTitleDevanagari || 'तप्'}</span> — {aboutData.whyDevanagariDesc}</p>
                <p>{aboutData.whyParagraph2}</p>
              </div>

              <details className="tray">
                <summary>
                  <img className="tr-av" src={aboutData.founderAvatar} alt={aboutData.founderName} />
                  <span>{aboutData.founderTrayTitle}</span>
                  <span className="tr-x">▼</span>
                </summary>
                <div className="tr-body">
                  <div className="letter">
                    <div className="lt-head">
                      <img className="lt-port" src={aboutData.founderAvatar} alt={aboutData.founderName} />
                      <div className="lt-who">
                        <b>{aboutData.founderName}</b>
                        <span>{aboutData.founderDesignation}</span>
                      </div>
                    </div>
                    <div className="lt">
                      <h3>{aboutData.founderLetterTitle}</h3>
                      <p>{aboutData.founderLetterP1}</p>
                      <p>{aboutData.founderLetterP2}</p>
                      <p>{aboutData.founderLetterP3}</p>
                      <p>{aboutData.founderLetterP4}</p>
                      <p>{aboutData.founderLetterP5}</p>

                      <figure>
                        <img src={aboutData.founderFamilyImage} alt={aboutData.founderFamilyCaption} />
                        <figcaption>{aboutData.founderFamilyCaption}</figcaption>
                      </figure>

                      <div className="lt-pull">
                        {aboutData.founderPullQuote1}
                      </div>

                      <p>{aboutData.founderLetterP6}</p>

                      <p>Dharma does not require fear to survive. It requires clarity.</p>

                      <p>{aboutData.founderLetterP8}</p>

                      <div className="sig">
                        <b>{aboutData.founderSignatureName}</b>
                        <span>{aboutData.founderSignatureTitle}</span>
                        <i>{aboutData.founderSignatureCompany}</i>
                      </div>

                      <div className="lt-pull" style={{ margin: '24px 0 18px' }}>
                        {aboutData.founderPullQuote2}
                      </div>

                      <p>{aboutData.founderLetterP9}</p>
                      <p>{aboutData.founderLetterP10}</p>

                      <div className="vals">
                        <div className="vals-h">{aboutData.coreValuesHeading}</div>
                        <div className="vals-sub">{aboutData.coreValuesSubtitle}</div>
                        <p className="vals-p">{aboutData.coreValuesIntro}</p>
                        {aboutData.coreValues.map((v, idx) => (
                          <ValueRow key={v.id || idx} number={v.number} title={v.title} description={v.description} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number={aboutData.editorialSectionNumber || '4'} title={aboutData.editorialTitle} />
          <div className="col">
            <div className="pane">
              <p className="stand">{aboutData.editorialStandfirst}</p>

              <div className="dpb">
                <div className="d">
                  <b>{aboutData.editorialDharmaTitle}</b>
                  <i>{aboutData.editorialDharmaSub}</i>
                  <p>{aboutData.editorialDharmaDesc}</p>
                </div>
                <div className="p">
                  <b>{aboutData.editorialPrathaTitle}</b>
                  <i>{aboutData.editorialPrathaSub}</i>
                  <p>{aboutData.editorialPrathaDesc}</p>
                </div>
                <div className="b">
                  <b>{aboutData.editorialBhrantiTitle}</b>
                  <i>{aboutData.editorialBhrantiSub}</i>
                  <p>{aboutData.editorialBhrantiDesc}</p>
                </div>
              </div>

              <div className="rulebox">
                <p>One rule holds the whole system up: <b>{aboutData.editorialRuleText}</b></p>
                <span>{aboutData.editorialConsensusText}</span>
              </div>

              <p>{aboutData.editorialSeparatedText}</p>

              <h3>{aboutData.editorialWeighTitle}</h3>
              <p>{aboutData.editorialWeighP1}</p>

              <div className="overflow-x-auto w-full max-w-full">
                <table className="stab min-w-[400px] md:min-w-full">
                  <thead>
                    <tr>
                      <th>SOURCE</th>
                      <th>SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aboutData.editorialSources.map((s, idx) => (
                      <SourceRow key={s.id || idx} source={s.source} score={s.score} />
                    ))}
                  </tbody>
                </table>
              </div>

              <p>{aboutData.editorialWeighP2}</p>
              <a href={aboutData.editorialCtaUrl} className="btn">{aboutData.editorialCtaText}</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number={aboutData.glossarySectionNumber || '5'} title={aboutData.glossaryTitle} />
          <div className="col">
            <div className="pane">
              <p className="stand">{aboutData.glossaryStandfirst}</p>
              <p>{aboutData.glossaryParagraph1}</p>
              <p>{aboutData.glossaryParagraph2}</p>
              <a href={aboutData.glossaryCtaUrl} className="btn gh">{aboutData.glossaryCtaText}</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number={aboutData.kitsSectionNumber || '7'} title={aboutData.kitsTitle} />
          <div className="col">
            <div className="pane">
              <p className="stand" style={{ color: 'var(--pink)' }}>{aboutData.kitsStandfirst}</p>
              <p>{aboutData.kitsParagraph1}</p>
              <p>{aboutData.kitsParagraph2}</p>

              <h3>{aboutData.kitsHeading}</h3>
              <div className="pts">
                {aboutData.kitPoints.map((pt, idx) => (
                  <Point key={pt.id || idx} title={pt.title} description={pt.description} />
                ))}
              </div>

              <div className="note">{aboutData.kitsNote}</div>
              <a href={aboutData.kitsCtaUrl} className="btn">{aboutData.kitsCtaText}</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number={aboutData.purohitSectionNumber || '8'} title={<>{aboutData.purohitTitle} <span className="chip soon">{aboutData.purohitChipText}</span></>} />
          <div className="col">
            <div className="pane">
              <p>{aboutData.purohitParagraph}</p>

              <h3>{aboutData.purohitBookingHeading}</h3>
              <div className="pts">
                {aboutData.purohitBookingPoints.map((pt, idx) => (
                  <Point key={pt.id || idx} title={pt.title} description={pt.description} />
                ))}
              </div>

              <h3>{aboutData.purohitArrangeHeading}</h3>
              <div className="pts">
                {aboutData.purohitArrangementPoints.map((pt, idx) => (
                  <Point key={pt.id || idx} title={pt.title} description={pt.description} />
                ))}
              </div>

              <h3>{aboutData.purohitNotHappenHeading}</h3>
              <p>{aboutData.purohitNotHappenDesc}</p>
              <button type="button" className="btn gh">{aboutData.purohitNotifyCtaText}</button>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number={aboutData.circleSectionNumber || '9'} title={<>{aboutData.circleTitle} <span className="chip">{aboutData.circlePriceChip}</span></>} />
          <div className="col">
            <div>
              <div className="pane">
                <p className="stand">{aboutData.circleStandfirst}</p>
                <p>{aboutData.circleParagraph1}</p>
                <p>{aboutData.circleParagraph2}</p>
              </div>

              <details className="tray">
                <summary>
                  <span>{aboutData.circleTrayTitle}</span>
                  <span className="tr-x">▼</span>
                </summary>
                <div className="tr-body">
                  <div className="steps" style={{ paddingTop: '14px' }}>
                    {aboutData.circleSteps.map((st, idx) => (
                      <CircleStep key={st.id || idx} title={st.title} description={st.description} />
                    ))}
                  </div>
                  <div className="note">{aboutData.circleLeavingNote}</div>
                </div>
              </details>

              <button type="button" className="btn wa" style={{ marginTop: '14px' }}>{aboutData.circleJoinCtaText}</button>
            </div>
          </div>
        </section>
        <WorkWithUsForms />
        <div className="close">
          <div className="close-in">
            <div className="close-l">{aboutData.closingLabel}</div>
            <p className="close-pre">{aboutData.closingPreText}</p>
            <p className="close-t">{aboutData.closingText}</p>
            <img className="close-logo" src={aboutData.closingLogo} alt="तप्" />
          </div>
        </div>
      </div>
    </>
  );
}
