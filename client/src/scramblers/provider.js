import { Scramble as twoScrambler } from "../scramblers/twoScrambler";
import { Scramble as threeScrambler } from "../scramblers/threeScrambler";
import { Scramble as fourScrambler } from "../scramblers/fourScrambler";
import { Scramble as fiveScrambler } from "./fiveScrambler";
import { Scramble as bldScrambler } from "../scramblers/bldScrambler";
import { Scramble as pyraminxScrambler } from "../scramblers/pyraScrambler";
import { Scramble as megaScrambler } from "../scramblers/megaScrambler";
import { TWO, THREE, FOUR, FIVE, BLD, PYRAMINX, MEGAMINX } from "../constants";

const Scramble = (puzzle) => {
    switch (puzzle) {
        case TWO:
            return twoScrambler();
        case THREE:
            return threeScrambler();
        case FOUR:
            return fourScrambler();
        case FIVE:
            return fiveScrambler();
        case BLD:
            return bldScrambler();
        case PYRAMINX:
            return pyraminxScrambler();
        case MEGAMINX:
            return megaScrambler();
        default:
            return "";
    }
};

export default Scramble;
