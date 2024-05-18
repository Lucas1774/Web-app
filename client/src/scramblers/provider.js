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
            let newScramble;
            switch (props.puzzle) {
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
                    newScramble = "not implemented";
                    break;
                case constants.SIX:
                    newScramble = "not implemented";
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
                case constants.MULTI:
                    let multiScrambles = [];
                    for (let i = 0; i < props.quantity; i++) {
                        multiScrambles.push(bldScrambler().trim());
                    }
                    newScramble = multiScrambles.map((scramble, index) => (
                        <p key={index}>{index + 1}{")"} {scramble}</p>
                    ));
                    break;
                default:
                    newScramble = "";
            }
            setScramble(newScramble);
            props.onScrambleChange(newScramble);
        }
    }, [props]);

    return (
        <h2 data-testid="scramble" className={props.puzzle} style={{ display: props.display }}>{scramble}</h2>
    );
};

export default Scramble;
