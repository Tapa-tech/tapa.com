import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';

const observer = new Observer(28.6139, 77.2090, 216); // Delhi lat/lng/elevation

const testDates = [
    { label: 'Ganesh Chaturthi (should be Chaturthi)', date: new Date('2026-09-14') },
    { label: 'Raksha Bandhan (should be Purnima)', date: new Date('2026-07-28') },
    { label: 'Diwali (should be Amavasya)', date: new Date('2026-11-08') },
    { label: 'Aja Ekadashi (should be Ekadashi)', date: new Date('2026-09-08') },
];

for (const t of testDates) {
    const result = getPanchangam(t.date, observer);
    console.log(`\n=== ${t.label} ===`);
    console.log('tithi (number):', result.tithi);
    console.log('nakshatra (number):', result.nakshatra);
    console.log('full result:', JSON.stringify(result, null, 2));
}