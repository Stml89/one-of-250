/* ---------- countries: money, names, places and local job-market reality ----------
   Text values are {ru,en} pairs so that every language sees the same number of options:
   a daily seed has to produce the same run in any language. */
const COUNTRIES={
  ru:{name:{ru:"Россия",en:"Russia"},platform:{ru:"ЖдиОтвета.ру",en:"WaitForReply.ru"},
    cur:"RUB",per:"mo",step:5000,fee:15000,eng:true,
    base:{dev:220000,mk:150000,pm:190000,hr:120000},
    photo:{with:1.05,without:1,hint:{ru:"В России резюме с фото — привычное дело.",en:"In Russia a photo on a CV is the norm."}},
    probation:{ru:"Испытательный срок 3 месяца",en:"3-month probation"},
    cities:[{ru:"Москва",en:"Moscow"},{ru:"Казань",en:"Kazan"},{ru:"Новосибирск",en:"Novosibirsk"},{ru:"Екатеринбург",en:"Yekaterinburg"},{ru:"Краснодар",en:"Krasnodar"}],
    names:{m:[{ru:"Валерий",en:"Valery"},{ru:"Артём",en:"Artyom"},{ru:"Игорь",en:"Igor"},{ru:"Денис",en:"Denis"},{ru:"Олег",en:"Oleg"},{ru:"Павел",en:"Pavel"}],
      f:[{ru:"Ольга",en:"Olga"},{ru:"Наталья",en:"Natalia"},{ru:"Светлана",en:"Svetlana"},{ru:"Марина",en:"Marina"},{ru:"Ирина",en:"Irina"},{ru:"Юлия",en:"Yulia"}]},
    surn:[{ru:"К.",en:"K."},{ru:"Л.",en:"L."},{ru:"М.",en:"M."},{ru:"Н.",en:"N."},{ru:"С.",en:"S."},{ru:"Т.",en:"T."}],
    companies:[{ru:"ООО «Вектор Синергии»",en:"Vector Synergy LLC"},{ru:"Стартап «Блокчейн для бабушек»",en:"Blockchain for Grannies"},{ru:"Банк «Надёжный-ish»",en:"Reliable-ish Bank"},{ru:"ООО «ТехноПрорыв 2030»",en:"TechnoBreakthrough 2030 LLC"},{ru:"ИП Сергеев и партнёры (Сергеев)",en:"Sergeev & Partners (just Sergeev)"},{ru:"Маркетплейс «Всё и Сразу»",en:"Everything At Once marketplace"},{ru:"ООО «Ромашка»",en:"Romashka LLC"}],
    my:{ru:"«Мы Семья»",en:"«We Are Family» Holding"},
    perks:[{ru:"Печеньки и дружный коллектив",en:"Cookies and a friendly team"},{ru:"Молодой динамичный коллектив",en:"Young, dynamic team"},{ru:"Белая зарплата (частично)",en:"Salary on the books (partly)"},{ru:"ДМС после испытательного срока",en:"Health insurance after probation"},{ru:"Возможность роста (в том числе вниз)",en:"Room to grow (in any direction, including down)"},{ru:"Мы не компания, мы семья",en:"We're not a company, we're a family"}],
    oform:{real:[{ru:"Оформление по ТК",en:"Official contract under the Labor Code"},{ru:"По ТК, белая зарплата",en:"Labor Code contract, fully on the books"}],
      internal:[{ru:"Оформление по ТК",en:"Official contract under the Labor Code"}],ghost:[{ru:"Оформление обсуждается",en:"Employment terms to be discussed"}],
      scam:[{ru:"Самозанятость, оплата по результату",en:"Self-employed, paid per result"},{ru:"Договор — после испытательного срока",en:"Contract signed after the trial period"}]},
    insys:[{ru:"CRM «Бублик»",en:"the «Bublik» CRM"},{ru:"1С «Наша версия»",en:"1C «Our Edition»"},{ru:"таск-трекер «Сделано»",en:"the «Done» task tracker"},{ru:"портал «Внутрянка»",en:"the «Inside» portal"}],
    grades:[["Junior",0,"pre"],["Middle",2,"pre"],["Senior",5,"pre"]],
    titles:{dev:{ru:"1С-программист (почти бэкенд)",en:"1C developer (almost backend)",tag:"backend",nice:"data"},mk:{ru:"Маркетолог маркетплейсов",en:"Marketplace marketer",tag:"performance",nice:"analytics"},
      pm:{ru:"Руководитель проектов (госзаказ)",en:"Project manager (government contracts)",tag:"delivery",nice:"budget"},hr:{ru:"Менеджер по персоналу",en:"Personnel manager",tag:"recruiting",nice:"cb"}},
    planB:[{ru:"курьер",en:"courier"},{ru:"продавец-консультант",en:"sales assistant"}]},
  us:{name:{ru:"США",en:"USA"},platform:{ru:"LinkedOut",en:"LinkedOut"},
    cur:"USD",per:"yr",step:5000,fee:499,eng:false,
    base:{dev:130000,mk:85000,pm:110000,hr:70000},
    photo:{with:0.8,without:1,hint:{ru:"В США фото в резюме обычно не ставят: часть компаний такие резюме откладывает.",en:"In the US a photo is unusual: some companies set such CVs aside."}},
    probation:{ru:"Испытательный период 90 дней",en:"90-day introductory period"},
    cities:[{ru:"Остин",en:"Austin"},{ru:"Чикаго",en:"Chicago"},{ru:"Денвер",en:"Denver"},{ru:"Атланта",en:"Atlanta"},{ru:"Сиэтл",en:"Seattle"}],
    names:{m:[{ru:"Кевин",en:"Kevin"},{ru:"Брэндон",en:"Brandon"},{ru:"Тайлер",en:"Tyler"},{ru:"Джош",en:"Josh"},{ru:"Райан",en:"Ryan"},{ru:"Эрик",en:"Eric"}],
      f:[{ru:"Эшли",en:"Ashley"},{ru:"Меган",en:"Megan"},{ru:"Джессика",en:"Jessica"},{ru:"Бриттани",en:"Brittany"},{ru:"Лорен",en:"Lauren"},{ru:"Кейли",en:"Kayley"}]},
    surn:[{ru:"Смит",en:"Smith"},{ru:"Джонсон",en:"Johnson"},{ru:"Миллер",en:"Miller"},{ru:"Дэвис",en:"Davis"},{ru:"Браун",en:"Brown"},{ru:"Уилсон",en:"Wilson"}],
    companies:["Synergetix Inc.","Disruptly","Rockstar Ninja Labs","MegaCorp Holdings","Pivotal Pivot","Unicorn-ish AI","Stealth Startup"],
    my:"FamilyFirst Corp.",
    perks:[{ru:"Unlimited PTO (лучше не брать)",en:"Unlimited PTO (better not use it)"},{ru:"We are a family",en:"We are a family"},{ru:"Fast-paced environment",en:"Fast-paced environment"},{ru:"Competitive salary (какой — не скажем)",en:"Competitive salary (we won't say how much)"},{ru:"Медстраховка с франшизой $6 000",en:"Health plan with a $6,000 deductible"},{ru:"Пицца по пятницам вместо премии",en:"Pizza Fridays instead of a bonus"}],
    oform:{real:[{ru:"W-2, полный соцпакет",en:"W-2, full benefits"}],internal:[{ru:"W-2, полный соцпакет",en:"W-2, full benefits"}],ghost:[{ru:"Детали — на собеседовании",en:"Details at the interview"}],
      scam:[{ru:"1099, оплата за результат",en:"1099, paid per result"},{ru:"Контракт — после испытательного срока",en:"Contract after the trial period"}]},
    insys:[{ru:"инструмент «Gizmo»",en:"the «Gizmo» tool"},{ru:"портал «Hub»",en:"the «Hub» portal"},{ru:"CRM «Pipeline Pro (форк)»",en:"the «Pipeline Pro (fork)» CRM"},{ru:"база «Legacy»",en:"the «Legacy» database"}],
    grades:[["I",0,"post"],["II",2,"post"],["Senior",5,"pre"]],
    titles:{dev:{ru:"Software Engineer (обязанности Staff-уровня)",en:"Software Engineer (Staff-level duties)",tag:"backend",nice:"lead"},mk:{ru:"Growth-маркетолог",en:"Growth Marketer",tag:"performance",nice:"analytics"},
      pm:{ru:"Technical Program Manager",en:"Technical Program Manager",tag:"delivery",nice:"stakeholders"},hr:{ru:"Talent Acquisition Partner",en:"Talent Acquisition Partner",tag:"recruiting",nice:"hrbrand"}},
    planB:[{ru:"водитель такси через приложение",en:"rideshare driver"},{ru:"бариста",en:"barista"}]},
  es:{name:{ru:"Испания",en:"Spain"},platform:{ru:"InfoNoJobs",en:"InfoNoJobs"},
    cur:"EUR",per:"yr",step:1000,fee:299,eng:true,
    base:{dev:38000,mk:30000,pm:40000,hr:28000},
    photo:{with:1,without:1,hint:{ru:"В Испании фото в резюме встречается часто, но решающим не бывает.",en:"In Spain photos are common but never decisive."}},
    probation:{ru:"Periodo de prueba: 6 месяцев",en:"Periodo de prueba: 6 months"},
    cities:[{ru:"Мадрид",en:"Madrid"},{ru:"Барселона",en:"Barcelona"},{ru:"Валенсия",en:"Valencia"},{ru:"Севилья",en:"Seville"},{ru:"Бильбао",en:"Bilbao"}],
    names:{m:[{ru:"Хавьер",en:"Javier"},{ru:"Алехандро",en:"Alejandro"},{ru:"Пабло",en:"Pablo"},{ru:"Серхио",en:"Sergio"},{ru:"Давид",en:"David"},{ru:"Хорхе",en:"Jorge"}],
      f:[{ru:"Лусия",en:"Lucía"},{ru:"Мария",en:"María"},{ru:"Кармен",en:"Carmen"},{ru:"Лаура",en:"Laura"},{ru:"Марта",en:"Marta"},{ru:"Паула",en:"Paula"}]},
    surn:[{ru:"Гарсия",en:"García"},{ru:"Лопес",en:"López"},{ru:"Мартинес",en:"Martínez"},{ru:"Санчес",en:"Sánchez"},{ru:"Перес",en:"Pérez"},{ru:"Гомес",en:"Gómez"}],
    companies:["Sinergias Globales S.L.","Disrupción Total S.A.","Consultora Cárnica S.L.","Tapas & Tech","Startup del Bocadillo","Grupo Mañana S.A."],
    my:"Grupo Familia S.A.",
    perks:[{ru:"Фрукты по понедельникам",en:"Fruit on Mondays"},{ru:"Jornada intensiva летом (до 15:00)",en:"Jornada intensiva in summer (done by 3 pm)"},{ru:"Ticket restaurante",en:"Ticket restaurante"},{ru:"Удалёнка по пятницам (иногда)",en:"Remote Fridays (sometimes)"},{ru:"Молодой коллектив и много энтузиазма",en:"Young team, lots of enthusiasm"},{ru:"Зарплата обсуждается (вниз)",en:"Salary negotiable (downwards)"}],
    oform:{real:[{ru:"Бессрочный контракт (contrato indefinido)",en:"Contrato indefinido (permanent contract)"}],internal:[{ru:"Бессрочный контракт (contrato indefinido)",en:"Contrato indefinido (permanent contract)"}],
      ghost:[{ru:"Условия обсудим",en:"Condiciones a convenir"}],
      scam:[{ru:"Как autónomo (ИП), оплата по результату",en:"As an autónomo, paid per result"},{ru:"Контракт — после испытательного срока",en:"Contract after the trial period"}]},
    insys:[{ru:"ERP «Paella»",en:"the «Paella» ERP"},{ru:"Excel «Final_v7_bueno»",en:"the «Final_v7_bueno» spreadsheet"},{ru:"портал «Mañana»",en:"the «Mañana» portal"},{ru:"CRM «Siesta»",en:"the «Siesta» CRM"}],
    grades:[["Junior",0,"pre"],["Mid",2,"pre"],["Senior",5,"pre"]],
    titles:{dev:{ru:"Программист в консалтинге (consultora cárnica)",en:"Developer at a body-shop consultancy (cárnica)",tag:"backend",nice:"frontend"},mk:{ru:"Community manager",en:"Community manager",tag:"smm",nice:"content"},
      pm:{ru:"Jefe de proyecto",en:"Jefe de proyecto (project lead)",tag:"delivery",nice:"budget"},hr:{ru:"Técnico de selección (рекрутер)",en:"Técnico de selección (recruiter)",tag:"recruiting",nice:"ats"}},
    planB:[{ru:"официант на сезон",en:"seasonal waiter"},{ru:"оператор колл-центра",en:"call center agent"}]},
  it:{name:{ru:"Италия",en:"Italy"},platform:{ru:"InfoNiente.it",en:"InfoNiente.it"},
    cur:"EUR",per:"yr",step:1000,fee:299,eng:true,
    base:{dev:35000,mk:30000,pm:38000,hr:30000},
    photo:{with:1,without:1,hint:{ru:"В Италии фото в CV ставят часто, но на решение оно не влияет.",en:"In Italy photos on CVs are common but don't change the decision."}},
    probation:{ru:"Periodo di prova: 6 месяцев",en:"Periodo di prova: 6 months"},
    cities:[{ru:"Милан",en:"Milan"},{ru:"Рим",en:"Rome"},{ru:"Турин",en:"Turin"},{ru:"Болонья",en:"Bologna"},{ru:"Неаполь",en:"Naples"}],
    names:{m:[{ru:"Марко",en:"Marco"},{ru:"Лука",en:"Luca"},{ru:"Джузеппе",en:"Giuseppe"},{ru:"Андреа",en:"Andrea"},{ru:"Маттео",en:"Matteo"},{ru:"Лоренцо",en:"Lorenzo"}],
      f:[{ru:"Джулия",en:"Giulia"},{ru:"Франческа",en:"Francesca"},{ru:"Кьяра",en:"Chiara"},{ru:"Сара",en:"Sara"},{ru:"Элена",en:"Elena"},{ru:"Валентина",en:"Valentina"}]},
    surn:[{ru:"Росси",en:"Rossi"},{ru:"Бьянки",en:"Bianchi"},{ru:"Романо",en:"Romano"},{ru:"Коломбо",en:"Colombo"},{ru:"Риччи",en:"Ricci"},{ru:"Галло",en:"Gallo"}],
    companies:["Sinergia S.r.l.","Nonna Tech S.p.A.","Burocrazia Digitale S.r.l.","Pizza & Cloud","Consulenze Infinite S.r.l.","Domani Holding"],
    my:"Famiglia S.p.A.",
    perks:[{ru:"Тринадцатая и четырнадцатая зарплата",en:"13th and 14th month salary"},{ru:"Buoni pasto (талоны на обед)",en:"Buoni pasto (meal vouchers)"},{ru:"Кофе-пауза — святое",en:"The coffee break is sacred"},{ru:"Контракт по CCNL Commercio",en:"CCNL Commercio contract"},{ru:"Возможность роста (лет через пятнадцать)",en:"Growth opportunities (in about fifteen years)"},{ru:"Ambiente giovane e dinamico",en:"Ambiente giovane e dinamico"}],
    oform:{real:[{ru:"Бессрочный контракт (tempo indeterminato)",en:"Tempo indeterminato (permanent contract)"}],internal:[{ru:"Бессрочный контракт (tempo indeterminato)",en:"Tempo indeterminato (permanent contract)"}],
      ghost:[{ru:"Условия определим позже",en:"Inquadramento da definire"}],
      scam:[{ru:"Через partita IVA, оплата по результату",en:"Partita IVA, paid per result"},{ru:"Неоплачиваемая стажировка, а там посмотрим",en:"Unpaid stage, then we'll see"}]},
    insys:[{ru:"gestionale «Pasta 2003»",en:"the «Pasta 2003» management system"},{ru:"портал «Burocrazia»",en:"the «Burocrazia» portal"},{ru:"CRM «Nonna»",en:"the «Nonna» CRM"},{ru:"Access-база «Definitivo_2»",en:"the «Definitivo_2» Access database"}],
    grades:[["Junior",0,"pre"],["Mid",2,"pre"],["Senior",5,"pre"]],
    titles:{dev:{ru:"Разработчик (body rental)",en:"Developer (body rental)",tag:"backend",nice:"devops"},mk:{ru:"Social media manager",en:"Social media manager",tag:"smm",nice:"brand"},
      pm:{ru:"Project manager (PMO)",en:"Project manager (PMO)",tag:"delivery",nice:"team"},hr:{ru:"HR generalist (и расчёт зарплат)",en:"HR generalist (payroll too)",tag:"recruiting",nice:"cb"}},
    planB:[{ru:"курьер-доставщик",en:"delivery rider"},{ru:"продавец в магазине",en:"shop assistant"}]},
  fr:{name:{ru:"Франция",en:"France"},platform:{ru:"Pôle Attente",en:"Pôle Attente"},
    cur:"EUR",per:"yr",step:1000,fee:349,eng:true,
    base:{dev:48000,mk:40000,pm:50000,hr:38000},
    photo:{with:1,without:1,hint:{ru:"Во Франции фото в CV — по желанию, на решение почти не влияет.",en:"In France a photo is optional and barely matters."}},
    probation:{ru:"Période d'essai: 4 месяца",en:"Période d'essai: 4 months"},
    cities:[{ru:"Париж",en:"Paris"},{ru:"Лион",en:"Lyon"},{ru:"Тулуза",en:"Toulouse"},{ru:"Нант",en:"Nantes"},{ru:"Лилль",en:"Lille"}],
    names:{m:[{ru:"Жюльен",en:"Julien"},{ru:"Тома",en:"Thomas"},{ru:"Николя",en:"Nicolas"},{ru:"Антуан",en:"Antoine"},{ru:"Максим",en:"Maxime"},{ru:"Люка",en:"Lucas"}],
      f:[{ru:"Камиль",en:"Camille"},{ru:"Леа",en:"Léa"},{ru:"Хлоя",en:"Chloé"},{ru:"Манон",en:"Manon"},{ru:"Софи",en:"Sophie"},{ru:"Инес",en:"Inès"}]},
    surn:[{ru:"Мартен",en:"Martin"},{ru:"Бернар",en:"Bernard"},{ru:"Дюбуа",en:"Dubois"},{ru:"Моро",en:"Moreau"},{ru:"Лоран",en:"Laurent"},{ru:"Симон",en:"Simon"}],
    companies:["Synergie Conseil SAS","Start-up Nation SAS","Disruption & Fils","Croissant Analytics","Groupe Réunionite","La Grève Digitale SAS"],
    my:"Groupe Famille",
    perks:[{ru:"Tickets-resto",en:"Tickets-resto"},{ru:"RTT — дополнительные выходные",en:"RTT extra days off"},{ru:"Mutuelle — медстраховка",en:"Mutuelle health cover"},{ru:"Afterwork по четвергам",en:"Thursday afterwork"},{ru:"Пятая неделя отпуска",en:"Fifth week of paid leave"},{ru:"Дух start-up nation и настольный футбол",en:"Start-up nation vibes and a baby-foot table"}],
    oform:{real:[{ru:"CDI (бессрочный), конвенция Syntec",en:"CDI (permanent), Syntec agreement"}],internal:[{ru:"CDI (бессрочный), конвенция Syntec",en:"CDI (permanent), Syntec agreement"}],
      ghost:[{ru:"Статус обсудим",en:"Statut à définir"}],
      scam:[{ru:"Как auto-entrepreneur, оплата по результату",en:"As an auto-entrepreneur, paid per result"},{ru:"Контракт — после испытательного срока",en:"Contract after the trial period"}]},
    insys:[{ru:"logiciel maison «Baguette»",en:"the in-house «Baguette» software"},{ru:"интранет «Grève»",en:"the «Grève» intranet"},{ru:"CRM «Réunion»",en:"the «Réunion» CRM"},{ru:"тикет-система «Demain»",en:"the «Demain» ticketing system"}],
    grades:[["junior",0,"post"],["confirmé",2,"post"],["senior",5,"post"]],
    titles:{dev:{ru:"Développeur full stack в ESN (аутсорс)",en:"Full-stack developer at an ESN (outsourcer)",tag:"backend",nice:"frontend"},mk:{ru:"Chargé de communication",en:"Chargé de communication",tag:"content",nice:"smm"},
      pm:{ru:"Chef de projet",en:"Chef de projet",tag:"delivery",nice:"stakeholders"},hr:{ru:"Chargé de recrutement",en:"Chargé de recrutement",tag:"recruiting",nice:"hrbrand"}},
    planB:[{ru:"курьер на велосипеде",en:"bike courier"},{ru:"официант",en:"waiter"}]},
  jp:{name:{ru:"Япония",en:"Japan"},platform:{ru:"Rikunashi (リクナシ)",en:"Rikunashi (リクナシ)"},
    cur:"JPY",per:"yr",step:100000,fee:49800,eng:true,
    base:{dev:6000000,mk:5000000,pm:6500000,hr:4800000},
    photo:{with:1.05,without:0.85,hint:{ru:"В Японии фото в резюме (履歴書) обязательно: без него резюме выглядит неполным.",en:"In Japan a photo on the rirekisho is expected: without one the CV looks incomplete."}},
    probation:{ru:"試用期間 — 3 месяца",en:"Shiyō kikan (trial): 3 months"},
    cities:[{ru:"Токио",en:"Tokyo"},{ru:"Осака",en:"Osaka"},{ru:"Нагоя",en:"Nagoya"},{ru:"Фукуока",en:"Fukuoka"},{ru:"Саппоро",en:"Sapporo"}],
    names:{m:[{ru:"Харуто",en:"Haruto"},{ru:"Такуми",en:"Takumi"},{ru:"Кэнта",en:"Kenta"},{ru:"Дайки",en:"Daiki"},{ru:"Рё",en:"Ryo"},{ru:"Сота",en:"Sota"}],
      f:[{ru:"Юи",en:"Yui"},{ru:"Сакура",en:"Sakura"},{ru:"Аой",en:"Aoi"},{ru:"Харука",en:"Haruka"},{ru:"Мисаки",en:"Misaki"},{ru:"Нана",en:"Nana"}]},
    surn:[{ru:"Сато",en:"Sato"},{ru:"Судзуки",en:"Suzuki"},{ru:"Такахаси",en:"Takahashi"},{ru:"Танака",en:"Tanaka"},{ru:"Ито",en:"Ito"},{ru:"Ямамото",en:"Yamamoto"}],
    companies:["Synergy Holdings K.K.","Karoshi Systems Co.","Salaryman & Sons K.K.","Nemawashi Consulting","Overtime Tech K.K.","Ringi Solutions"],
    my:"Kazoku Holdings K.K.",
    perks:[{ru:"Утренняя гимнастика под радио (ラジオ体操)",en:"Morning radio calisthenics"},{ru:"Номикай после работы — по желанию (обязательно)",en:"After-work nomikai — optional (mandatory)"},{ru:"Пожизненный найм (так было в 1985-м)",en:"Lifetime employment (as of 1985)"},{ru:"Бонусы два раза в год",en:"Bonuses twice a year"},{ru:"Служебное общежитие",en:"Company dormitory"},{ru:"Сверхурочные уже включены в зарплату (みなし残業)",en:"Overtime already «included» in your salary"}],
    oform:{real:[{ru:"正社員 — постоянный штат",en:"Seishain: permanent full-time"}],internal:[{ru:"正社員 — постоянный штат",en:"Seishain: permanent full-time"}],
      ghost:[{ru:"Тип найма обсудим",en:"Employment type to be discussed"}],
      scam:[{ru:"業務委託 — подряд, оплата по результату",en:"Gyōmu itaku contract, paid per result"},{ru:"Договор — после испытательного срока",en:"Contract after the trial period"}]},
    insys:[{ru:"Excel-форма «稟議» (ринги)",en:"the «ringi» approval spreadsheet"},{ru:"система печатей «Ханко 2.0»",en:"the «Hanko 2.0» stamp system"},{ru:"факс-портал «Ima»",en:"the «Ima» fax portal"},{ru:"Lotus Notes «Zutto»",en:"the «Zutto» Lotus Notes"}],
    grades:[[{ru:"(新卒 — выпускник)",en:"(shinsotsu, new grad)"},0,"post"],[{ru:"(中途 — с опытом)",en:"(chūto, mid-career)"},2,"post"],[{ru:"(シニア)",en:"(senior)"},5,"post"]],
    titles:{dev:{ru:"SE в SIer-компании (システムエンジニア)",en:"Systems engineer at an SIer",tag:"backend",nice:"data"},mk:{ru:"Специалист по продвижению (販促)",en:"Sales promotion staff (hansoku)",tag:"content",nice:"brand"},
      pm:{ru:"PM (総合職, ротация раз в три года)",en:"PM (sōgōshoku, rotated every three years)",tag:"delivery",nice:"team"},hr:{ru:"Сотрудник отдела кадров (人事部)",en:"Jinji-bu (HR department) staff",tag:"recruiting",nice:"onboarding"}},
    planB:[{ru:"ночная смена в конбини",en:"night shift at a konbini"},{ru:"охранник на парковке",en:"parking lot guard"}]},
  cn:{name:{ru:"Китай",en:"China"},platform:{ru:"BOSS不直聘",en:"BOSS不直聘 (Boss No-Hire)"},
    cur:"CNY",per:"mo",step:500,fee:2999,eng:true,surnameFirst:true,
    base:{dev:25000,mk:15000,pm:22000,hr:12000},
    photo:{with:1.05,without:1,hint:{ru:"В Китае фото в резюме — норма.",en:"In China a photo on a CV is the norm."}},
    probation:{ru:"试用期 — 6 месяцев, 80% оклада",en:"Shiyongqi (trial): 6 months at 80% pay"},
    cities:[{ru:"Пекин",en:"Beijing"},{ru:"Шанхай",en:"Shanghai"},{ru:"Шэньчжэнь",en:"Shenzhen"},{ru:"Ханчжоу",en:"Hangzhou"},{ru:"Чэнду",en:"Chengdu"}],
    names:{m:[{ru:"Вэй",en:"Wei"},{ru:"Хао",en:"Hao"},{ru:"Цзюнь",en:"Jun"},{ru:"Лэй",en:"Lei"},{ru:"Тао",en:"Tao"},{ru:"Бо",en:"Bo"}],
      f:[{ru:"На",en:"Na"},{ru:"Цзин",en:"Jing"},{ru:"Фан",en:"Fang"},{ru:"Янь",en:"Yan"},{ru:"Минь",en:"Min"},{ru:"Хуэй",en:"Hui"}]},
    surn:[{ru:"Ван",en:"Wang"},{ru:"Ли",en:"Li"},{ru:"Чжан",en:"Zhang"},{ru:"Лю",en:"Liu"},{ru:"Чэнь",en:"Chen"},{ru:"Ян",en:"Yang"}],
    companies:["996 Tech Co.","Fubao Group","Neijuan Ltd.","Wolf Culture Inc.","Unicorn Dream Co.","Tangping Holdings"],
    my:"Family Group (家人集团)",
    perks:[{ru:"996 — это благословение (福报)",en:"996 is a blessing (fubao)"},{ru:"Бесплатный ужин, если ты ещё на работе после 21:00",en:"Free dinner if you're still here after 9 pm"},{ru:"Командный дух «волчьей стаи»",en:"«Wolf pack» team spirit"},{ru:"Опционы (когда-нибудь)",en:"Stock options (someday)"},{ru:"Ежегодная поездка с коллективом",en:"Annual team trip"},{ru:"Капсулы для сна прямо в офисе",en:"Nap pods right in the office"}],
    oform:{real:[{ru:"Трудовой договор, 五险一金 (полная соцстраховка)",en:"Labor contract with wuxian yijin (full social insurance)"}],internal:[{ru:"Трудовой договор, 五险一金 (полная соцстраховка)",en:"Labor contract with wuxian yijin (full social insurance)"}],
      ghost:[{ru:"Условия — на собеседовании",en:"Terms at the interview"}],
      scam:[{ru:"Без соцстраховки, оплата по результату",en:"No social insurance, paid per result"},{ru:"Договор — после испытательного срока",en:"Contract after the trial period"}]},
    insys:[{ru:"мини-апп «关系» (гуаньси)",en:"the «guanxi» mini-app"},{ru:"KPI-система «Волк»",en:"the «Wolf» KPI system"},{ru:"OA-портал «Fubao»",en:"the «Fubao» OA portal"},{ru:"чат-бот «Neijuan»",en:"the «Neijuan» chatbot"}],
    grades:[["P5",0,"post"],["P6",2,"post"],["P7",5,"post"]],
    titles:{dev:{ru:"Java-разработчик (996)",en:"Java developer (996)",tag:"backend",nice:"devops"},mk:{ru:"Оператор новых медиа (新媒体运营)",en:"New-media operator",tag:"smm",nice:"content"},
      pm:{ru:"Проджект-менеджер (项目经理)",en:"Project manager (xiangmu jingli)",tag:"delivery",nice:"budget"},hr:{ru:"HRBP («волчья культура»)",en:"HRBP («wolf culture»)",tag:"onboarding",nice:"recruiting"}},
    planB:[{ru:"курьер доставки еды (外卖骑手)",en:"food delivery rider"},{ru:"продавец в прямом эфире",en:"livestream seller"}]}
};
const COUNTRY_KEYS=["ru","us","es","it","fr","jp","cn"];

