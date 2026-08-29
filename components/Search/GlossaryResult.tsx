'use client';

import React from 'react';
import Link from 'next/link';

export interface GlossaryDefinition {
  title: string;
  devanagari?: string;
  pronunciation?: string;
  tags?: string[];
  definition: string;
  appearsIn?: Array<{ name: string; url: string }>;
  glossaryUrl?: string;
}

interface GlossaryResultProps {
  data: GlossaryDefinition;
}

export const GlossaryResult: React.FC<GlossaryResultProps> = ({ data }) => {
  return (
    <div className="tapa-gans">
      <div className="tapa-ga-h">DEFINITION · FROM THE GLOSSARY</div>
      <div className="tapa-ga-b">
        <div className="tapa-ga-t">{data.title}</div>
        {data.devanagari && <div className="tapa-ga-dev">{data.devanagari}</div>}
        
        <div className="tapa-ga-m">
          {data.pronunciation && <span className="tapa-ga-say">{data.pronunciation}</span>}
          {data.pronunciation && data.tags && data.tags.length > 0 && <span className="tapa-ga-dot">·</span>}
          {data.tags?.map((t) => (
            <span key={t} className="tapa-ga-tag">{t}</span>
          ))}
        </div>

        <p className="tapa-ga-d">{data.definition}</p>

        {((data.appearsIn && data.appearsIn.length > 0) || data.glossaryUrl) && (
          <div className="tapa-ga-f">
            {data.appearsIn && data.appearsIn.length > 0 && (
              <>
                <span className="tapa-ga-l">APPEARS IN</span>
                {data.appearsIn.map((item) => (
                  <Link key={item.name} href={item.url} className="tapa-ga-a">
                    {item.name}
                  </Link>
                ))}
              </>
            )}
            <Link href={data.glossaryUrl || `/glossary#${data.title.toLowerCase()}`} className="tapa-ga-a c">
              Open the glossary ›
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
