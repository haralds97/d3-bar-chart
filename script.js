

// declared 'width', 'height', and 'GDP barwidth'
var yMargin = 40;
var width = 800;
var height = 400;
var barWidth = width/18;


var tooltip = d3.select(".visHolder").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3.select('.visHolder').append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

// declaring the 'svg', and setting its 'width' and 'height' - based on previously defined.
var svgContainer =  d3.select('.visHolder')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

// accessing data from API
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(err, data) {
  
  // text at the left - created here
  svgContainer.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -220)
    .attr('y', 25)
    .text('Pulksteņa laiki');
  
  // text at the bottom - created here
  svgContainer.append('text')
    .attr('x', width/2 + 220)
    .attr('y', height + 50)
    .text('More Information: no Mood-Tracker app')
    .attr('class', 'info');
  
  let myValuesForTicks = datesOfRecords2 => (item, index => index * 30);

  var xScale = d3.scaleOrdinal()
    // .domain([d3.min(yearsDate), xMax])
    // .domain([d3.min(sampleTicksForXaxis), d3.max(sampleTicksForXaxis)])    
    .domain(datesOfRecords2)    
    // .range([0, 22, 44, 66, 88, 120, 142, 164, 186, 208, 230, 252, width]);
    .range(myValuesForTicks);

 // var xScale = d3.scale().domain(d3.min(sampleTicksForXaxis), d3.max(sampleTicksForXaxis)) 
 //    .rangePoints([0,width]);

    // creating 'x Axis' with 'axisBottom()' method of d3
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickValues(datesOfRecords2);
    // to create a custom number of 'ticks' - the default is '10'
    // xAxis.ticks(20);
    // xAxis.tickValues([datesOfRecords2]);




    // creating horizontal line with 'g'
  var xAxisGroup = svgContainer.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    // moving it 60px right on x axis, and 400px down on y axis
    .attr('transform', 'translate(60, 400)');

  let timeMin = d3.min(goodTimesToNumbers);
  let timeMax = d3.max(goodTimesToNumbers);

  // create a 'linearScale' where domain is mapped onto 'range'.
  var linearScale = d3.scaleLinear()
    .domain([timeMin, timeMax])
    .range([0, height]);
  
  // scaled GDP values are returned for displaying
  let scaleDayTimes = goodTimesToNumbers.map(item => linearScale(item));
    
  // getting values for 'y' axis
  var yAxisScale = d3.scaleLinear()
    .domain([timeMin, timeMax])
    .range([height, 0]);
  
  // declaring 'yAxis' with previousy defined values
  var yAxis = d3.axisLeft(yAxisScale)
    
  // appending group to 'svgContainer' with 'yAxis'
  var yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 0)');
    



  // creating many 'rect' and filling them all with data, and displaying
  d3.select('svg').selectAll('rect')
    .data(scaleDayTimes)
    .enter()
    // creating and appending as many as necessary 'rect' in this step
    .append('rect')
    
    // attr 'dates' to rects
    .attr('data-date', function(d, i) {
      return goodTimes[i];
    })
    // attr gdp to rects
    .attr('data-gdp', function(d, i) {
      // return data.data[i][1];
      return sampleTicksForXaxis[i];
    })
    
    // attr css 'class' of 'bar' to all 'rect'
    .attr('class', 'bar')
    // assigning value to every 'x', by looping over 'yearsDate'
    .attr('x', function(d, i) {
      // return xScale(yearsDate[i]);
      return xScale(sampleTicksForXaxis[i]);
      // return xScale(datesOfRecords[i]);      
    })
     // assigning value to every 'y', by subtracting 'd' from 'height' - inverting 'y', so that it starts from bottom axis upwards
    .attr('y', function(d, i) {
      return height - d - 40;
    })

    // assigning value to every 'bar', assigning 'd' to 'height'
    .attr('width', barWidth)
    .attr('height', 40)
    // filling rect with green color
    .style('fill', '#279b1a')
    .attr('transform', 'translate(60, 0)')
       

    // second assignment
    


     // styling on 'mouseover' event
    .on('mouseover', function(d, i) {
      
      overlay.transition()
        .duration(0)
        .style('height', 40 + 'px')
        .style('width', barWidth + 'px')
        .style('opacity', .7)
        .style('left', (i * barWidth) + 'px')
        .style('top', height - d - 40  + 'px')
        .style('transform', 'translateX(60px)');

      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      

      tooltip.html(sampleTicksForXaxis[i] + '<br>' + arrayOfFirstGoodEmotion[i] + '<br>' + secondGoodEmotion[2] + '<br>' + thirdGoodEmotion[3])
        .attr('data-date', sampleTicksForXaxis[i])
        .style('left', (i * barWidth) + 50 + 'px')
        .style('top', height - (d + 10) + 'px')
        .style('transform', 'translateX(60px)');
    })
    // styling on 'mouseout' event
    .on('mouseout', function(d) {
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
      
      overlay.transition()
        .duration(200)
        .style('opacity', 0);
    });

});


