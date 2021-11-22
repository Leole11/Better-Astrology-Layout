// ==UserScript==
// @name         Better Astrology Layout
// @namespace    ididthisonawhimLeole
// @version      1.0
// @description  Make the layout less confusing by grouping together bonuses of similar rarity
// @author       Leole
// @match        https://melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function updateAstrology() {
        // if relevant element exists
        if (document.getElementById("astrology-bonus-element") != null ) {

            // create my new column elements
            var normalCol = document.createElement("div");
            normalCol.setAttribute("class", "col-6 p-2");
            var specialCol = document.createElement("div");
            specialCol.setAttribute("class", "col-6 p-2");

            // container is the div containing all the rows that will be moved
            var element = document.getElementById("astrology-bonus-element");
            var container = element.children[0].children[0];

            // flip flop
            var isItCommon = true;

            // clone each row to their respective column, then remove them
            for(let i=1; i != container.childElementCount ; ){
                isItCommon ? normalCol.appendChild(container.children[i].cloneNode(true)) : specialCol.appendChild(container.children[i].cloneNode(true));
                container.removeChild(container.children[i]);
                isItCommon = !isItCommon;
            }

            // append new columns
            container.appendChild(normalCol);
            container.appendChild(specialCol);
        }
    }

    var oldAstrology = createAstrologySelectedUI;
    var oldMastery = levelUpMasteryWithPool;

    // expand the definition of the function that updates the UI with new columns
    createAstrologySelectedUI = function(args) {
        oldAstrology.call(this, args);
        updateAstrology();
    }

    // spending mastery pool also updates the UI, so the columns need to be created, again
    levelUpMasteryWithPool = function(skill, mastery, confirmation) {
    oldMastery.call(this, skill, mastery, confirmation);
    if (skill == 22 && !confirmation) {
        updateAstrology();
    }
}
})();