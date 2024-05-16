import React, { useState, useEffect } from 'react';
import { Scramble as twoScrambler } from "../scramblers/twoScrambler";
import { Scramble as threeScrambler } from "../scramblers/threeScrambler";
import { Scramble as fourScrambler } from "../scramblers/fourScrambler";
import { Scramble as fiveScrambler } from "./fiveScrambler";
import { Scramble as bldScrambler } from "../scramblers/bldScrambler";
import { Scramble as pyraminxScrambler } from "../scramblers/pyraScrambler";
import { Scramble as megaScrambler } from "../scramblers/megaScrambler";
import { TWO, THREE, FOUR, FIVE, BLD, MULTI, PYRAMINX, MEGAMINX } from "../constants";

const Scramble = (props) => {
    const [scramble, setScramble] = useState("");

    useEffect(() => {
        if (props.new && props.display === "block") {
            switch (props.puzzle) {
                case TWO:
                    setScramble(twoScrambler());
                    break;
                case THREE:
                    setScramble(threeScrambler());
                    break;
                case FOUR:
                    setScramble(fourScrambler());
                    break;
                case FIVE:
                    setScramble(fiveScrambler());
                    break;
                case BLD:
                    setScramble(bldScrambler());
                    break;
                case MULTI:
                    let multiScrambles = [];
                    for (let i = 0; i < props.quantity; i++) {
                        multiScrambles.push(bldScrambler());
                    }
                    setScramble(multiScrambles.map((scramble, index) => <p key={index}>{index + 1}{")"} {scramble}</p>));
                    break;
                case PYRAMINX:
                    setScramble(pyraminxScrambler());
                    break;
                case MEGAMINX:
                    setScramble(megaScrambler());
                    break;
                default:
                    setScramble("");
            }
        }
    }, [props.new, props.display, props.puzzle, props.quantity]);

    return (
        <h2 className={props.puzzle} style={{ display: props.display }}>{scramble}</h2>
    );
};

export default Scramble;
