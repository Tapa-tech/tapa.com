export interface ObservanceItem {
  id: string;
  day: number;
  month: string; // 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  monthIndex: number; // 0 to 11
  year: number; // 2026
  weekday: string;
  name: string;
  note?: string;
  category: 'Ekadashi' | 'Pradosh' | 'Chaturthi' | 'Purnima' | 'Amavasya' | 'Festival' | 'Other';
  tithi: string;
  guideSlug?: string;
}

export const MONTH_NAMES: Array<{ short: string; full: string; vedic: string }> = [
  { short: 'Jan', full: 'JANUARY 2026', vedic: 'Pausha into Magha' },
  { short: 'Feb', full: 'FEBRUARY 2026', vedic: 'Magha into Phalguna' },
  { short: 'Mar', full: 'MARCH 2026', vedic: 'Phalguna into Chaitra' },
  { short: 'Apr', full: 'APRIL 2026', vedic: 'Chaitra into Vaisakha' },
  { short: 'May', full: 'MAY 2026', vedic: 'Vaisakha into Jyeshtha' },
  { short: 'Jun', full: 'JUNE 2026', vedic: 'Jyeshtha into Ashadha' },
  { short: 'Jul', full: 'JULY 2026', vedic: 'Ashadha into Shravana' },
  { short: 'Aug', full: 'AUGUST 2026', vedic: 'Shravana into Bhadrapada' },
  { short: 'Sep', full: 'SEPTEMBER 2026', vedic: 'Bhadrapada into Ashwin' },
  { short: 'Oct', full: 'OCTOBER 2026', vedic: 'Ashwin into Kartika' },
  { short: 'Nov', full: 'NOVEMBER 2026', vedic: 'Kartika into Margashirsha' },
  { short: 'Dec', full: 'DECEMBER 2026', vedic: 'Margashirsha into Pausha' },
];

