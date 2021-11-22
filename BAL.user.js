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
        if (document.getElementById("astrology-bonus-element") != null ) {
            var normalCol = document.createElement("div")
            normalCol.setAttribute("class", "col-6 p-2")
            var specialCol = document.createElement("div")
            specialCol.setAttribute("class", "col-6 p-2")

            var element = document.getElementById("astrology-bonus-element")
            var container = element.children[0].children[0]

            var isItCommon = true;

            for(let i=1; i != container.childElementCount ; ){
                isItCommon ? normalCol.appendChild(container.children[i].cloneNode(true)) : specialCol.appendChild(container.children[i].cloneNode(true))
                container.removeChild(container.children[i])
                isItCommon = !isItCommon
            }

            container.appendChild(normalCol)
            container.appendChild(specialCol)
        }
    }

    var old = createAstrologySelectedUI

    createAstrologySelectedUI = function(args) {
        old.call(this, args)
        updateAstrology()
    }
})();