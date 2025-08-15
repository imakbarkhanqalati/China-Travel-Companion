/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- DATA STRUCTURES ---
interface CityGuide {
  id: string;
  name: string;
  image: string;
  highlights: string[];
  transportation: {
    fromAirport: string;
    withinCity: string;
  };
  mustTryFoods: {
    dish: string;
    description: string;
    recommendedRestaurant: string;
  }[];
}

interface TransportationGuide {
    id:string;
    name: string;
    icon: 'train' | 'car' | 'plane' | 'bus' | 'boat' | 'bike';
    description: string;
    details: Record<string, string[]>;
}

interface UsefulResource {
  id: string;
  name: string;
  icon: 'message' | 'wallet' | 'plane' | 'book' | 'globe';
  description: string;
  url: string;
}

// --- MOCK DATA ---
const countryData: Record<string, CityGuide[]> = {
    'China': [
        { id: 'c1', name: 'Beijing', image: 'https://images.unsplash.com/photo-1547981609-4b6b73a5e984?q=80&w=800', highlights: ['The Great Wall', 'The Forbidden City', 'The Summer Palace'], transportation: { fromAirport: 'The Airport Express train is recommended, costing 25元.', withinCity: 'The metro system is the most efficient way to travel.' }, mustTryFoods: [{ dish: 'Peking Duck', description: 'Crispy roasted duck served with thin pancakes.', recommendedRestaurant: 'Da Dong' }] },
        { id: 'c2', name: 'Shanghai', image: 'https://images.unsplash.com/photo-1538428322894-25d2b7d41f89?q=80&w=800', highlights: ['The Bund', 'Yu Garden', 'Shanghai Tower'], transportation: { fromAirport: 'The Maglev train offers a futuristic, high-speed journey to the city center.', withinCity: 'The extensive metro system covers nearly all attractions.' }, mustTryFoods: [{ dish: 'Xiao Long Bao', description: 'Delicate steamed soup dumplings.', recommendedRestaurant: 'Din Tai Fung' }] },
        { id: 'c3', name: 'Xi\'an', image: 'https://images.unsplash.com/photo-1596321251978-a8d9a48f296c?q=80&w=800', highlights: ['Terracotta Army', 'Ancient City Wall', 'Muslim Quarter'], transportation: { fromAirport: 'Airport shuttle buses are an economical option to reach the city.', withinCity: 'Cycling on the Ancient City Wall is a unique experience.' }, mustTryFoods: [{ dish: 'Biangbiang Noodles', description: 'Thick, belt-like noodles often served with a savory, spicy sauce.', recommendedRestaurant: 'Muslim Quarter stalls' }] },
        { id: 'c4', name: 'Chengdu', image: 'https://images.unsplash.com/photo-1519399479359-56c81a205d15?q=80&w=800', highlights: ['Giant Panda Breeding Base', 'Jinli Street', 'Wenshu Monastery'], transportation: { fromAirport: 'A direct metro line connects the airport to the city center.', withinCity: 'The metro is convenient, but taxis are also affordable.' }, mustTryFoods: [{ dish: 'Sichuan Hotpot', description: 'A spicy, flavorful broth where you cook your own ingredients.', recommendedRestaurant: 'Shu Jiuxiang Hotpot' }] },
        { id: 'c5', name: 'Guilin', image: 'https://images.unsplash.com/photo-1562613529-5f2ba012a64c?q=80&w=800', highlights: ['Li River Cruise', 'Elephant Trunk Hill', 'Reed Flute Cave'], transportation: { fromAirport: 'Airport buses are available to major points in the city.', withinCity: 'Local buses and sightseeing boats are the primary modes of transport.' }, mustTryFoods: [{ dish: 'Guilin Rice Noodles', description: 'A local breakfast staple served with various toppings.', recommendedRestaurant: 'Small local eateries' }] },
    ],
    'Japan': [
        { id: 'j1', name: 'Tokyo', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800', highlights: ['Shibuya Crossing', 'Tokyo Skytree', 'Senso-ji Temple'], transportation: { fromAirport: 'Narita Express or Limousine Bus are convenient options.', withinCity: 'The JR Yamanote Line and Tokyo Metro are incredibly efficient.' }, mustTryFoods: [{ dish: 'Sushi', description: 'Fresh seafood over vinegared rice.', recommendedRestaurant: 'Tsukiji Outer Market' }] },
        { id: 'j2', name: 'Kyoto', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800', highlights: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove'], transportation: { fromAirport: 'Haruka Express from Kansai International Airport (KIX).', withinCity: 'Buses are the best way to get around Kyoto\'s main sights.' }, mustTryFoods: [{ dish: 'Kaiseki', description: 'A traditional multi-course Japanese dinner.', recommendedRestaurant: 'Gion Karyo' }] },
    ],
    'Italy': [
        { id: 'i1', name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800', highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'], transportation: { fromAirport: 'Leonardo Express train is the fastest way to Termini Station.', withinCity: 'Walkable city center, supplemented by a good metro system.' }, mustTryFoods: [{ dish: 'Cacio e Pepe', description: 'A simple, delicious pasta with cheese and black pepper.', recommendedRestaurant: 'Trastevere trattorias' }] },
        { id: 'i2', name: 'Florence', image: 'https://images.unsplash.com/photo-1528159339935-d5257a731174?q=80&w=800', highlights: ['Florence Cathedral (Duomo)', 'Uffizi Gallery', 'Ponte Vecchio'], transportation: { fromAirport: 'Tram or bus from Florence Airport.', withinCity: 'Extremely walkable; most major attractions are close together.' }, mustTryFoods: [{ dish: 'Bistecca alla Fiorentina', description: 'A thick-cut T-bone steak, grilled rare.', recommendedRestaurant: 'Trattoria Mario' }] },
    ],
    'USA': [
        { id: 'us1', name: 'New York', image: 'https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=800', highlights: ['Times Square', 'Statue of Liberty', 'Central Park'], transportation: { fromAirport: 'AirTrain JFK and subway or Long Island Rail Road.', withinCity: 'The subway is the most comprehensive way to travel.' }, mustTryFoods: [{ dish: 'New York-Style Pizza', description: 'Large, foldable slices with a thin crust.', recommendedRestaurant: 'Joe\'s Pizza' }] },
        { id: 'us2', name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1542065355-46762a635833?q=80&w=800', highlights: ['Hollywood Sign', 'Santa Monica Pier', 'Griffith Observatory'], transportation: { fromAirport: 'FlyAway buses or ride-sharing from LAX.', withinCity: 'A car is highly recommended as the city is very spread out.' }, mustTryFoods: [{ dish: 'Tacos', description: 'Diverse and authentic Mexican street food.', recommendedRestaurant: 'Leo\'s Tacos Truck' }] },
    ],
    'France': [
        { id: 'f1', name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=800', highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'], transportation: { fromAirport: 'RER B train from Charles de Gaulle (CDG) is efficient.', withinCity: 'The Métro is fast and covers the entire city.' }, mustTryFoods: [{ dish: 'Croissant', description: 'A buttery, flaky viennoisie pastry.', recommendedRestaurant: 'Any local boulangerie' }] },
    ]
};

