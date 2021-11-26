// ==UserScript==
// @name         Better Astrology Layout
// @namespace    ididthisonawhimLeole
// @version      1.2
// @description  Make the Melvor's Astrology layout less confusing by grouping together bonuses of similar rarity and highlighting rare rolls
// @author       Leole
// @match        https://melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const VERSION = "Public BETA v1.0"

    // automatically deactivate the mod if there's an update to the game
    // if the prototype of the function that handles astrology rerolls is a mismatch to the version of which I'm expanding the definition,
    // it might corrupt your save, this is a precaution.

    if (gameVersion === VERSION){
        function highlightRares(col) {
            col.children.forEach((mod) => {
                var modSpan = mod.getElementsByTagName("span")[0]
                if (typeof modSpan !== 'undefined'){
                    var modText = modSpan.textContent
                    var modContainer = mod.children[0].children[0].children[0]
                    if(modText.includes("4")){
                        modContainer.setAttribute("style", "border: 2px #85C1E9 solid !important;")
                    } else if (modText.includes("5")){
                        modContainer.setAttribute("style", "border: 2px #FFD580 solid !important;")
                    } else {
                        modContainer.removeAttribute("style");
                    }
                }
            })
        }

        createAstrologyBonusesElement = function(id) {
            let html = "";
            let standardStarImg = "star_standard.svg";
            let specialStarImg = "star_unique.svg";

            html += `<div class="block block-content block-content-full block-rounded-extra block-link-pop border-top border-astrology border-4x text-center">
            <div class="row gutters-tiny">
            <div class="col-12 p-1">
            <button class="btn btn-sm btn-primary m-1" id="astrology-reroll-all" onClick="rerollAstrologyModifiers(${id}, 'standard');">${templateString(getLangString("ASTROLOGY", "BTN_3"), {
                itemImage: `<img class="skill-icon-xs mr-1" src="${getItemMedia(CONSTANTS.item.Stardust)}">`,
                qty: `1`
            })}</button>
            <button class="btn btn-sm btn-secondary m-1" id="astrology-reroll-all-unique" onClick="rerollAstrologyModifiers(${id}, 'unique');">${templateString(getLangString("ASTROLOGY", "BTN_4"), {
                itemImage: `<img class="skill-icon-xs mr-1" src="${getItemMedia(CONSTANTS.item.Golden_Stardust)}">`,
                qty: `1`
            })}</button>
            </div>
            <div class="col-6 p-2" id="normal-bonuses-column">
            <div class="col-12 p-2">
            <div class="media d-flex align-items-center push m-0">
            <div class="m-auto font-w600">
            <img class="skill-icon-sm mr-2" src="assets/media/skills/astrology/${standardStarImg}">
            </div>
            </div>
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 0)}
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 2)}
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 4)}
            </div>
            </div>
            <div class="col-6 p-2" id="special-bonuses-column">
            <div class="col-12 p-2">
            <div class="media d-flex align-items-center push m-0">
            <div class="m-auto font-w600">
            <img class="skill-icon-sm mr-2" src="assets/media/skills/astrology/${specialStarImg}">
            </div>
            </div>
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 1)}
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 3)}
            </div>
            <div class="col-12 p-2">
            ${createAstrologyModifierElement(id, 5)}
            </div>
            </div>
            </div>
            </div>`;
            return html;
        }

        createAstrologyModifierElement = function(id, num) {
            let modText = getDefaultAstrologyModifierText(id, num)
            let border = "border-top border-1x border-info";
            let style = ""

            if(modText.includes("4")){
                style = "border: 2px #85C1E9 solid !important;"
            } else if (modText.includes("5")){
                style = "border: 2px #FFD580 solid !important;"
            }

            let dustImg = items[CONSTANTS.item.Stardust].media;
            let btnClass = "btn-primary";
            let btnCost = getSingleStardustCost();
            if (num % 2 !== 0) {
                border = "border-top border-1x border-warning";
                dustImg = items[CONSTANTS.item.Golden_Stardust].media;
                btnClass = "btn-secondary";
                btnCost = getSingleGoldenStardustCost();
            }
            return `<div class="media d-flex align-items-center push m-0">
            <div class="media-body">
            <div class="block block-rounded-double bg-combat-inner-dark p-1 mb-0 ${border} text-left" style="${style}">
            <h5 class="font-w700 font-size-sm m-1" id="astrology-modifier-${id}-${num}">${modText}</h5>
            </div>
            </div>
            <div class="m-1">
            <button class="btn btn-sm ${btnClass}" role="button" onClick="rerollSpecificAstrologyModifier(${id}, ${num}, true);"><img class="skill-icon-xs mr-1" src="${dustImg}">${btnCost}</button>
            </div>
            </div>`;
        }

        // arguments 'confirmed' and 'bypass' seem to be debug values
        // 'applySingleCost' controls whether or not you get dust discounted when you reroll. 
        // This is exlusively set to false when you unlock a slot by achieving a certain mastery level, so it doesn't cost you anything.

        var oldSpecificReroll = rerollSpecificAstrologyModifier;
        var oldReroll = rerollAstrologyModifiers;

        // expand rerolling to highlight rares
        rerollSpecificAstrologyModifier = function(id, i, applySingleCost=false, confirmed=true, bypass=false) {
            oldSpecificReroll.call(this, id, i, applySingleCost, confirmed, bypass);
            var normalCol = document.getElementById("normal-bonuses-column");
            highlightRares(normalCol);
            var specialCol = document.getElementById("special-bonuses-column");
            highlightRares(specialCol);
        }

        rerollAstrologyModifiers = function(id, type="standard", confirmed=true, bypass=false) {
            oldReroll.call(this, id, type, confirmed, bypass);
            var normalCol = document.getElementById("normal-bonuses-column");
            highlightRares(normalCol);
            var specialCol = document.getElementById("special-bonuses-column");
            highlightRares(specialCol);
        }
    }
})();