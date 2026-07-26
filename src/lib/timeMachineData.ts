export interface TimelineEra {
  year: number;
  yearLabel: string;
  eraName: string;
  reconstructionImage: string;
  todayImage: string;
  keyTransformations: string[];
  narrations: {
    historian: string;
    documentary: string;
    child: string;
    traveler: string;
    architect: string;
    storyteller: string;
  };
}

export interface MonumentTimeData {
  id: string;
  name: string;
  location: string;
  constructionYear: number;
  constructionYearLabel: string;
  currentYearLabel: string;
  currentImage: string;
  snapshot: {
    builder: string;
    dynasty: string;
    constructionYear: string;
    architecturalStyle: string;
    unescoStatus: string;
    historicalImportance: string;
    majorFestivals: string;
    interestingFacts: string[];
  };
  timelineEras: TimelineEra[];
}

export const FEATURED_TIME_MONUMENTS: Record<string, MonumentTimeData> = {
  meenakshi: {
    id: "meenakshi",
    name: "Madurai Meenakshi Temple",
    location: "Madurai, Tamil Nadu, India",
    constructionYear: 1200,
    constructionYearLabel: "1200 CE (Original Shrine Era)",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Pandyan Kings & King Tirumalai Nayak",
      dynasty: "Pandyan & Nayak Dynasties",
      constructionYear: "1200–1659 CE",
      architecturalStyle: "Classical Dravidian Temple Architecture",
      unescoStatus: "Tentative World Heritage / National Treasure",
      historicalImportance: "Cultural heartbeat of Tamil Nadu and spiritual capital of the ancient Pandyan Kingdom.",
      majorFestivals: "Chithirai Thiruvizha, Meenakshi Thirukalyanam, Float Festival",
      interestingFacts: [
        "Houses 14 majestic Gopuram towers adorned with over 33,000 colorful stucco sculptures.",
        "The Thousand Pillared Hall contains musical granite pillars that resonate with distinct notes when struck.",
        "The Golden Lotus Tank (Porthamarai Kulam) is believed to judge the literary merit of Tamil poets."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Modern Living Heritage Era",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved 14 gopurams with restored organic mineral pigments",
          "Surrounding bustling Madurai markets with digital tourist amenities",
          "Active daily Agamic worship and thousands of daily international pilgrims"
        ],
        narrations: {
          historian: "Today, Meenakshi Amman Temple stands as a living testament to South Indian temple architecture, drawing millions of pilgrims while retaining its ancient layout.",
          documentary: "Standing amidst the high-tech bustle of modern Madurai, these 170-foot stone gateways remain an unbroken bridge to two millennia of Tamil spiritual heritage.",
          child: "Look at all the bright colors on the giant towers! Thousands of people visit every day to see the golden lotus pond and elephant blessings.",
          traveler: "You step out of the vibrant Madurai jasmine market into the cool, incense-perfumed stone corridors as chants echo off ancient granite walls.",
          architect: "The structural integration of 14 distinct gopurams surrounding twin sanctums demonstrates centuries of progressive structural expansion around an ancient sacred core.",
          storyteller: "As dawn breaks over 218-foot towers, golden rays illuminate 33,000 sculpted deities while the gentle aroma of fresh jasmine fills the morning air."
        }
      },
      {
        year: 1900,
        yearLabel: "1900 CE",
        eraName: "Colonial Era & Epigraphic Restoration",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1627894092102-12502c525f00?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Horse-drawn carriages and bullock carts along temple corridors",
          "Natural vegetable Dyes on stucco statues",
          "Archival recording of palm-leaf manuscripts and copper plate grants"
        ],
        narrations: {
          historian: "At the turn of the 20th century, British antiquarians and Indian scholars systematically cataloged the temple's thousands of Tamil wall inscriptions.",
          documentary: "In 1900, bullock carts navigated dirt avenues leading to the temple while master stonemasons used original vegetable pigments to maintain the gopurams.",
          child: "Before cars existed, families came to the temple in wooden bullock carts with bells ringing on the oxen!",
          traveler: "Oil lamps light your path through Pudhumandapam as spice merchants trade cardamom and silk from hand-woven palm baskets.",
          architect: "Nineteenth-century conservation notes reveal how traditional lime mortar and herbal adhesives preserved the intricate gopuram stucco work through monsoons.",
          storyteller: "Under the shade of ancient banyan trees, palm-leaf scribes recorded royal legacies while temple musicians played woodwind nadaswarams at sunset."
        }
      },
      {
        year: 1800,
        yearLabel: "1800 CE",
        eraName: "Late Nayak & Polygar Period",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Royal palanquins carried through Pudhumandapam",
          "Torches and brass lamp trees lighting the inner corridors",
          "Dense coconut groves surrounding the city moat"
        ],
        narrations: {
          historian: "During the 18th century, regional chieftains and temple trustees maintained lavish daily endowments despite regional political shifts.",
          documentary: "Entering 1800 Madurai meant crossing fortified earthen walls into a sanctuary lit entirely by thousands of flickering oil lamps.",
          child: "At night, thousands of tiny brass lamps lit up the giant stone halls like a magical starry sky!",
          traveler: "You walk past royal guards dressed in embroidered tunics while temple elephants adorned with gold forehead plates lead morning processions.",
          architect: "The spatial acoustic resonance in the Thousand Pillared Hall was perfected using specific stone density selection and vaulted ceiling geometry.",
          storyteller: "Torchlight flickered off granite Yali pillars as temple dancers performed sacred recitals recorded in stone wall reliefs."
        }
      },
      {
        year: 1650,
        yearLabel: "1635–1650 CE",
        eraName: "Golden Age of King Tirumalai Nayak",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1627894092102-12502c525f00?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Pudhumandapam newly completed with freshly carved royal statues",
          "Vibrant natural mineral paint on all 14 gopurams",
          "Royal Nayak court processions with silk banners and brass trumpets",
          "Flourishing jasmine markets along the southern moat"
        ],
        narrations: {
          historian: "King Tirumalai Nayak expanded the temple into one of South India's greatest architectural masterpieces, constructing Pudhumandapam and the royal palace.",
          documentary: "This was the absolute peak of the Nayak dynasty. Thousands of stonemasons, sculptors, and painters worked simultaneously to complete the towering gateways.",
          child: "Imagine walking into a giant colorful palace where festivals happened every day and musicians filled the streets with golden trumpets!",
          traveler: "You would arrive through crowded markets filled with silk merchants, flower sellers, musicians, elephants, and temple festivals.",
          architect: "The massive gopurams were engineered using interlocking granite blocks and detailed stone carvings demonstrating remarkable structural stability without cement.",
          storyteller: "As the morning sun rose above Madurai, temple bells echoed through the city while pilgrims, dancers, merchants, and kings gathered beneath the towering gateways."
        }
      },
      {
        year: 1500,
        yearLabel: "1500 CE",
        eraName: "Early Vijayanagara Expansion Era",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Construction of the Thousand Pillared Hall begins",
          "Fortified stone walls replacing earlier earthen ramparts",
          "Active trade with Vijayanagara imperial emissaries"
        ],
        narrations: {
          historian: "Vijayanagara generals reconstructed and fortified the outer walls, laying the groundwork for the monumental Gopuram expansions.",
          documentary: "Rebuilding after earlier historical conflicts, 16th-century master builders carved 985 intricate pillars inside the grand assembly hall.",
          child: "Builders carved hundreds of stone pillars, each with a different animal or hero sculpted on it!",
          traveler: "Stonemasons work under wood scaffolding while priests chant Vedic hymns in the golden lotus courtyard.",
          architect: "Monolithic granite pillars were quarried from nearby hills and transported on wooden rollers lubricated with wet mud and oil.",
          storyteller: "Chisels clinked rhythmically against solid rock as master artisans shaped the legendary musical stone pillars."
        }
      },
      {
        year: 1300,
        yearLabel: "1300 CE",
        eraName: "Later Pandyan Dynasty Core Era",
        todayImage: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1627894092102-12502c525f00?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Original Pandyan sanctums and central gopuram core",
          "Golden Lotus Tank framed by classic stone steps",
          "Royal Pandyan fish emblem carved into lintels"
        ],
        narrations: {
          historian: "The Pandyan kings established the central shrine layout and the Golden Lotus Tank, founding the spiritual geography of the temple complex.",
          documentary: "In 1300, the central sanctum was protected by three concentric stone enclosures adorned with the royal twin-fish crest of the Pandyan dynasty.",
          child: "The ancient Pandyan kings loved the goddess so much they built a sparkling lotus pond surrounded by stone steps!",
          traveler: "Pilgrims dip sacred water from the lotus pond before offering lotus flowers at the shrine of Goddess Meenakshi.",
          architect: "The orientation of the central sanctum aligns precisely with cardinal solar paths, ensuring optimal natural light framing during solstice rituals.",
          storyteller: "Under royal Pandyan patronage, Tamil poets gathered by the lotus pool to recite verses that echoed across the stone courtyards."
        }
      }
    ]
  },

  tajmahal: {
    id: "tajmahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh, India",
    constructionYear: 1632,
    constructionYearLabel: "1632 CE (Inception)",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Emperor Shah Jahan",
      dynasty: "Mughal Empire",
      constructionYear: "1632–1653 CE",
      architecturalStyle: "Indo-Islamic Mughal Architecture",
      unescoStatus: "UNESCO World Heritage Site (1983) & New 7 Wonder",
      historicalImportance: "The world's premier symbol of eternal love and peak Mughal artistic achievement.",
      majorFestivals: "Taj Mahotsav, Urs of Shah Jahan",
      interestingFacts: [
        "Built using pure white Makrana marble that changes tone with sunlight and moonlight.",
        "Over 20,000 artisans from Persia, Europe, and India worked on its construction for 22 years.",
        "The four minarets tilt slightly outward to protect the central dome in case of earthquakes."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Global Heritage Landmark Era",
        todayImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Pristine restored white marble reflecting pools",
          "Manicured cypress trees framing Charbagh gardens",
          "Global eco-protection zone surrounding Yamuna riverbank"
        ],
        narrations: {
          historian: "The Taj Mahal remains the pinnacle of Mughal architecture, preserved today under international conservation protocols.",
          documentary: "Attracting over 7 million visitors annually, this 17th-century marble mausoleum stands as an enduring monument to Shah Jahan's vision.",
          child: "Look at the sparkling white marble building! It reflects like a mirror in the long garden swimming pools.",
          traveler: "You walk down the quiet marble walkway at sunrise as the tomb shifts from soft pink to radiant pearl white.",
          architect: "The optical balance of the central 115-foot double dome and four flanking minarets creates flawless mathematical symmetry from every angle.",
          storyteller: "As dawn painted the Agra sky, the white marble glowing mausoleum reflected softly upon the calm Yamuna river waters."
        }
      },
      {
        year: 1900,
        yearLabel: "1900 CE",
        eraName: "Lord Curzon Restoration Era",
        todayImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Restoration of overgrown gardens into English-style lawns",
          "Installation of the famous Cairo brass lamp in the central chamber",
          "Archival masonry repair on marble pietra dura inlays"
        ],
        narrations: {
          historian: "In 1900, extensive restoration efforts cleared overgrown vegetation and restored damaged Pietra Dura stone inlays.",
          documentary: "Before British restorations in 1900, the Charbagh gardens were thick fruit orchards, which were reshaped into formal lawns.",
          child: "Gardeners carefully cleaned every marble stone and hung a shiny new bronze lamp inside!",
          traveler: "You stroll past newly planted rose beds while craftsmen carefully re-set lapis lazuli stones into the marble arches.",
          architect: "Restoration engineers documented the wooden well-foundation system beneath the Yamuna riverbank that keeps the structure stable.",
          storyteller: "Gentle breezes rustled through newly pruned gardens as scholars traced the Persian calligraphic inscriptions on the main gate."
        }
      },
      {
        year: 1750,
        yearLabel: "1750 CE",
        eraName: "Late Mughal & Regional Capital Era",
        todayImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Original silver gates and gold finial topping the dome",
          "Full lush fruit orchards (pomegranates, lemons, oranges) in Charbagh",
          "Royal guards stationed at the red sandstone Darwaza gateway"
        ],
        narrations: {
          historian: "In the 18th century, the complex retained its original imperial endowments, with lush orchards supplying the shrine's upkeep.",
          documentary: "In 1750, the garden was a fragrant paradise of fruit trees, fountains powered by gravity, and incense burning continuously inside.",
          child: "The gardens were filled with sweet orange and pomegranate trees where songbirds sang all day long!",
          traveler: "You enter through the monumental red sandstone gate as guardians in velvet robes greet traveling ambassadors.",
          architect: "The water system utilized deep wells and aqueducts along the Yamuna river, filling 24 fountains without mechanical pumps.",
          storyteller: "Sunlight glinted off the original gold dome finial while scent of jasmine and orange blossoms filled the imperial courtyards."
        }
      },
      {
        year: 1650,
        yearLabel: "1632–1653 CE",
        eraName: "Royal Construction Era under Shah Jahan",
        todayImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Earthen ramps used to haul massive Makrana marble blocks",
          "20,000 artisans, carvers, calligraphers, and lapidaries at work",
          "Scaffolding constructed of brick rather than bamboo to support heavy stone",
          "Royal boats transporting white marble down the Yamuna river"
        ],
        narrations: {
          historian: "Commissioned by Emperor Shah Jahan in 1632 to honor Empress Mumtaz Mahal, over 20,000 artisans spent 22 years erecting this masterpiece.",
          documentary: "This was the epicenter of world architecture. Elephants hauled massive marble slabs up a 10-mile earthen ramp to the top of the double dome.",
          child: "Thousands of stonemasons and gentle elephants worked together to build this magnificent white marble tomb!",
          traveler: "You witness master craftsmen setting semi-precious jade, onyx, and turquoise into sparkling marble floral patterns.",
          architect: "To support the immense weight near the river, builders sunk deep masonry wells filled with stone, lime, and timber, creating a subterranean foundation raft.",
          storyteller: "By moonlight, Emperor Shah Jahan gazed across the Yamuna from Agra Fort, watching his grand vision take form in gleaming white marble."
        }
      }
    ]
  },

  hampi: {
    id: "hampi",
    name: "Hampi Virupaksha Temple & Ruins",
    location: "Vijayanagara, Karnataka, India",
    constructionYear: 1336,
    constructionYearLabel: "1336 CE (Imperial Founding)",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Emperor Krishnadevaraya & Sangama Rulers",
      dynasty: "Vijayanagara Empire",
      constructionYear: "1336–1565 CE",
      architecturalStyle: "Vijayanagara Dravidian Architecture",
      unescoStatus: "UNESCO World Heritage Site (1986)",
      historicalImportance: "Capital of the opulent Vijayanagara Empire, one of the largest and wealthiest cities in the 16th-century world.",
      majorFestivals: "Hampi Utsav, Virupaksha Car Festival, Mahanavami",
      interestingFacts: [
        "Open-air diamond and gemstone bazaars stretched for half a mile in front of Virupaksha Temple.",
        "Vittala Temple features the iconic Stone Chariot and 56 musical pillars that chime like musical instruments.",
        "The city was protected by seven concentric rings of massive granite fortifications."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Protected Archaeological Park Era",
        todayImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved granite boulder landscape and iconic Stone Chariot",
          "Active continuous worship at Virupaksha Temple since 7th century",
          "Eco-friendly electric cart paths and UNESCO heritage trails"
        ],
        narrations: {
          historian: "Today, Hampi stands as a majestic open-air museum, spanning 16 square miles of ancient temples, palaces, and granite hills.",
          documentary: "Amidst surreal boulder fields along the Tungabhadra river, Hampi's silent stone monuments whisper tales of South India's golden empire.",
          child: "Look at the giant stone chariot with wheels carved from solid rock and the cute coracle boats floating on the river!",
          traveler: "You climb Hemakuta Hill at sunset as the ancient stone towers glow deep orange against the rocky landscape.",
          architect: "The structural integration of monolithic granite columns into vast hypostyle halls represents peak South Indian stone engineering.",
          storyteller: "As evening shadows lengthened over the boulder hills, temple bells rang from Virupaksha's 160-foot tower just as they have for over 1,300 years."
        }
      },
      {
        year: 1520,
        yearLabel: "1509–1529 CE",
        eraName: "Golden Age of Emperor Krishnadevaraya",
        todayImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Bustling Virupaksha and Sule Bazaar filled with international horse traders and gemstone merchants",
          "Intact royal palaces, multi-tiered aqueducts, and Lotus Mahal fountains",
          "Royal elephant stables fully occupied by imperial war elephants",
          "Stone Chariot wheels rotating smoothly during temple processions"
        ],
        narrations: {
          historian: "During Krishnadevaraya's reign, Vijayanagara was one of the largest cities in the world, renowned for international trade in diamonds, horses, and silks.",
          documentary: "Portuguese merchant Domingo Paes recorded in 1520 that Vijayanagara was as large as Rome, with markets overflowing with rubies, diamonds, and Arab horses.",
          child: "Imagine a city so rich that merchants sold shiny diamonds and rubies out of big wooden baskets in the street markets!",
          traveler: "You walk through the half-mile long stone bazaar where foreign traders exchange Arabian horses and silk banners under shaded awnings.",
          architect: "The city's water supply system utilized stone aqueducts and terracotta pipes delivering water to royal baths and stepped tanks from distant reservoirs.",
          storyteller: "Golden royal palanquins glided through crowded avenue streets while trumpets sounded the arrival of Emperor Krishnadevaraya at the Mahanavami Dibba."
        }
      }
    ]
  },

  konark: {
    id: "konark",
    name: "Konark Sun Temple",
    location: "Konark, Odisha, India",
    constructionYear: 1250,
    constructionYearLabel: "1250 CE",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "King Narasimhadeva I",
      dynasty: "Eastern Ganga Dynasty",
      constructionYear: "1250 CE",
      architecturalStyle: "Kalinga Architecture",
      unescoStatus: "UNESCO World Heritage Site (1984)",
      historicalImportance: "A colossal 13th-century stone chariot dedicated to the Sun God Surya, featuring 24 carved wheels that act as sundials.",
      majorFestivals: "Konark Dance Festival, Magha Saptami",
      interestingFacts: [
        "Designed as a gigantic 12-wheeled chariot pulled by seven carved stone horses.",
        "The stone wheels can accurately calculate time down to minutes using sun shadows.",
        "Built at the mouth of the Chandrabhaga River near the Bay of Bengal."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Preserved Stone Chariot Landmark",
        todayImage: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved stone wheels and detailed dance relief sculptures",
          "Consolidated stone structure protected by ASI conservators"
        ],
        narrations: {
          historian: "Konark Sun Temple remains a masterpiece of Kalinga architecture, famous worldwide for its astronomical sundial wheels.",
          documentary: "Standing near the Bay of Bengal, this stone chariot's 24 wheels continue to tell time as they have for over 750 years.",
          child: "Look at the giant wheels carved on the side of the building! They tell the time using shadows from the sun!",
          traveler: "You stand before the massive stone wheels as morning sunlight warms the intricate dancer carvings.",
          architect: "The structural balance of the Jagamohana hall utilized iron beams and stone gravity joints.",
          storyteller: "As the first rays of dawn hit the east face of Konark, the stone horses seemed ready to leap across the sky."
        }
      }
    ]
  },

  machupicchu: {
    id: "machupicchu",
    name: "Machu Picchu",
    location: "Cusco Region, Peru",
    constructionYear: 1450,
    constructionYearLabel: "1450 CE",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Inca Emperor Pachacuti",
      dynasty: "Inca Empire",
      constructionYear: "1450 CE",
      architecturalStyle: "Incan Dry-Stone Masonry (Ashlar)",
      unescoStatus: "UNESCO World Heritage Site & New 7 Wonder",
      historicalImportance: "Royal estate and sacred sanctuary of the Inca Empire nestled high in the Andes mountains.",
      majorFestivals: "Inti Raymi (Sun Festival)",
      interestingFacts: [
        "Constructed without mortar; granite stones fit so tightly together a blade of grass cannot pass between them.",
        "Features over 700 agricultural terraces that prevented erosion during tropical monsoons.",
        "Remained hidden from spanish conquistadors until Hiram Bingham documented it in 1911."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Preserved Andean Sanctuary",
        todayImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved agricultural terraces and Intihuatana solar stone",
          "Eco-guided visitor trails above the Urubamba River"
        ],
        narrations: {
          historian: "Machu Picchu represents the pinnacle of Incan dry-stone engineering, perfectly integrated into the cloud forest topography.",
          documentary: "Hidden 7,970 feet above sea level, this Incan citadel served as a royal sanctuary aligned with sacred mountain peaks.",
          child: "Look at the stone houses built right on top of green mountains above the clouds!",
          traveler: "You step onto the upper terrace as morning mist parts to reveal the iconic granite peaks.",
          architect: "The seismic masonry technique allowed heavy granite blocks to dance during earthquakes without collapsing.",
          storyteller: "As dawn parted the mountain clouds, sunlight illuminated the sacred stone altar of Intihuatana."
        }
      }
    ]
  },

  colosseum: {
    id: "colosseum",
    name: "Roman Colosseum",
    location: "Rome, Italy",
    constructionYear: 80,
    constructionYearLabel: "80 CE",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Emperors Vespasian & Titus",
      dynasty: "Flavian Dynasty",
      constructionYear: "70–80 CE",
      architecturalStyle: "Classical Roman Amphitheater",
      unescoStatus: "UNESCO World Heritage Site & New 7 Wonder",
      historicalImportance: "The largest amphitheater ever built in antiquity, symbolizing Roman architectural grandeur and engineering.",
      majorFestivals: "Imperial Roman Games & Naumachia (Naval Battles)",
      interestingFacts: [
        "Could seat over 50,000 spectators with 80 vaulted arch entrances.",
        "Features a subterranean hypogeum network of lift elevators and animal cages.",
        "Equipped with a giant retractable canvas awning (Velarium) operated by Roman sailors."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Preserved Ancient Amphitheater",
        todayImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved outer travertine facade arches",
          "Accessible hypogeum arena floor restoration"
        ],
        narrations: {
          historian: "The Flavian Amphitheater stands as Rome's ultimate monument to engineering, vaulting, and concrete innovation.",
          documentary: "Two thousand years after its inaugural games, the Colosseum remains the iconic symbol of ancient Rome.",
          child: "Imagine sitting in a huge round stadium with 50,000 people watching giant performances!",
          traveler: "You walk beneath travertine arches where ancient Roman gladiators once prepared for victory.",
          architect: "The structural tiering of Doric, Ionic, and Corinthian columns distributed immense structural loads effortlessly.",
          storyteller: "Golden afternoon light warmed the ancient arches as visitors marveled at Rome's enduring stone giant."
        }
      }
    ]
  },

  greatwall: {
    id: "greatwall",
    name: "Great Wall of China",
    location: "Northern China",
    constructionYear: 1368,
    constructionYearLabel: "1368 CE (Ming Dynasty Wall)",
    currentYearLabel: "2026 CE (Today)",
    currentImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    snapshot: {
      builder: "Qin Shi Huang & Ming Dynasty Emperors",
      dynasty: "Qin, Han, & Ming Dynasties",
      constructionYear: "221 BCE – 1644 CE",
      architecturalStyle: "Ancient Chinese Fortified Rampart Architecture",
      unescoStatus: "UNESCO World Heritage Site (1987) & New 7 Wonder",
      historicalImportance: "The longest human-made fortification in history, stretching over 13,000 miles across mountain ridges.",
      majorFestivals: "Border Garrison Patrols & Beacon Signal Lightings",
      interestingFacts: [
        "Sticky rice mortar was used to bind granite blocks together, providing remarkable water resistance.",
        "Included thousands of watchtowers that transmitted smoke signals by day and fire signals by night.",
        "Traverses deserts, mountain crests, rivers, and grasslands across Northern China."
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "World Wonder Rampart Era",
        todayImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
        reconstructionImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
        keyTransformations: [
          "Preserved stone watchtowers and battlements along mountain ridges",
          "Restored stone parapets and tourist cable car access"
        ],
        narrations: {
          historian: "The Great Wall remains an extraordinary achievement of military engineering and stone masonry across rugged terrain.",
          documentary: "Winding over 13,000 miles across high mountain crests, this stone dragon stands as China's eternal monument.",
          child: "Look at the giant stone wall stretching over mountain tops as far as the eye can see!",
          traveler: "You climb up stone steps to a high watchtower as wind sweeps across green mountain ridges.",
          architect: "Granite blocks and kiln-fired bricks were laid with sticky rice lime mortar for incredible longevity.",
          storyteller: "Morning fog lifted over steep mountain peaks to reveal the endless stone wall winding into the horizon."
        }
      }
    ]
  }
};

