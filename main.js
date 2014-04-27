/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

*/


var Alarm2010 = false; //Variable die speichtert ob der Alarm, der wenn man das Jahr 2010 auswählt
// kommt, schonmal ausgegeben wurde (gegen Spam, für die Nerven)
var Alarm2100 = false;
var istGanzJahr = false; // true wenn das ganze jahr angezeigt werden soll

function start() {
    displayNow();
    if ( location.pathname.search( /w660\/Elektroniker\/gr.2\/html_source\/Docs/ ) >= 0 ) {
        document.getElementById( "pdfAnz" ).style.display = "table-cell";
    }
}

function displayNow() {
    setYear( new Date().getFullYear() );
    setMonth();
    
    display(false); //Und startet den ersten Prozess
}

function tagSuchen() { // Setzt das Datum auf die Eingabe im Datumsuchfeld
    var eingabe = document.getElementById( "suchenEingabe" ).value.replace( /,/g, "." ),
        datum   = new Date( toIsoDate( eingabe ) ),
        year    = datum.getFullYear(),
        month   = datum.getMonth();
    
    console.log( eingabe + "\n" + datum );
    setYear( year );
    setMonth( month / 4 );
    display();
    document.getElementById( "row_" + year + "_" + month + "_" + datum.getDate() )
        .style.backgroundColor = "darkorange"; // Farbe setzen
}

