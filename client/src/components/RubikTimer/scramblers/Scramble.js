import React, { useState, useEffect } from "react";
import { Scramble as threeScrambler } from "./threeScrambler";
import { Scramble as twoScrambler } from "./twoScrambler";
import { Scramble as fourScrambler } from "./fourScrambler";
import { Scramble as fiveScrambler } from "./fiveScrambler";
import { Scramble as sevenScrambler } from "./sevenScrambler";
import { Scramble as sixScrambler } from "./sixScrambler";
import { Scramble as bldScrambler } from "./bldScrambler";
import { Scramble as fmcScrambler } from "./fmcScrambler";
import { Scramble as clockScrambler } from "./clockScrambler";
import { Scramble as megaScrambler } from "./megaScrambler";
import { Scramble as pyraminxScrambler } from "./pyraScrambler";
import { Scramble as skewbScrambler } from "./skewbScrambler";
import * as constants from "../../../constants";
import { PropTypes } from "prop-types";

const Scramble = ({ isNewScramble, onScrambleChange, puzzle, display, quantity }) => {
    const [scramble, setScramble] = useState("");

    useEffect(() => {
        if (isNewScramble && display === "block") {
            let newScramble;
            switch (puzzle) {
                case constants.THREE:
                    newScramble = threeScrambler().trim();
                    break;
                case constants.TWO:
                    newScramble = twoScrambler().trim();
                    break;
                case constants.FOUR:
                    newScramble = fourScrambler().trim();
                    break;
                case constants.FIVE:
                    newScramble = fiveScrambler().trim();
                    break;
                case constants.SEVEN:
                    newScramble = sevenScrambler().trim();
                    break;
                case constants.SIX:
                    newScramble = sixScrambler().trim();
                    break;
                case constants.BLD:
                    newScramble = bldScrambler().trim();
                    break;
                case constants.FMC:
                    newScramble = fmcScrambler().trim();
                    break;
                case constants.OH:
                    newScramble = threeScrambler().trim();
                    break;
                case constants.CLOCK:
                    newScramble = clockScrambler().trim();
                    break;
                case constants.MEGAMINX:
                    newScramble = megaScrambler().trim();
                    break;
                case constants.PYRAMINX:
                    newScramble = pyraminxScrambler().trim();
                    break;
                case constants.SKEWB:
                    newScramble = skewbScrambler().trim();
                    break;
                case constants.SQUARE:
                    newScramble = "not implemented";
                    break;
                case constants.FOUR_BLD:
                    newScramble = "not implemented";
                    break;
                case constants.FIVE_BLD:
                    newScramble = "not implemented";
                    break;
                case constants.MULTI: {
                    let multiScrambles = [];
                    for (let i = 0; i < quantity; i++) {
                        multiScrambles.push(bldScrambler().trim());
                    }
                    newScramble = multiScrambles.map((scramble, index) => (
                        <p key={index}>{index + 1}{")"} {scramble}</p>
                    ));
                    break;
                }
                default:
                    newScramble = "";
            }
            setScramble(newScramble);
            onScrambleChange(newScramble);
        }
    }, [display, isNewScramble, onScrambleChange, puzzle, quantity]);

    return (
        <h2 data-testid="scramble" className={puzzle} style={{ display: display }}>{scramble}</h2>
    );
};

Scramble.propTypes = {
    isNewScramble: PropTypes.bool,
    onScrambleChange: PropTypes.func,
    puzzle: PropTypes.string,
    display: PropTypes.string,
    quantity: PropTypes.number
};

export default Scramble;
