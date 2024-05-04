import {Scramble as threeScrambler} from "../scramblers/threeScrambler";
import {Scramble as twoScrambler} from "../scramblers/twoScrambler";
import {TWO, THREE} from "../constants";

const Scramble = (puzzle) => {
    switch (puzzle) {
        case TWO:
            return twoScrambler();
        case THREE:
            return threeScrambler();
        default:
            return "";
    }
};

export default Scramble;