function toIsoDate( eingabe ) {
    var time;
    if ( /\d{4}-\d{1,2}-\d{1,2}/.test( eingabe ) ) { // Wenn es ISO-Datum (YYYY-MM-DD) ist
        time = eingabe; // Sollte auch bei dem Date-input rauskommen
    }
    else if ( /\d{2}-\d{1,2}-\d{1,2}/.test( eingabe ) ) { // Wenn es ISO-Datum (YYYY-MM-DD) ist
        time = "20" + eingabe; // Sollte auch bei dem Date-input rauskommen
    }
    else if ( /\d{1,2}.\d{1,2}.\d{4}/.test( eingabe ) ) { // Wenn De-Datum (DD.MM.YYYY) ist
        time = eingabe.replace( /(\d{1,2})\.(\d{1,2})\.(\d{4})/, "$3-$2-$1" );
    }
    else if ( /\d{1,2}.\d{1,2}.\d\d/.test( eingabe ) ) { // Wenn De-Kurz-Datum (DD.MM.YY) ist
        time = eingabe.replace( /(\d{1,2})\.(\d{1,2})\.(\d\d)/, "20$3-$2-$1" );
    }
    else if ( /\d{1,2}\/\d{1,2}\/\d{4}/.test( eingabe ) ) { // Wenn US-Datum (MM/DD/YYYY) ist
        time = eingabe.replace( /(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$1-$2" );
    }
    else if ( /\d{1,2}\/\d{1,2}\/\d\d/.test( eingabe ) ) { // Wenn US-Kurz-Datum (MM/DD/YY) ist
        time = eingabe.replace( /(\d{1,2})\/(\d{1,2})\/(\d\d)/, "20$3-$2-$1" );
    }
    else {
        alert( "Bitte ein güldiges Datum eingeben!\n(Volle Tage & Monate)" );
        return;
    }
    return time.replace(/-(\d)$/, "-0$1").replace(/-(\d)(\D)/, "-0$1$2");// macht einzifrige
    // Tage & Monate zu zweizifrig (09)
}

function setYear( year ) { //diese Function setzt das eingabe Feld auf das Aktuelle Jahr
    var oldYear = document.getElementById( "jahrFeld" ).value,
        newYear;
    
    if ( !year ) {
        newYear = new Date().getFullYear();
    }
    else if ( year === "minus" ) {
        newYear = oldYear - 1;
    }
    else if ( year === "plus" ) {
        newYear = oldYear + 1;
    }
    else {// if ()
        newYear = Number( year );
    }
    document.getElementById( "jahrFeld" ).value = newYear;
}

function setMonth ( month ) {
    if ( typeof month === "undefined" ) {
        month = Math.floor( new Date().getMonth() / 4 );
    }
    else { month = Math.floor( Number( month ) ); }
    document.getElementById( "MonatFeld" ).options[month].selected = true;
}

function jahrVeraendern ( was, anzeigen ) {
//Diese Function wird bei den Pfeilen aufgerufen. Sie erhöht oder senkt das jahr um 1.
//+ Wird gleich geschrieben
    var element = document.getElementById( "jahrFeld" );
    switch ( was ) {
        case 0: element.value--; break;
        case 1: element.value++; break;
        default: element.value = Number(element.value); break;
    }
    if ( typeof anzeigen === "undefined" ) {
        display();
    }
}

function monatVeraendern ( was, anzeigen ) {
//Diese Function wird bei den Pfeilen aufgerufen. Sie erhöht oder senkt den monat um 1. Wird gleich geschrieben
    var element = document.getElementById( "MonatFeld" ),
        index   = element.selectedIndex;
    switch ( was ) {
        case 0: index--; break;
        case 1: index++; break;
        default: return;
    }
    if ( index < 0 ) {
        jahrVeraendern( 0, true );
        index = 2;
    }
    if ( index > 2 ) {
        jahrVeraendern( 1, true );
        index = 0;
    }
    element.options[index].selected = true;
    if ( typeof anzeigen === "undefined" ) {
        display( false );
    }
}

function display( was ) {
    if ( typeof was === "boolean" ) { istGanzJahr = was; } // wechseln zwischen ganz Jahr und nur ein teil
    
    var jahr = checkYear( Number( document.getElementById( "jahrFeld" ).value ) ),
    // Das Jahr wird ausgelesen und überprüft
        trital, // ein drittel eines Jahrs (0, 1 oder 2)
        // ... ich kenn den richtigen Namen von einem Drittel nicht
        anzeige = document.getElementById( "anzeige" ), // DOM-Knoten wo die Tabelle angezeigt werden soll
        element; // entweder die Tabelle selbst oder eine Tabelle in der alle Monate enthalten sind
    
    if ( istGanzJahr ) { element = createGanzJahrTabelle( jahr ); } //ein ganzes jahr wird angezeigt
    else { // nur ein drittel eines Jahres
        for ( var i = 0; i < document.getElementById( "MonatFeld" ).length; ++i ) {
        //auslesen welche Monate ausgewählt sind
            if ( document.getElementById( "MonatFeld" ).options[i].selected == true ) {
                trital = document.getElementById( "MonatFeld" ).options[i].value;
            }
        }
        element = create4MonthTabelle( jahr, trital );
    }
    anzeige.replaceChild( element, anzeige.firstChild );
    document.getElementById( "jahrAnzeigeDruck" ).firstChild.data = "Jahr: " + jahr;
    // Druck Jahr anzeige
}

function checkYear ( year ) {
    if ( year < 2010 ) {
        var newYear = new Date().getFullYear();
        document.getElementById( "jahrFeld" ).value = newYear;
        alert("Das Jahr " + year + " ist zu niedrig!\nEs wird das Jahr " + newYear + " verwendet.");
        return newYear;
    }
    else if ( year > 2099 && !Alarm2100 ) {
        alert("Achtung!!! Dieser Kalender geht nur bis zum Jahr 2099 garantiert richtig! Danach"
            + " könnte die Osterangabe nicht mehr stimmen!");
        Alarm2100 = true;
        return year;
    }
    else {
        if ( year === 2010 && !Alarm2010 ) {
            alert( "Achtung!\nDieser Kalender kann nur das 6-Tage-Modell anzeigen!\nAlle Tage"
                + " vor Ostern 2010 sind falsch!" );
            Alarm2010 = true;
        }
        return year;
    }
}

function createGanzJahrTabelle ( year ) {
// erstellt eine Tabelle in der alle 12 Monate dargestellt werden
    var tab = document.createElement( "table" );
    tab.className = "year";
    for ( var i = 0; i < 3; i++ ) {
        tab.appendChild( create4MonthRow( year, i ) );
    }
    return tab;
}

function create4MonthTabelle ( year, trital ) { //erzeugt eine Tabelle mit einer Reihe mit 4 Monaten
    var tab = document.createElement( "table" );
    tab.className = "year";
    tab.appendChild( create4MonthRow( year, trital ) );
    return tab;
}

function create4MonthRow ( year, trital ) { // erzeugt eine Reihe von einer Tabelle mit je 4
    //Monaten. Wird aufgerufen von createGanzJahrTabelle & create4MonthTabelle
    var row = document.createElement( "tr" );
    for ( var i = 0; i < 4; i++ ) {
        var bereich = createTdObj( createMonth( year, trital * 4 + i ) );
        bereich.className = "year";
        row.appendChild( bereich );
    }
    return row;
}

function createMonth ( year, monat ) {
    var tabelle = document.createElement( "table" );
    tabelle.style.margin = "10px";
    
    tabelle.appendChild( createMonthName( monat ) ); // Zelle die den Monats-Namen beinhaltet
    
    tabelle.appendChild( createTableHead() );
    
    tabelle.appendChild( createTableBody( year, monat ) );
    
    return tabelle;
}

function createMonthName ( monat ) {
    var Namen = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September",
        "Oktober","November", "Dezember"];
    var MonName = document.createElement( "caption" );
    MonName.appendChild( textNode( Namen[ monat ] ) );
    return MonName;
}

function createTableHead () {
    var head = document.createElement( "thead" );
    
    var reihe2 = document.createElement( "tr" );
    
    var zeilenArt = ["Tag", " ", "Gr.1", "Gr.2", "Gr.3", "Gr.4", "Gr.5", "Gr.6"];
    for ( var i = 0; i < 8; i++ ) 	{
        var zelle = document.createElement( "td" );
        zelle.appendChild( textNode( zeilenArt[i] ) );
        reihe2.appendChild( zelle );
    }
    
    head.appendChild( reihe2 );
    
    return head;
}

function createTr( kind ) {
    var reihe = document.createElement( "tr" );
    if ( kind ) reihe.appendChild( kind );
    return reihe;
}

function createTableBody ( year, monat ) {
    var theBody = document.createElement( "tbody" );
    var anz, // anzahl der tage in diesen Monat
        arbeitstage = [0,0,0,0,0,0];
    switch ( monat ) {
        case 0: case 2: case 4: case 6: case 7: case 9: case 11:
            anz = 31;
            break;
        case 3: case 5: case 8: case 10:
            anz = 30;
            break;
        case 1:
            anz = ( isSchaltjahr( year ) ) ? 29 : 28; // wenn es februar ist und ein schaltjahr ist dann 29 tage
            break;
    }
    
    for ( var i = 1; i <= anz; i++ ) { // startet bei 1 weil der erste tag im monat 1 ist
        var tag = createDay( year, monat, i );
        theBody.appendChild( tag[0] );
        for ( var gr = 0; gr < 6; gr++ ) {
            if ( tag[1][gr] ) arbeitstage[gr]++; // wenn an dem tag die gruppe gearbeit, dann wird
            // deren Arbeitstage hochgezählt
        }
    }
    
    theBody.appendChild( createArbeitsTagAnzeige( arbeitstage ) );
    
    return theBody;
}

function isSchaltjahr ( year ) {
    return ( year % 4 ) === 0;
}

function createDay ( year, month, day ) {
    var line = document.createElement( "tr" );
    line.id = "row_" + year + "_" + month + "_" + day;
    if ( isWoE( year, month, day ) ) {
        line.className = "WoE";
    }
    var schichten = []; // in diesen Array wird gespeicher welche der Schichten arbeit (true/false)
    
    var zeit = new Date( year, month, day, 0, 0, 0 );
    var heute = isToday( year, month, day );
    
    // Monatstag
    // hier wird die erste Spalte erstellt in der steht welcher tag im monat dieser ist
    var monthDay = createTd( zeit.getDate() );
    feierTag( monthDay, year, month, day, true );
    if ( heute ) {
        setBorder( "left", monthDay );
    }

    line.appendChild( monthDay );
    
    // Wochentag
    // zeile in der die Abkürzung des Wochentagen (z.B.: Mo,Di) steht
    var Wochentag = ["So","Mo","Di","Mi","Do","Fr","Sa"];
    var weeksDay = createTd( Wochentag[ zeit.getDay() ] );
    feierTag( weeksDay, year, month, day, true );
    if ( heute ) {
        setBorder( "", weeksDay );
    }
    line.appendChild( weeksDay );
    
    for ( var i = 0; i < 6; i++ ) { // die Schichtanzeige der 6 schichtgruppen wird erstellt
        var zelle = createBodyZell( year, month, day, i );
        if ( heute && i < 5 ) {
            setBorder( "", zelle[0] );
        }
        else if ( heute && i === 5 ) {
            setBorder( "right", zelle[0] );
        }
        line.appendChild( zelle[0] ); // die eigentliche Zelle wir übergeben
        schichten[i] = zelle[1]; // es wird übergeben ob eine Schicht gearbeitet har
    }
    return [line, schichten];
}

function setBorder ( wo, obj ) {//macht den Ramen dicker für das Feld das den Heutigen tag darstellt
// wo = welcher der positionen es inne hat
    var dicke = "4px";
    obj.style.borderBottomWidth = dicke;
    obj.style.borderTopWidth = dicke;
    if      ( wo === "left" ) obj.style.borderLeftWidth = dicke;
    else if ( wo === "right" ) obj.style.borderRightWidth = dicke;
}

function isToday ( year, month, day ) {
    var heute = new Date();
    heute.setTime( heute.getTime() - 21600000 ); // -6h weil neue Schicht erst um 6:00Uhr anfängt
    heute.setHours( 0 );
    heute.setMinutes( 0 );
    heute.setSeconds( 0 );
    heute.setMilliseconds( 0 );
    return ( new Date( year, month, day, 0, 0, 0, 0 ).getTime() === heute.getTime() );
}

function createBodyZell ( year, month, day, gr ) {
    var zell;// = document.createElement("td");
    var arbeitet; // true wenn gearbeitet wird
    var schicht = getSchicht( year, month, day, gr ); // berechnung der schicht "F" = Früh
    // "S" = Spät "N" = Nacht "K" = frei
    if ( schicht === "K" ) {
        zell = createTd();
        feierTag ( zell, year, month, day );
        arbeitet = false;
    }
    else if ( schicht ) {
        zell = createTd( schicht );
        color( zell, gr ); // färbt es in Gruppen farbe
        //zell.appendChild( textNode( schicht ) );
        arbeitet = true;
    }
    //zell.style
    return [zell,arbeitet];
}

function feierTag ( obj, year, month, day, isNameCell ) {
    // es wird überprüft of es ein Feiertag (Ostern & Weihnachten) oder ein Wochenende ist
    var urlaub = getUrlaub( year, month, day, isNameCell ) || { is: false };
    if ( urlaub.is ) {
        color( obj, "urlaub" );
        obj.style.cursor = "help";
        obj.title = urlaub.was;
        if ( typeof obj.addEventListener !== "undefined" ) {
            obj.addEventListener("click", function () {
                createAlert(urlaub.was, 5000);
            }, false);
        }
    }
    /*else if ( isWoE( year, month, day ) ) {//--------------------------------------------------
        color( obj, "WoE" );
    }*/
}

function getSchicht ( year, month, day, gr ) {
    var schicht; // "F" = früh, "S" = spät, "N" = nacht, "K" = keine/frei
    var zeit = new Date( year, month, day, 0, 0, 0 );
    var inSchicht = ( zeit.getTime() / 1000 / 60 / 60 / 24 ) / 12; // zuerst auf die anzahl von tagen von 1970.1.1
                                                                 // dann durch 12 da ein zyklus 12 tage sind
    var grOffset;
    switch ( gr ) {
        case 0: grOffset = 5; break;  // gruppe 1
        case 1: grOffset = 11; break; // gruppe 2
        case 2: grOffset = 3; break;  // gruppe 3
        case 3: grOffset = 9; break;  // gruppe 4
        case 4: grOffset = 1; break;  // gruppe 5
        case 5: grOffset = 7; break;  // gruppe 6
    }
    
    var schichtTag = Math.floor( ( Math.round( afterDot( inSchicht ) * 12) + grOffset ) / 2);
    // es wird die dezimalzahl rausgefiltert. die anzeigt wie weit im block man ist
    // wird nur mal 6 genommen, da es nur 6 kombinationen gibt
    if (schichtTag >= 6) {
        schichtTag -= 6;
    }
    
    switch ( schichtTag ) {
        case 0: schicht = "F"; break; // Früh
        case 1: schicht = "S"; break; // Spät
        case 2: schicht = "N"; break; // Nacht
        case 3: case 4: case 5: schicht = "K"; break; // keine/Frei
    }
    return schicht;
}

//alert( getUrlaub(2013,4,1,true) );

function getUrlaub ( year, month, day, isNameCell ) {
    // wenn Weihnachten oder es Ostern ist return true sonst false
    if ( isNameCell && year === 2013 && month === 8 && day === 22 ) {
        return { is: true, was: "Bundestags-Wahlen" };
    }
    if ( isNameCell && month ===  0 && day ===  1 ) {
        return { is: true, was: "Neujahr" };
    }
    if ( isNameCell && month ===  0 && day ===  6 ) {
        return { is: true, was: "Heilig 3 Könige" };
    }
    if ( isNameCell && month ===  4 && day ===  1 ) {
        return { is: true, was: "Tag der Arbeit" };
    }
    if ( isNameCell && month ===  9 && day ===  3 ) {
        return { is: true, was: "Tag der deutschen Einheit" };
    }
    if ( isNameCell && month === 10 && day ===  1 ) {
        return { is: true, was: "Allerheiligen" };
    }
    if ( isNameCell && month === 11 && day === 31 ) {
        return { is: true, was: "Silvester" };
    }
    else if ( month === 2 || month === 3 ) { // Ostern    Monats abfrage aus sicherheit und Geschwindigkeit
        return isOstern( year, month, day );
    }
    else if ( isNameCell && ( month === 4 || month === 5 ) ) {
        return isOstern( year, month, day );
    }
    else if ( month === 11 && ( day === 24 || day === 25 || day === 26 ) ) { // Weihnachts tage
        //return true;
        return { is: true, was: "Weihnachten" };
    }
    else return { is: false };
}

function isOstern ( Jahr, Monat, Tag ) {
    // Gibt true zurück wenn an dem Tag Ostern ist
    if ( Monat < 2 || Monat > 5) return false; // gibt false zurück wenn es ein Monat ist in
    // dem Ostern garnicht sein kann
    var k = Math.floor( Jahr / 100 );
    var M = 15 + k - Math.floor( k / 3 ) - Math.floor( k / 4 );  // Müsste bis Jahr 2099 M = 24 sein
    var N = 5;
    var a = Math.round( afterDot( Jahr / 19 ) * 19 );
    var b = Math.round( afterDot( Jahr / 4 ) * 4 );
    var c = Math.round( afterDot( Jahr / 7 ) * 7 );
    var d = Math.round( afterDot( ( 19 * a + M ) / 30 ) * 30);
    var e = Math.round( afterDot( ( 2 * b + 4 * c + 6 * d + N ) / 7 ) * 7 );
    var OTag = 22 + d + e;
    
    if ( Monat >= 3 ) { Tag += 31 * ( Monat - 2 ); } // Tag der zusätzlichen Monate werden addiert
    
    if ( ( OTag - 2 ) <= Tag && ( OTag + 1 ) >= Tag ) {
        return { is: true, was: "Ostern" };
    }
    else if ( ( OTag + 50 ) <= Tag && ( OTag + 51 ) >= Tag ) {
        return { is: true, was: "Pfingsten" };
    }
    else if ( ( OTag + 61 ) === Tag ) {
        return { is: true, was: "Fronleichnam" };
    }
    else if ( ( OTag + 40 ) === Tag ) {
        return { is: true, was: "Himmelfahrt" };
    }
    else {
        return { is: false, was: "" };
    }
}

function afterDot ( number ) { // gibt den Wert nach dem Punkt/Komma einer Zahl zurück  1,25 -> 0,25
    return number - Math.floor( number ); // 1.1 - 1.0 = 0.1
}

function isWoE ( year, month, day ) { // gibt true zurück wenn der tag am Wochenende (Sa & So) ist
    var tag = new Date( year, month, day, 0, 0, 0 ).getDay();
    return tag === 0 || tag === 6;
}

function color ( obj, what ) { // färbt die Zellen in die Gruppen-, Wochenend- und Feiertags-Farben
    var newColor;
    switch ( String( what ) ) {
        case "urlaub": newColor = "#008000"; break;
        //case "WoE":    newColor = "#D3D3D3"; break;
        case "0":      newColor = "#FF69B4"; break;
        case "1":      newColor = "#FFFF00"; break;
        case "2":      newColor = "#FF0000"; break;
        case "3":      newColor = "#00FF00"; break;
        case "4":      newColor = "#1E90FF"; break;
        case "5":      newColor = "#CD853F"; break;
        default:       newColor = "#FFFFFF"; break;
    }
    obj.style.backgroundColor = newColor;
}

function createArbeitsTagAnzeige ( arbeitstage ) {
// erstellt die Arbeitstage-Anzeige erwartet ein Array aus Zahlen [Gr1,Gr2,Gr3,Gr4,Gr5,Gr6]
    var anzeige = document.createElement( "tr" );
    
    var name = createTd( "Anzahl" ); // alt: "Ar.Tag"
    name.colSpan = 2;
    name.title = "Die Anzahl der Tage, an denen eine Schichtgruppe gearbeitet hat.";
    name.style.cursor = "help";
    anzeige.appendChild( name );
    
    for ( var i = 0; i < 6; i++ ) {
        var zelle = createTd( arbeitstage[i]  );
        anzeige.appendChild( zelle );
    }
    return anzeige;
}

function createTd ( str ) { // erstellt eine TD mit String-Inhalt
    var zell = document.createElement( "td" );
    if ( str ) {
        zell.appendChild( textNode( String( str ) ) );
    }
    return zell;
}

function createTdObj ( kind ) { // erstellt eine TD mit einem Object als Inhalt
    var zell = document.createElement( "td" );
    if ( kind ) {
        zell.appendChild( kind );
    }
    return zell;
}

function textNode( str ) {
    return document.createTextNode( str );
}




function createAlert ( text, countdown ) { //erstellt ein Fenter in dem Nachrichten angezeigt werden
// und wieder geschlossen werden kann
    var win = createDiv( createEle( "p", textNode( text || "Hello World" ) ) ),//Rahmen mit Nachricht
        closer, timer,
        
        func = ( function() { // diese Function wird dem Schließen-Knopf angehängt.
            // die Function kann auf die var's von createAlert zugreifen
            win.parentNode.removeChild( win ); // also hier auf das Element win;
            clearTimeout( timer );
        } );
    
    win.id = "alertwin" + Math.random(); // erstellen einer eindeutigen ID;
    win.className = "alert";
    
    closer = createA( "#", textNode( "X" ) ); // Schließen-Knopf wird erstellt
    closer.className = "closer";
    closer.onclick = func; // Event wird angehängt   wegen IE wird dieser benutzt
    win.appendChild( closer );
    
    timer = setTimeout( func, countdown || 30000 ); //timer damit nicht ewig viele Meldungen da sind
    
    return win = document.getElementById( "theBody" ).appendChild( win );//win wird erst beschrieben
    // return win;
}



function createDiv( child ) { return createEle( "div", child ); }

function createA( href, child ) { // erstellt ein A mit href, und wenn ein Element übergeben wurde,
                // wird dieses gleich angehängt
    var ele = createEle( "a", child );
    ele.href = href || "#";
    return ele;
}

function createEle( type, child ) { // erstellt ein Element, und hängt gleich ein Element an
    var ele = document.createElement( type || "div" ); // Element wird erstellt
    if ( typeof child !== "undefined" ) { // element wird angehängt
        ele.appendChild( child );
    }
    return ele;
}