/* ---------- real labour-market numbers ----------
   Shown to the player with source and month, and they set how crowded vacancies are.
   facts: [kind, value, month, source, url] — the kind picks the wording in LANG[lang].facts;
   the url is the page the figure was read from, linked from its phrase and from the source name.
   press: how many more applicants a vacancy gets than in the US (1). A design judgment from the
     facts, not a statistic: Russia's unemployment is near a record low, but hh.ru counts ~9 CVs
     per vacancy, so office jobs there are crowded.
   young: extra applicants for a player under 25, where the youth rate is far above the total.
   search: how long a job search takes, where an official series exists.
   Update quarterly; tests/langcheck.js reports facts older than 12 months. */
const MARKET_STATS={
  ru:{press:1.2,facts:[["unemp",2.3,"2026-07","Rosstat","https://rosstat.gov.ru/labour_force"],["hh",8.7,"2026-07","hh.ru","https://stats.hh.ru/"]]},
  us:{press:1,facts:[["unemp",4.2,"2026-09","BLS","https://www.bls.gov/news.release/empsit.nr0.htm"],["perOpening",1.0,"2026-06","BLS","https://www.bls.gov/news.release/jolts.nr0.htm"]],
    search:{median:11,long:25.4,month:"2026-05",src:"BLS",url:"https://www.bls.gov/news.release/empsit.t12.htm"}},
  es:{press:1.35,young:1.3,facts:[["unemp",10.0,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"],["youth",22.9,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"]]},
  it:{press:1.05,young:1.5,facts:[["unemp",5.8,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"],["youth",18.9,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"]]},
  fr:{press:1.2,young:1.35,facts:[["unemp",8.3,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"],["youth",20.7,"2026-07","Eurostat","https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table"]]},
  jp:{press:0.85,facts:[["unemp",2.5,"2026-08","Statistics Bureau of Japan","https://www.stat.go.jp/english/data/roudou/index.html"],["jobsRatio",1.18,"2026-06","MHLW","https://www.mhlw.go.jp/toukei/list/114-1.html"],["fullTime",0.99,"2026-04","MHLW","https://www.mhlw.go.jp/toukei/list/114-1.html"]]},
  cn:{press:1.15,young:1.6,facts:[["unemp",5.2,"2026-09","NBS","https://www.stats.gov.cn/english/PressRelease/"],["youth",18.0,"2026-09","NBS","https://www.stats.gov.cn/english/PressRelease/"],["grads",12700000,"2026-06","MoE","https://govt.chinadaily.com.cn/s/202511/21/WS694a4679498e368550339281/china-to-have-12-7-million-new-college-graduates-next-year.html"]]}
};
/* the same for every country: Greenhouse Hire Standard (2025 data), TheLadders eye-tracking study (2012) */
const WORLD_STATS={appsPerJob:244,appsSrc:"Greenhouse",appsYear:2025,appsUrl:"https://www.greenhouse.com/recruiting-benchmarks",glanceSec:6,glanceSrc:"TheLadders",glanceYear:2012,glanceUrl:"https://web.archive.org/web/20131214121352/http://cdn.theladders.net/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf"};

/* Each language file adds its own wording for the country data through COUNTRY_TEXT[lang];
   missing entries fall back to English. */
const COUNTRY_TEXT={};
function mergeCountryText(lang,data){
  const put=(obj,key,val)=>{ if(val==null) return; if(typeof obj[key]==="string") obj[key]={en:obj[key]}; obj[key][lang]=val; };
  const arr=(list,vals)=>{ if(!vals) return; vals.forEach((v,i)=>{ if(i<list.length) put(list,i,v); }); };
  for(const ck of Object.keys(data)){
    const K=COUNTRIES[ck],D=data[ck];
    put(K,"name",D.name); put(K,"platform",D.platform); put(K,"my",D.my); put(K,"probation",D.probation); put(K.photo,"hint",D.photo);
    arr(K.cities,D.cities); arr(K.perks,D.perks); arr(K.insys,D.insys); arr(K.planB,D.planB); arr(K.companies,D.companies); arr(K.surn,D.surn);
    if(D.names){ arr(K.names.m,D.names.m); arr(K.names.f,D.names.f); }
    if(D.oform) for(const r of Object.keys(D.oform)) arr(K.oform[r],D.oform[r]);
    if(D.titles) for(const p of Object.keys(D.titles)) K.titles[p][lang]=D.titles[p];
    if(D.grades) D.grades.forEach((v,i)=>{ if(v!=null) put(K.grades[i],0,v); });
  }
}