const transportationData: Record<string, TransportationGuide[]> = {
  'China': [
    {
      id: 't1-cn',
      name: 'High-Speed Rail (Gāotiě)',
      icon: 'train',
      description: "Booking, boarding, and riding China's world-leading bullet trains.",
      details: {
        'Booking & Price': ['App: Trip.com is the easiest for foreigners. Prices range from ¥200-¥600+ for typical routes (e.g., Beijing-Shanghai).', 'Book tickets at least a few days in advance, especially around holidays.', 'Classes: Second Class (most common), First Class (more legroom), Business Class (premium).'],
        'Boarding': ['Arrive at the station at least 60-90 minutes early for security and ID checks.', 'You need your passport to enter the station and board.', 'Large screens show train numbers and boarding gates (检票口).'],
        'Pro Tips': ['Pack snacks and drinks, or buy them on board.', 'Hot water dispensers are available in every car.', 'Keep your ticket to exit the destination station.']
      }
    },
    {
      id: 't2-cn',
      name: 'Ride-Sharing & Taxis',
      icon: 'car',
      description: 'Using Didi (the "Uber" of China) and hailing official city cabs.',
      details: {
        'Apps & Payment': ['App: Didi is essential. Link an international credit card before you go. You will need Alipay or WeChat Pay for most regular taxis.', 'Price: Didi is often cheaper than taxis. A typical 30-min ride costs ¥30-¥60.'],
        'How it Works': ['For Didi, enter your destination in the app. It’s best to have the address in Chinese characters.', 'For taxis, use official, marked cabs. Insist on using the meter (打表, dǎbiǎo). Avoid unofficial "black cabs".'],
        'Traveler Info': ['Have your destination address saved as a screenshot in Chinese.', 'Ride-sharing is often more convenient than taxis due to the language barrier and payment methods.']
      }
    },
    {
      id: 't3-cn',
      name: 'Metro Systems (Dìtiě)',
      icon: 'train',
      description: 'Navigating the vast, modern, and efficient subway systems in major cities.',
      details: {
        'Key Cities': ['Beijing, Shanghai, Guangzhou, Chengdu, Xi\'an, etc., all have excellent metro networks.', 'App: Apple/Google Maps work well for routing. Metroman China is also great.'],
        'Tickets & Price': ['Price: Extremely cheap, typically ¥3-¥8 per ride depending on distance.', 'How to Buy: Use automated kiosks (switch to English) that accept small cash bills, coins, or mobile payments.', 'For convenience, get a local transit card or use the QR code function in Alipay/WeChat.'],
        'Riding': ['Stations and signs are in both Chinese and English.', 'Follow the signs for your line number and the final destination to find the right platform.']
      }
    },
    {
      id: 't4-cn',
      name: 'Public Buses (Gōnggòng Qìchē)',
      icon: 'bus',
      description: 'Affordable and extensive bus networks covering cities and rural areas.',
      details: {
        'Payment & Price': ['Fares are very cheap, typically ¥1-¥2 in cities. Exact change is often required if paying cash.', 'Use the same mobile payment QR codes (Alipay/WeChat) as the metro for convenience.'],
        'Navigation': ['Apps like Baidu Maps or Amap (高德地图) are best for bus routes, as Google Maps is unreliable.', 'Stops are announced in Mandarin; knowing your stop\'s name is helpful.'],
        'Tips': ['Buses can be very crowded, especially during rush hour.', 'A great way to see the city from a local\'s perspective.']
      }
    },
    {
      id: 't5-cn',
      name: 'Bicycle-Sharing (Dānchē Gòngxiǎng)',
      icon: 'bike',
      description: 'Convenient short trips using apps like Meituan or HelloBike.',
      details: {
        'Apps & Setup': ['Main providers are Meituan (yellow bikes) and HelloBike (blue bikes), usually integrated within Alipay or WeChat.', 'Setup requires a Chinese phone number and linking to a mobile payment app.'],
        'How it Works': ['Scan the QR code on the bike to unlock it. The ride starts immediately.', 'To end the trip, manually lock the bike in a designated public parking area (look for white painted lines on the sidewalk).'],
        'Price': ['Extremely cheap, usually around ¥1.5 for the first 15-30 minutes.']
      }
    },
    {
      id: 't6-cn',
      name: 'Long-Distance Buses (Kèyùn)',
      icon: 'bus',
      description: 'Budget-friendly intercity travel with sleeper options for overnight routes.',
      details: {
        'Booking': ['Purchase tickets at the corresponding bus station (客运站, kèyùnzhàn). Your passport is required.', 'Trip.com may offer booking for some popular routes.'],
        'Experience': ['Less comfortable than trains but connects to more remote towns and regions.', 'Sleeper buses have bunk beds instead of seats for overnight journeys.'],
        'Traveler Info': ['Arrive at least 30-45 minutes before departure. Bring your own water and snacks.', 'Onboard toilets are very basic or non-existent.']
      }
    },
    {
      id: 't7-cn',
      name: 'Domestic Flights (Guónèi Hángbān)',
      icon: 'plane',
      description: 'Fast connections between major cities with airlines like China Eastern or Air China.',
      details: {
        'Airlines & Booking': ['Major airlines include Air China, China Southern, and China Eastern.', 'Book through Trip.com for the best English-language experience. Prices can be competitive with high-speed rail if booked in advance.'],
        'Airport Info': ['Arrive 2 hours before your flight. Security is thorough.', 'CRITICAL: Power banks must be in carry-on luggage and have their capacity clearly marked. Over 20,000mAh is generally not allowed.']
      }
    },
    {
      id: 't8-cn',
      name: 'Traditional Rickshaws (Lāchē)',
      icon: 'car',
      description: 'Short-distance rides in tourist areas or older neighborhoods.',
      details: {
        'Where to Find': ['Common in tourist areas like Beijing\'s hutongs, Shanghai\'s old town, or near major sights in Xi\'an.', 'This is purely a tourist experience, not a practical form of transport.'],
        '**CRITICAL TIP**': ['**ALWAYS** negotiate and agree on the price *before* you get in. Be very clear if the price is per person or for the entire ride.', 'Be prepared to walk away if the price seems too high.'],
      }
    },
    {
      id: 't9-cn',
      name: 'Ferries & Water Buses (Dùlún)',
      icon: 'boat',
      description: 'Scenic river or coastal transport in cities like Shanghai or Hong Kong.',
      details: {
        'Key Cities': ['Shanghai: Huangpu River cruises offer spectacular skyline views.', 'Hong Kong: The Star Ferry is an iconic, cheap way to cross Victoria Harbour.', 'Guilin: The Li River cruise is a world-famous scenic journey.'],
        'Tickets': ['Purchase tickets at the pier. Prices range from very cheap for commuter ferries to expensive for tourist cruises.'],
        'Tips': ['An excellent way to get a different perspective of a city and great for photography, especially at night.']
      }
    },
    {
      id: 't10-cn',
      name: 'Private Car Rentals (Zūchē)',
      icon: 'car',
      description: 'Self-drive options, though less common due to traffic and license restrictions.',
      details: {
        '**IMPORTANT RESTRICTION**': ['An International Driving Permit (IDP) is **NOT** recognized in China. To rent and drive a car, you must have a valid Chinese driver\'s license.'],
        'Alternative': ['Hiring a car with a private driver is a much more common and recommended option for visitors. This can be arranged through your hotel or services like Didi Luxe.'],
        'When to Use': ['Best for business travel or exploring rural regions not well-served by public transport.']
      }
    }
  ],
  'Japan': [
    {
        id: 't1-jp',
        name: 'Shinkansen (新幹線)',
        icon: 'train',
        description: "Experience Japan's world-famous, punctual, and high-speed bullet trains.",
        details: {
          'Booking & Price': ['Japan Rail Pass: A cost-effective option for multiple long journeys (more details in its own section).', 'Individual tickets can be bought at any major JR station or online. A Tokyo-Kyoto one-way is ~¥14,000.', 'Apps: Navitime or Google Maps for schedules.'],
          'How it Works': ['Reserve seats in advance (指定席, shiteiseki) or use non-reserved cars (自由席, jiyūseki).', 'Trains are extremely punctual; arrive on the platform a few minutes early.', 'Follow platform markings to line up for your car number.'],
          'On Board': ['Etiquette is key: keep calls quiet, phone on silent.', 'Enjoy a bento box (駅弁, ekiben) purchased at the station for a classic experience.']
        }
    },
    {
        id: 't2-jp',
        name: 'IC Cards (Suica/Pasmo)',
        icon: 'car',
        description: "The single most essential item: a rechargeable card for nearly all transport and many purchases.",
        details: {
          'Getting a Card': ['Purchase a physical card at ticket machines in major train stations for a ¥500 refundable deposit.', 'Digital versions (Suica/Pasmo) can be added to iPhone wallets for easy recharging.'],
          'How They Work': ['Simply tap your card on the reader when entering and exiting transport gates. The fare is automatically deducted.', 'If you have insufficient funds, use the "Fare Adjustment" machines (精算機, seisanki) near the exit gates.'],
          'Where to Use': ['Virtually all trains, subways, and buses.', 'Also accepted at convenience stores (konbini), vending machines, station lockers, and many restaurants.']
        }
    },
    {
        id: 't3-jp',
        name: 'Japan Rail Pass (JR Pass)',
        icon: 'train',
        description: 'An all-inclusive pass for tourists offering unlimited travel on most JR trains.',
        details: {
          'Who is it for?': ['Only for foreign tourists visiting Japan on a "Temporary Visitor" visa.', 'Cost-effective if you plan at least one long-distance round trip (e.g., Tokyo-Kyoto-Tokyo).'],
          'How to Get It': ['**CRITICAL:** Purchase an "Exchange Order" from an authorized seller *outside* of Japan before your trip. You then exchange this for the actual pass at a JR office in Japan.', 'Some passes are now sold within Japan, but at a significantly higher price.'],
          'What it Covers': ['Most Shinkansen (except "Nozomi" and "Mizuho" services), all JR-operated limited express, express, rapid, and local trains.', 'Also covers the JR Miyajima Ferry, some JR buses, and the Tokyo Monorail.']
        }
    },
    {
        id: 't4-jp',
        name: 'Metro & Subway (地下鉄)',
        icon: 'train',
        description: 'Efficient urban transit in major cities like Tokyo (Tokyo Metro) and Osaka (Osaka Metro).',
        details: {
          'Key Systems': ['Tokyo Metro & Toei Subway (Tokyo), Osaka Metro, Kyoto Municipal Subway.', 'Lines are color-coded and numbered, making navigation straightforward.'],
          'Navigation & Fares': ['App: Google Maps is extremely accurate for routes, times, platform numbers, and fare costs.', 'Pay per ride using your IC Card (Suica/Pasmo). Single tickets are available but less convenient.', 'Some cities offer 24/48/72-hour tourist subway passes for unlimited travel.'],
          'Tips': ['Avoid rush hour (7:30-9:30 AM & 5-7 PM) in major cities.', 'Look for signs indicating the correct exit for your destination, as large stations can have dozens of exits.']
        }
    },
    {
        id: 't5-jp',
        name: 'Local Trains (JR & Private)',
        icon: 'train',
        description: 'The backbone of city and regional transport, including Tokyo\'s famous Yamanote Line.',
        details: {
          'JR vs. Private Lines': ['JR (Japan Railways) operates a massive nationwide network.', 'Private companies (e.g., Keio, Odakyu, Kintetsu) operate competing lines, often connecting city centers to suburbs or tourist areas (like Hakone).'],
          'How to Use': ['Use an IC Card for seamless travel across most lines.', 'Transfers between different companies may require exiting one set of ticket gates and entering another.'],
          'Famous Examples': ['JR Yamanote Line: Tokyo\'s crucial loop line connecting major hubs like Shinjuku, Shibuya, and Tokyo Station.', 'Hankyu Railway: Connects Osaka, Kobe, and Kyoto.']
        }
    },
    {
        id: 't6-jp',
        name: 'Buses (バス)',
        icon: 'bus',
        description: 'City buses (essential in Kyoto) and long-distance highway buses for budget travel.',
        details: {
          'City Buses': ['How to Ride: In Kyoto and most cities, enter from the back door and take a numbered ticket (or tap IC card). The fare is displayed on a screen at the front. Pay in the machine next to the driver when you exit from the front door (or tap again).', 'Tokyo buses (Toei) have a flat fare and are entered from the front.'],
          'Highway Buses': ['Companies like Willer Express offer a budget-friendly alternative to trains for intercity travel.', 'Overnight buses can save you a night\'s accommodation cost. Options range from basic seats to luxurious pods.'],
          'Booking': ['City buses do not require booking. Highway bus tickets should be booked in advance online or at bus terminals.']
        }
    },
    {
        id: 't7-jp',
        name: 'Taxis (タクシー)',
        icon: 'car',
        description: 'Reliable, clean, and professional, but one of the more expensive transport options.',
        details: {
          'How to Use': ['Hailed on the street (a red light means available), found at taxi stands, or booked via apps (Go, Uber).', 'Doors open and close automatically—do not operate them yourself!', 'Drivers are professional and do not expect tips.'],
          'Price & Payment': ['Fares start at a flag-fall rate (e.g., ~¥500) and increase with distance and time. Fares are higher late at night.', 'Most taxis accept credit cards and IC cards, but it\'s wise to confirm or have cash available.'],
          'Tips': ['Have your destination address written in Japanese. A business card or screenshot from a map is perfect.']
        }
    },
    {
        id: 't8-jp',
        name: 'Bicycle Rentals (レンタサイクル)',
        icon: 'bike',
        description: 'An excellent and enjoyable way to explore cities like Kyoto, Nara, or scenic rural areas.',
        details: {
          'Where to Rent': ['Many rental shops are located near major train stations.', 'Some cities have bike-sharing systems, though they can be tricky for tourists to register for.'],
          'Rules & Etiquette': ['In principle, you must cycle on the road (left side), not the sidewalk, unless signs permit it.', 'Parking is strict. Use designated bicycle parking areas to avoid having your bike impounded.'],
          'Price': ['Typically costs ¥1,000 - ¥2,000 for a full day rental.']
        }
    },
    {
        id: 't9-jp',
        name: 'Ferries (フェリー)',
        icon: 'boat',
        description: 'Essential for reaching islands and for scenic or long-distance travel between regions.',
        details: {
          'Famous Scenic Routes': ['Hiroshima (Miyajimaguchi) to Miyajima Island: The iconic route to see the floating torii gate. The JR Ferry is covered by the Japan Rail Pass.', 'Lake Ashi in Hakone: Pirate-themed sightseeing ships with views of Mt. Fuji.'],
          'Long-Distance & Overnight': ['Connect the main islands, e.g., from Tokyo to Hokkaido or across the Seto Inland Sea.', 'A comfortable and relaxing alternative to flying or trains, offering private cabins and public baths.'],
          'Tickets': ['Purchase at the ferry terminal. For long-distance routes, booking in advance is recommended.']
        }
    },
    {
        id: 't10-jp',
        name: 'Tramways (路面電車)',
        icon: 'bus',
        description: 'Charming and historic streetcars operating in several Japanese cities.',
        details: {
          'Where to Ride': ['Hiroshima (Hiroden): One of Japan\'s most extensive tram networks, great for sightseeing.', 'Nagasaki: The primary mode of public transport for tourists visiting the city\'s main sights.', 'Hakodate & Kagoshima also have notable tram systems.'],
          'How to Use': ['Similar to city buses. You typically enter from the middle or rear door and exit from the front, paying a flat fare as you get off.', 'IC cards are accepted.'],
          'Tips': ['Trams offer a unique, ground-level view of the city at a leisurely pace.']
        }
    },
    {
        id: 't11-jp',
        name: 'Domestic Flights (国内線)',
        icon: 'plane',
        description: 'The fastest way to travel long distances, such as to Hokkaido or Okinawa.',
        details: {
          'Airlines': ['Full-service carriers: JAL (Japan Airlines) and ANA (All Nippon Airways).', 'Budget airlines (LCCs): Peach, Jetstar Japan, and Spring Airlines Japan offer competitive fares but with stricter baggage rules.'],
          'When to Use': ['Best for routes where the Shinkansen is slow or non-existent (e.g., Tokyo to Sapporo, or to any destination in Okinawa).', 'Can sometimes be cheaper than the Shinkansen if booked far in advance.'],
          'Booking': ['Book directly on airline websites or use search engines like Google Flights or Skyscanner.']
        }
    },
    {
        id: 't12-jp',
        name: 'Unique Transport',
        icon: 'car',
        description: 'Experience unique modes of travel from traditional rickshaws to scenic mountain railways.',
        details: {
          'Rickshaws (人力車, Jinrikisha)': ['Found in tourist districts like Asakusa (Tokyo) and Arashiyama (Kyoto).', 'A guided tour rather than a mode of transport. The puller acts as a guide. Agree on the price and route beforehand.'],
          'Cable Cars & Ropeways': ['Common in mountainous areas like Hakone, Mt. Rokko (Kobe), and for accessing temples.', 'Offer stunning panoramic views.'],
          'Sleeper Trains': ['A rare luxury now. The "Sunrise Izumo/Seto" is the last remaining regular overnight train.', 'Offers a nostalgic and comfortable way to travel from Tokyo. Tickets sell out extremely fast.']
        }
    }
  ],
  'USA': [
    {
      id: 't1-us',
      name: 'Rental Cars',
      icon: 'car',
      description: "Essential for road trips and exploring areas outside of major cities.",
      details: {
        'Booking & Price': ['Companies: Hertz, Avis, Enterprise are major players. Use sites like Kayak to compare.', 'Price: Varies by location/season, from $50-$100+ per day. Under-25s pay a high fee.', 'Requirements: Valid driver\'s license. An International Driving Permit (IDP) is recommended.'],
        'On the Road': ['Insurance is crucial. Check your credit card benefits or purchase from the rental company.', 'Gas is sold by the gallon. Drive on the right-hand side of the road.', 'Be aware of tolls, which may require an electronic pass from the rental agency.']
      }
    },
    {
      id: 't2-us',
      name: 'Ride-Hailing (Uber/Lyft)',
      icon: 'car',
      description: 'The most common way to get around cities and suburbs if you don\'t have a car.',
      details: {
        'Apps & Price': ['Apps: Uber and Lyft are dominant. Download and set up your account before you travel.', 'Price: A 15-20 minute ride can cost $15-$30. Prices surge with high demand.'],
        'How it Works': ['Enter your destination, choose your ride type, and a driver will be dispatched to you. Payment is handled through the app.'],
        'Tips': ['Essential for airport transfers and navigating cities with limited public transport.']
      }
    },
    {
      id: 't3-us',
      name: 'Domestic Flights',
      icon: 'plane',
      description: 'The most efficient way to travel long distances between states and regions.',
      details: {
        'Airlines & Booking': ['Major carriers: Delta, American, United. Budget options: Southwest, JetBlue.', 'Book 1-3 months in advance using Google Flights or Skyscanner for best prices.', 'Baggage fees are common, especially on budget airlines. Southwest includes free checked bags.'],
        'Airport Info': ['Arrive at the airport at least 2 hours before your domestic flight for TSA security screening.']
      }
    },
    {
        id: 't4-us',
        name: 'Amtrak Trains',
        icon: 'train',
        description: 'Scenic long-distance routes that offer a unique, relaxed view of the country.',
        details: {
          'Routes & Experience': ['Famous scenic routes include the California Zephyr (Chicago-San Francisco) and the Empire Builder (Chicago-Seattle).', 'It is significantly slower but more relaxing than flying. Good for regional travel, especially in the Northeast Corridor (Boston-NYC-DC).'],
          'Booking & Price': ['Book tickets in advance on the Amtrak website for better prices. Prices can be high compared to flying if booked last minute.'],
          'On Board': ['Trains offer more legroom than planes, and many long-distance routes have dining cars and observation lounges.']
        }
    },
    {
        id: 't5-us',
        name: 'Subway/Metro',
        icon: 'train',
        description: 'Efficient and affordable public transit systems in major metropolitan areas.',
        details: {
          'Key Systems': ['New York City (MTA): The most extensive system, runs 24/7.', 'Washington, D.C. (Metro): Clean and efficient, connecting the city with Virginia and Maryland suburbs.', 'Chicago (The "L"): Iconic elevated and subway trains.', 'Other notable systems in Boston (The "T"), San Francisco (BART/Muni), and Philadelphia (SEPTA).'],
          'Tickets & Payment': ['Most systems use a rechargeable card (NYC\'s OMNY/MetroCard, DC\'s SmarTrip). Many now support contactless credit/debit card taps.'],
          'Tips': ['The absolute best way to navigate dense city centers and avoid traffic jams.']
        }
    },
    {
        id: 't6-us',
        name: 'Buses (Intercity)',
        icon: 'bus',
        description: 'Budget-friendly intercity travel connecting thousands of large and small towns.',
        details: {
          'Companies': ['Greyhound: The most extensive network, serving the entire country.', 'Megabus & FlixBus: Offer cheaper, modern service on popular routes, often with Wi-Fi.'],
          'Experience': ['The most affordable but also the slowest mode of long-distance transport.', 'Comfort levels can vary, but it\'s a great option for travelers on a tight budget.'],
          'Booking': ['Book tickets online in advance for the lowest fares.']
        }
    },
    {
        id: 't7-us',
        name: 'Taxis',
        icon: 'car',
        description: 'Traditional cabs, still common in major cities but often more expensive than ride-hailing.',
        details: {
          'How to Use': ['Hailed on the street in cities like NYC, or found at designated taxi stands at airports, train stations, and hotels.', 'Look for the official medallion or markings of the city.'],
          'Price & Payment': ['Fares are calculated by a meter. Generally more expensive than Uber/Lyft, except during peak surge pricing.', 'Most now accept credit cards, but it\'s wise to confirm.'],
          'Tips': ['Can be a more straightforward option at busy airports where ride-share pickups can be confusing.']
        }
    },
    {
        id: 't8-us',
        name: 'Bike-Sharing',
        icon: 'bike',
        description: 'A convenient and enjoyable way to make short trips in many urban areas.',
        details: {
          'Key Systems': ['Citi Bike (New York City), Divvy (Chicago), and Bluebikes (Boston) are large, station-based systems.', 'App-based, dockless bikes and scooters (Lime, Bird) are common in many other cities.'],
          'How it Works': ['Use the respective app to find a bike/station and unlock it. You can buy single rides or day passes.', 'Return station-based bikes to any empty dock. Park dockless bikes responsibly.'],
          'Tips': ['An excellent way to explore parks, waterfronts, and neighborhoods. Always be aware of local traffic and bike lane rules.']
        }
    },
    {
        id: 't9-us',
        name: 'Ferries',
        icon: 'boat',
        description: 'Provide essential commuter links and scenic sightseeing in coastal and lakeside cities.',
        details: {
          'Famous Routes': ['NYC: The Staten Island Ferry is free and offers fantastic views of the Statue of Liberty and Manhattan skyline. NYC Ferry connects the boroughs.', 'Seattle: Washington State Ferries are a key part of regional transport, with the Seattle-Bainbridge Island route being very popular.', 'San Francisco: Ferries connect the city to Sausalito, Alcatraz, and Oakland.'],
          'Tickets': ['Purchase tickets at the ferry terminal before boarding.'],
          'Tips': ['Often provides the best photo opportunities of a city\'s skyline from the water.']
        }
    },
    {
        id: 't10-us',
        name: 'Walking',
        icon: 'bike',
        description: 'The best way to experience dense, historic, and vibrant city centers.',
        details: {
          'Best Cities for Walking': ['New York City (especially Manhattan), Boston, San Francisco, Chicago (Downtown/Loop), and the French Quarter in New Orleans are highly walkable.', 'Most other US cities are very spread out and designed for cars.'],
          'Tips': ['Walking is ideal for exploring specific neighborhoods in-depth.', 'Use marked crosswalks ("zebra crossings") to cross streets; cars are legally required to stop for pedestrians in them.'],
          'Safety': ['As in any large city, be aware of your surroundings, especially at night.']
        }
    }
  ],
   'Italy': [
    {
      id: 't1-it',
      name: 'Trains (Trenitalia/Italo)',
      icon: 'train',
      description: "An extensive and efficient network connecting major cities and small towns.",
      details: {
        'Types & Price': ['High-Speed (Frecciarossa, Italo): Fast, modern, connect major cities. Book in advance for big discounts (e.g., Rome-Florence from €20-€70+).', 'Regional (Regionale): Slower, cheaper, serve smaller towns. Fixed price, can buy on the day.'],
        'Booking & Apps': ['Apps: Trenitalia and Italo Treno have official apps. Omio is a good third-party comparison tool.', 'Booking high-speed trains weeks or months ahead saves a lot of money.'],
        '**VALIDATION IS CRITICAL**': ['If you have a paper ticket for a Regionale train, you MUST validate it in a small green/white machine on the platform before boarding, or risk a hefty fine. High-speed e-tickets do not need validation.']
      }
    },
    {
      id: 't2-it',
      name: 'Public Transport (Cities)',
      icon: 'bus',
      description: 'Using buses, trams, and metros in cities like Rome, Milan, and Florence.',
      details: {
        'Tickets & Price': ['Tickets (Biglietto) must be bought *before* boarding from tobacco shops (Tabacchi, marked with a "T"), newsstands, or metro stations.', 'A standard ticket (BIT) in Rome costs €1.50 and is valid for 100 minutes on buses/trams or one metro ride.'],
        'How it Works': ['Once on the bus or tram, you MUST validate your ticket in the small machine on board.', 'Failure to buy or validate a ticket will result in a fine, and ignorance is not an accepted excuse.'],
        'Tips': ['Google Maps is reliable for bus and metro routing in major cities.']
      }
    },
    {
        id: 't3-it',
        name: 'Vaporetto (Venice)',
        icon: 'boat',
        description: 'The water bus system that serves as Venice\'s primary mode of public transport.',
        details: {
          'Tickets & Price': ['A single ride is expensive (€9.50). It\'s much more economical to buy a timed pass (e.g., 24h for €25, 48h for €35).', 'Buy passes from ticket booths at major stops (e.g., Ferrovia, Piazzale Roma, San Marco) or automated machines.'],
          'How it Works': ['Tap your pass on the validator before entering the floating platform area.', 'Check the line number and destination on the signs at the stop. Lines 1 and 2 run along the Grand Canal.'],
          'Tips': ['Stand in the outdoor areas at the front or back for the best views.', 'These boats can get very crowded. Be prepared to stand.']
        }
    }
  ],
  'France': [
    {
      id: 't1-fr',
      name: 'TGV & Intercités Trains',
      icon: 'train',
      description: "Travel quickly between French cities on the high-speed TGV and other national trains.",
      details: {
        'Booking & Price': ['App: SNCF Connect is the official app. Book TGV tickets as early as possible (up to 3 months ahead) for the lowest fares (from €25).', 'OUIGO is the low-cost TGV service—cheaper but with stricter luggage rules and often from secondary stations.'],
        'How it Works': ['Seat reservations are mandatory on TGVs. Your ticket will show your car (voiture) and seat (place).', 'Before boarding, you may need to validate (composter) paper tickets at a yellow machine on the platform. E-tickets on your phone do not need this.'],
        'On Board': ["Trains are comfortable and offer café-bar services.", "Store large luggage in racks at the end of each car."]
      }
    },
    {
      id: 't2-fr',
      name: 'Paris Métro & RER',
      icon: 'train',
      description: 'Navigating the dense and efficient public transport network of Paris.',
      details: {
        'Tickets & Price': ['A single ticket "t+" costs ~€2.15. A carnet of 10 is cheaper.', 'For longer stays, consider a Navigo Découverte pass (weekly/monthly, runs Mon-Sun) or a day pass (Mobilis).', 'Apps: Citymapper and Bonjour RATP are excellent for navigation.'],
        'How it Works': ['The Métro uses numbered lines for travel within Paris. The RER (letters A, B, C, etc.) is a regional express network that goes to suburbs and airports (Versailles, CDG, Disneyland).', 'Keep your ticket until you exit the station, as checks are common.'],
        'Tips': ['Beware of pickpockets, especially in crowded stations and trains.', 'The network is old; many stations are not accessible (lack elevators/escalators).']
      }
    },
    {
        id: 't3-fr',
        name: 'Ride-Sharing & Taxis',
        icon: 'car',
        description: 'Options for getting around cities when public transport is less convenient.',
        details: {
          'Apps & Price': ['Apps: Uber is widely available. Bolt and FreeNow are common alternatives and can sometimes be cheaper.', 'Prices are comparable to other Western European cities.'],
          'Taxis': ['Official taxis (e.g., Taxis G7 in Paris) can be hailed, found at taxi stands, or booked via app/phone.', 'Taxis are generally more expensive than ride-sharing apps, especially for airport runs where ride-sharing apps often have flat rates.'],
          'Tips': ['Ride-sharing is often easier for non-French speakers due to in-app translation and payment.', 'For airport transfers, booking a taxi or ride-share in advance can provide peace of mind and a fixed price.']
        }
    }
  ]
};

