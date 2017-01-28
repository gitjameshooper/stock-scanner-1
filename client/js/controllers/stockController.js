(function() {
    'use strict';

    angular
        .module('stockScannerApp')
        .controller('stockController', stockController);
    stockController.$inject = ['$scope', '$log', 'symbolsService', 'oAuthService', 'xtraFactory', 'scanFactory', 'tierFactory'];
     
    function stockController($scope, $log, symbolsService, oAuthService, xtraFactory, scanFactory, tierFactory) {
        var vm = this;
        // config
        vm.cfg = {
                status: 'ready',
                run: true,
                apiMSecs: 1000,
                symbolsPerTier: 1030,
                etfArr: ["NUGT","JNUG","EDZ","DPK","SJNK","OIH","SQQQ","XOP","ERY","USLV","FAZ","UVXY","VIXY","PDBC","CATH","VXX","UWTI","DWTI","DGAZ","DUST","XIV","TZA","DBEF","DBJP","UGAZ","SPXS","XIV","XOP","GDX","SVXY","JDST"],
                loopCounter: 0,
                stockMinPrice: 2,
                stockMaxPrice: 100,
                stockGapPctA: 5,
                stockVwapPctB: 5, // price percentage away from vwap
                stockVwapHighPctB: 12, // high percentage away from vwap
                stockSpeedPctC: 1,
                stockMaxSpreadC: .75,
                stockMinFloatRotated: .80,
                accountVal: 24000,
                showTest: {
                    testA: true,
                    testB: true,
                    testC: true,
                    testD: true
                },
                stockVolumeObj: {
                    "hr8": 200000,
                    "hr840": 300000,
                    "hr850": 500000,
                    "hr9": 600000,
                    "hr10": 800000,
                    "hr11": 1000000,
                    "hr12": 1200000,
                    "hr13": 1400000,
                    "hr14": 1600000,
                    "hr15": 1600000
                }
            }
            // vars
        vm.tkUrl = '';
        vm.symbolsJSON = {};
        vm.oAuthJSON = {};
        vm.symbolTiers = [];
        vm.symbolStr = '';
        vm.stockPassedCount = 0;
        vm.stocksPassed = {
            stocksPassA: [],
            stocksPassB: [],
            stocksPassC: [],
            stocksPassD: [],
            stocksAlert: []
        }
        vm.stocksA = [];
        vm.stocksB = [];
        vm.stocksC = [];
        vm.stocksD = [];

        // functions
        vm.startScan = startScan;
        vm.stopScan = stopScan;
        vm.getSymbols = getSymbols;
        vm.getStocks = getStocks;
        vm.countStocks = countStocks;
        vm.strPassedStocks = strPassedStocks;
        vm.getOAuth = getOAuth;
        vm.checkData = checkData;
        vm.createTiers = tierFactory.createTiers;
        vm.formatTierSymbols = tierFactory.formatTierSymbols;
        vm.loopTiers = loopTiers;
        vm.viewStocks = viewStocks;
        vm.scanStocks = scanFactory.scanStocks;
        vm.delistStock = scanFactory.delistStock;
        vm.emptyDelist = scanFactory.emptyDelist;
        vm.init = init;

      
        function init() {

            xtraFactory.settingsAnim();
            xtraFactory.jQueryExtends();
        }

        function getSymbols() {
            return symbolsService.getSymbols()
                .then(function(data) {
                    vm.symbolsJSON = data;
                    vm.getOAuth();
                });
        }

        function getOAuth() {
            return oAuthService.getOAuth()
                .then(function(data) {
                    vm.oAuthJSON = data;
                    vm.checkData();
                });
        }

        function getStocks(url, method, oAuthData) {
            console.log(oAuthData);
           oAuthData.symbols = 'A,AA,AAC,AAN,AAP,AAT,AAV,AB,ABB,ABBV,ABC,ACAD,ABEV,ABG,ABM,ABR,ABRN,ABT,ABX,AC,ACC,ACCO,ACH,ACM,ACN,ACP,ACRE,ACV,ACW,ADC,ADM,ADPT,ADS,ADX,AEB,AED,AEE,AEG,AEH,AEK,AEL,AEM,AEO,AEP,AER,AES,AET,AEUA,AF,AFA,AFB,AFC,AFG,AFGE,AFGH,AFI,AFL,AFSD,AFSS,AFST,AFT,AFW,AG,AGC,AGCO,AGD,AGI,AGM,AGN,AGO,AGR,AGRO,AGU,AGX,AHC,AHH,AHL,AHP,AHS,AHT,AI,AIB,AIC,AIF,AIG,AIN,AIR,AIT,AIV,AIW,AIY,AIZ,AJG,AJRD,AJX,AKP,AKR,AKS,AL,ALB,ALDW,ALE,ALEX,ALG,ALJ,ALK,ALL,ALLE,ALLY,ALR,ALSN,ALV,ALX,AM,AMBR,AMC,AME,AMFW,AMG,AMH,AMID,AMP,AMRC,AMT,AMTG,AMX,AN,ANET,ANF,ANFI,ANH,ANTM,ANTX,ANW,AOD,AOI,AON,AOS,AP,APA,APAM,APB,APC,APD,APF,APH,APLE,APO,APTS,APU,AR,ARA,ARC,ARCO,ARCX,ARDC,ARE,ARES,ARI,ARL,ARMK,AROC,ARP,ARR,ARU,ARW,ASA,ASB,ASC,ASG,ASGN,ASH,ASPN,ASR,ASX,AT,ATEN,ATHM,ATI,ATKR,ATO,ATR,ATTO,ATU,ATV,ATW,AU,AUO,AUY,AV,AVA,AVAL,AVB,AVD,AVG,AVH,AVK,AVP,AVT,AVV,AVX,AVY,AWF,AWH,AWI,AWK,AWP,AWR,AXE,AXL,AXLL,AXON,AXP,AXR,AXS,AXTA,AYI,AYR,AZN,AZO,AZZ,B,BA,BABA,BAC,BAF,BAH,BAK,BAM,BANC,BAP,BAS,BAX,BBD,BBDO,BBF,BBG,BBK,BBL,BBN,BBT,BBU,BBVA,BBW,BBX,BBY,BC,BCC,BCE,BCEI,BCH,BCO,BCR,BCRH,BCS,BCX,BDC,BDJ,BDN,BDX,BEL,BEN,BEP,BERY,BETR,BFAM,BFK,BFO,BFR,BFS,BFZ,BG,BGB,BGC,BGCA,BGG,BGH,BGR,BGS,BGT,BGX,BGY,BH,BHE,BHI,BHK,BHL,BHLB,BHP,BID,BIF,BIG,BIO,BIOA,BIP,BIT,BITA,BJZ,BK,BKD,BKE,BKFS,BKH,BKHU,BKK,BKN,BKS,BKT,BKU,BLD,BLH,BLK,BLL,BLOX,BLW,BLX,BMA,BME,BMI,BMO,BMS,BMY,BNED,BNJ,BNK,BNS,BNY,BOE,BOH,BOI,BOOT,BORN,BOX,BOXC,BP,BPI,BPK,BPL,BPT,BPY,BQH,BR,BRC,BRFS,BRO,BRS,BRSS,BRT,BRX,BSAC,BSBR,BSD,BSE,BSL,BSM,BSMX,BST,BSX,BT,BTA,BTE,BTO,BTT,BTZ,BUD,BUI,BURL,BVN,BW,BWA,BWG,BWP,BWXT,BX,BXC,BXE,BXMT,BXMX,BXP,BXS,BYD,BYM,BZH,C,CAA,CAB,CABO,CACI,CAE,CAF,CAG,CAH,CAI,CAJ,CAL,CALX,CAPL,CAS,CAT,CATO,CB,CBA,CBB,CBD,CBG,CBI,CBK,CBL,CBM,CBO,CBPX,CBR,CBS,CBT,CBU,CBX,CBZ,CC,CCC,CCE,CCI,CCJ,CCK,CCL,CCM,CCO,CCP,CCS,CCU,CCV,CCZ,CDE,CDI,CDR,CE,CEA,CEB,CEE,CEL,CELP,CEM,CEN,CEO,CEQP,CF,CFG,CFI,CFR,CFX,CGA,CGG,CGI,CHA,CHCT,CHD,CHE,CHGG,CHH,CHK,CHKR,CHL,CHMI,CHMT,CHN,CHS,CHSP,CHT,CHU,CI,CIA,CIB,CIE,CIEN,CIF,CIG,CII,CIM,CINR,CIO,CIR,CIT,CIVI,CJES,CKH,CL,CLA,CLB,CLC,CLD,CLDT,CLF,CLGX,CLH,CLI,CLNY,CLR,CLS,CLW,CLX,CM,CMA,CMC,CMCM,CMG,CMI,CMN,CMO,CMP,CMRE,CMS,CMU,CNA,CNC,CNCO,CNHI,CNI,CNK,CNNX,CNO,CNP,CNQ,CNS,CNX,CNXC,CO,CODI,COE,COF,COG,COH,COL,COO,COP,COR,CORR,COT,COTV,COTY,CP,CPA,CPAC,CPB,CPE,CPF,CPG,CPGX,CPK,CPL,CPN,CPPL,CPS,CPT,CR,CRC,CRCM,CRH,CRI,CRK,CRL,CRM,CRR,CRS,CRT,CRY,CS,CSC,CSH,CSI,CSL,CSLT,CSRA,CSS,CST,CSTM,CSU,CSV,CTAA,CTB,CTL,CTLT,CTQ,CTR,CTS,CTT,CTU,CTV,CTW,CTX,CTY,CTZ,CUB,CUBE,CUBI,CUBS,CUDA,CUK,CUZ,CVA,CVB,CVC,CVE,CVEO,CVG,CVI,CVO,CVRR,CVS,CVT,CVX,CW,CWEI,CWT,CX,CXE,CXH,CXO,CXP,CXW,CYD,CYH,CYS,CZZ,D,DAC,DAL,DAN,DANG,DAR,DATA,DB,DBD,DBL,DCA,DCI,DCM,DCO,DCT,DCUB,DCUC,DD,DDC,DDD,DDE,DDF,DDR,DDS,DDT,DE,DEA,DECK,DEG,DEI,DEL,DEO,DEX,DF,DFP,DFS,DFT,DG,DGI,DGX,DHF,DHG,DHI,DHR,DHT,DHX,DIAX,DIN,DIS,DK,DKL,DKS,DKT,DL,DLB,DLNG,DLPH,DLR,DLX,DM,DMB,DMD,DMO,DNB,DNI,DNOW,DNP,DNR,DO,DOC,DOOR,DOV,DOW,DPG,DPLO,DPM,DPS,DPZ,DQ,DRA,DRD,DRE,DRH,DRI,DRII,DRQ,DSE,DSL,DSM,DST,DSU,DSW,DSX,DSXN,DTE,DTF,DTJ,DTK,DTQ,DTZ,DUC,DUK,DUKH,DV,DVA,DVD,DVN,DW,DWRE,DX,DXB,DY,DYN,DYNC,E,EAA,EAB,EAE,EARN,EAT,EBF,EBS,EC,ECA,ECC,ECCA,ECCZ,ECL,ECOM,ECR,ECT,ED,EDD,EDE,EDF,EDI,EDN,EDR,EDU,EE,EEA,EEP,EEQ,EFC,EFF,EFM,EFR,EFT,EFX,EGF,EGIF,EGL,EGN,EGO,EGP,EGY,EHI,EHIC,EHT,EIG,EIX,EJ,EL,ELA,ELB,ELJ,ELLI,ELP,ELS,ELU,ELY,EMC,EMD,EME,EMES,EMF,EMG,EMN,EMO,EMQ,EMR,EMZ,ENB,ENBL,ENH,ENIA,ENIC,ENJ,ENLC,ENLK,ENO,ENR,ENS,ENV,ENVA,ENZ,EOCA,EOCC,EOD,EOG,EOI,EOS,EOT,EPAM,EPC,EPD,EPE,EPR,EQC,EQCO,EQGP,EQM,EQR,EQS,EQT,EQY,ERA,ERF,ERJ,EROS,ES,ESD,ESE,ESI,ESL,ESNT,ESRT,ESS,ESV,ETB,ETE,ETG,ETH,ETJ,ETM,ETN,ETO,ETP,ETR,ETV,ETW,ETX,ETY,EURN,EV,EVA,EVC,EVDY,EVER,EVF,EVG,EVGN,EVH,EVHC,EVN,EVR,EVRI,EVT,EVTC,EW,EXAM,EXAR,EXC,EXCU,EXD,EXG,EXK,EXP,EXPR,EXR,EXTN,EZT,F,FAC,FAF,FAM,FAV,FBC,FBHS,FBP,FBR,FC,FCAM,FCAU,FCB,FCF,FCH,FCN,FCPT,FCT,FCX,FDC,FDEU,FDP,FDS,FDX,FE,FEI,FELP,FENG,FEO,FET,FF,FFA,FFC,FFG,FGB,FGL,FGP,FHN,FHY,FI,FICO,FIF,FIG,FII,FIS,FIT,FIX,FL,FLC,FLO,FLOW,FLR,FLS,FLT,FLTX,FLY,FMC,FMD,FMN,FMO,FMS,FMSA,FMX,FMY,FN,FNB,FNF,FNFV,FNV,FOE,FOF,FOR,FPF,FPI,FPL,FPO,FPT,FR,FRA,FRC,FRO,FRT,FSB,FSCE,FSD,FSIC,FSM,FSS,FT,FTAI,FTI,FTK,FTV,FUL,FUN,FUR,FVE,FXCM,G,GAB,GAM,GAS,GATX,GB,GBAB,GBL,GBX,GCAP,GCH,GCI,GCO,GCP,GCV,GD,GDDY,GDF,GDL,GDO,GDOT,GDV,GE,GEB,GEF,GEH,GEK,GEL,GEN,GEO,GEQ,GER,GES,GF,GFA,GFF,GFI,GFY'; 
            $.ajax({
                url: 'https://api.tradeking.com/v1/market/ext/quotes.json',
                type: "POST",
                data: oAuthData,
                beforeSend: function(xhr, settings) {
                    // hijack request url and remove duplicate symbols from oAuth
                    // var symbolStr = settings.url.indexOf('&symbols=');
                    // var oauthStr = settings.url.indexOf('&oauth_signature=');
                    // var rmString = settings.url.substring(symbolStr, oauthStr);
                    // settings.url = settings.url.replace(rmString, '');
                }

            }).error(function(err) {
                vm.cfg.status = "error";
                // $.playSound("/sounds/monkey");
                $log.error('Bad TK Request - ' + err.statusText);
                $scope.$apply();
                // start scan if error
                setTimeout(function() {
                    vm.startScan();
                }, 20000);

            }).done(function(data) {
                //run tk data thru tests
                console.log(data.response.quotes);
                vm.stocksPassed = vm.scanStocks(data.response.quotes.quote, vm.stocksPassed, vm.symbolsJSON, vm.cfg);
                vm.viewStocks();
            });
        }

        function viewStocks() {

            // pass final arrays to view
            vm.stocksA = vm.stocksPassed.stocksPassA;
            vm.stocksB = vm.stocksPassed.stocksPassB;
            vm.stocksC = vm.stocksPassed.stocksPassC;
            vm.stocksD = vm.stocksPassed.stocksPassD;
            
            $scope.$apply();

            //  keep looping thru tiers
            vm.loopTiers();
        }
        function countStocks(){
    
            vm.stockPassedCount = vm.stocksA.length + vm.stocksB.length + vm.stocksC.length + vm.stocksD.length;
        }
        // prepend passed stock symbols for next api call
        function strPassedStocks(){
            
            $.each(vm.stocksPassed,function(k,v){
                
                $.each(v,function(k,v){
                        
                        if(v.symbol){
                           vm.stocksPassedStr += v.symbol + ',';
                        }
                });
                
            });
             
        }
        function checkData() {
            if (vm.symbolsJSON && vm.oAuthJSON) {

                // create tiers and start the loop
                vm.symbolTiers = vm.createTiers(vm.symbolsJSON, vm.cfg.symbolsPerTier);
                vm.loopTiers();
            } else {
                vm.cfg.status = "error";
                $.playSound("/sounds/monkey");
            }
        }
        function loopTiers() {
            if (vm.cfg.run) {
                vm.countStocks();
                vm.strPassedStocks();
                vm.symbolTiers = vm.createTiers(vm.symbolsJSON, vm.cfg.symbolsPerTier - vm.stockPassedCount);
                vm.tkUrl = vm.formatTierSymbols(vm.symbolsJSON, vm.stocksPassedStr, vm.symbolTiers, vm.oAuthJSON, vm.stockPassedCount, vm.cfg);
                vm.stocksPassedStr = '';
                setTimeout(function() {
                    vm.getStocks(vm.tkUrl, vm.oAuthJSON.tkRequestData.method, vm.oAuthJSON.consumer.authorize(vm.oAuthJSON.tkRequestData, vm.oAuthJSON.token));
                }, vm.cfg.apiMSecs);
            }
        }

        function startScan() {
            vm.cfg.run = true;
            vm.cfg.status = "scanning";
            vm.getSymbols();

        }

        function stopScan() {
            vm.cfg.run = false;
            vm.cfg.status = "stopped";
        }

        vm.init();
    }
})();