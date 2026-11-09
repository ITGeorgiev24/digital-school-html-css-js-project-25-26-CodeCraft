// Question Bank
const QB={
  // Each category: {Easy:[...], Medium:[...], Hard:[...]}  — 5 questions per tier
  1:{ // Computer Science
    Easy:[
      {t:"What does CSS stand for?",o:["Cascading Style Sheets","Creative Style Sheets","Computer Style System","Content Styling Syntax"],c:0,e:"CSS = Cascading Style Sheets.",x:10},
      {t:"What does HTML stand for?",o:["High Transfer Machine Language","HyperText Markup Language","Hybrid Text Module Layer","HyperLink Text Markup"],c:1,e:"HTML = HyperText Markup Language.",x:10},
      {t:"What does RAM stand for?",o:["Read Access Memory","Rapid Array Module","Random Access Memory","Runtime Active Memory"],c:2,e:"RAM = Random Access Memory.",x:10},
      {t:"What does API stand for?",o:["Application Process Index","Automated Processing Input","Advanced Protocol Integration","Application Programming Interface"],c:3,e:"API = Application Programming Interface.",x:10},
      {t:"Which symbol starts a comment in Python?",o:["#","/*","//","--"],c:0,e:"Python uses # for single-line comments.",x:10},
    ],
    Medium:[
      {t:"What is the time complexity of binary search?",o:["O(n)","O(log n)","O(n²)","O(1)"],c:1,e:"Binary search halves the search space each step — O(log n).",x:15},
      {t:"Which data structure uses LIFO order?",o:["Queue","Linked List","Stack","Heap"],c:2,e:"A Stack uses Last-In-First-Out ordering.",x:15},
      {t:"In JavaScript, what does typeof null return?",o:["'null'","'undefined'","'boolean'","'object'"],c:3,e:"A famous JS quirk — typeof null returns 'object'.",x:20},
      {t:"What is a closure in programming?",o:["A function with access to its outer scope","A loop that never ends","A sealed class","An encrypted variable"],c:0,e:"A closure retains access to its enclosing scope.",x:20},
      {t:"Which sorting algorithm is O(n log n) on average?",o:["Bubble Sort","Merge Sort","Insertion Sort","Selection Sort"],c:1,e:"Merge Sort consistently achieves O(n log n).",x:15},
    ],
    Hard:[
      {t:"What is the purpose of a foreign key in a database?",o:["Primary identifier","Encrypt data","Link between tables","Speed up queries"],c:2,e:"Foreign keys establish relationships between database tables.",x:25},
      {t:"What does the CAP theorem state?",o:["All distributed systems can be consistent","Code must be atomic, consistent, and persistent","Caches always accelerate performance","A distributed system can only guarantee 2 of: Consistency, Availability, Partition tolerance"],c:3,e:"CAP theorem: distributed systems can only fully provide 2 of the 3 properties.",x:25},
      {t:"What is Big O notation used for?",o:["Describing algorithm time/space complexity","Measuring RAM usage","Naming variables","Defining recursion depth"],c:0,e:"Big O notation describes how an algorithm's runtime or space grows with input size.",x:20},
      {t:"What is tail recursion?",o:["A recursive call at the start","A recursive call as the final operation allowing stack optimisation","A loop disguised as recursion","Mutual recursion between two functions"],c:1,e:"Tail recursion allows compilers to reuse the stack frame, preventing stack overflow.",x:25},
      {t:"What is a race condition in concurrent programming?",o:["A performance benchmark","A type of deadlock","When two threads access shared data simultaneously causing unpredictable results","When CPU speed is insufficient"],c:2,e:"A race condition occurs when program behaviour depends on the uncontrolled sequence of thread execution.",x:25},
    ],
  },
  2:{ // Biology
    Easy:[
      {t:"What is the powerhouse of the cell?",o:["Nucleus","Ribosome","Golgi apparatus","Mitochondria"],c:3,e:"Mitochondria produce ATP, the cell's energy currency.",x:10},
      {t:"What do plants need to photosynthesise?",o:["Sunlight, CO2 and water","Water only","Soil nutrients only","Oxygen"],c:0,e:"Plants need sunlight, CO2 and water to photosynthesise.",x:10},
      {t:"How many chambers does the human heart have?",o:["2","4","3","6"],c:1,e:"4 chambers: 2 atria and 2 ventricles.",x:10},
      {t:"What is the largest organ in the human body?",o:["Liver","Brain","Skin","Heart"],c:2,e:"The skin is the largest organ.",x:10},
      {t:"What type of blood cells fight infection?",o:["Red blood cells","Platelets","Plasma","White blood cells"],c:3,e:"White blood cells are key to the immune system.",x:10},
    ],
    Medium:[
      {t:"What molecule carries genetic information?",o:["DNA","ATP","RNA","Protein"],c:0,e:"DNA stores genetic information.",x:15},
      {t:"How many chromosomes do humans typically have?",o:["23","46","44","48"],c:1,e:"Humans have 46 chromosomes in 23 pairs.",x:15},
      {t:"Which organ produces insulin?",o:["Liver","Kidney","Pancreas","Thyroid"],c:2,e:"The pancreas produces insulin to regulate blood sugar.",x:15},
      {t:"What is osmosis?",o:["Movement of solutes","Protein synthesis","Cell division","Movement of water across a semi-permeable membrane"],c:3,e:"Osmosis is movement of water through a semi-permeable membrane.",x:15},
      {t:"What is the function of the ribosome?",o:["Protein synthesis","Energy production","DNA replication","Cell division"],c:0,e:"Ribosomes translate mRNA into proteins.",x:15},
    ],
    Hard:[
      {t:"What is the central dogma of molecular biology?",o:["RNA→DNA→Protein","DNA→RNA→Protein","Protein→DNA→RNA","DNA→Protein→RNA"],c:1,e:"Genetic information flows from DNA to RNA to protein.",x:25},
      {t:"What is apoptosis?",o:["Cell division","Viral infection","Programmed cell death","Uncontrolled cell growth"],c:2,e:"Apoptosis is programmed cell death — a normal, controlled process.",x:25},
      {t:"What does the Hardy-Weinberg principle describe?",o:["Rate of mutation","Rate of speciation","Speed of genetic drift","Allele frequency equilibrium in a non-evolving population"],c:3,e:"Hardy-Weinberg: allele frequencies stay constant without evolutionary forces.",x:25},
      {t:"What is the endosymbiotic theory?",o:["Mitochondria evolved from ancient prokaryotes","How viruses infect cells","How DNA replication works","Gene expression theory"],c:0,e:"Lynn Margulis proposed mitochondria were once free-living bacteria engulfed by early eukaryotes.",x:25},
      {t:"What is the lac operon in E. coli?",o:["A type of ribosome","A gene regulatory system controlling lactose metabolism","A cell membrane protein","A viral insertion site"],c:1,e:"The lac operon regulates genes for lactose metabolism based on lactose availability.",x:25},
    ],
  },
  3:{ // Geography
    Easy:[
      {t:"What is the capital of France?",o:["Lyon","Marseille","Paris","Bordeaux"],c:2,e:"Paris is the capital of France.",x:10},
      {t:"Which is the largest continent by area?",o:["Africa","North America","Antarctica","Asia"],c:3,e:"Asia covers ~44 million km².",x:10},
      {t:"What is the capital of Japan?",o:["Tokyo","Kyoto","Hiroshima","Osaka"],c:0,e:"Tokyo is the capital of Japan.",x:10},
      {t:"What ocean is the largest?",o:["Atlantic","Pacific","Arctic","Indian"],c:1,e:"The Pacific Ocean covers over 165 million km².",x:10},
      {t:"Which mountain is the tallest in the world?",o:["K2","Kangchenjunga","Mount Everest","Lhotse"],c:2,e:"Mount Everest at 8,849 m is Earth's highest peak.",x:10},
    ],
    Medium:[
      {t:"What is the capital of Australia?",o:["Sydney","Melbourne","Brisbane","Canberra"],c:3,e:"Canberra is the capital, not Sydney.",x:15},
      {t:"Which river is the longest in the world?",o:["Nile","Amazon","Mississippi","Yangtze"],c:0,e:"The Nile is approximately 6,650 km long.",x:15},
      {t:"How many countries are in Africa?",o:["48","54","60","42"],c:1,e:"Africa has 54 recognised sovereign countries.",x:15},
      {t:"What is the smallest country in the world?",o:["Monaco","San Marino","Vatican City","Liechtenstein"],c:2,e:"Vatican City at ~0.44 km² is the world's smallest country.",x:15},
      {t:"The Amazon rainforest is primarily in which country?",o:["Colombia","Venezuela","Peru","Brazil"],c:3,e:"About 60% of the Amazon lies within Brazil.",x:15},
    ],
    Hard:[
      {t:"Which country has the most natural lakes?",o:["Canada","USA","Brazil","Russia"],c:0,e:"Canada has over 60% of the world's natural lakes.",x:20},
      {t:"The Strait of Gibraltar connects which two bodies of water?",o:["Red Sea & Indian Ocean","Atlantic Ocean & Mediterranean Sea","Black Sea & Caspian Sea","North Sea & Baltic Sea"],c:1,e:"The Strait of Gibraltar links the Atlantic to the Mediterranean.",x:20},
      {t:"Which desert is technically the largest in the world?",o:["Sahara","Gobi","Antarctic","Arabian"],c:2,e:"Antarctica is the world's largest desert (cold desert).",x:25},
      {t:"What is the Mercator projection famous for distorting?",o:["Distances between cities","Ocean depths","Coastlines","The relative sizes of landmasses near poles"],c:3,e:"The Mercator projection greatly exaggerates the size of landmasses near the poles.",x:25},
      {t:"Which country has the longest coastline in the world?",o:["Canada","Australia","USA","Russia"],c:0,e:"Canada has roughly 202,080 km of coastline.",x:25},
    ],
  },
  4:{ // Art & Culture
    Easy:[
      {t:"Who painted the Mona Lisa?",o:["Michelangelo","Leonardo da Vinci","Raphael","Botticelli"],c:1,e:"Leonardo da Vinci painted the Mona Lisa (c.1503).",x:10},
      {t:"The Louvre museum is located in which city?",o:["Rome","Madrid","Paris","London"],c:2,e:"The Louvre is in Paris, France.",x:10},
      {t:"Who sculpted David?",o:["Donatello","Bernini","Raphael","Michelangelo"],c:3,e:"Michelangelo's David was completed in 1504.",x:10},
      {t:"Who wrote Romeo and Juliet?",o:["William Shakespeare","Charles Dickens","Jane Austen","Geoffrey Chaucer"],c:0,e:"Shakespeare wrote Romeo and Juliet around 1594.",x:10},
      {t:"What is the art of paper folding called?",o:["Ikebana","Origami","Manga","Haiku"],c:1,e:"Origami is the Japanese art of paper folding.",x:10},
    ],
    Medium:[
      {t:"Which artistic movement did Salvador Dalí belong to?",o:["Cubism","Impressionism","Surrealism","Baroque"],c:2,e:"Dalí is famous for his Surrealist works.",x:15},
      {t:"Who composed the Moonlight Sonata?",o:["Mozart","Bach","Chopin","Beethoven"],c:3,e:"Beethoven composed the Moonlight Sonata.",x:15},
      {t:"What art movement did Claude Monet help found?",o:["Impressionism","Realism","Expressionism","Abstract"],c:0,e:"Monet was a founder of French Impressionism.",x:15},
      {t:"The Starry Night was painted by whom?",o:["Paul Gauguin","Vincent van Gogh","Claude Monet","Edvard Munch"],c:1,e:"Van Gogh painted The Starry Night in June 1889.",x:15},
      {t:"What style of art is Picasso famous for co-founding?",o:["Impressionism","Dadaism","Cubism","Fauvism"],c:2,e:"Picasso co-founded Cubism with Braque around 1907.",x:15},
    ],
    Hard:[
      {t:"What does chiaroscuro refer to in art?",o:["A type of fresco technique","A type of woodcut printmaking","A school of Italian painting","The contrast of light and shadow to create depth"],c:3,e:"Chiaroscuro is the use of strong contrasts between light and dark to give a sense of volume.",x:25},
      {t:"Which novel begins with 'Call me Ishmael'?",o:["Moby-Dick","The Great Gatsby","Crime and Punishment","1984"],c:0,e:"Moby-Dick by Herman Melville opens with 'Call me Ishmael'.",x:20},
      {t:"The Taj Mahal was built by which Mughal emperor?",o:["Akbar","Shah Jahan","Aurangzeb","Babur"],c:1,e:"Shah Jahan built the Taj Mahal as a mausoleum for his wife.",x:20},
      {t:"What is the Golden Ratio approximately equal to?",o:["1.414","2.718","1.618","3.141"],c:2,e:"The Golden Ratio φ ≈ 1.618 appears throughout art and architecture.",x:25},
      {t:"Who wrote One Hundred Years of Solitude?",o:["Mario Vargas Llosa","Jorge Luis Borges","Isabel Allende","Gabriel García Márquez"],c:3,e:"García Márquez published this masterpiece of magical realism in 1967.",x:25},
    ],
  },
  5:{ // Physics
    Easy:[
      {t:"What is the unit of force?",o:["Newton","Joule","Watt","Pascal"],c:0,e:"Force is measured in Newtons.",x:10},
      {t:"Which force pulls objects towards Earth?",o:["Magnetism","Gravity","Friction","Tension"],c:1,e:"Gravity attracts objects with mass towards each other.",x:10},
      {t:"What particle has a negative charge?",o:["Proton","Neutron","Electron","Photon"],c:2,e:"Electrons carry a negative electric charge.",x:10},
      {t:"What is the speed of light approximately?",o:["30,000 km/s","150,000 km/s","600,000 km/s","300,000 km/s"],c:3,e:"Light travels at ~299,792 km/s.",x:10},
      {t:"What does a thermometer measure?",o:["Temperature","Pressure","Volume","Mass"],c:0,e:"A thermometer measures temperature.",x:10},
    ],
    Medium:[
      {t:"What is Newton's second law?",o:["E = mc²","F = ma","v = u + at","p = mv"],c:1,e:"Force = mass × acceleration.",x:15},
      {t:"What does E = mc² describe?",o:["Kinetic energy","Wave frequency","Mass-energy equivalence","Gravitational potential"],c:2,e:"Einstein's equation shows mass and energy are equivalent.",x:15},
      {t:"What is absolute zero in Celsius?",o:["-100°C","-200°C","-350°C","-273.15°C"],c:3,e:"Absolute zero is −273.15°C.",x:15},
      {t:"Sound travels fastest through which medium?",o:["Steel","Air","Water","Vacuum"],c:0,e:"Sound travels fastest through solids like steel.",x:15},
      {t:"What phenomenon causes a rainbow?",o:["Reflection","Refraction and dispersion","Diffraction","Absorption"],c:1,e:"Rainbows result from light refracting through water droplets.",x:15},
    ],
    Hard:[
      {t:"What is the Heisenberg Uncertainty Principle?",o:["Energy is conserved","Light has a constant speed","Position and momentum cannot both be precisely known simultaneously","Mass and energy are equivalent"],c:2,e:"Δx·Δp ≥ ℏ/2 — the more precisely position is known, the less precisely momentum can be.",x:25},
      {t:"What does the Pauli Exclusion Principle state?",o:["No two photons occupy the same space","Energy is quantised","All bosons have integer spin","No two identical fermions can share the same quantum state"],c:3,e:"No two electrons can have the same four quantum numbers simultaneously.",x:25},
      {t:"What is quantum entanglement?",o:["Correlated quantum states where measuring one instantly affects the other","Particles fusing","Wave-particle duality","Quantum tunnelling"],c:0,e:"Entangled particles share quantum states — measuring one instantly determines the other.",x:25},
      {t:"What is the Casimir effect?",o:["Gravity between large masses","Attractive force between uncharged plates due to vacuum fluctuations","Magnetic attraction","Electrostatic repulsion"],c:1,e:"Quantum vacuum fluctuations between closely spaced plates create a measurable attractive force.",x:25},
      {t:"What is renormalisation in quantum field theory?",o:["Normalising wave functions","Measuring particle spin","Technique to handle infinities by redefining physical quantities","Calculating orbital energy"],c:2,e:"Renormalisation removes infinities from QFT by absorbing them into redefined constants.",x:25},
    ],
  },
  6:{ // Literature
    Easy:[
      {t:"Who wrote Pride and Prejudice?",o:["Charlotte Brontë","Emily Brontë","George Eliot","Jane Austen"],c:3,e:"Jane Austen published Pride and Prejudice in 1813.",x:10},
      {t:"Who wrote the Harry Potter series?",o:["J.K. Rowling","Philip Pullman","Roald Dahl","Ursula Le Guin"],c:0,e:"J.K. Rowling wrote the seven Harry Potter novels.",x:10},
      {t:"To be or not to be is from which Shakespeare play?",o:["Macbeth","Hamlet","King Lear","Othello"],c:1,e:"This soliloquy is from Hamlet, Act 3.",x:10},
      {t:"Who wrote 1984?",o:["Aldous Huxley","Ray Bradbury","George Orwell","Arthur Koestler"],c:2,e:"George Orwell published 1984 in 1949.",x:10},
      {t:"Who wrote The Great Gatsby?",o:["Ernest Hemingway","John Steinbeck","William Faulkner","F. Scott Fitzgerald"],c:3,e:"F. Scott Fitzgerald published The Great Gatsby in 1925.",x:10},
    ],
    Medium:[
      {t:"Who wrote Crime and Punishment?",o:["Fyodor Dostoevsky","Anton Chekhov","Leo Tolstoy","Ivan Turgenev"],c:0,e:"Dostoevsky published Crime and Punishment in 1866.",x:15},
      {t:"What is the first line of A Tale of Two Cities?",o:["Call me Ishmael","It was the best of times","Happy families are all alike","It is a truth universally acknowledged"],c:1,e:"Dickens: 'It was the best of times, it was the worst of times.'",x:15},
      {t:"Which poet wrote The Waste Land?",o:["W.B. Yeats","Ezra Pound","T.S. Eliot","Robert Frost"],c:2,e:"T.S. Eliot published The Waste Land in 1922.",x:15},
      {t:"Who wrote Don Quixote?",o:["Lope de Vega","Pablo Neruda","Gabriel García Márquez","Miguel de Cervantes"],c:3,e:"Cervantes published Don Quixote in 1605 and 1615.",x:15},
      {t:"What genre is Frankenstein by Mary Shelley?",o:["Gothic horror / sci-fi","Romance","Historical fiction","Poetry"],c:0,e:"Frankenstein (1818) is Gothic horror and early science fiction.",x:15},
    ],
    Hard:[
      {t:"In which century was Canterbury Tales written?",o:["12th","14th","13th","15th"],c:1,e:"Chaucer wrote The Canterbury Tales in the late 14th century.",x:20},
      {t:"What is the subtitle of Mary Shelley's Frankenstein?",o:["The Modern Monster","The Lost Soul","The Modern Prometheus","The Dark Creation"],c:2,e:"Full title: Frankenstein; or, The Modern Prometheus.",x:20},
      {t:"What dystopia is depicted in Brave New World?",o:["Totalitarian","Anarchist","Theocratic","Consumer-hedonistic"],c:3,e:"Huxley's Brave New World depicts a pleasure-focused consumer dystopia.",x:25},
      {t:"What does stream of consciousness mean in literature?",o:["A narrative technique depicting continuous thought flow","A nature writing style","A type of poetry","A form of unreliable narrator"],c:0,e:"Stream of consciousness depicts a character's continuous, unfiltered flow of thoughts.",x:25},
      {t:"Who wrote Lolita?",o:["Albert Camus","Vladimir Nabokov","Samuel Beckett","Franz Kafka"],c:1,e:"Vladimir Nabokov published Lolita in 1955.",x:25},
    ],
  },
  7:{ // History
    Easy:[
      {t:"Who was the first President of the United States?",o:["John Adams","Thomas Jefferson","George Washington","Benjamin Franklin"],c:2,e:"George Washington served 1789–1797.",x:10},
      {t:"In which year did World War II end?",o:["1943","1944","1946","1945"],c:3,e:"WWII ended in 1945.",x:10},
      {t:"Who was the first person to walk on the Moon?",o:["Neil Armstrong","Yuri Gagarin","Buzz Aldrin","Alan Shepard"],c:0,e:"Neil Armstrong on July 20, 1969.",x:10},
      {t:"The Titanic sank in which year?",o:["1910","1912","1911","1913"],c:1,e:"The Titanic sank on April 15, 1912.",x:10},
      {t:"Which empire was ruled by Julius Caesar?",o:["Greek","Ottoman","Roman","Byzantine"],c:2,e:"Julius Caesar was a Roman statesman.",x:10},
    ],
    Medium:[
      {t:"The French Revolution began in which year?",o:["1776","1815","1804","1789"],c:3,e:"The French Revolution began in 1789.",x:15},
      {t:"The Berlin Wall fell in which year?",o:["1989","1988","1987","1991"],c:0,e:"The Berlin Wall fell on November 9, 1989.",x:15},
      {t:"The Magna Carta was signed in which year?",o:["1066","1215","1348","1492"],c:1,e:"King John signed the Magna Carta in 1215.",x:15},
      {t:"What triggered World War I?",o:["Invasion of Poland","Sinking of the Lusitania","Assassination of Archduke Franz Ferdinand","Russian Revolution"],c:2,e:"The assassination of Franz Ferdinand in 1914.",x:15},
      {t:"Who wrote The Communist Manifesto?",o:["Lenin and Trotsky","Proudhon and Bakunin","Stalin and Mao","Marx and Engels"],c:3,e:"Marx and Engels published it in 1848.",x:15},
    ],
    Hard:[
      {t:"The Peace of Westphalia (1648) established which principle?",o:["State sovereignty in international relations","Free trade","Universal democracy","Abolition of monarchy"],c:0,e:"Westphalia established state sovereignty, forming the basis of modern international law.",x:25},
      {t:"What was the Defenestration of Prague (1618)?",o:["A Czech coronation","Throwing of Catholic officials from a window, sparking the Thirty Years War","A peasant revolt","The burning of Prague"],c:1,e:"Protestant Bohemians threw Habsburg officials from a window, triggering the Thirty Years War.",x:25},
      {t:"Which country was first to grant women the vote?",o:["USA","UK","New Zealand","France"],c:2,e:"New Zealand granted women suffrage in 1893.",x:20},
      {t:"What was the primary cause of the Peloponnesian War?",o:["Persian invasion","Trade disputes","Assassination of a king","Athenian imperial expansion threatening Spartan allies"],c:3,e:"Growing Athenian power threatened Spartan allies, triggering the war (431–404 BC).",x:25},
      {t:"The printing press was invented by whom?",o:["Johannes Gutenberg","Leonardo da Vinci","Galileo Galilei","Nicolaus Copernicus"],c:0,e:"Gutenberg invented the movable-type printing press around 1440.",x:15},
    ],
  },
  8:{ // Mathematics
    Easy:[
      {t:"What is 12 × 12?",o:["124","144","132","148"],c:1,e:"12 × 12 = 144.",x:10},
      {t:"What is the square root of 64?",o:["6","7","8","9"],c:2,e:"√64 = 8.",x:10},
      {t:"How many degrees are in a right angle?",o:["45°","60°","180°","90°"],c:3,e:"A right angle is 90°.",x:10},
      {t:"What is 25% of 80?",o:["20","15","25","30"],c:0,e:"25% of 80 = 20.",x:10},
      {t:"What is the next prime after 7?",o:["8","11","10","9"],c:1,e:"11 is the next prime after 7.",x:10},
    ],
    Medium:[
      {t:"What is the value of π to 2 decimal places?",o:["3.12","3.16","3.14","3.18"],c:2,e:"π ≈ 3.14159.",x:15},
      {t:"What is the derivative of x²?",o:["x","2x²","x²/2","2x"],c:3,e:"d/dx(x²) = 2x by the power rule.",x:15},
      {t:"What does the Pythagorean theorem state?",o:["a²+b²=c²","a+b=c","a×b=c²","a²−b²=c"],c:0,e:"In a right triangle: a²+b²=c².",x:15},
      {t:"What is log₁₀(1000)?",o:["2","3","4","10"],c:1,e:"log₁₀(1000) = 3 because 10³ = 1000.",x:15},
      {t:"What is 7! (seven factorial)?",o:["49","720","5040","2520"],c:2,e:"7! = 7×6×5×4×3×2×1 = 5040.",x:15},
    ],
    Hard:[
      {t:"What is Euler's identity?",o:["e^π + 1 = 0","iπ + e = 1","e^i + π = 0","e^(iπ) + 1 = 0"],c:3,e:"Euler's identity e^(iπ) + 1 = 0 connects five fundamental constants.",x:25},
      {t:"What does Gödel's incompleteness theorem state?",o:["Any consistent system cannot prove all truths within it","All truths are provable","Infinity has a definite size","Every equation has a solution"],c:0,e:"Gödel showed any sufficiently powerful consistent system contains true statements it cannot prove.",x:25},
      {t:"What is a manifold in mathematics?",o:["A type of equation","A space that locally resembles Euclidean space","An infinite series","A type of matrix"],c:1,e:"A manifold is a topological space that near each point resembles flat Euclidean space.",x:25},
      {t:"Which number is both a perfect square and a perfect cube?",o:["8","16","64","32"],c:2,e:"64 = 8² = 4³.",x:20},
      {t:"What is the Riemann Hypothesis about?",o:["Prime number distribution","Topology of surfaces","Convergence of series","Zeros of the Riemann zeta function"],c:3,e:"It conjectures all non-trivial zeros of the Riemann zeta function have real part ½.",x:25},
    ],
  },
};


function pickQuestions(catId,n,difficulty){
  const catBank=QB[catId]||QB[1];
  const tier=(difficulty==='Hard'?'Hard':difficulty==='Easy'?'Easy':'Medium');
  const pool=[...(catBank[tier]||catBank.Medium||Object.values(catBank)[0])];
  const q=[];for(let i=0;i<n&&pool.length;i++){const idx=Math.floor(Math.random()*pool.length);q.push(pool.splice(idx,1)[0]);}
  return q.map(q=>({text:q.t,options:q.o,correct:q.c,explanation:q.e,xp:q.x}));
}
function getAIQuestions(topic){
  const k=Object.keys(AI_QS).find(k=>topic.toLowerCase().includes(k));
  const raw=k?AI_QS[k]:QB[Math.ceil(Math.random()*8)];
  return ([...raw]).slice(0,5).map(q=>({text:q.t,options:q.o,correct:q.c,explanation:q.e,xp:q.x}));
}


// ---- AI TOPIC LIBRARY ----