export function getMonumentTimeData(queryOrName: string): MonumentTimeData {
  const norm = (queryOrName || "").toLowerCase().trim();

  if (norm.includes("taj") || norm.includes("mahal") || norm.includes("agra")) {
    return FEATURED_TIME_MONUMENTS.tajmahal;
  }
  if (norm.includes("hampi") || norm.includes("virupaksha") || norm.includes("vijayanagara")) {
    return FEATURED_TIME_MONUMENTS.hampi;
  }
  if (norm.includes("meenakshi") || norm.includes("madurai") || norm.includes("gopuram")) {
    return FEATURED_TIME_MONUMENTS.meenakshi;
  }
  if (norm.includes("konark") || norm.includes("sun temple") || norm.includes("odisha")) {
    return FEATURED_TIME_MONUMENTS.konark;
  }
  if (norm.includes("machu") || norm.includes("picchu") || norm.includes("peru")) {
    return FEATURED_TIME_MONUMENTS.machupicchu;
  }
  if (norm.includes("colosseum") || norm.includes("rome") || norm.includes("roman")) {
    return FEATURED_TIME_MONUMENTS.colosseum;
  }
  if (norm.includes("great wall") || norm.includes("china")) {
    return FEATURED_TIME_MONUMENTS.greatwall;
  }

  // Generic fallback generator for worldwide search - STRICTLY KEEPS SAME MONUMENT IMAGE!
  const cleanName = queryOrName || "Ancient Heritage Monument";
  // Pick an authentic, beautiful generic heritage stone landmark image
  const defaultImage = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80";

  return {
    id: "custom_" + Math.random().toString(36).substring(7),
    name: cleanName,
    location: "Global Heritage Site",
    constructionYear: 1200,
    constructionYearLabel: "1200 CE (Construction Era)",
    currentYearLabel: "2026 CE (Today)",
    currentImage: defaultImage,
    snapshot: {
      builder: "Ancient Master Builders & Royal Patrons",
      dynasty: "Imperial Historical Dynasty",
      constructionYear: "1200 CE",
      architecturalStyle: "Monumental Heritage Architecture",
      unescoStatus: "World Heritage Cultural Landmark",
      historicalImportance: `${cleanName} represents an outstanding architectural milestone in human heritage history.`,
      majorFestivals: "Annual Heritage & Sacred Celebrations",
      interestingFacts: [
        `Constructed using precision engineering methods without modern machinery.`,
        `Serves as an enduring symbol of cultural identity and regional craftsmanship.`,
        `Preserves verified historical inscriptions documenting royal patrons and artisans.`
      ]
    },
    timelineEras: [
      {
        year: 2026,
        yearLabel: "2026 CE (Today)",
        eraName: "Modern Preserved Landmark",
        todayImage: defaultImage,
        reconstructionImage: defaultImage,
        keyTransformations: [
          "Preserved structural masonry and heritage trails",
          "Modern conservation amenities and global visitors"
        ],
        narrations: {
          historian: `${cleanName} stands today as a preserved historical site documented by international heritage scholars.`,
          documentary: `Visiting ${cleanName} in 2026 connects us directly with the architectural mastery of ancient civilisations.`,
          child: `Look at this incredible ancient building preserved so we can visit it today!`,
          traveler: `You stand before ${cleanName}, taking in the awe-inspiring scale of ancient masonry.`,
          architect: `The structural load distribution and stone geometry ensure the monument's stability across centuries.`,
          storyteller: `Sunlight illuminates the ancient facade of ${cleanName}, whispering stories of centuries past.`
        }
      },
      {
        year: 1600,
        yearLabel: "1600 CE",
        eraName: "Historical Peak Era",
        todayImage: defaultImage,
        reconstructionImage: defaultImage,
        keyTransformations: [
          "Complete restored architectural facade and vibrant courtyards",
          "Active royal court presence, traditional markets, and organic gardens"
        ],
        narrations: {
          historian: `During the 17th century, ${cleanName} served as a primary hub of administrative, cultural, and spiritual activity.`,
          documentary: `In 1600, ${cleanName} was vibrant with life, surrounded by bustling markets and royal guards.`,
          child: `Hundreds of years ago, people gathered here in colorful traditional clothes for grand celebrations!`,
          traveler: `You walk past royal messengers and artisan workshops surrounding the monument's entrance.`,
          architect: `Intricate stone masonry and traditional herbal mortars protected the structure against weathering.`,
          storyteller: `Banners fluttered in the breeze as trumpets heralded the arrival of royal patrons at ${cleanName}.`
        }
      },
      {
        year: 1200,
        yearLabel: "1200 CE",
        eraName: "Original Construction Era",
        todayImage: defaultImage,
        reconstructionImage: defaultImage,
        keyTransformations: [
          "Active construction with wooden scaffolding and stone quarrying",
          "Master craftsmen chiseling original architectural details"
        ],
        narrations: {
          historian: `In 1200 CE, royal patrons commissioned master craftsmen to lay the foundations of ${cleanName}.`,
          documentary: `Chisels clinked rhythmically as thousands of artisans carved solid stone to erect ${cleanName}.`,
          child: `Builders used wooden ramps and stone tools to raise giant stone blocks into the sky!`,
          traveler: `You witness master stonemasons shaping granite pillars under the direction of chief architects.`,
          architect: `Interlocking stone joints and foundation masonry laid the foundation for centuries of structural endurance.`,
          storyteller: `The first stone of ${cleanName} was consecrated amidst royal chants and community celebration.`
        }
      }
    ]
  };
}