let arrayOfFirstGoodEmotion = ["draivs", "enerģija, gandarījums, kontakts", "enerģija, dominance, spēk", "", "", "mierīgs, ieinteresēts", "atslābums, nomierināšanās, atpūta", "gandarījums", "atslābums", "pacilātība", "varēšana", "miers", "miers", "pacilātība", "gaidas uz pusdienām", "enerģisks", "mundrums", "miers", "enerģija", "saulainums"];

let goodTimes = ["18:00", "13:00", "14:00", "16:00", "18:00", "14:00", "17:00", "17:00", "12:00", "16:00", "13:00", "15:00", "15:00", "19:00", "9:00", "12:00", "14:00", "15:00"];

let goodTimesToNumbers = goodTimes.map(item => +item.slice(0, -3));

let sampleTicksForXaxis = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17, 18, 19];

// duplicate data .... long file

let duplicateData = [ 
  { id: 135,
    gulet: '',
    aizmig: '1:00',
    pamod: '10:30',
    kva: 'fair',
    piez1m: '',
    brok: '11:00',
    pusd: '14:30',
    laun: '17:00',
    vaks: '0:00',
    piez2e: '',
    past: '40',
    skries: 'ritenis',
    vingr: '',
    piez3f: '',
    enrg: '0',
    passaj: '0',
    d5e1: 'trauksme',
    d5e2: 'pacilātība',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: 'bija dažāda diena. pārsvarā jutos nomākts, sāpēja galva, varbūt augsts asinsspiediens.\n\npēc tam biju uz Prozas lasījumiem, kur diez ko nekontaktējos, jo nepatika, lai gan paši lasījumi bija veiksmīgi',
    cik1vs: '15:00',
    se1: 'trauksme',
    se2: 'nomāktība',
    se3: 'nav kur likties',
    not1s: 'diena mājās. jāgatavojas Prozas lasījumiem. stress, trauksmes. varbūt arī fiziska pārstrādāšanās.',
    cik2vl: '18:00',
    le1: 'draivs',
    le2: 'pacilātība',
    le3: 'satraukums',
    not2l: 'uzstājos Laligabas prozas lasījumos, kā pirmais ar anekdotēm par Raimondu Paulu. gāja diezgan labi. publika bija atsaucīga.',
    par31dat: '2019-04-18',
    timestamp: '2019-04-19 11:38:14.527',
    email: null },
  { id: 2,
    gulet: '2:20',
    aizmig: '2:30',
    pamod: '8:50',
    kva: 'fair',
    piez1m: '',
    brok: '10:50',
    pusd: '12:15',
    laun: '15:00',
    vaks: '20:30',
    piez2e: '',
    past: '0:40',
    skries: '0',
    vingr: '',
    piez3f: '',
    enrg: '3',
    passaj: '3',
    d5e1: 'enerģija',
    d5e2: '',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: 'bija lekcija JAS, uzmundrinoši',
    cik1vs: '8:50 ',
    se1: 'bezjēdzīgums',
    se2: '',
    se3: '',
    not1s: 'bija 8:40 jāmostas, un jābrauc ar 2 transportiem, un ārā auksta ziema',
    cik2vl: '13:40',
    le1: 'enerģija, gandarījums, kontakts',
    le2: '',
    le3: '',
    not2l: 'lasīju JAS lekciju un interaktēju',
    par31dat: '',
    timestamp: '2019-01-29 00:31:35.232',
    email: null },
  { id: 6,
    gulet: '2:30',
    aizmig: '2:40',
    pamod: '10:30',
    kva: 'fair',
    piez1m: 'šis ir par 29.janvāri',
    brok: '11:00',
    pusd: '15:00',
    laun: '',
    vaks: '20:00',
    piez2e: 'vakarā Pētera dzimšanas dienas ballīte bumbu baseinā',
    past: '30',
    skries: '0',
    vingr: '',
    piez3f: 'pastaiga no Melnsila ielas līdz Nometņu 58',
    enrg: '3',
    passaj: '3',
    d5e1: 'enerģija, miers, kontakts',
    d5e2: '',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: 'otrdiena, darbā, klātienes darbs ar Annu, daži zvani.\nproduktīvi, izsūtīju divus lielus e-pastus.',
    cik1vs: '22:00',
    se1: 'skumjas, nomāktību, necieņa',
    se2: '',
    se3: '',
    not1s: 'Ildze izturējās valdonīgi Pētera ballītē - izrīkoja sīkumos, ko darīt.',
    cik2vl: '14:00',
    le1: 'enerģija, dominance, spēk',
    le2: '',
    le3: '',
    not2l: 'strādājām ar Annu pie dažādiem papīriem.\n\nbiju izgājis ārā, satiku Annu Začu mafinos.',
    par31dat: '',
    timestamp: '2019-01-30 15:57:13.282',
    email: null },
  { id: 30,
    gulet: '00:30',
    aizmig: '00:40',
    pamod: '9:40',
    kva: 'fair',
    piez1m: '',
    brok: '10:20',
    pusd: '14:00',
    laun: '',
    vaks: '',
    piez2e: '',
    past: '',
    skries: '30',
    vingr: '',
    piez3f: 'paskrēju pa dienu, jo stress ',
    enrg: '-1',
    passaj: '-2',
    d5e1: 'stress, dusmas, apātija, miegainums, trauksme',
    d5e2: '',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: '',
    cik1vs: '11:30',
    se1: 'dusmas, stress, veģetatīvā distonija',
    se2: '',
    se3: '',
    not1s: 'zvanīju Dainai par kontu pārvedumiem un nesakritību. ',
    cik2vl: '',
    le1: '',
    le2: '',
    le3: '',
    not2l: '',
    par31dat: '',
    timestamp: '2019-02-01 15:58:17.93',
    email: null },
  { id: 31,
    gulet: '1:20',
    aizmig: '1:30',
    pamod: '9:40',
    kva: 'fair',
    piez1m: '',
    brok: '10:30',
    pusd: '14:00',
    laun: '15:30',
    vaks: '',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '-1',
    passaj: '-1',
    d5e1: 'skumjas, miegainība, stress',
    d5e2: '',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: '',
    cik1vs: '',
    se1: '',
    se2: '',
    se3: '',
    not1s: '',
    cik2vl: '',
    le1: '',
    le2: '',
    le3: '',
    not2l: '',
    par31dat: '',
    timestamp: '2019-02-02 15:30:31.375',
    email: null },
  { id: 38,
    gulet: '1:30',
    aizmig: '2:00',
    pamod: '12:30',
    kva: 'fair',
    piez1m: '13:30 pamodos',
    brok: '12:30',
    pusd: '17:00',
    laun: '',
    vaks: '19:30',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '0',
    passaj: '-1',
    d5e1: 'drūms, apātisks, miegains',
    d5e2: '',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: 'biju noguris pēc vakardienas. trešo dienu ar Pēci slimu pa māju.',
    cik1vs: '18:00',
    se1: 'izmisums, notrulums, depresija',
    se2: '',
    se3: '',
    not1s: 'atgriezos no bibliotēkas, ēdu vakariņas, bija bēdīgs prāts, apkārt cilvēki, kas trokšņo un prasa uzmanību',
    cik2vl: '16:00',
    le1: 'mierīgs, ieinteresēts',
    le2: '',
    le3: '',
    not2l: 'lasīju LNB grāmatu, ko atradu plauktā - Daniel Canemahn par lēno un ātro domāšanu',
    par31dat: '',
    timestamp: '2019-02-03 20:57:57.073',
    email: null },
  { id: 39,
    gulet: '1:30',
    aizmig: '2:00',
    pamod: '10:30',
    kva: 'poor',
    piez1m: 'pa  nakti Pēcim bij t0, modāmies 4:30 un bijām augšā stundu',
    brok: '11:00',
    pusd: '15:30',
    laun: '16:30',
    vaks: '19:00',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '-1',
    d5e1: 'skumjas',
    d5e2: 'nogurums',
    d5e3: 'apātija',
    d5e4: 'miegainums',
    d5e5: '',
    piez4d: '',
    cik1vs: '17:00',
    se1: 'bezcerība, nospiestība, nomāktība',
    se2: '',
    se3: '',
    not1s: 'biju atgriezies mājās, jezga, cilvēki, trokšņi, nevarēju palikt savā nodabā un atpūsties',
    cik2vl: '18:00',
    le1: 'atslābums, nomierināšanās, atpūta',
    le2: '',
    le3: '',
    not2l: 'pasēdēju vannā, palasīju Social Dynamics',
    par31dat: '',
    timestamp: '2019-02-04 18:23:51.318',
    email: null },
  { id: 46,
    gulet: '1:00',
    aizmig: '1:00',
    pamod: '10:00',
    kva: 'fair',
    piez1m: '',
    brok: '11:00',
    pusd: '14:00',
    laun: '',
    vaks: '19:00',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '40',
    piez3f: 'nevingroju, bet divreiz pa 30 minūtēm raku sniegu',
    enrg: '2',
    passaj: '1',
    d5e1: 'miers',
    d5e2: 'misijas apziņa',
    d5e3: 'mundrums',
    d5e4: 'apātiskums',
    d5e5: '',
    piez4d: 'pavadīju mājās ar Pēci. no rīta noskatījos filmu, vēlāk arī uzgleznoju 1 gleznu',
    cik1vs: '10:00',
    se1: 'rīta apātija',
    se2: 'negribas celties',
    se3: 'kaut kā jāsāk diena',
    not1s: 'biju pamodies, negribēju vēl līst no gultas ārā, pēc tam kāpt lejā, ko ēst',
    cik2vl: '14:00',
    le1: 'gandarījums',
    le2: 'prieks',
    le3: 'izdošanās sajūta',
    not2l: 'gleznoju un pabeidzu gleznu par Puertorico does it better.\n\nārā spīdēja saule, Pēteris sēdēja man blakus',
    par31dat: '',
    timestamp: '2019-02-07 00:07:20.701',
    email: null },
  { id: 47,
    gulet: '1:00',
    aizmig: '1:00',
    pamod: '11:00',
    kva: '',
    piez1m: 'pa dienu nogulēju no 13:30 līdz 17:40',
    brok: '11:00',
    pusd: 'izlaidu',
    laun: '',
    vaks: '18:30',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'miegainums',
    d5e2: 'skumjas',
    d5e3: 'miers',
    d5e4: '',
    d5e5: '',
    piez4d: 'daudz nogulēju, negribēju iet ārā no mājas, pagulēju 3 stundas pa dienu',
    cik1vs: '13:00',
    se1: 'apātija',
    se2: 'skumjas',
    se3: '',
    not1s: 'negribēju iet ārā, aizgāju gulēt',
    cik2vl: '17:00',
    le1: 'atslābums',
    le2: 'miers',
    le3: '',
    not2l: 'pamodos pēc dienas gulēšanas',
    par31dat: '',
    timestamp: '2019-02-07 19:32:04.627',
    email: null },
  { id: 83,
    gulet: '3:00',
    aizmig: '3:00',
    pamod: '9:00',
    kva: 'fair',
    piez1m: 'iepriekšējā dienā gulējām ar Pēci 3h pa dienu',
    brok: '11:30',
    pusd: '14:30',
    laun: '',
    vaks: '',
    piez2e: '',
    past: '40',
    skries: '',
    vingr: '',
    piez3f: '40 minūtes krāvu sniegu pagalmā.. - pārāk noguru, pēc tam sāpēja mugura uz krustiem',
    enrg: '2',
    passaj: '1',
    d5e1: 'enerģija',
    d5e2: 'miers',
    d5e3: 'darba spars',
    d5e4: 'padarīta darba sajūta',
    d5e5: 'nomierināšanās',
    piez4d: 'pēc 7 dienu Pēča pieskatīšanas, bija viena diena pašam ar sevi, pastrādāju darba lietas.',
    cik1vs: '15:00',
    se1: 'trauksme',
    se2: 'vainas sajūta',
    se3: 'nepietiekami izdarījis',
    not1s: 'bija pēc pusdienām un pēc sniega vākšanas. biju domājis uz 17:00 braukt uz kafē atkal pastrādāt, bet tad sapratu, ka nepaspēšu, un vajadzēs to atlikt.\nuznāca par to trauksme, un t.s. katastrofas domas, ka neesmu pietiekami labs.',
    cik2vl: '17:00',
    le1: 'pacilātība',
    le2: 'azarts',
    le3: 'sajūta ka mīlēts',
    not2l: 'uzrakstīju dzejoli un iepublicēju FB – par vāveri, kurai trūkst vārdu.',
    par31dat: '',
    timestamp: '2019-02-08 18:47:43.794',
    email: null },    
  { id: 85,
    gulet: '1:30',
    aizmig: '1:30',
    pamod: '9:30',
    kva: 'fair',
    piez1m: '',
    brok: '10:30',
    pusd: '15:00',
    laun: '17:30',
    vaks: '20:00',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '2',
    passaj: '2',
    d5e1: 'mundrums',
    d5e2: 'pacilātība',
    d5e3: 'padarīta darba sajūta',
    d5e4: '',
    d5e5: '',
    piez4d: 'bijām ar Ingu B. pirmajā vizītē uz KM. \n\nPēc tam biju uz kbt.\n\npastrādāju kafenē ar epastiem.',
    cik1vs: '18:00',
    se1: 'panīkums',
    se2: 'bezizejas sajūt',
    se3: 'ieslodzītība',
    not1s: 'brauciens no Pētera bērndārza',
    cik2vl: '12:00',
    le1: 'varēšana',
    le2: 'sarunas kontrole',
    le3: '',
    not2l: 'tikāmies KM ar Ingu B. un bija konstruktīva saruna par Rīcības plānu.',
    par31dat: '2019-02-17',
    timestamp: '2019-02-18 21:07:15.14',
    email: null },
  { id: 89,
    gulet: '23:30',
    aizmig: '0:00',
    pamod: '8:00',
    kva: 'fair',
    piez1m: 'gājām gulēt kopā ar Pēci pēc vannas',
    brok: '9:30',
    pusd: '15:00',
    laun: '',
    vaks: '19:30',
    piez2e: '',
    past: '90',
    skries: '',
    vingr: '',
    piez3f: 'gāju no bnd uz Dominu. no Čakas ielas uz darbu, uz Blaumaņa ielu, uz Vecrīgu, uz autobusu, no veikala',
    enrg: '1',
    passaj: '1',
    d5e1: 'pacilātība',
    d5e2: 'enerģija',
    d5e3: 'kautrība ar Ingu',
    d5e4: '',
    d5e5: '',
    piez4d: 'biju cilvēkos, strādāju pie datora kafejnīcās',
    cik1vs: '20:00',
    se1: 'miegainība',
    se2: 'nogurums',
    se3: 'gribas trūkums',
    not1s: 'uznāca miegs. nezinu, kur likties. jādomā, kā pavadīt 4h vēl līdz miegam',
    cik2vl: '16:00',
    le1: 'miers',
    le2: 'prieks',
    le3: 'pacilātība',
    not2l: 'nācu pēc fotosesijas ar Ingu, pa Barona ielu. bija koša pavasara saule. sirds bija līksma',
    par31dat: '2019-04-03',
    timestamp: '2019-04-04 20:53:55.563',
    email: null },
  { id: 90,
    gulet: '1:30',
    aizmig: '1:30',
    pamod: '',
    kva: '',
    piez1m: '',
    brok: '11:30',
    pusd: '14:00',
    laun: '17:00',
    vaks: '22:00',
    piez2e: '',
    past: '',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '2',
    passaj: '2',
    d5e1: 'miers',
    d5e2: 'saulains',
    d5e3: 'pienākums',
    d5e4: 'iesprostotība',
    d5e5: '',
    piez4d: 'bija saulaina diena. daudz izdarīju. divi sociālie pasākumi - Ievas Ast atklāšana un dzēriens Sandrai Ratniecei',
    cik1vs: '21:00',
    se1: 'iesprostotība',
    se2: 'nevērtība',
    se3: 'kauns',
    not1s: 'biju pārāk ilgi uzkavējies Konteksta pasākumā, un bija sajūta, ka pavadu laiku nesaturīgi, esmu pārāk draudzīgs, lai arī apkārtējie man nedod pietiekami pretim',
    cik2vl: '13:00',
    le1: 'miers',
    le2: 'pacilātība',
    le3: 'varēšana',
    not2l: 'spīdēja saule. paturpināju D3 soļus - labi sanāca.\nPēc tam ārā saeļļoju riteni.',
    par31dat: '2019-04-05',
    timestamp: '2019-04-06 00:16:27.413',
    email: null },
  { id: 91,
    gulet: '',
    aizmig: '3:30',
    pamod: '11:30',
    kva: 'fair',
    piez1m: '',
    brok: 'izlaidu',
    pusd: '14:00',
    laun: '17:30',
    vaks: '22:00',
    piez2e: '',
    past: '60',
    skries: 'cits',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'saulains',
    d5e2: 'varenība',
    d5e3: 'idejas',
    d5e4: '',
    d5e5: '',
    piez4d: 'strādāju fiziski. uzrakstīju 8 punktu plānu – ko, kādā secībā gribu sasniegt. : ) balva -> mašīna -> IT darbs -> KKF stipendija -> istaba/dzīvoklis',
    cik1vs: '21:00',
    se1: 'nogurums',
    se2: 'neziņa',
    se3: 'trauksme',
    not1s: 'nogurums. neziņa ko darīt. jāgaida Pēcis.',
    cik2vl: '15:00',
    le1: 'pacilātība',
    le2: 'varenība',
    le3: 'prieks',
    not2l: 'saulaina diena. zināju, ka man daudz laika. pastrādāju pie FCC D3 uz priekšu.',
    par31dat: '2019-04-06',
    timestamp: '2019-04-06 23:07:26.65',
    email: null },
  { id: 97,
    gulet: '',
    aizmig: '1:30',
    pamod: '10:30',
    kva: 'fair',
    piez1m: '',
    brok: '11:30',
    pusd: '14:00',
    laun: '',
    vaks: '20:30',
    piez2e: '',
    past: '20',
    skries: 'ritenis',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'darbīgums',
    d5e2: 'nogurums',
    d5e3: 'bezizeja',
    d5e4: '',
    d5e5: '',
    piez4d: 'otrdienas darbadiena RSP. paliku pārāk ilgi, līdz 19:30. pēc tam nevarēju atgūties, bija drūms ceļš mājup, vientulīgi, cilvēki iet garām, man nav kur iet.',
    cik1vs: '20:00',
    se1: 'skumjas',
    se2: 'izmisums',
    se3: 'bezcerība',
    not1s: 'braukšana mājās trolejbusu. tumst. cilvēki, meitenes iet citā virzienā. es esmu vientuļš un nosalis.',
    cik2vl: '15:00',
    le1: 'gaidas uz pusdienām',
    le2: 'miers',
    le3: 'siltums',
    not2l: 'pusdienlaiks. nebija super, bet bija darbīgi, un tāpēc ok.',
    par31dat: '2019-04-09',
    timestamp: '2019-04-10 15:47:01.069',
    email: null },
  { id: 98,
    gulet: '',
    aizmig: '1:00',
    pamod: '10:30',
    kva: 'fair',
    piez1m: '',
    brok: '11:00',
    pusd: '14:00',
    laun: '',
    vaks: '20:30',
    piez2e: '',
    past: '10',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'grūts sākums',
    d5e2: 'darbošanās',
    d5e3: 'enerģija',
    d5e4: '',
    d5e5: '',
    piez4d: 'mainīgas sajūtas',
    cik1vs: '11:00',
    se1: 'trauksme',
    se2: 'skumjas',
    se3: 'nepadarīti darbi',
    not1s: 'pēc vēlām brokastīm plānoju iet strādāt uz Bieriņkrogu. Taču trūka grūdiena. Apgūlos gultā. sāku justies nomākts. negribējās darīt RSP lietas... stundu nogulšņāju apātiski, domām griežoties pa riņķi.',
    cik2vl: '19:00',
    le1: 'enerģisks',
    le2: 'ir idejas',
    le3: '',
    not2l: 'atgriezos no Pēča bērndārza ar mašīnu. ir vēl gaišs. neesmu noguris. Pēcis satiek Nameju. Es uzkāpju augšā un jūtos labi.',
    par31dat: '2019-04-10',
    timestamp: '2019-04-10 19:34:53.536',
    email: null },
  { id: 99,
    gulet: '',
    aizmig: '2:00',
    pamod: '8:00',
    kva: 'fair',
    piez1m: '',
    brok: '9:00',
    pusd: '15:00',
    laun: '',
    vaks: '20:00',
    piez2e: '',
    past: '20',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'enerģija',
    d5e2: 'komunikācija',
    d5e3: 'gandarījums',
    d5e4: '',
    d5e5: '',
    piez4d: 'bija gandarījums par vakardienas sarunu ar Anitu. miers un sajūta, ka ar mani viss būs labi.\nvakar ar viņu runājot, uz pusotru stundu aizmirsu laiku un biju kontaktā.',
    cik1vs: '16:00',
    se1: 'neziņa',
    se2: 'neizlēmība',
    se3: 'trauksme',
    not1s: 'biju paēdis. iedzēris balzāmu 50 gr. noguris. nosalis. sasildījies. neziņā, vai doties uz rīgu. bet ja palikt liepājā, tad daudz naudas jāiztērē',
    cik2vl: '9:00',
    le1: 'mundrums',
    le2: 'koncentrēšanās',
    le3: 'miegainums',
    not2l: 'izbaudīju brokastis viesnīcā Līva. pēc sarunas ar Anitu vakar. bija agrs rīts, es pamodies un možs',
    par31dat: '2019-04-12',
    timestamp: '2019-04-13 01:27:19.609',
    email: null },
  { id: 101,
    gulet: '',
    aizmig: '1:30',
    pamod: '10:30',
    kva: 'fair',
    piez1m: '',
    brok: '10:30',
    pusd: '14:00',
    laun: '17:30',
    vaks: '20:30',
    piez2e: '',
    past: '20',
    skries: 'cits',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'miers',
    d5e2: 'īgnums',
    d5e3: 'lēnums',
    d5e4: '',
    d5e5: '',
    piez4d: 'rīts un pusdiena mājās, jauna glezna gandarī. pakaplēju dārzu. mazliet sāp mugura/plecs. ',
    cik1vs: '20:00',
    se1: 'iesprostotība',
    se2: 'rezignācija',
    se3: 'skumjas',
    not1s: 'sarunas ciemos pie Kristapa. es nevaru it kā dominēt, jo visi ir draugi un paziņas. reizē man nav līdz galam interesanti, es nevadu sarunas par tēmām, kas mani tiešām interesē. jūtos atrauts no sevis un realitātes',
    cik2vl: '12:00',
    le1: 'miers',
    le2: 'gandarījums',
    le3: 'pārliecība',
    not2l: 'diena vēl nesen sākusies. apziņa, ka ir 4 stundas tikai man pašam. un ka nav nekas obligāti jāizdara un jāsasniedz, ka viss ir kārtībā šobrīd.',
    par31dat: '2019-04-13',
    timestamp: '2019-04-13 23:38:27.253',
    email: null },
  { id: 107,
    gulet: '',
    aizmig: '1:00',
    pamod: '8:00',
    kva: 'fair',
    piez1m: '',
    brok: '10:00',
    pusd: '14:00',
    laun: '',
    vaks: '19:30',
    piez2e: '',
    past: '20',
    skries: '',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'enerģija',
    d5e2: 'mērķtiecība',
    d5e3: 'tikšana galā',
    d5e4: '',
    d5e5: '',
    piez4d: 'bija saulaina diena. pavasarīga enerģija.\npēc darba sakoncentrējos un paspēlēju klavieres 30 minūtes Baznīcas ielā.',
    cik1vs: '8:00',
    se1: 'vajāšana',
    se2: 'padošanās',
    se3: 'skumjas',
    not1s: 'kad jāceļas, jābrauc uz dārziņu un daudz lietu... bet vispār šodien bija tīri okei. visas dienas laikā nebija tādu kritumu.',
    cik2vl: '14:00',
    le1: 'enerģija',
    le2: 'prieks',
    le3: 'delverība',
    not2l: 'pusdienas ar Ingu, runātīgs, cilvēki un atvērtas sievietes apkārt.',
    par31dat: '',
    timestamp: '2019-04-16 22:46:03.547',
    email: null },
  { id: 130,
    gulet: '',
    aizmig: '1:00',
    pamod: '9:00',
    kva: 'fair',
    piez1m: '',
    brok: '10:30',
    pusd: '14:00',
    laun: '',
    vaks: '22:00',
    piez2e: '',
    past: '40',
    skries: 'skriešana',
    vingr: '',
    piez3f: '',
    enrg: '1',
    passaj: '1',
    d5e1: 'saulainums',
    d5e2: 'miers',
    d5e3: '',
    d5e4: '',
    d5e5: '',
    piez4d: 'diena mājās. paprogrammēju, paturpināju d3. vakarā biju paskriet. pa dienu braucu ar ričuku.',
    cik1vs: '22:00',
    se1: 'satraukums',
    se2: '',
    se3: '',
    not1s: 'īsti neatceros. visa diena bija ok. ar brīžiem satraukumu, ko remdēju ar meditāciju  - ir lieliski tas, kas notiek šobrīd.',
    cik2vl: '15:00',
    le1: 'saulainums',
    le2: 'iespaidi',
    le3: 'idejas',
    not2l: 'aizbraucu ar riteni uz Āgenskalnu pēc sūtījuma, un tad uz Depo pēc zāliena sēklām',
    par31dat: '2019-04-17',
    timestamp: '2019-04-18 16:16:25.82',
    email: null } 
];