export const VRAT_CALENDAR_2026: ObservanceItem[] = [
  // JANUARY 2026
  { id: 'jan-1', day: 1, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Thursday', name: 'Pausha Putrada Ekadashi', note: 'Fast for offspring and wellbeing', category: 'Ekadashi', tithi: 'Pausha Shukla Ekadashi', guideSlug: 'putrada-ekadashi' },
  { id: 'jan-3', day: 3, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Saturday', name: 'Pausha Purnima', note: 'Holy dip and charity', category: 'Purnima', tithi: 'Pausha Purnima' },
  { id: 'jan-6', day: 6, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Tuesday', name: 'Sakat Chauth', note: 'Sankashti Chaturthi for children', category: 'Chaturthi', tithi: 'Magha Krishna Chaturthi' },
  { id: 'jan-14', day: 14, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Wednesday', name: 'Makar Sankranti', note: 'Sun enters Capricorn · Holy bathing', category: 'Festival', tithi: 'Magha Krishna Ekadashi' },
  { id: 'jan-15', day: 15, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Thursday', name: 'Shattila Ekadashi', note: 'Six uses of sesame seeds', category: 'Ekadashi', tithi: 'Magha Krishna Ekadashi' },
  { id: 'jan-17', day: 17, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Saturday', name: 'Mauni Amavasya', note: 'Silent fast and ancestor tarpan', category: 'Amavasya', tithi: 'Magha Amavasya' },
  { id: 'jan-23', day: 23, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Friday', name: 'Vasant Panchami', note: 'Saraswati Puja · Spring onset', category: 'Festival', tithi: 'Magha Shukla Panchami' },
  { id: 'jan-29', day: 29, month: 'Jan', monthIndex: 0, year: 2026, weekday: 'Thursday', name: 'Jaya Ekadashi', note: 'Freedom from lower rebirths', category: 'Ekadashi', tithi: 'Magha Shukla Ekadashi' },

  // FEBRUARY 2026
  { id: 'feb-2', day: 2, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Monday', name: 'Magha Purnima', note: 'Magh Snan conclusion', category: 'Purnima', tithi: 'Magha Purnima' },
  { id: 'feb-5', day: 5, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Thursday', name: 'Dwijapriya Sankashti Chaturthi', note: 'Evening moonrise puja', category: 'Chaturthi', tithi: 'Phalguna Krishna Chaturthi' },
  { id: 'feb-13', day: 13, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Friday', name: 'Vijaya Ekadashi', note: 'Vrat for victory over obstacles', category: 'Ekadashi', tithi: 'Phalguna Krishna Ekadashi' },
  { id: 'feb-15', day: 15, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Sunday', name: 'Maha Shivratri', note: 'Nishita Kaal Shiva puja & jagran', category: 'Festival', tithi: 'Phalguna Krishna Chaturdashi', guideSlug: 'mahashivratri' },
  { id: 'feb-17', day: 17, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Tuesday', name: 'Phalguna Amavasya', note: 'Pitru tarpan & charity', category: 'Amavasya', tithi: 'Phalguna Amavasya' },
  { id: 'feb-27', day: 27, month: 'Feb', monthIndex: 1, year: 2026, weekday: 'Friday', name: 'Amalaki Ekadashi', note: 'Puja under Amla tree', category: 'Ekadashi', tithi: 'Phalguna Shukla Ekadashi' },

  // MARCH 2026
  { id: 'mar-3', day: 3, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Tuesday', name: 'Holika Dahan', note: 'Evening bonfire ceremony', category: 'Festival', tithi: 'Phalguna Purnima' },
  { id: 'mar-4', day: 4, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Wednesday', name: 'Holi / Dhulandi', note: 'Festival of colours', category: 'Festival', tithi: 'Chaitra Krishna Pratipada' },
  { id: 'mar-7', day: 7, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Saturday', name: 'Bhalachandra Sankashti', note: 'Ganesha moonrise puja', category: 'Chaturthi', tithi: 'Chaitra Krishna Chaturthi' },
  { id: 'mar-14', day: 14, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Saturday', name: 'Papmochani Ekadashi', note: 'Cleansing of past karma', category: 'Ekadashi', tithi: 'Chaitra Krishna Ekadashi' },
  { id: 'mar-19', day: 19, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Thursday', name: 'Chaitra Navratri Begins', note: 'Ghatasthapana · Ugadi / Gudi Padwa', category: 'Festival', tithi: 'Chaitra Shukla Pratipada' },
  { id: 'mar-27', day: 27, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Friday', name: 'Rama Navami', note: 'Birth of Lord Rama', category: 'Festival', tithi: 'Chaitra Shukla Navami' },
  { id: 'mar-29', day: 29, month: 'Mar', monthIndex: 2, year: 2026, weekday: 'Sunday', name: 'Kamada Ekadashi', note: 'Fulfillment of righteous desires', category: 'Ekadashi', tithi: 'Chaitra Shukla Ekadashi' },

  // APRIL 2026
  { id: 'apr-2', day: 2, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Thursday', name: 'Hanuman Jayanti', note: 'Chaitra Purnima · Sundarkand path', category: 'Festival', tithi: 'Chaitra Purnima', guideSlug: 'hanuman-chalisa' },
  { id: 'apr-5', day: 5, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Sunday', name: 'Vikat Sankashti Chaturthi', note: 'Moonrise fast', category: 'Chaturthi', tithi: 'Vaisakha Krishna Chaturthi' },
  { id: 'apr-13', day: 13, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Monday', name: 'Varuthini Ekadashi', note: 'Protection and good fortune', category: 'Ekadashi', tithi: 'Vaisakha Krishna Ekadashi' },
  { id: 'apr-15', day: 15, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Wednesday', name: 'Pradosh Vrat', note: 'Evening Shiva Abhishekam', category: 'Pradosh', tithi: 'Vaisakha Krishna Trayodashi' },
  { id: 'apr-19', day: 19, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Sunday', name: 'Akshaya Tritiya', note: 'Unending auspiciousness · Gold buying', category: 'Festival', tithi: 'Vaisakha Shukla Tritiya' },
  { id: 'apr-28', day: 28, month: 'Apr', monthIndex: 3, year: 2026, weekday: 'Tuesday', name: 'Mohini Ekadashi', note: 'Illusion dispelling vrat', category: 'Ekadashi', tithi: 'Vaisakha Shukla Ekadashi' },

  // MAY 2026
  { id: 'may-1', day: 1, month: 'May', monthIndex: 4, year: 2026, weekday: 'Friday', name: 'Buddha Purnima', note: 'Vaisakha Purnima · Bathing & charity', category: 'Purnima', tithi: 'Vaisakha Purnima' },
  { id: 'may-5', day: 5, month: 'May', monthIndex: 4, year: 2026, weekday: 'Tuesday', name: 'Ekadanta Sankashti Chaturthi', note: 'Evening moonrise prayer', category: 'Chaturthi', tithi: 'Jyeshtha Krishna Chaturthi' },
  { id: 'may-13', day: 13, month: 'May', monthIndex: 4, year: 2026, weekday: 'Wednesday', name: 'Apara Ekadashi', note: 'Immense merit and forgiveness', category: 'Ekadashi', tithi: 'Jyeshtha Krishna Ekadashi' },
  { id: 'may-15', day: 15, month: 'May', monthIndex: 4, year: 2026, weekday: 'Friday', name: 'Pradosh Vrat', note: 'Shiva puja in twilight', category: 'Pradosh', tithi: 'Jyeshtha Krishna Trayodashi' },
  { id: 'may-17', day: 17, month: 'May', monthIndex: 4, year: 2026, weekday: 'Sunday', name: 'Vat Savitri Vrat', note: 'Banyan tree puja by married women', category: 'Festival', tithi: 'Jyeshtha Amavasya' },
  { id: 'may-25', day: 25, month: 'May', monthIndex: 4, year: 2026, weekday: 'Monday', name: 'Ganga Dussehra', note: 'Descent of Holy Ganga river', category: 'Festival', tithi: 'Jyeshtha Shukla Dashami' },
  { id: 'may-27', day: 27, month: 'May', monthIndex: 4, year: 2026, weekday: 'Wednesday', name: 'Nirjala Ekadashi', note: 'Waterless fast · Most sacred Ekadashi', category: 'Ekadashi', tithi: 'Jyeshtha Shukla Ekadashi' },

  // JUNE 2026
  { id: 'jun-3', day: 3, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Wednesday', name: 'Krishnapingala Sankashti', note: 'Ganesha moonrise vrat', category: 'Chaturthi', tithi: 'Ashadha Krishna Chaturthi' },
  { id: 'jun-11', day: 11, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Thursday', name: 'Yogini Ekadashi', note: 'Relief from physical ailments', category: 'Ekadashi', tithi: 'Ashadha Krishna Ekadashi' },
  { id: 'jun-14', day: 14, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Sunday', name: 'Pradosh Vrat', note: 'Evening Shiva worship', category: 'Pradosh', tithi: 'Ashadha Krishna Trayodashi' },
  { id: 'jun-16', day: 16, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Tuesday', name: 'Jagannath Rath Yatra', note: 'Puri Rath Yatra begins', category: 'Festival', tithi: 'Ashadha Shukla Dwitiya' },
  { id: 'jun-25', day: 25, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Thursday', name: 'Devshayani Ekadashi', note: 'Chaturmas begins · Vishnu slumbers', category: 'Ekadashi', tithi: 'Ashadha Shukla Ekadashi' },
  { id: 'jun-29', day: 29, month: 'Jun', monthIndex: 5, year: 2026, weekday: 'Monday', name: 'Guru Purnima', note: 'Ashadha Purnima · Guru worship', category: 'Purnima', tithi: 'Ashadha Purnima' },

  // JULY 2026
  { id: 'jul-3', day: 3, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Friday', name: 'Gajanana Sankashti Chaturthi', note: 'Moonrise fast', category: 'Chaturthi', tithi: 'Shravana Krishna Chaturthi' },
  { id: 'jul-10', day: 10, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Friday', name: 'Kamika Ekadashi', note: 'Shravan month Vishnu worship', category: 'Ekadashi', tithi: 'Shravana Krishna Ekadashi' },
  { id: 'jul-13', day: 13, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Monday', name: 'Shravan Somwar Vrat', note: 'First Monday Shiva Abhishekam', category: 'Festival', tithi: 'Shravana Krishna Amavasya' },
  { id: 'jul-16', day: 16, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Thursday', name: 'Hariyali Teej', note: 'Green canopy swing festival', category: 'Festival', tithi: 'Shravana Shukla Tritiya' },
  { id: 'jul-18', day: 18, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Saturday', name: 'Nag Panchami', note: 'Serpent deity worship', category: 'Festival', tithi: 'Shravana Shukla Panchami' },
  { id: 'jul-25', day: 25, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Saturday', name: 'Shravana Putrada Ekadashi', note: 'Fast for family lineage', category: 'Ekadashi', tithi: 'Shravana Shukla Ekadashi' },
  { id: 'jul-28', day: 28, month: 'Jul', monthIndex: 6, year: 2026, weekday: 'Tuesday', name: 'Raksha Bandhan', note: 'Shravan Purnima · Sacred thread', category: 'Festival', tithi: 'Shravana Purnima', guideSlug: 'raksha-bandhan' },

  // AUGUST 2026
  { id: 'aug-1', day: 1, month: 'Aug', monthIndex: 7, year: 2026, weekday: 'Saturday', name: 'Vibhuvana Sankashti Chaturthi', note: 'Evening moonrise prayer', category: 'Chaturthi', tithi: 'Bhadrapada Krishna Chaturthi' },
  { id: 'aug-9', day: 9, month: 'Aug', monthIndex: 7, year: 2026, weekday: 'Sunday', name: 'Aja Ekadashi', note: 'Grain avoidance from sunrise to parana', category: 'Ekadashi', tithi: 'Bhadrapada Krishna Ekadashi', guideSlug: 'aja-ekadashi' },
  { id: 'aug-11', day: 11, month: 'Aug', monthIndex: 7, year: 2026, weekday: 'Tuesday', name: 'Pradosh Vrat', note: 'Evening Shiva puja', category: 'Pradosh', tithi: 'Bhadrapada Krishna Trayodashi' },
  { id: 'aug-24', day: 24, month: 'Aug', monthIndex: 7, year: 2026, weekday: 'Monday', name: 'Pavitropana Ekadashi', note: 'Thread offering to Vishnu', category: 'Ekadashi', tithi: 'Bhadrapada Shukla Ekadashi' },
  { id: 'aug-28', day: 28, month: 'Aug', monthIndex: 7, year: 2026, weekday: 'Friday', name: 'Bhadrapada Purnima', note: 'Start of ancestor offerings', category: 'Purnima', tithi: 'Bhadrapada Purnima' },

  // SEPTEMBER 2026 (Matches Screenshot Exactly)
  { id: 'sep-2', day: 2, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Wednesday', name: 'Sankashti Chaturthi', note: 'Moonrise required to break the fast', category: 'Chaturthi', tithi: 'Bhadrapada Krishna Chaturthi' },
  { id: 'sep-4', day: 4, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Friday', name: 'Krishna Janmashtami', note: 'Smarta observance · Nishita Kaal', category: 'Festival', tithi: 'Bhadrapada Krishna Ashtami' },
  { id: 'sep-8', day: 8, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Tuesday', name: 'Aja Ekadashi', note: 'Grain avoidance · parana next morning', category: 'Ekadashi', tithi: 'Bhadrapada Krishna Ekadashi', guideSlug: 'aja-ekadashi' },
  { id: 'sep-9', day: 9, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Wednesday', name: 'Pradosh Vrat', note: 'Bhauma-adjacent · evening Shiva puja', category: 'Pradosh', tithi: 'Bhadrapada Krishna Trayodashi' },
  { id: 'sep-11', day: 11, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Friday', name: 'Amavasya', note: 'Pithori Amavasya · Shraddha observed', category: 'Amavasya', tithi: 'Bhadrapada Amavasya' },
  { id: 'sep-13', day: 13, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Sunday', name: 'Hartalika Teej', note: 'Sand Shivalinga · night vigil', category: 'Festival', tithi: 'Bhadrapada Shukla Tritiya', guideSlug: 'hartalika-teej' },
  { id: 'sep-14', day: 14, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Monday', name: 'Ganesh Chaturthi', note: 'Prana pratishtha · Madhyahna muhurat', category: 'Chaturthi', tithi: 'Bhadrapada Shukla Chaturthi', guideSlug: 'ganesh-chaturthi' },
  { id: 'sep-19', day: 19, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Saturday', name: 'Radha Ashtami', note: 'Divine appearance of Sri Radha', category: 'Festival', tithi: 'Bhadrapada Shukla Ashtami' },
  { id: 'sep-22', day: 22, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Tuesday', name: 'Parsva Ekadashi', note: 'Chaturmas midpoint', category: 'Ekadashi', tithi: 'Bhadrapada Shukla Ekadashi' },
  { id: 'sep-23', day: 23, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Wednesday', name: 'Anant Chaturdashi', note: 'Ganesh Visarjan', category: 'Festival', tithi: 'Bhadrapada Shukla Chaturdashi' },
  { id: 'sep-24', day: 24, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Thursday', name: 'Pitru Paksha Begins', note: 'Bhadrapada Purnima Shraddha', category: 'Other', tithi: 'Bhadrapada Purnima' },
  { id: 'sep-30', day: 30, month: 'Sep', monthIndex: 8, year: 2026, weekday: 'Wednesday', name: 'Mahalaya Amavasya', note: 'Sarvapitri Shraddha', category: 'Amavasya', tithi: 'Ashwin Krishna Amavasya' },

  // OCTOBER 2026
  { id: 'oct-11', day: 11, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Sunday', name: 'Sharad Navratri Begins', note: 'Ghatasthapana morning muhurat', category: 'Festival', tithi: 'Ashwin Shukla Pratipada', guideSlug: 'sharad-navratri' },
  { id: 'oct-18', day: 18, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Sunday', name: 'Durga Ashtami', note: 'Maha Gauri puja · Kanya Pujan', category: 'Festival', tithi: 'Ashwin Shukla Ashtami', guideSlug: 'sharad-navratri' },
  { id: 'oct-19', day: 19, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Monday', name: 'Maha Navami', note: 'Siddhidatri puja · Havan', category: 'Festival', tithi: 'Ashwin Shukla Navami', guideSlug: 'sharad-navratri' },
  { id: 'oct-20', day: 20, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Tuesday', name: 'Vijayadashami / Dussehra', note: 'Victory of good over evil', category: 'Festival', tithi: 'Ashwin Shukla Dashami' },
  { id: 'oct-22', day: 22, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Thursday', name: 'Papankusha Ekadashi', note: 'Destruction of major sins', category: 'Ekadashi', tithi: 'Ashwin Shukla Ekadashi' },
  { id: 'oct-25', day: 25, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Sunday', name: 'Sharad Purnima', note: 'Kojagari Lakshmi Puja · Kheer in moonlight', category: 'Purnima', tithi: 'Ashwin Purnima' },
  { id: 'oct-29', day: 29, month: 'Oct', monthIndex: 9, year: 2026, weekday: 'Thursday', name: 'Karwa Chauth', note: 'Nirjala vrat by married women', category: 'Festival', tithi: 'Kartika Krishna Chaturthi', guideSlug: 'karwa-chauth' },

  // NOVEMBER 2026
  { id: 'nov-5', day: 5, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Thursday', name: 'Rama Ekadashi', note: 'Pre-Diwali fast for wealth and virtue', category: 'Ekadashi', tithi: 'Kartika Krishna Ekadashi' },
  { id: 'nov-6', day: 6, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Friday', name: 'Dhanteras', note: 'Dhanvantari Jayanti · Purchasing metals', category: 'Festival', tithi: 'Kartika Krishna Trayodashi' },
  { id: 'nov-8', day: 8, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Sunday', name: 'Diwali / Lakshmi Puja', note: 'Festival of lights · Amavasya Pradosh Kaal', category: 'Festival', tithi: 'Kartika Amavasya', guideSlug: 'diwali-beginners' },
  { id: 'nov-9', day: 9, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Monday', name: 'Govardhan Puja', note: 'Annakut offerings to Krishna', category: 'Festival', tithi: 'Kartika Shukla Pratipada' },
  { id: 'nov-10', day: 10, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Tuesday', name: 'Bhai Dooj', note: 'Brother-sister affection blessing', category: 'Festival', tithi: 'Kartika Shukla Dwitiya' },
  { id: 'nov-14', day: 14, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Saturday', name: 'Chhath Puja', note: 'Surya Dev & Chhathi Maiya worship', category: 'Festival', tithi: 'Kartika Shukla Shashthi' },
  { id: 'nov-20', day: 20, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Friday', name: 'Devutthana Ekadashi', note: 'Vishnu awakens · Chaturmas ends', category: 'Ekadashi', tithi: 'Kartika Shukla Ekadashi' },
  { id: 'nov-24', day: 24, month: 'Nov', monthIndex: 10, year: 2026, weekday: 'Tuesday', name: 'Kartika Purnima', note: 'Dev Deepawali in Varanasi', category: 'Purnima', tithi: 'Kartika Purnima' },

  // DECEMBER 2026
  { id: 'dec-5', day: 5, month: 'Dec', monthIndex: 11, year: 2026, weekday: 'Saturday', name: 'Utpanna Ekadashi', note: 'Origin of Ekadashi Devi', category: 'Ekadashi', tithi: 'Margashirsha Krishna Ekadashi' },
  { id: 'dec-8', day: 8, month: 'Dec', monthIndex: 11, year: 2026, weekday: 'Tuesday', name: 'Margashirsha Amavasya', note: 'Ancestor tarpan', category: 'Amavasya', tithi: 'Margashirsha Amavasya' },
  { id: 'dec-19', day: 19, month: 'Dec', monthIndex: 11, year: 2026, weekday: 'Saturday', name: 'Mokshada Ekadashi', note: 'Gita Jayanti · Recitation of Bhagavad Gita', category: 'Ekadashi', tithi: 'Margashirsha Shukla Ekadashi' },
  { id: 'dec-23', day: 23, month: 'Dec', monthIndex: 11, year: 2026, weekday: 'Wednesday', name: 'Margashirsha Purnima', note: 'Dattatreya Jayanti', category: 'Purnima', tithi: 'Margashirsha Purnima' },
];

export function getCountdownStatus(year: number, monthIndex: number, day: number) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetTime = new Date(year, monthIndex, day).getTime();

  const diffDays = Math.round((targetTime - todayStart) / 86400000);

  if (diffDays < 0) {
    return { text: 'PASSED', className: 'dt-cd past' };
  } else if (diffDays === 0) {
    return { text: 'TODAY', className: 'dt-cd today' };
  } else if (diffDays === 1) {
    return { text: 'TOMORROW', className: 'dt-cd soon' };
  } else if (diffDays <= 7) {
    return { text: `IN ${diffDays} DAYS`, className: 'dt-cd soon' };
  } else {
    return { text: `IN ${diffDays} DAYS`, className: 'dt-cd' };
  }
}
