"use strict";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

*/


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
    return createEle( "caption", textNode( Namen[ monat ] ) );
}

function createTableHead () {
    var reihe = createTr();

    ["Tag", " ", "Gr.1", "Gr.2", "Gr.3", "Gr.4", "Gr.5", "Gr.6"].forEach(function(zellText) {
        reihe.appendChild( createEle( "td", textNode( zellText ) ) );
    });

    return createEle( "thead", reihe );
}

function createTableBody ( year, monat ) {
    var theBody = createEle( "tbody" ),
        anz, // anzahl der tage in diesen Monat
        arbeitstage = [0,0,0,0,0,0];
    switch ( monat ) {
        case 0: case 2: case 4: case 6: case 7: case 9: case 11:
            anz = 31;
            break;
        case 3: case 5: case 8: case 10:
            anz = 30;
            break;
        case 1:
            // wenn es februar ist und ein schaltjahr ist dann 29 tage
            anz = ( isSchaltjahr( year ) ) ? 29 : 28;
            break;
    }

    for ( var i = 1; i <= anz; i++ ) { // startet bei 1 weil der erste tag im monat 1 ist
        var tag = createDay( year, monat, i );
        theBody.appendChild( tag.row );
        tag.schichten.forEach(function (is, gr) {
            if ( is ) { arbeitstage[gr]++; }
             // wenn an dem tag die gruppe gearbeit, dann wird deren Arbeitstage hochgezählt
        });
    }

    theBody.appendChild( createArbeitsTagAnzeige( arbeitstage ) );

    return theBody;
}

function isSchaltjahr ( year ) {
    return ( year % 4 ) === 0;
}

function createDay ( year, month, day ) {
    var line = createTr();
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
            setBorder( "", zelle.ele );
        }
        else if ( heute && i === 5 ) {
            setBorder( "right", zelle.ele );
        }
        line.appendChild( zelle.ele ); // die eigentliche Zelle wir übergeben
        schichten[i] = zelle.arbeit; // es wird übergeben ob eine Schicht gearbeitet har
    }
    return {row:line, schichten:schichten};
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
    return {ele:zell, arbeit:arbeitet};
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
    // zuerst auf die anzahl von tagen von 1970.1.1, dann durch 12 da ein zyklus 12 tage sind
    var inSchicht = ( zeit.getTime() / 1000 / 60 / 60 / 24 ) / 12;
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
    else if ( month === 2 || month === 3 ) { // Ostern
        // Monats abfrage aus sicherheit und Geschwindigkeit
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

var isOstern = (function () {
    var memory = {}; // Speichert den Tag von einen Jahr  (wird mit der Jahreszahl abgerufen)
    return (function isOstern ( Jahr, Monat, Tag ) {
        // Gibt true zurück wenn an dem Tag Ostern ist
        if ( Monat < 2 || Monat > 5) return false; // gibt false zurück wenn es ein Monat ist in
        // dem Ostern garnicht sein kann
        var OTag
        if ( !memory[ Jahr ] ) {
            var k = Math.floor( Jahr / 100 );
            // Müsste bis Jahr 2099 M = 24 sein
            var M = 15 + k - Math.floor( k / 3 ) - Math.floor( k / 4 );
            var N = 5;
            var a = Math.round( afterDot( Jahr / 19 ) * 19 );
            var b = Math.round( afterDot( Jahr / 4 ) * 4 );
            var c = Math.round( afterDot( Jahr / 7 ) * 7 );
            var d = Math.round( afterDot( ( 19 * a + M ) / 30 ) * 30);
            var e = Math.round( afterDot( ( 2 * b + 4 * c + 6 * d + N ) / 7 ) * 7 );
            OTag = 22 + d + e;

            memory[ Jahr ] = OTag;
        }
        else {
            OTag = memory[ Jahr ];
        }

        if ( Monat >= 3 ) { Tag += 31 * ( Monat - 2 ); }//Tag der zusätzlichen Monate werden addiert

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
    });
})();

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