let emotionsAtTime = (duplicateData) => duplicateData.map(item => ({ 

        cik2vl: item.cik2vl,
        le1: item.le1,
        le2: item.le2,
        le3: item.le3,

        cik1vs: item.cik1vs,
        se1: item.se1,
        se2: item.se2,
        se3: item.se3,    

        d5e1: item.d5e1,
        d5e2: item.d5e2,
        d5e3: item.d5e3,

        par31dat: item.par31dat,
        timestamp: item.timestamp.slice(0,10)
    }));

let timesOfGoodEmotions = duplicateData => duplicateData.map(item => item.cik2vl);

let firstGoodEmotion = duplicateData => duplicateData.map(item => item.le1);

let secondGoodEmotion = duplicateData => duplicateData.map(item => item.le2);

let thirdGoodEmotion = duplicateData => duplicateData.map(item => item.le3);

let datesOfRecords = duplicateData => duplicateData.map(item => item.timestamp.slice(0, 10));


let datesOfRecords2 = ["2019-04-19", "2019-01-29", "2019-01-30", "2019-02-01", "2019-02-02", "2019-02-03", "2019-02-04", "2019-02-07", "2019-02-07", "2019-02-08", "2019-02-18", "2019-04-04", "2019-04-06", "2019-04-06", "2019-04-10", "2019-04-10", "2019-04-13", "2019-04-13", "2019-04-16", "2019-04-18"];

let datesOutOfStrings = datesOfRecords2 => datesOfRecords2.map(item => new Date(item));

let objectOfDates = {...datesOfRecords2};