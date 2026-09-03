export type PropertyLocaleFields = {
  title: string;
  location: string;
  description: string;
  amenities: string[];
  host?: { about?: string };
  locationDetails?: {
    address: string;
    neighborhood: string;
    description: string;
    transport: Array<{ name: string }>;
    infrastructure: Array<{ name: string }>;
  };
};

export const enPropertyLocales: Record<number, PropertyLocaleFields> = {
  1: {
    title: 'Cozy Studio Near the Hermitage',
    location: 'Saint Petersburg • Central District',
    description:
      'A bright and incredibly cozy studio just two minutes from Palace Square. Everything you need for a comfortable stay is inside: a soft double bed, a modern kitchen, and high-speed Wi-Fi. The windows overlook a quiet St. Petersburg courtyard, so city noise will not disturb you.',
    amenities: [
      'High-speed Wi-Fi',
      'Kitchen with cookware',
      'Smart TV',
      'Air conditioning',
      'Washing machine',
    ],
    host: {
      about:
        'Hi! I love long walks through nighttime St. Petersburg and I am passionate about film photography. I would be happy to point you to the most scenic rooftops for photo shoots and help you plan an off-the-beaten-path route through hidden courtyards.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Moyka River Embankment, 42',
      neighborhood: 'Central District, Saint Petersburg',
      description:
        'The very heart of St. Petersburg. The Hermitage, St. Isaac\'s Cathedral, and Nevsky Prospect are all within walking distance. An ideal location for tourists.',
      transport: [{ name: 'Admiralteyskaya Metro' }, { name: 'Palace Square Stop' }],
      infrastructure: [
        { name: 'VkusVill' },
        { name: 'F. Volchek Bakery' },
        { name: 'Gosti Restaurant' },
      ],
    },
  },
  2: {
    title: 'Loft in Petrogradsky District',
    location: 'Saint Petersburg • Petrogradsky District',
    description:
      'A stylish two-level loft with four-meter ceilings in a historic building. Exposed brick walls, vintage furniture, and panoramic windows make this space one of a kind. Perfect for those who appreciate aesthetics.',
    amenities: ['Wi-Fi', 'Coffee machine', 'Smart speaker and vinyl', 'Comfortable workspace'],
    host: {
      about:
        'Welcome! In my free time I restore furniture and collect vinyl records. If you would like, I can give you a mini tour of the best entrance halls on the Petrograd Side and recommend great bars with live music.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Bolshoy Prospekt P.S., 45',
      neighborhood: 'Petrograd Side, Saint Petersburg',
      description:
        'A trendy, dynamic neighborhood full of boutiques, craft pubs, specialty coffee shops, and Art Nouveau architecture.',
      transport: [{ name: 'Petrogradskaya Metro' }, { name: 'Chkalovskaya Metro' }],
      infrastructure: [{ name: 'Azbuka Vkusa' }, { name: 'Skuratov Coffee' }],
    },
  },
  3: {
    title: 'Apartment with Neva River Views',
    location: 'Saint Petersburg • Admiralteysky District',
    description:
      'Luxurious apartment with direct views of the Neva River and the drawbridges. A spacious living room, premium bedding, and a balcony where you can enjoy your morning coffee while watching boats pass by.',
    amenities: ['Wi-Fi', 'Balcony with a view', 'Air conditioning', 'Whirlpool bath', 'Minibar'],
    host: {
      about:
        'I am passionate about art history and theater. I would be happy to help you get tickets to the best performances at the Mariinsky Theatre or recommend contemporary art exhibitions worth visiting this week.',
    },
    locationDetails: {
      address: 'Saint Petersburg, English Embankment, 24',
      neighborhood: 'Admiralteysky District, Saint Petersburg',
      description:
        'An aristocratic neighborhood with stunning views. The Bronze Horseman and St. Isaac\'s Square are nearby.',
      transport: [{ name: 'Truda Square Stop' }, { name: 'Admiralteyskaya Metro' }],
      infrastructure: [{ name: 'Stroganoff Restaurant' }, { name: 'New Holland Island' }],
    },
  },
  4: {
    title: 'Scandinavian Apartment',
    location: 'Saint Petersburg • Vasileostrovsky District',
    description:
      'Minimalism, wood, and plenty of natural light. This apartment on Vasilyevsky Island is ideal for those seeking tranquility. An equipped workspace by the window lets you work comfortably in peace and quiet.',
    amenities: ['Wi-Fi', 'Kitchen', 'Workspace'],
    host: {
      about:
        'An avid cyclist and coffee lover. There are two bikes in the hallway — take them for free and ride along the embankments! I have also put together a paper map for guests with my favorite off-the-beaten-path coffee shops.',
    },
    locationDetails: {
      address: 'Saint Petersburg, 8th Line V.O., 15',
      neighborhood: 'Vasilyevsky Island, Saint Petersburg',
      description:
        'An academic, unhurried neighborhood with straight streets, spacious embankments, and a student atmosphere.',
      transport: [{ name: 'Vasileostrovskaya Metro' }],
      infrastructure: [{ name: 'Perekrestok Supermarket' }, { name: 'British Bakeries' }],
    },
  },
  5: {
    title: 'Designer Apartment',
    location: 'Saint Petersburg • Moskovsky District',
    description:
      'Spacious apartment in a new business-class residential complex. Fresh renovation following a custom design project, gated community, security, and a coffee shop on the ground floor.',
    amenities: ['Wi-Fi', 'Free parking', 'Gym in the building', '4K TV', 'Air conditioning'],
    host: {
      about:
        'I am passionate about cooking and gardening. All the plants in the apartment are live ones — I hope they will brighten your stay. I am always happy to help with car rental or event tickets, so feel free to reach out anytime!',
    },
    locationDetails: {
      address: 'Saint Petersburg, Moskovsky Prospekt, 183',
      neighborhood: 'Moskovsky District, Saint Petersburg',
      description:
        'A prestigious neighborhood with wide avenues and Stalin-era architecture. Convenient access to Pulkovo Airport.',
      transport: [{ name: 'Moskovskaya Metro' }, { name: 'Pulkovo Airport' }],
      infrastructure: [{ name: 'Pyaterochka' }, { name: 'Tokyo City Restaurant' }],
    },
  },
  6: {
    title: 'Cozy Hideaway in the Courtyards',
    location: 'Saint Petersburg • Central District',
    description:
      'Authentic St. Petersburg atmosphere. The apartment is tucked away in a system of pass-through courtyard wells, so it is surprisingly quiet despite being on the city\'s main restaurant street.',
    amenities: ['Wi-Fi', 'Heating', 'Luggage storage', 'Hair dryer'],
    host: {
      about:
        'I read a lot and collect old editions of books. You will find classics and guidebooks on the shelves — feel free to browse over evening tea. I would be glad to join you for dinner and share local urban legends.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Rubinstein Street, 23',
      neighborhood: 'Rubinstein Street, Saint Petersburg',
      description:
        'Russia\'s main restaurant street. Hundreds of bars, cafés, and restaurants for every taste are literally around the corner.',
      transport: [{ name: 'Dostoyevskaya Metro' }],
      infrastructure: [{ name: 'Bekitzer Bar' }, { name: '22 Centimeters Pizzeria' }],
    },
  },
  7: {
    title: 'Classic Apartment Near the Mariinsky',
    location: 'Saint Petersburg • Admiralteysky District',
    description:
      'A spacious three-room apartment with crown molding on high ceilings, antique furniture, and herringbone parquet. Perfect for cultural trips and lovers of classical architecture.',
    amenities: ['Wi-Fi', 'Real piano', 'Library', 'Bathtub', 'Full kitchen'],
    host: {
      about:
        'I am passionate about classical music and floristry. I love welcoming guests in person and treating them to homemade pastries. I would be happy to arrange a private backstage tour of the city\'s theaters for you.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Dekabristov Street, 34',
      neighborhood: 'Admiralteysky District',
      description: 'A quiet, refined neighborhood centered around the Mariinsky Theatre.',
      transport: [{ name: 'Mariinsky Theatre Stop' }],
      infrastructure: [{ name: 'Mariinsky Theatre' }, { name: 'Dixie Supermarket' }],
    },
  },
  8: {
    title: 'Smart Home on Krestovsky Island',
    location: 'Saint Petersburg • Petrogradsky District',
    description:
      'Exclusive apartment in an elite residential complex on Krestovsky Island. The space is fully automated: lighting, curtains, climate, and music are controlled by voice commands or from a tablet.',
    amenities: [
      'Wi-Fi',
      'Smart home system',
      'Climate control',
      'Underground parking',
      '24-hour security',
    ],
    host: {
      about:
        'My passions are gadgets, yachting, and morning runs. I am always happy to join you for a jog through Krestovsky Island\'s parks. I can also help arrange a yacht rental for a trip along the Gulf of Finland.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Krestovsky Prospekt, 15',
      neighborhood: 'Krestovsky Island',
      description:
        'The greenest and most upscale neighborhood in the city. Parks, yacht clubs, and prestigious waterfront restaurants.',
      transport: [{ name: 'Krestovsky Ostrov Metro' }],
      infrastructure: [{ name: 'Primorsky Victory Park' }, { name: 'Karl & Friedrich Restaurant' }],
    },
  },
  9: {
    title: 'Bright Studio',
    location: 'Saint Petersburg • Vyborgsky District',
    description:
      'Small but very ergonomic studio near the metro. A great budget option for students, solo travelers, or couples visiting for the weekend.',
    amenities: ['Wi-Fi', 'Mini kitchen', 'Microwave', 'Shower'],
    host: {
      about:
        'I love hiking, yoga, and board games. I would be happy to arrange contactless check-in and I am always available on messaging apps to resolve any issue quickly.',
    },
    locationDetails: {
      address: 'Saint Petersburg, Engels Prospekt, 111',
      neighborhood: 'Vyborgsky District',
      description:
        'A quiet residential neighborhood with a well-developed transport network and large green recreational areas.',
      transport: [{ name: 'Ozerki Metro' }],
      infrastructure: [{ name: "O'KEY" }, { name: 'Suzdal Lakes' }],
    },
  },
  10: {
    title: 'Stalin-Era Apartment',
    location: 'Saint Petersburg • Moskovsky District',
    description:
      'Spacious apartment with a bay window and thick brick walls that provide excellent sound insulation. Authentic Stalin-era architecture with wide windowsills.',
    amenities: ['Wi-Fi', 'Gas stove', 'Washing machine', 'Large kitchen'],
    host: {
      about:
        'A passionate lover of history and architecture. On my days off I lead custom tours of the entrance halls of Stalin-era buildings on Moskovsky Prospekt. I would be glad to share the history of this building with you!',
    },
    locationDetails: {
      address: 'Saint Petersburg, Moskovsky Prospekt, 190',
      neighborhood: 'Park Pobedy',
      description: 'A green neighborhood with magnificent monumental Soviet-era architecture.',
      transport: [{ name: 'Park Pobedy Metro' }],
      infrastructure: [{ name: 'Moscow Victory Park' }],
    },
  },
  11: {
    title: "Anna's Apartment",
    location: 'Moscow • Central District',
    description:
      'Bright apartment in the very center of Moscow. Spacious living room, fully equipped kitchen, and cozy bedroom. Red Square, parks, and the city\'s best cafés are nearby.',
    amenities: ['Wi-Fi', 'Kitchen', 'Washing machine'],
    host: {
      about: 'I love Moscow and enjoy sharing my favorite places with guests.',
    },
    locationDetails: {
      address: 'Moscow, Tverskaya Street, 12',
      neighborhood: 'Central District, Moscow',
      description: 'The historic heart of the capital, with major landmarks within walking distance.',
      transport: [{ name: 'Okhotny Ryad Metro' }],
      infrastructure: [{ name: 'VkusVill' }],
    },
  },
  12: {
    title: "Studio on Patriarch's Ponds",
    location: 'Moscow • Presnensky District',
    description:
      'Designer studio on a quiet lane near Patriarch\'s Ponds. Panoramic windows, custom furniture, and everything you need for a comfortable stay in the city center.',
    amenities: ['Wi-Fi', 'Coffee machine', 'Smart TV'],
    host: {
      about: 'I collect vintage furniture and love morning walks around the ponds.',
    },
    locationDetails: {
      address: 'Moscow, Bolshoy Patriarshy Lane, 8',
      neighborhood: 'Presnensky District, Moscow',
      description:
        'One of Moscow\'s most atmospheric neighborhoods, with restaurants and scenic strolls.',
      transport: [{ name: 'Mayakovskaya Metro' }],
      infrastructure: [{ name: 'Double B Coffee' }],
    },
  },
  13: {
    title: 'Apartment by the Moskva River',
    location: 'Moscow • Yakimanka',
    description:
      'Modern apartment with embankment views. Two bedrooms, a spacious open-plan kitchen and living room, and a separate work area. Ideal for a family or an extended stay.',
    amenities: ['Wi-Fi', 'Parking', 'Air conditioning'],
    host: {
      about: 'I can help you plan a route along the embankments and parks of Zamoskvorechye.',
    },
    locationDetails: {
      address: 'Moscow, Kadashyovskaya Embankment, 6',
      neighborhood: 'Yakimanka, Moscow',
      description: 'A quiet waterfront neighborhood with quick access to the city center and Muzeon Park.',
      transport: [{ name: 'Tretyakovskaya Metro' }],
      infrastructure: [{ name: 'Muzeon Park' }],
    },
  },
  14: {
    title: 'House Near Sokolniki',
    location: 'Moscow • Sokolniki',
    description:
      'Cozy house with a terrace and green yard near Sokolniki Park. Perfect for a peaceful getaway away from downtown bustle, with convenient metro access.',
    amenities: ['Wi-Fi', 'Terrace', 'Kitchen'],
    host: {
      about: 'I run in the park every morning and know the best routes for walks.',
    },
    locationDetails: {
      address: 'Moscow, Sokolnichesky Val, 1',
      neighborhood: 'Sokolniki, Moscow',
      description: 'A green neighborhood with a large park and well-developed infrastructure.',
      transport: [{ name: 'Sokolniki Metro' }],
      infrastructure: [{ name: 'Sokolniki Park' }],
    },
  },
  15: {
    title: "Anna's Apartment",
    location: 'Central District, Saint Petersburg',
    description:
      'Bright apartment with modern renovation. Perfect for a couple or solo traveler. Metro and major landmarks are within walking distance.',
    amenities: ['Wi-Fi', 'Kitchen'],
    host: {
      about: 'Happy to welcome guests and help with city recommendations.',
    },
    locationDetails: {
      address: 'Central District, Saint Petersburg',
      neighborhood: 'Central District, Saint Petersburg',
      description: 'A convenient neighborhood with well-developed infrastructure.',
      transport: [],
      infrastructure: [],
    },
  },
  16: {
    title: 'Room in Guest House "By the River"',
    location: 'Frunzensky District, Saint Petersburg',
    description:
      'Bright room in my apartment with modern renovation. I did everything as I would for myself, so you will feel comfortable. The metro is just a 5-minute walk away.',
    amenities: ['Wi-Fi', 'Kitchen'],
    host: {
      about: 'Happy to welcome guests and help with city recommendations.',
    },
    locationDetails: {
      address: 'Frunzensky District, Saint Petersburg',
      neighborhood: 'Frunzensky District, Saint Petersburg',
      description: 'A convenient neighborhood with well-developed infrastructure.',
      transport: [],
      infrastructure: [],
    },
  },
  17: {
    title: 'Cozy Corner in Petrogradsky District',
    location: 'Petrogradsky District, Saint Petersburg',
    description:
      'I am renting out a room in my apartment. The Petrograd Side is all about architecture and the best coffee shops. I value cleanliness, so I am looking for tidy, pleasant guests.',
    amenities: ['Wi-Fi', 'Kitchen'],
    host: {
      about: 'Happy to welcome guests and help with city recommendations.',
    },
    locationDetails: {
      address: 'Petrogradsky District, Saint Petersburg',
      neighborhood: 'Petrogradsky District, Saint Petersburg',
      description: 'A convenient neighborhood with well-developed infrastructure.',
      transport: [],
      infrastructure: [],
    },
  },
  18: {
    title: 'Apartment in Moscow City',
    location: 'Presnensky District, Moscow',
    description:
      'Stunning city views from the 65th floor. Panoramic windows, designer renovation, and a jacuzzi.',
    amenities: ['Wi-Fi', 'Kitchen'],
    host: {
      about: 'Happy to welcome guests and help with city recommendations.',
    },
    locationDetails: {
      address: 'Presnensky District, Moscow',
      neighborhood: 'Presnensky District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure.',
      transport: [],
      infrastructure: [],
    },
  },
  19: {
    title: 'Studio on Arbat',
    location: 'Arbat, Moscow',
    description:
      'Quiet studio in the historic center. Perfect for tourists who want to stay in the very heart of the capital.',
    amenities: ['Wi-Fi', 'Kitchen'],
    host: {
      about: 'Happy to welcome guests and help with city recommendations.',
    },
    locationDetails: {
      address: 'Arbat, Moscow',
      neighborhood: 'Arbat, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure.',
      transport: [],
      infrastructure: [],
    },
  },
  20: {
    title: "Penthouse on Patriarch's Ponds",
    location: 'Moscow • Presnensky District',
    description:
      'Luxurious penthouse with a terrace and views of the Moskva River. Designer interior, fireplace, and walk-in closet. Perfect for a special occasion.',
    amenities: ['Wi-Fi', 'Fireplace', 'Jacuzzi'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Bolshoy Patriarshy Lane, 15',
      neighborhood: 'Presnensky District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  21: {
    title: 'Apartment Near the Kremlin',
    location: 'Moscow • Tverskoy District',
    description:
      'Spacious two-room apartment within walking distance of Red Square. High ceilings, parquet flooring, and views of the historic center.',
    amenities: ['Wi-Fi', 'Kitchen', 'Air conditioning'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Makhovaya Street, 7',
      neighborhood: 'Tverskoy District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  22: {
    title: 'Loft in Zamoskvorechye',
    location: 'Moscow • Zamoskvorechye',
    description:
      'Spacious loft in a historic mansion. Exposed brick walls, mezzanine levels, and large windows. Tretyakov Gallery and cozy restaurants are nearby.',
    amenities: ['Wi-Fi', 'Workspace', 'Coffee machine'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Bolshaya Ordynka, 45',
      neighborhood: 'Zamoskvorechye, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  23: {
    title: 'Studio Near Kurskaya Metro',
    location: 'Moscow • Basmanny District',
    description:
      'Compact studio for one or a couple. Fresh renovation, comfortable bed, and quick access to the city center by metro. A great option for a short trip.',
    amenities: ['Wi-Fi', 'Washing machine'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Zemlyanoy Val, 21',
      neighborhood: 'Basmanny District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  24: {
    title: 'Two-Bedroom Near VDNKh',
    location: 'Moscow • Ostankinsky District',
    description:
      'Bright family apartment near VDNKh and the Botanical Garden. Two bedrooms, a balcony, and a fully equipped kitchen.',
    amenities: ['Wi-Fi', 'Kitchen', 'Parking'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Prospekt Mira, 119',
      neighborhood: 'Ostankinsky District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  25: {
    title: 'Cozy Room in Taganka',
    location: 'Moscow • Tagansky District',
    description:
      'Private room in a quiet apartment. An atmospheric neighborhood with theaters, a market, and scenic walks along the Yauza River embankment.',
    amenities: ['Wi-Fi', 'Shared kitchen'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Taganskaya Street, 32',
      neighborhood: 'Tagansky District, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
  26: {
    title: 'Apartment in Khamovniki',
    location: 'Moscow • Khamovniki',
    description:
      'Elegant apartment in a prestigious neighborhood. Gorky Park, Novodevichy Convent, and the capital\'s best restaurants are nearby.',
    amenities: ['Wi-Fi', 'Kitchen', 'Smart TV', 'Air conditioning'],
    host: {
      about: 'I live in Moscow and enjoy sharing my favorite places in the neighborhood.',
    },
    locationDetails: {
      address: 'Moscow, Usachyova Street, 10',
      neighborhood: 'Khamovniki, Moscow',
      description: 'A convenient neighborhood with well-developed infrastructure and quick metro access.',
      transport: [{ name: 'Metro nearby' }],
      infrastructure: [{ name: 'Supermarket' }],
    },
  },
};
