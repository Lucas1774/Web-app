import React, { useState, useEffect } from 'react';
import { Scramble as threeScrambler } from "../scramblers/threeScrambler";
import { Scramble as twoScrambler } from "../scramblers/twoScrambler";
import { Scramble as fourScrambler } from "../scramblers/fourScrambler";
import { Scramble as fiveScrambler } from "./fiveScrambler";
import { Scramble as bldScrambler } from "../scramblers/bldScrambler";
import { Scramble as fmcScrambler } from "../scramblers/fmcScrambler";
import { Scramble as clockScrambler } from "../scramblers/clockScrambler";
import { Scramble as megaScrambler } from "../scramblers/megaScrambler";
import { Scramble as pyraminxScrambler } from "../scramblers/pyraScrambler";
import { Scramble as skewbScrambler } from "../scramblers/skewbScrambler";
import * as constants from "../constants";

const Scramble = (props) => {
    const [scramble, setScramble] = useState("");

    useEffect(() => {
        if (props.new && props.display === "block") {
            switch (props.puzzle) {
                case constants.THREE:
                    setScramble(threeScrambler().trim());
                    break;
                case constants.TWO:
                    setScramble(twoScrambler().trim());
                    break;
                case constants.FOUR:
                    setScramble(fourScrambler().trim());
                    break;
                case constants.FIVE:
                    setScramble(fiveScrambler().trim());
                    break;
                case constants.SEVEN:
                    setScramble("not implemented");
                    break;
                case constants.SIX:
                    setScramble("not implemented");
                    break;
                case constants.BLD:
                    setScramble(bldScrambler().trim());
                    break;
                case constants.FMC:
                    setScramble(fmcScrambler().trim());
                    break;
                case constants.OH:
                    setScramble(threeScrambler().trim());
                    break;
                case constants.CLOCK:
                    setScramble(clockScrambler().trim());
                    break;
                case constants.MEGAMINX:
                    setScramble(megaScrambler().trim());
                    break;
                case constants.PYRAMINX:
                    setScramble(pyraminxScrambler().trim());
                    break;
                case constants.SKEWB:
                    setScramble(skewbScrambler().trim());
                    break;
                case constants.SQUARE:
                    setScramble("not implemented");
                    break;
                case constants.FOUR_BLD:
                    setScramble("not implemented");
                    break;
                case constants.FIVE_BLD:
                    setScramble("not implemented");
                    break;
                case constants.MULTI:
                    let multiScrambles = [];
                    for (let i = 0; i < props.quantity; i++) {
                        multiScrambles.push(bldScrambler());
                    }
                    setScramble(multiScrambles.map((scramble, index) => <p key={index}>{index + 1}{")"} {scramble.trim()}</p>));
                    break;
                default:
                    setScramble("");
            }
        }
    }, [props.new, props.display, props.puzzle, props.quantity]);

    return (
        <h2 data-testid="scramble" className={props.puzzle} style={{ display: props.display }}>{scramble}</h2>
    );
};

export default Scramble;