const resourcesData: UsefulResource[] = [
    { id: 'r1', name: 'Google Maps', icon: 'message', description: 'Essential for navigation, finding public transit routes, and discovering local businesses. Download offline maps.', url: 'https://www.google.com/maps' },
    { id: 'r2', name: 'Google Translate', icon: 'wallet', description: 'Break down language barriers with text, voice, and camera translation. Download languages for offline use.', url: 'https://translate.google.com/' },
    { id: 'r3', name: 'Trip.com / Expedia', icon: 'plane', description: 'Go-to platforms for booking flights, trains, and hotels worldwide. Compare prices for the best deals.', url: 'https://www.trip.com/' },
    { id: 'r4', name: 'XE Currency', icon: 'book', description: 'A powerful currency converter to check live exchange rates on the go. Avoids confusion when shopping.', url: 'https://www.xe.com/' },
    { id: 'r5', name: 'A Good VPN', icon: 'globe', description: 'Crucial for accessing blocked international websites and apps in certain countries. Install before you go.', url: 'https://www.expressvpn.com/' },
];

const heroImages = [
    { src: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=400', alt: 'Man walking in a desert canyon', className: 'hero-img-1' },
    { src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400', alt: 'Longtail boat in a Thai lagoon', className: 'hero-img-2' },
    { src: 'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?q=80&w=400', alt: 'Hiker looking over a cliff', className: 'hero-img-3' },
    { src: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=400', alt: 'Person walking on a snowy mountain', className: 'hero-img-4' },
    { src: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400', alt: 'Person walking on a boat in a Vietnamese river', className: 'hero-img-5' },
    { src: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=400', alt: 'Suitcase covered in travel stickers', className: 'hero-img-6' },
    { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400', alt: 'Colorful Italian coastal village', className: 'hero-img-7' }
];


// --- SVG ICONS ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
);

const TrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.12a5.5 5.5 0 0 0-5.5 5.5v5.38a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8.62a5.5 5.5 0 0 0-5.5-5.5z"/><path d="M22 17h-1"/><path d="m21 17-1.5-3h-11L7 17"/><path d="M3 17H2"/><path d="M7 17a2 2 0 0 1-2 2H3"/><path d="M17 17a2 2 0 0 0 2 2h2"/><circle cx="7.5" cy="19.5" r="2.5"/><circle cx="16.5" cy="19.5" r="2.5"/></svg>
);

const CarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M7 17h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);

const BusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/><path d="M12 6V4"/><path d="M12 20v-2"/><path d="M4 12h16"/><path d="M6 12v-2"/><path d="M18 12v-2"/></svg> );
const BoatIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 10.3c.1-.5-.3-1.3-.8-1.3l-2.4-.1c-.5-.1-.9-.6-1-1.1l-.9-2.7c-.2-.5-.8-.8-1.3-.6s-.8.8-.6 1.3l.9 2.7c.1.5.5 1 1 1.1l2.4.1c.5 0 .8.8.8 1.3M12 21.5c-4.6 0-8.4-3.8-8.4-8.5S7.4 4.5 12 4.5s8.4 3.8 8.4 8.5-3.8 8.5-8.4 8.5z"/><path d="M12 4.5 C 10 4.5, 9 7, 9 9 s 1 4.5, 3 4.5 s 3 -2.5, 3 -4.5 s -1 -4.5, -3 -4.5 z"/><path d="M12 13.5 C 14 13.5, 15 11, 15 9 s -1 -4.5, -3 -4.5 s -3 2.5, -3 4.5 s 1 4.5, 3 4.5 z"/></svg>);
const BikeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 17.5h-5.5"/><path d="m11.5 14-3-6.5L6 14"/><path d="m18.5 17.5-3-6.5 3-4.5h-3"/></svg> );

const MessageIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> );
const WalletIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M18 12a2 2 0 0 0-2 2h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2z"/></svg> );
const PlaneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1.5-1.5-3-1-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg> );
const BookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5a2.5 2.5 0 0 1 0-5H20V9H6.5a2.5 2.5 0 0 1 0-5H20V2H6.5A2.5 2.5 0 0 1 4 4.5v15z"/></svg> );
const GlobeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> );

