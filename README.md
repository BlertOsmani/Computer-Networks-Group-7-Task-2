# Computer-Networks-Group-7-Task-2

Ky program i krijuar ne lenden "Rrjeta kompjuterike" perfshin nje komunikim klient - server duke perdorur protokolin UDP. Logjika e programit funksionon ne ate menyre qe serveri pranon kerkesat e derguara nga klienti dhe i menaxhon ato. Si fillim startohet serveri dhe me pas startohen klientat e tjere duke specifikuar IP Adresen e serverit. Klienti i pare qe konektohet zgjidhet si admin automatikisht nga serveri, ndersa klientet e tjere te konektuar jane thjeshte kliente te rregullte. Klienti i cili eshte admin ka privilegje shtese ndaj klienteve te tjere. Ai mund te shkruaj dhe lexoj ne fajlla, poashtu mund te fshije dhe te ngarkoje fajlla, perderisa klientet e tjere munden vetem te lexojne ne fajlla, pa bere modifikime te tjera. Poashtu ekziston edhe mundesia e diskonektimit nga ana e klienteve duke zgjedhur komanden e specifikuar "exit", pra lidhja e klienteve dhe performimi i operacioneve vazhdon perderisa vete klientet te diskonektohen nga lidhja. Per te realizuar programin kemi importuar disa module si: "dgram", "fs", "readline". Moduli "dgram" (Datagram) na lejon te krijojme socketa UDP per dergimin dhe marrjen e te dhenave. Moduli "fs" (File System) na lejon performimin e operacioneve ne fajlla, si: te shkruajme ne fajlla, ti lexojme ato, ti fshijme dhe te krijojme fajlla te ri. Moduli "readline" ofron nje nderfaqe per te lexuar te dhenat prej command line - it. 
Projekti u punua nga anetaret e grupit: 
Blert Osmani, 
Blerta Azemi, 
Blerta Krasniqi, 
Blina Retkoceri.
