// data/countries.js
export const countries = [
    { 
      id: 'usa', 
      name: 'United States', 
      description: 'The United States offers diverse educational opportunities with over 4,000 universities and colleges. Known for academic excellence, research opportunities, and cultural diversity. Home to world-leading institutions like Harvard, MIT, and Stanford, attracting students from around the globe.',
      image: '/consult.jpg',
      states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia'],
      categories: ['Most Popular'],
      universities: [
        { id: 'harvard', name: 'Harvard University', location: 'Massachusetts', ranking: 'Ivy League', programs: 120, established: 1636, students: 21000 },
        { id: 'stanford', name: 'Stanford University', location: 'California', ranking: 'Top 10', programs: 98, established: 1885, students: 17000 },
        { id: 'mit', name: 'Massachusetts Institute of Technology', location: 'Massachusetts', ranking: 'Ivy League', programs: 85, established: 1861, students: 11500 },
        { id: 'ucla', name: 'University of California, Los Angeles', location: 'California', ranking: 'Public Ivy', programs: 130, established: 1919, students: 45000 },
        { id: 'columbia', name: 'Columbia University', location: 'New York', ranking: 'Ivy League', programs: 110, established: 1754, students: 33000 },
        { id: 'uchicago', name: 'University of Chicago', location: 'Illinois', ranking: 'Top 20', programs: 95, established: 1890, students: 16000 }
      ]
    },
    { 
      id: 'uk', 
      name: 'United Kingdom', 
      description: 'The UK is home to some of the world\'s oldest and most prestigious universities, including Oxford and Cambridge. Offers quality education with a rich cultural experience, shorter course durations, and excellent research opportunities.',
      image: '/consult.jpg',
      states: ['England', 'Scotland', 'Wales', 'Northern Ireland', 'London', 'Manchester', 'Birmingham', 'Liverpool'],
      categories: ['Top Ranked'],
      universities: [
        { id: 'oxford', name: 'University of Oxford', location: 'England', ranking: 'Russell Group', programs: 250, established: 1096, students: 25000 },
        { id: 'cambridge', name: 'University of Cambridge', location: 'England', ranking: 'Russell Group', programs: 230, established: 1209, students: 23000 },
        { id: 'imperial', name: 'Imperial College London', location: 'London', ranking: 'Russell Group', programs: 110, established: 1907, students: 20000 },
        { id: 'ucl', name: 'University College London', location: 'London', ranking: 'Russell Group', programs: 190, established: 1826, students: 42000 },
        { id: 'edinburgh', name: 'University of Edinburgh', location: 'Scotland', ranking: 'Russell Group', programs: 180, established: 1582, students: 35000 },
        { id: 'manchester', name: 'University of Manchester', location: 'England', ranking: 'Russell Group', programs: 200, established: 1824, students: 40000 }
      ]
    },
    { 
      id: 'canada', 
      name: 'Canada', 
      description: 'Canada is known for its high-quality education, multicultural society, and stunning natural landscapes. Offers excellent post-study work opportunities, affordable tuition, and pathways to permanent residence for international students.',
      image: '/consult.jpg',
      states: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick'],
      categories: ['Most Popular'],
      universities: [
        { id: 'toronto', name: 'University of Toronto', location: 'Ontario', ranking: 'U15', programs: 150, established: 1827, students: 88000 },
        { id: 'ubc', name: 'University of British Columbia', location: 'British Columbia', ranking: 'U15', programs: 140, established: 1908, students: 66000 },
        { id: 'mcgill', name: 'McGill University', location: 'Quebec', ranking: 'U15', programs: 130, established: 1821, students: 40000 },
        { id: 'mcmaster', name: 'McMaster University', location: 'Ontario', ranking: 'U15', programs: 110, established: 1887, students: 33000 },
        { id: 'alberta', name: 'University of Alberta', location: 'Alberta', ranking: 'U15', programs: 120, established: 1908, students: 40000 },
        { id: 'montreal', name: 'Université de Montréal', location: 'Quebec', ranking: 'U15', programs: 100, established: 1878, students: 67000 }
      ]
    },
    { 
      id: 'australia', 
      name: 'Australia', 
      description: 'Australia offers world-class education with a relaxed lifestyle and beautiful beaches. Known for research excellence, innovative teaching methods, and diverse cultural experiences. Home to the prestigious Group of Eight universities.',
      image: '/consult.jpg',
      states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Canberra', 'Northern Territory'],
      categories: ['Top Ranked'],
      universities: [
        { id: 'melbourne', name: 'University of Melbourne', location: 'Victoria', ranking: 'Group of Eight', programs: 160, established: 1853, students: 52000 },
        { id: 'sydney', name: 'University of Sydney', location: 'New South Wales', ranking: 'Group of Eight', programs: 150, established: 1850, students: 73000 },
        { id: 'anu', name: 'Australian National University', location: 'Canberra', ranking: 'Group of Eight', programs: 120, established: 1946, students: 24000 },
        { id: 'unsw', name: 'UNSW Sydney', location: 'New South Wales', ranking: 'Group of Eight', programs: 140, established: 1949, students: 63000 },
        { id: 'monash', name: 'Monash University', location: 'Victoria', ranking: 'Group of Eight', programs: 145, established: 1958, students: 86000 },
        { id: 'queensland', name: 'University of Queensland', location: 'Queensland', ranking: 'Group of Eight', programs: 130, established: 1909, students: 55000 }
      ]
    },
    { 
      id: 'germany', 
      name: 'Germany', 
      description: 'Germany is renowned for its engineering and technical education, with low or no tuition fees at public universities. Strong focus on research, industry connections, and innovation. Perfect for students seeking quality education.',
      image: '/consult.jpg',
      states: ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Berlin', 'Hamburg', 'Hesse', 'Saxony', 'Lower Saxony'],
      categories: ['Most Popular'],
      universities: [
        { id: 'tum', name: 'Technical University of Munich', location: 'Bavaria', ranking: 'TU9', programs: 80, established: 1868, students: 48000 },
        { id: 'lmu', name: 'Ludwig Maximilian University', location: 'Bavaria', ranking: 'U15', programs: 90, established: 1472, students: 52000 },
        { id: 'heidelberg', name: 'Heidelberg University', location: 'Baden-Württemberg', ranking: 'U15', programs: 100, established: 1386, students: 28000 },
        { id: 'berlin', name: 'Humboldt University of Berlin', location: 'Berlin', ranking: 'U15', programs: 95, established: 1810, students: 33000 },
        { id: 'karlsruhe', name: 'Karlsruhe Institute of Technology', location: 'Baden-Württemberg', ranking: 'TU9', programs: 85, established: 1825, students: 24000 }
      ]
    },
    { 
      id: 'france', 
      name: 'France', 
      description: 'France offers excellence in arts, fashion, business, and engineering. Known for prestigious Grandes Écoles, affordable education, rich cultural experiences, and world-renowned cuisine. Study in the heart of Europe.',
      image: '/consult.jpg',
      states: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Provence', 'Brittany', 'Normandy'],
      categories: ['Top Ranked'],
      universities: [
        { id: 'sorbonne', name: 'Sorbonne University', location: 'Île-de-France', ranking: 'Grande École', programs: 120, established: 1257, students: 55000 },
        { id: 'polytechnique', name: 'École Polytechnique', location: 'Île-de-France', ranking: 'Grande École', programs: 40, established: 1794, students: 5000 },
        { id: 'hec', name: 'HEC Paris', location: 'Île-de-France', ranking: 'Grande École', programs: 35, established: 1881, students: 4500 }
      ]
    },
    { 
      id: 'japan', 
      name: 'Japan', 
      description: 'Japan combines cutting-edge technology with deep cultural traditions. Offers world-class education in engineering, robotics, and business. Experience unique culture, advanced research facilities, and safe environment.',
      image: '/consult.jpg',
      states: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka', 'Aichi', 'Hiroshima', 'Okinawa'],
      categories: ['Most Popular'],
      universities: [
        { id: 'tokyo', name: 'University of Tokyo', location: 'Tokyo', ranking: 'National Seven', programs: 110, established: 1877, students: 28000 },
        { id: 'kyoto', name: 'Kyoto University', location: 'Kyoto', ranking: 'National Seven', programs: 100, established: 1897, students: 22000 },
        { id: 'osaka', name: 'Osaka University', location: 'Osaka', ranking: 'National Seven', programs: 95, established: 1931, students: 23000 }
      ]
    },
    { 
      id: 'india', 
      name: 'India', 
      description: 'India combines ancient educational traditions with modern institutions like IITs and IIMs. Offers affordable education, diverse cultures, and growing opportunities in technology and research. A land of rich heritage and innovation.',
      image: '/consult.jpg',
      states: ['Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Rajasthan', 'West Bengal', 'Delhi'],
      categories: ['Top Ranked'],
      universities: [
        { id: 'iitb', name: 'IIT Bombay', location: 'Maharashtra', ranking: 'IIT', programs: 50, established: 1958, students: 12000 },
        { id: 'iitd', name: 'IIT Delhi', location: 'Delhi', ranking: 'IIT', programs: 48, established: 1961, students: 11000 },
        { id: 'iimah', name: 'IIM Ahmedabad', location: 'Gujarat', ranking: 'IIM', programs: 25, established: 1961, students: 8000 },
        { id: 'iisc', name: 'IISc Bangalore', location: 'Karnataka', ranking: 'Institute of Eminence', programs: 60, established: 1909, students: 5000 },
        { id: 'du', name: 'University of Delhi', location: 'Delhi', ranking: 'Central University', programs: 300, established: 1922, students: 60000 }
      ]
    },
    { 
      id: 'brazil', 
      name: 'Brazil', 
      description: 'Brazil offers vibrant cultural experiences alongside growing educational opportunities. Known for research in environmental sciences, engineering, and medicine. Experience the energy of South America\'s largest nation.',
      image: '/consult.jpg',
      states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Rio Grande do Sul', 'Paraná', 'Pernambuco', 'Amazonas'],
      categories: ['Most Popular', 'Top Ranked'],
      universities: [
        { id: 'usp', name: 'University of São Paulo', location: 'São Paulo', ranking: 'Top Brazilian', programs: 200, established: 1934, students: 90000 },
        { id: 'unicamp', name: 'University of Campinas', location: 'São Paulo', ranking: 'Top Brazilian', programs: 80, established: 1966, students: 35000 },
        { id: 'ufrj', name: 'Federal University of Rio de Janeiro', location: 'Rio de Janeiro', ranking: 'Federal', programs: 150, established: 1920, students: 67000 }
      ]
    },
    { 
      id: 'uae', 
      name: 'United Arab Emirates', 
      description: 'The UAE is a rapidly growing education hub with world-class facilities and international branch campuses. Offers unique opportunities in business, engineering, and hospitality. Experience luxury and innovation.',
      image: '/consult.jpg',
      states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'],
      categories: ['Most Popular'],
      universities: [
        { id: 'nyuad', name: 'NYU Abu Dhabi', location: 'Abu Dhabi', ranking: 'Top International', programs: 45, established: 2010, students: 2000 },
        { id: 'uaeu', name: 'UAE University', location: 'Al Ain', ranking: 'National', programs: 90, established: 1976, students: 14000 },
        { id: 'aus', name: 'American University of Sharjah', location: 'Sharjah', ranking: 'Top Regional', programs: 60, established: 1997, students: 6000 }
      ]
    },
    { 
      id: 'new-zealand', 
      name: 'New Zealand', 
      description: 'New Zealand offers high-quality education in a safe, picturesque environment. Known for research-intensive universities, excellent work-life balance, and breathtaking landscapes. Perfect for nature lovers.',
      image: '/consult.jpg',
      states: ['Auckland', 'Wellington', 'Canterbury', 'Waikato', 'Otago', 'Bay of Plenty', 'Northland', 'Southland'],
      categories: ['Top Ranked'],
      universities: [
        { id: 'auckland', name: 'University of Auckland', location: 'Auckland', ranking: 'Group of Eight', programs: 120, established: 1883, students: 40000 },
        { id: 'otago', name: 'University of Otago', location: 'Otago', ranking: 'Group of Eight', programs: 100, established: 1869, students: 21000 },
        { id: 'canterbury', name: 'University of Canterbury', location: 'Canterbury', ranking: 'Group of Eight', programs: 85, established: 1873, students: 18000 }
      ]
    },
  ]
  
  export const allCategories = ['All', 'Most Popular', 'Top Ranked', ...new Set(countries.flatMap(country => country.categories).filter(cat => cat !== 'Most Popular' && cat !== 'Top Ranked'))]