const Icons = {
    train: <TrainIcon />,
    car: <CarIcon />,
    plane: <PlaneIcon />,
    bus: <BusIcon />,
    boat: <BoatIcon />,
    bike: <BikeIcon />,
    message: <MessageIcon />,
    wallet: <WalletIcon />,
    book: <BookIcon />,
    globe: <GlobeIcon />,
};

// --- COMPONENTS ---
type View = 'home' | 'guides' | 'explore' | 'discover';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    isDetailViewActive: boolean;
    onNavClick: () => void;
}

const Header = ({ currentView, setView, isDetailViewActive, onNavClick }: HeaderProps) => {
    const handleNav = (view: View) => {
        if (isDetailViewActive) onNavClick();
        setView(view);
    };

    return (
        <header className="site-header">
            <div className="site-logo" onClick={() => handleNav('home')} role="button" tabIndex={0}>
                <h1>Guide</h1>
            </div>
            <nav className="header-nav">
                <div className="nav-links">
                    <button className={`nav-link ${currentView === 'guides' ? 'active' : ''}`} onClick={() => handleNav('guides')}>Guide</button>
                    <button className={`nav-link ${currentView === 'explore' ? 'active' : ''}`} onClick={() => handleNav('explore')}>Explore</button>
                    <button className="nav-link">Contact Us</button>
                    <button className={`nav-link ${currentView === 'discover' ? 'active' : ''}`} onClick={() => handleNav('discover')}>Discover</button>
                </div>
            </nav>
            <div className="header-auth">
                <button className="login-btn">Log in</button>
                <button className="signup-btn">Sign Up</button>
            </div>
        </header>
    );
};

