"use strict";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

*/


var Alarm2010 = false; //Variable die speichtert ob der Alarm, der wenn man das Jahr 2010 auswählt
// kommt, schonmal ausgegeben wurde (gegen Spam, für die Nerven)
var Alarm2100 = false;
var istGanzJahr = false; // true wenn das ganze jahr angezeigt werden soll

window.onload = function() { // Init  adding the EventListeners
    document.getElementById( "heuteButton" ).onclick = displayNow;
    document.getElementById( "monateMinus" ).onclick = function() {
        monatVeraendern( 0 );
    };
    document.getElementById( "monatePlus" ).onclick = function() {
        monatVeraendern( 1 );
    };
    document.getElementById( "MonatFeld" ).onclick = function() {
        display( false );
    };
    document.getElementById( "jahrMinus" ).onclick = function() {
        jahrVeraendern( 0 );
    };
    document.getElementById( "jahrPlus" ).onclick = function() {
        jahrVeraendern( 1 );
    };
    document.getElementById( "jahrStart" ).onclick = display;
    document.getElementById( "ganzesJahrInput" ).onclick = function() {
        display( true );
    };
    document.getElementById( "tagSuchenButton" ).onclick = tagSuchen;

    displayNow();
};

function displayNow() {
    setYear( new Date().getFullYear() );
    setMonth();
    
    display( false ); //Und startet den ersten Prozess
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
    
    return win = document.body.appendChild( win );//win wird erst beschrieben
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
