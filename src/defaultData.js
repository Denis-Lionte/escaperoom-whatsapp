export const INITIAL_DATA = {
  settings: {
    // Doctor Credentials (Player Login)
    doctorUsername: "Sterian",
    doctorPassword: "anokim24",
    doctorName: "Dr. Sterian",
    doctorStatus: "Medic Primar Psihiatrie - Pavilionul 9 (Experimente Clinice)",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",

    // Admin Credentials (Game Master Login)
    adminUsername: "Admin",
    adminPassword: "Admin123",

    roomName: "Sanatoriul Psihiatric Poiana Verde - Pavilionul 9",
    autoTypingDelayMs: 1800,
  },
  // Reguli speciale pentru numere necunoscute / adăugate manual de jucător (ex: Curier)
  secretTriggers: [
    {
      id: "sec_courier",
      phoneNumber: "0752593149",
      contactName: "Curier Urgent (0752593149)",
      contactStatus: "Livrări rapide sanatoriu",
      contactAvatar: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80",
      triggerType: "any_first_message", // răspunde la orice prim mesaj trimis
      responseMessage: "Salut! Sunt la intrarea Pavilionului 9 cu pachetul de la Bogdan. Bate de 5 ori în ușa de la intrare ca să știu că ești tu și îți dau coletul!",
      delayMs: 1500,
      enabled: true
    }
  ],
  contacts: [
    {
      id: "igor_morga",
      name: "Igor - Asistent Morgă",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      status: "La subsol în frigider. Nu bateți la ușă.",
      lastSeen: "online",
      unread: 1,
      messages: [
        {
          id: "m_ig1",
          sender: "them",
          type: "text",
          content: "Domnule Doctor Sterian, corpul din celula frigorifică 4 a început să aibă spasme din nou la nivelul toracelui.",
          timestamp: "21:30",
          status: "read",
        },
        {
          id: "m_ig2",
          sender: "me",
          type: "text",
          content: "Igor, ai verificat doza de clorpromazină administrată înainte de stopul cardiac?",
          timestamp: "21:34",
          status: "read",
        },
        {
          id: "m_ig3",
          sender: "them",
          type: "text",
          content: "Am verificat, dar temperatura corporală crește în loc să scadă. Ochii i se deschid parțial sub cearșaf. Ce fac dacă se trezește complet?",
          timestamp: "21:40",
          status: "read",
        },
        {
          id: "m_ig4",
          sender: "them",
          type: "text",
          content: "Aștept ordinul dumneavoastră. Să injectez soluția albastră sau pregătesc bisturiul pentru disecția cerebrală?",
          timestamp: "22:15",
          status: "read",
        }
      ]
    },
    {
      id: "asistenta_elena",
      name: "Elena - Asistentă Șefă",
      avatar: "https://images.unsplash.com/photo-1594824813629-79f884bf059e?w=150&auto=format&fit=crop&q=80",
      status: "Tura de noapte. Administrare sedative.",
      lastSeen: "online",
      unread: 2,
      messages: [
        {
          id: "m_el1",
          sender: "them",
          type: "text",
          content: "Domnule doctor, pacientul din Rezerva 7 s-a dezlegat din cămașa de forță și a zgâriat tapetul până la cărămidă.",
          timestamp: "20:45",
          status: "read",
        },
        {
          id: "m_el2",
          sender: "me",
          type: "text",
          content: "Elena, izolează-l imediat în celula capitonată. Nu lăsa pe nimeni din tura de zi să vadă urmele de pe brațe.",
          timestamp: "20:50",
          status: "read",
        },
        {
          id: "m_el3",
          sender: "them",
          type: "text",
          content: "L-am închis, dar strigă încontinuu despre 'cheia din dulapul metalic'. Unde ați lăsat cifrul pentru dulapul cu sedative?",
          timestamp: "21:12",
          status: "read",
        },
        {
          id: "m_el4",
          sender: "them",
          type: "text",
          content: "Doctor Sterian, răspundeți repede! Se aud pași grei pe coridorul vechi și toate luminile din aripa de est pâlpâie!",
          timestamp: "22:30",
          status: "read",
        }
      ]
    },
    {
      id: "director_vance",
      name: "Directorul Spitalului (Dr. Voinea)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      status: "Control Minister mâine dimineață. Totul trebuie curățat.",
      lastSeen: "văzut azi la 23:10",
      unread: 0,
      messages: [
        {
          id: "m_dir1",
          sender: "them",
          type: "text",
          content: "Sterian, ai întrecut orice măsură! Ministerul Sănătății și Poliția au primit sesizări anonime despre disparițiile din evidență.",
          timestamp: "19:10",
          status: "read",
        },
        {
          id: "m_dir2",
          sender: "me",
          type: "text",
          content: "Cercetarea mea asupra conștiinței umane necesită sacrificii. Sunteți laș dacă vă opriți acum, domnule Director.",
          timestamp: "19:15",
          status: "read",
        },
        {
          id: "m_dir3",
          sender: "them",
          type: "text",
          content: "Nu mă interesează scuzele tale macabre! Dacă găsesc laboratorul din subsol deschis mâine la ora 08:00, voi chema personal procuratura.",
          timestamp: "19:30",
          status: "read",
        },
        {
          id: "m_dir4",
          sender: "me",
          type: "text",
          content: "Nimeni nu coboară în subsol fără aprobarea mea. Ușa blindată rămâne blocată.",
          timestamp: "19:32",
          status: "read",
        },
        {
          id: "m_dir5",
          sender: "them",
          type: "text",
          content: "Ești un nebun periculos, Sterian. Îți revoc dreptul de practică la prima oră.",
          timestamp: "20:00",
          status: "read",
        }
      ]
    },
    {
      id: "subiectul_zero",
      name: "Subiectul 0 (Anonim)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "VĂ VĂD PRIN OGLINDA FALSĂ",
      lastSeen: "tastează...",
      unread: 0,
      messages: [
        {
          id: "m_sub1",
          sender: "them",
          type: "text",
          content: "Îți amintești ziua în care mi-ai injectat prima fiolă? Încă îți simt degetele reci pe tâmplele mele.",
          timestamp: "22:05",
          status: "read",
        },
        {
          id: "m_sub2",
          sender: "me",
          type: "text",
          content: "Cum ai făcut rost de un telefon mobil în celula de izolare maximă?!",
          timestamp: "22:08",
          status: "read",
        },
        {
          id: "m_sub3",
          sender: "them",
          type: "text",
          content: "Zidurile de aici au crăpături, doctore. Iar mintea mea nu mai este prizonieră în craniul pe care l-ai găurit.",
          timestamp: "22:14",
          status: "read",
        },
        {
          id: "m_sub4",
          sender: "them",
          type: "text",
          content: "Tic-tac. Umbrele vin după tine. Nici măcar codul de la ieșire nu te va salva când se va stinge lumina.",
          timestamp: "22:50",
          status: "read",
        }
      ]
    },
    {
      id: "farmacist_bogdan",
      name: "Farmacist Bogdan - Depozit",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      status: "La inventar chimicale & toxine",
      lastSeen: "azi la 22:45",
      unread: 1,
      messages: [
        {
          id: "m_ph1",
          sender: "them",
          type: "text",
          content: "Domnule Doctor Sterian, stocul de cianură de potasiu și ser paralizant e aproape epuizat. Nu mai pot elibera comenzi fără rețete parafate.",
          timestamp: "18:20",
          status: "read",
        },
        {
          id: "m_ph2",
          sender: "me",
          type: "text",
          content: "Trece-le la pierderi de laborator sau cercetare experimentală pe cobai. Banii i-ai primit în plic ca de obicei.",
          timestamp: "18:25",
          status: "read",
        },
        {
          id: "m_ph3",
          sender: "them",
          type: "text",
          content: "Am înțeles... am expediat de urgență un colet secret cu fiolele neurotoxice și o cheie de rezervă printr-un curier de încredere.",
          timestamp: "18:40",
          status: "read",
        },
        {
          id: "m_ph4",
          sender: "them",
          type: "text",
          content: "Dacă întârzie sau nu ajunge la dumneavoastră, contactați direct curierul la numărul de serviciu: 0752593149. Spuneți-i că trimite Bogdan de la farmacie.",
          timestamp: "19:05",
          status: "read",
        }
      ]
    },
    {
      id: "paznic_mircea",
      name: "Mircea - Paznic Poarta 1",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      status: "În postul de pază. Poarta principală zăvorâtă.",
      lastSeen: "online",
      unread: 0,
      messages: [
        {
          id: "m_pz1",
          sender: "them",
          type: "text",
          content: "Șefu', a venit o dubiță neagră la poartă acum o jumătate de oră. Doi indivizi au descărcat un pacient legat la ochi și au plecat în grabă.",
          timestamp: "21:00",
          status: "read",
        },
        {
          id: "m_pz2",
          sender: "me",
          type: "text",
          content: "L-ați dus direct pe scara de serviciu spre laboratorul din subsol?",
          timestamp: "21:03",
          status: "read",
        },
        {
          id: "m_pz3",
          sender: "them",
          type: "text",
          content: "Da, l-a preluat Igor la morgă. Dar ușa metalică de la curtea interioară are lacătul ruginit blocat.",
          timestamp: "21:15",
          status: "read",
        },
        {
          id: "m_pz4",
          sender: "them",
          type: "text",
          content: "Să știți că am încuiat porțile mari cu lanțul greu. Nimeni nu mai intră și nimeni nu iese din spital în noaptea asta.",
          timestamp: "21:55",
          status: "read",
        }
      ]
    },
    {
      id: "dr_sandu_chirurg",
      name: "Dr. Sandu - Neurochirurg",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
      status: "În sala de operații 2",
      lastSeen: "azi la 20:15",
      unread: 0,
      messages: [
        {
          id: "m_ch1",
          sender: "them",
          type: "text",
          content: "Sterian, lobotomia de la ora 16:00 a eșuat. Emisfera stângă a suferit necroză masivă din cauza electrozilor.",
          timestamp: "17:30",
          status: "read",
        },
        {
          id: "m_ch2",
          sender: "me",
          type: "text",
          content: "Nu este un eșec, Sandu. Este o fază intermediară. Am extras datele electroencefalogramei?",
          timestamp: "17:45",
          status: "read",
        },
        {
          id: "m_ch3",
          sender: "them",
          type: "text",
          content: "Da, graficele sunt în dosarul roșu din cabinetul tău. Dar nu mai particip la așa ceva. Mirosul de carne arsă nu se mai duce din sală.",
          timestamp: "18:10",
          status: "read",
        },
        {
          id: "m_ch4",
          sender: "me",
          type: "text",
          content: "Ești prea slab pentru medicina viitorului. Pune dosarul sub cheie și taci.",
          timestamp: "18:15",
          status: "read",
        }
      ]
    },
    {
      id: "inginer_raducu",
      name: "Nea Răducu - Tehnic & Generatoare",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      status: "În camera cazanelor",
      lastSeen: "azi la 21:50",
      unread: 0,
      messages: [
        {
          id: "m_tc1",
          sender: "them",
          type: "text",
          content: "Dom' doctor, generatorul diesel din subsol scoate scântei ciudate. Dacă mai porniți aparatul de terapie cu șocuri electrice, pică siguranțele generale!",
          timestamp: "20:20",
          status: "read",
        },
        {
          id: "m_tc2",
          sender: "me",
          type: "text",
          content: "Crește voltajul pe rețeaua secundară. Avem nevoie de 220V constanți pentru stabilizatorul cerebral.",
          timestamp: "20:25",
          status: "read",
        },
        {
          id: "m_tc3",
          sender: "them",
          type: "text",
          content: "Riscăm să luăm foc cu toții! Tabloul electric este încuiat cu lacătul cu cifru. Dacă e urgență, știți că maneta roșie taie tot curentul.",
          timestamp: "20:40",
          status: "read",
        }
      ]
    },
    {
      id: "arhiva_sanatoriu",
      name: "Doamna Carmen - Arhivă Medicală",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      status: "Catalogare dosare pacienți 1970-1995",
      lastSeen: "azi la 19:40",
      unread: 0,
      messages: [
        {
          id: "m_ar1",
          sender: "me",
          type: "text",
          content: "Carmen, ai găsit dosarul pacientului internat în 1984 cu diagnosticul de psihoză maniacală delirantă?",
          timestamp: "16:00",
          status: "read",
        },
        {
          id: "m_ar2",
          sender: "them",
          type: "text",
          content: "L-am găsit, domnule Doctor. Era ascuns în cutia cu dosare 'Decedați fără aparținători'. Fila cu autopsia a fost smulsă intenționat.",
          timestamp: "16:15",
          status: "read",
        },
        {
          id: "m_ar3",
          sender: "me",
          type: "text",
          content: "Foarte bine. Adu-mi dosarul în cabinet și nu vorbi cu nimeni despre ce scrie pe copertă.",
          timestamp: "16:20",
          status: "read",
        },
        {
          id: "m_ar4",
          sender: "them",
          type: "text",
          content: "L-am pus pe biroul dumneavoastră sub lampă. Numele pacientului era chiar cel pe care îl bănuiați...",
          timestamp: "17:00",
          status: "read",
        }
      ]
    },
    {
      id: "procuror_stancu",
      name: "Procuror M. Stancu",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      status: "Tribunalul Județean - Dosar Penal 402/P",
      lastSeen: "azi la 22:10",
      unread: 1,
      messages: [
        {
          id: "m_pr1",
          sender: "them",
          type: "text",
          content: "Doctor Sterian, vă somez oficial. Mâine la ora 09:00 sunteți citat pentru audieri în cazul morților suspecte din Pavilionul 9.",
          timestamp: "21:45",
          status: "read",
        },
        {
          id: "m_pr2",
          sender: "me",
          type: "text",
          content: "Toate decesele au fost cauzate de stop cardio-respirator pe fondul unor afecțiuni psihosomatice incurabile.",
          timestamp: "21:50",
          status: "read",
        },
        {
          id: "m_pr3",
          sender: "them",
          type: "text",
          content: "Avem declarația unui infirmier care a fugit din spital. Știm despre experimentele ilegale din subsol. Nu încercați să părăsiți incinta.",
          timestamp: "22:02",
          status: "read",
        },
        {
          id: "m_pr4",
          sender: "them",
          type: "text",
          content: "Mandatul de percheziție a fost deja semnat de judecător. Echipajele de intervenție sunt în drum spre Poiana Verde.",
          timestamp: "22:48",
          status: "read",
        }
      ]
    }
  ],
  rules: [
    {
      id: "rule_1",
      contactId: "asistenta_elena",
      triggerType: "contains", // "contains" sau "exact"
      triggerPhrase: "dulap",
      responseType: "image", // "text", "image", "audio", "call"
      responseContent: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80",
      responseCaption: "Am găsit eticheta sertarului! Pe spatele cheii scrie codul cifrului: [ 7 3 9 1 ]. Grăbiți-vă!",
      delayMs: 2500,
      enabled: true
    },
    {
      id: "rule_2",
      contactId: "igor_morga",
      triggerType: "contains",
      triggerPhrase: "injecteaza",
      responseType: "text",
      responseContent: "Am înțeles, domnule Doctor. I-am injectat 50ml de Formaldehidă B în vena jugulară. Spasmele s-au oprit. Discul cu cifru de sub masa de autopsie indică 'DELTA-4'.",
      responseCaption: "",
      delayMs: 2000,
      enabled: true
    },
    {
      id: "rule_3",
      contactId: "subiectul_zero",
      triggerType: "contains",
      triggerPhrase: "cine esti",
      responseType: "call",
      responseContent: "EERIE_STATIC",
      callAudioUrl: "",
      callDurationSec: 12,
      callVoiceLine: "Șoaptă: 'Privește în spatele tabloului... cheia este în carnea mea...'",
      responseCaption: "",
      delayMs: 1500,
      enabled: true
    },
    {
      id: "rule_4",
      contactId: "asistenta_elena",
      triggerType: "contains",
      triggerPhrase: "antidot",
      responseType: "audio",
      responseContent: "AUDIO_VOICE_NOTE",
      responseCaption: "Mesaj vocal de la Elena (0:14): 'Ascultați cu atenție! Amestecați eprubeta 3 cu eprubeta 9, apoi trageți de maneta roșie!'",
      delayMs: 3000,
      enabled: true
    },
    {
      id: "rule_5",
      contactId: "farmacist_bogdan",
      triggerType: "contains",
      triggerPhrase: "toxina",
      responseType: "text",
      responseContent: "Formula letală este pregătită: 3 picături din sticla cu etichetă verde și 2 din cea maro. Combinația de la lada frigorifică din laborator este 8-4-2.",
      responseCaption: "",
      delayMs: 1800,
      enabled: true
    },
    {
      id: "rule_6",
      contactId: "inginer_raducu",
      triggerType: "contains",
      triggerPhrase: "curent",
      responseType: "text",
      responseContent: "Am cuplat generatorul de rezervă, dom' Doctor! Pentru a deschide ușa magnetică spre ieșire, introduceți la panou anul înființării spitalului: 1968.",
      responseCaption: "",
      delayMs: 2000,
      enabled: true
    }
  ]
};