const Hero = () => (
    <section className="hero-section">
        {heroImages.map(img => (
            <div key={img.className} className={`hero-image-container ${img.className}`}>
                <img src={img.src} alt={img.alt} />
            </div>
        ))}
        <div className="hero-content">
            <h2 className="hero-title">Explore The World<br />Easily & Comfortably</h2>
            <p className="hero-subtitle">find the best destinations and plan your dream trip at the best prices, find the best destinations and plan your dream trip</p>
            <div className="hero-tags">
                <span className="tag">Waterfall</span>
                <span className="tag">Guide</span>
                <span className="tag">Staycation</span>
                <span className="tag">Hotel</span>
                <span className="tag">Destination</span>
                <span className="tag">Toure</span>
            </div>
        </div>
    </section>
);


interface CityGuidesProps {
    cities: CityGuide[];
    onSelectCity: (city: CityGuide) => void;
}
const CityGuides = ({ cities, onSelectCity }: CityGuidesProps) => (
    <div className="card-grid">
        {cities.map((city, index) => (
            <article 
                key={city.id} 
                className="image-card" 
                onClick={() => onSelectCity(city)} 
                tabIndex={0} 
                onKeyDown={(e) => e.key === 'Enter' && onSelectCity(city)}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <img src={city.image} alt={`View of ${city.name}`} />
                <div className="image-card-content">
                    <h3>{city.name}</h3>
                </div>
            </article>
        ))}
    </div>
);


const GuidesView = ({ onSelectCity }) => {
    const countries = Object.keys(countryData);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const cities = countryData[selectedCountry];

    return (
        <div>
            <h2 className="page-title">City Guides</h2>
            <div className="country-selector">
                {countries.map(country => (
                    <button 
                        key={country}
                        className={`country-btn ${selectedCountry === country ? 'active' : ''}`}
                        onClick={() => setSelectedCountry(country)}
                    >
                        {country}
                    </button>
                ))}
            </div>
            {/* Using key to force re-render and re-trigger animations */}
            <CityGuides key={selectedCountry} cities={cities} onSelectCity={onSelectCity} />
        </div>
    );
};

interface CityDetailProps {
    city: CityGuide;
    onBack: () => void;
}
const CityDetail = ({ city, onBack }: CityDetailProps) => (
    <div>
        <h2 className="page-title">
            <button onClick={onBack} className="back-button" aria-label="Go back to city guides">
                <BackIcon />
            </button>
            {city.name}
        </h2>
        <div className="detail-card">
            <section className="detail-section">
                <h3>Highlights</h3>
                <ul>
                    {city.highlights.map(h => <li key={h}>✨ {h}</li>)}
                </ul>
            </section>
            <section className="detail-section">
                <h3>Transportation</h3>
                <ul>
                    <li><strong>From Airport:</strong> {city.transportation.fromAirport}</li>
                    <li><strong>Within City:</strong> {city.transportation.withinCity}</li>
                </ul>
            </section>
            <section className="detail-section">
                <h3>Must-Try Foods</h3>
                <ul>
                    {city.mustTryFoods.map(f => (
                        <li key={f.dish}>
                           <strong>{f.dish}:</strong> {f.description} (Try at: {f.recommendedRestaurant})
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    </div>
);


interface TransportationViewProps {
    onSelectTransport: (transport: TransportationGuide) => void;
}
const TransportationView = ({ onSelectTransport }: TransportationViewProps) => {
    const countries = Object.keys(transportationData);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const transports = transportationData[selectedCountry];

    const TransportCards = () => (
        <div className="card-grid">
            {transports.map((transport, index) => (
                <article 
                    key={transport.id} 
                    className="icon-card transport-card" 
                    onClick={() => onSelectTransport(transport)} 
                    tabIndex={0} 
                    onKeyDown={(e) => e.key === 'Enter' && onSelectTransport(transport)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <header className="icon-card-header">
                        {Icons[transport.icon]}
                        <h3>{transport.name}</h3>
                    </header>
                    <p className="icon-card-description">{transport.description}</p>
                </article>
            ))}
        </div>
    );

    return (
        <>
            <h2 className="page-title">Transportation Guides</h2>
            <div className="country-selector">
                {countries.map(country => (
                    <button 
                        key={country}
                        className={`country-btn ${selectedCountry === country ? 'active' : ''}`}
                        onClick={() => setSelectedCountry(country)}
                    >
                        {country}
                    </button>
                ))}
            </div>
             <TransportCards key={selectedCountry} />
        </>
    );
};


interface TransportationDetailProps {
    transport: TransportationGuide;
    onBack: () => void;
}
const TransportationDetail = ({ transport, onBack }: TransportationDetailProps) => (
    <div>
        <h2 className="page-title">
            <button onClick={onBack} className="back-button" aria-label="Go back to transportation guides">
                <BackIcon />
            </button>
            {transport.name}
        </h2>
        <div className="detail-card">
            {Object.entries(transport.details).map(([title, points]) => (
                 <section key={title} className="detail-section">
                    <h3>{title}</h3>
                    <ul>
                        {points.map((point, index) => <li key={index}>▸ {point}</li>)}
                    </ul>
                </section>
            ))}
        </div>
    </div>
);

const UsefulWebsites = () => (
    <>
        <h2 className="page-title">Useful Websites & Apps</h2>
        <div className="card-grid">
            {resourcesData.map(resource => (
                <article key={resource.id} className="icon-card resource-card">
                     <header className="icon-card-header">
                        {Icons[resource.icon]}
                        <h3>{resource.name}</h3>
                    </header>
                    <p className="icon-card-description">{resource.description}</p>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-card-link">
                        Visit Website
                    </a>
                </article>
            ))}
        </div>
    </>
);

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} Guide. All rights reserved.</p>
            <div className="footer-links">
                 <a href="#">About Us</a>
                 <a href="#">Contact</a>
                 <a href="#">Privacy Policy</a>
            </div>
        </div>
    </footer>
);


const App = () => {
    const [view, setView] = useState<View>('guides');
    const [selectedCity, setSelectedCity] = useState<CityGuide | null>(null);
    const [selectedTransport, setSelectedTransport] = useState<TransportationGuide | null>(null);

    const clearSelections = () => {
        setSelectedCity(null);
        setSelectedTransport(null);
    }

    const mainContent = () => {
        if (selectedCity) {
            return <CityDetail city={selectedCity} onBack={() => setSelectedCity(null)} />;
        }
        if (selectedTransport) {
            return <TransportationDetail transport={selectedTransport} onBack={() => setSelectedTransport(null)} />;
        }
        switch(view) {
            case 'home': return <Hero />;
            case 'guides': return <GuidesView onSelectCity={setSelectedCity} />;
            case 'explore': return <TransportationView onSelectTransport={setSelectedTransport} />;
            case 'discover': return <UsefulWebsites />;
            default: return <Hero />;
        }
    };

    return (
        <div className="app-wrapper">
            <Header
                currentView={view}
                setView={setView}
                isDetailViewActive={!!selectedCity || !!selectedTransport}
                onNavClick={clearSelections}
            />
            <div className="app-container">
                <main>
                    {mainContent()}
                </main>
            </div>
            <Footer />
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);