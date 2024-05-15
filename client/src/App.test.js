
import { render } from '@testing-library/react';
import Scramble from "./scramblers/provider";
import { EMPTY_TIMER, TWO, THREE, FOUR, FIVE, BLD, PYRAMINX } from "./constants";
import { SCRAMBLE_LENGTH as TWO_SCRAMBLE_LENGTH } from "./scramblers/twoScrambler";
import { SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH } from "./scramblers/threeScrambler";
import { SCRAMBLE_LENGTH as FOUR_SCRAMBLE_LENGTH } from "./scramblers/fourScrambler";
import { SCRAMBLE_LENGTH as FIVE_SCRAMBLE_LENGTH } from './scramblers/fiveScrambler';
import { SCRAMBLE_LENGTH as BLD_SCRAMBLE_LENGTH } from "./scramblers/bldScrambler";
import { SCRAMBLE_LENGTH as PYRAMINX_SCRAMBLE_LENGTH } from "./scramblers/pyraScrambler";

const NUMBER_OF_RUNS = 1000;
const LIKELINESS_RELATIVE_ERROR = 0.05
const isTimerRunning = false;
const isTimerPrepared = false;
const isHorizontal = false;
const averageDisplay = isTimerRunning || isTimerPrepared ? "none" : "grid";

test("2x2", () => {
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(TWO);
		const axisMoves = scramble.replace(/[2'\s]/g, "");
		expect(axisMoves.length).toBe(TWO_SCRAMBLE_LENGTH);
		expect(axisMoves).not.toContain("UU");
		expect(axisMoves).not.toContain("FF");
		expect(axisMoves).not.toContain("RR");
	}
});

test("3x3", () => {
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(THREE);
		const axisMoves = scramble.replace(/[2'\s]/g, "");
		expect(axisMoves.length).toBe(THREE_SCRAMBLE_LENGTH);
		expect(axisMoves).not.toContain("UU");
		expect(axisMoves).not.toContain("DD");
		expect(axisMoves).not.toContain("FF");
		expect(axisMoves).not.toContain("BB");
		expect(axisMoves).not.toContain("RR");
		expect(axisMoves).not.toContain("LL");
		expect(axisMoves).not.toContain("UDU");
		expect(axisMoves).not.toContain("DUD");
		expect(axisMoves).not.toContain("FBF");
		expect(axisMoves).not.toContain("BFB");
		expect(axisMoves).not.toContain("RLR");
		expect(axisMoves).not.toContain("LRL");
	}
});

test("4x4", () => {
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(FOUR);
		const axisMoves = scramble.replace(/[2'\sw]/g, "");
		expect(axisMoves.length).toBe(FOUR_SCRAMBLE_LENGTH);
		const sanitizedMoves = scramble.replace(/[2']/g, ""); // keep spaces for easier pattern matching
		expect(sanitizedMoves).not.toContain("U U ");
		expect(sanitizedMoves).not.toContain("D D ");
		expect(sanitizedMoves).not.toContain("F F ");
		expect(sanitizedMoves).not.toContain("B B ");
		expect(sanitizedMoves).not.toContain("R R ");
		expect(sanitizedMoves).not.toContain("L L ");
		expect(sanitizedMoves).not.toContain("U D U ");
		expect(sanitizedMoves).not.toContain("D U D ");
		expect(sanitizedMoves).not.toContain("F B F ");
		expect(sanitizedMoves).not.toContain("B F B ");
		expect(sanitizedMoves).not.toContain("R L R ");
		expect(sanitizedMoves).not.toContain("L R L ");
		expect(sanitizedMoves).not.toContain("Uw Uw ");
		expect(sanitizedMoves).not.toContain("Uw Dw ");
		expect(sanitizedMoves).not.toContain("Dw Uw ");
		expect(sanitizedMoves).not.toContain("Dw Dw ");
		expect(sanitizedMoves).not.toContain("Fw Fw ");
		expect(sanitizedMoves).not.toContain("Fw Bw ");
		expect(sanitizedMoves).not.toContain("Bw Fw ");
		expect(sanitizedMoves).not.toContain("Bw Bw ");
		expect(sanitizedMoves).not.toContain("Rw Rw ");
		expect(sanitizedMoves).not.toContain("Rw Lw ");
		expect(sanitizedMoves).not.toContain("Lw Rw ");
		expect(sanitizedMoves).not.toContain("Lw Lw ");
		expect(sanitizedMoves).not.toContain("Uw D Uw ");
		expect(sanitizedMoves).not.toContain("Uw U Uw ");
		expect(sanitizedMoves).not.toContain("Dw D Dw ");
		expect(sanitizedMoves).not.toContain("Dw U Dw ");
		expect(sanitizedMoves).not.toContain("Fw B Fw ");
		expect(sanitizedMoves).not.toContain("Fw F Fw ");
		expect(sanitizedMoves).not.toContain("Bw F Bw ");
		expect(sanitizedMoves).not.toContain("Bw B Bw ");
		expect(sanitizedMoves).not.toContain("Rw L Rw ");
		expect(sanitizedMoves).not.toContain("Rw R Rw ");
		expect(sanitizedMoves).not.toContain("Lw R Lw ");
		expect(sanitizedMoves).not.toContain("Lw L Lw ");
	}
});

test("5x5", () => {
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(FIVE);
		const axisMoves = scramble.replace(/[2'\sw]/g, "");
		expect(axisMoves.length).toBe(FIVE_SCRAMBLE_LENGTH);
		const sanitizedMoves = scramble.replace(/[2']/g, ""); // keep spaces for easier pattern matching
		expect(sanitizedMoves).not.toContain("U U ");
		expect(sanitizedMoves).not.toContain("D D ");
		expect(sanitizedMoves).not.toContain("F F ");
		expect(sanitizedMoves).not.toContain("B B ");
		expect(sanitizedMoves).not.toContain("R R ");
		expect(sanitizedMoves).not.toContain("L L ");
		expect(sanitizedMoves).not.toContain("U D U ");
		expect(sanitizedMoves).not.toContain("D U D ");
		expect(sanitizedMoves).not.toContain("F B F ");
		expect(sanitizedMoves).not.toContain("B F B ");
		expect(sanitizedMoves).not.toContain("R L R ");
		expect(sanitizedMoves).not.toContain("L R L ");
		expect(sanitizedMoves).not.toContain("Uw Uw ");
		expect(sanitizedMoves).not.toContain("Dw Dw ");
		expect(sanitizedMoves).not.toContain("Fw Fw ");
		expect(sanitizedMoves).not.toContain("Bw Bw ");
		expect(sanitizedMoves).not.toContain("Rw Rw ");
		expect(sanitizedMoves).not.toContain("Lw Lw ");
		expect(sanitizedMoves).not.toContain("Uw D Uw ");
		expect(sanitizedMoves).not.toContain("Uw U Uw ");
		expect(sanitizedMoves).not.toContain("Dw D Dw ");
		expect(sanitizedMoves).not.toContain("Dw U Dw ");
		expect(sanitizedMoves).not.toContain("Fw B Fw ");
		expect(sanitizedMoves).not.toContain("Fw F Fw ");
		expect(sanitizedMoves).not.toContain("Bw F Bw ");
		expect(sanitizedMoves).not.toContain("Bw B Bw ");
		expect(sanitizedMoves).not.toContain("Rw L Rw ");
		expect(sanitizedMoves).not.toContain("Rw R Rw ");
		expect(sanitizedMoves).not.toContain("Lw R Lw ");
		expect(sanitizedMoves).not.toContain("Lw L Lw ");
	}
});

test("BLD", () => {
	let scramblesWIthNoWideMoves = 0;
	let ScramblesWIthOneWideMove = 0;
	let ScramblesWithTwoWideMoves = 0;
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(BLD);
		const axisMoves = scramble.replace(/[2'\sw]/g, "");
		const numberOfWideMoves = (scramble.match(/w/g) || []).length;
		expect(numberOfWideMoves).not.toBeGreaterThan(2);
		expect(axisMoves.length).toBe((BLD_SCRAMBLE_LENGTH - 2) + numberOfWideMoves);
		const nonWideAxisMoves = axisMoves.slice(0, -(numberOfWideMoves));
		expect(nonWideAxisMoves).not.toContain("UU");
		expect(nonWideAxisMoves).not.toContain("DD");
		expect(nonWideAxisMoves).not.toContain("FF");
		expect(nonWideAxisMoves).not.toContain("BB");
		expect(nonWideAxisMoves).not.toContain("RR");
		expect(nonWideAxisMoves).not.toContain("LL");
		expect(nonWideAxisMoves).not.toContain("UDU");
		expect(nonWideAxisMoves).not.toContain("DUD");
		expect(nonWideAxisMoves).not.toContain("FBF");
		expect(nonWideAxisMoves).not.toContain("BFB");
		expect(nonWideAxisMoves).not.toContain("RLR");
		expect(nonWideAxisMoves).not.toContain("LRL");
		const wideMoves = numberOfWideMoves === 0
			? ""
			: numberOfWideMoves === 1
				? axisMoves.slice(-1) :
				axisMoves.slice(-2);
		expect(wideMoves).not.toBe("UU");
		expect(wideMoves).not.toBe("UD");
		expect(wideMoves).not.toBe("DU");
		expect(wideMoves).not.toBe("DD");
		expect(wideMoves).not.toBe("FF");
		expect(wideMoves).not.toBe("FB");
		expect(wideMoves).not.toBe("BF");
		expect(wideMoves).not.toBe("BB");
		expect(wideMoves).not.toBe("RR");
		expect(wideMoves).not.toBe("RL");
		expect(wideMoves).not.toBe("LR");
		expect(wideMoves).not.toBe("LL");
		const widthSplitMoves = numberOfWideMoves === 0
			? ""
			: numberOfWideMoves === 1
				? axisMoves.slice(-2)
				: axisMoves.slice(-3, -1);
		expect(widthSplitMoves).not.toBe("UD");
		expect(widthSplitMoves).not.toBe("DU");
		expect(widthSplitMoves).not.toBe("FB");
		expect(widthSplitMoves).not.toBe("BF");
		expect(widthSplitMoves).not.toBe("RL");
		expect(widthSplitMoves).not.toBe("LR");
		if (numberOfWideMoves === 0) {
			scramblesWIthNoWideMoves++;
		} else if (numberOfWideMoves === 1) {
			ScramblesWIthOneWideMove++;
		} else if (numberOfWideMoves === 2) {
			ScramblesWithTwoWideMoves++;
		}
	}
	expect(scramblesWIthNoWideMoves / NUMBER_OF_RUNS).toBeGreaterThan((1 / 5) ** 2 - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWIthNoWideMoves / NUMBER_OF_RUNS).toBeLessThan((1 / 5) ** 2 + LIKELINESS_RELATIVE_ERROR);
	expect(ScramblesWIthOneWideMove / NUMBER_OF_RUNS).toBeGreaterThan(2 * (1 / 5) * (4 / 5) - LIKELINESS_RELATIVE_ERROR);
	expect(ScramblesWIthOneWideMove / NUMBER_OF_RUNS).toBeLessThan(2 * (1 / 5) * (4 / 5) + LIKELINESS_RELATIVE_ERROR);
	expect(ScramblesWithTwoWideMoves / NUMBER_OF_RUNS).toBeGreaterThan((4 / 5) ** 2 - LIKELINESS_RELATIVE_ERROR);
	expect(ScramblesWithTwoWideMoves / NUMBER_OF_RUNS).toBeLessThan((4 / 5) ** 2 + LIKELINESS_RELATIVE_ERROR);
});

test("pyra", () => {
	let scramblesWithNoTips = 0;
	let scramblesWithOneTip = 0;
	let scramblesWithTwoTips = 0;
	let scramblesWithThreeTips = 0;
	let scramblesWithFourTips = 0;
	for (let i = 0; i < NUMBER_OF_RUNS; i++) {
		const scramble = Scramble(PYRAMINX);
		const axisMoves = scramble.replace(/['\s]/g, "");
		const numberOfTipsScrambled = (scramble.match(/[ubrl]/g) || []).length;
		expect(numberOfTipsScrambled).not.toBeGreaterThan(4);
		expect(axisMoves.length).toBe(PYRAMINX_SCRAMBLE_LENGTH + numberOfTipsScrambled);
		expect(axisMoves).not.toContain("UU");
		expect(axisMoves).not.toContain("BB");
		expect(axisMoves).not.toContain("RR");
		expect(axisMoves).not.toContain("LL");
		if (numberOfTipsScrambled === 0) {
			scramblesWithNoTips++;
		} else if (numberOfTipsScrambled === 1) {
			scramblesWithOneTip++;
		} else if (numberOfTipsScrambled === 2) {
			scramblesWithTwoTips++;
		} else if (numberOfTipsScrambled === 3) {
			scramblesWithThreeTips++;
		} else if (numberOfTipsScrambled === 4) {
			scramblesWithFourTips++;
		}
	}
	expect(scramblesWithNoTips / NUMBER_OF_RUNS).toBeGreaterThan((1 / 3) ** 4 - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithNoTips / NUMBER_OF_RUNS).toBeLessThan((1 / 3) ** 4 + LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithOneTip / NUMBER_OF_RUNS).toBeGreaterThan(4 * ((2 / 3) * (1 / 3) ** 3) - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithOneTip / NUMBER_OF_RUNS).toBeLessThan(4 * ((2 / 3) * (1 / 3) ** 3) + LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithTwoTips / NUMBER_OF_RUNS).toBeGreaterThan(4 * ((2 / 3) * (1 / 3) ** 2) - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithTwoTips / NUMBER_OF_RUNS).toBeLessThan(4 * ((2 / 3) * (1 / 3) ** 2) + LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithThreeTips / NUMBER_OF_RUNS).toBeGreaterThan(4 * ((1 / 3) * (2 / 3) ** 3) - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithThreeTips / NUMBER_OF_RUNS).toBeLessThan(4 * ((1 / 3) * (2 / 3) ** 3) + LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithFourTips / NUMBER_OF_RUNS).toBeGreaterThan(((2 / 3) ** 4) - LIKELINESS_RELATIVE_ERROR);
	expect(scramblesWithFourTips / NUMBER_OF_RUNS).toBeLessThan(((2 / 3) ** 4) + LIKELINESS_RELATIVE_ERROR);
});

const renderAverages = (recentTimes) => { // mocking the function like this is an approach I can live with
	const params = [
		{ label: "best", length: 1, removeBestAndWorst: false, align: "left" },
		{ label: "mo3", length: 3, removeBestAndWorst: false, align: "left" },
		{ label: "avg5", length: 5, removeBestAndWorst: true, align: "left" },
		{ label: "avg12", length: 12, removeBestAndWorst: true, align: isHorizontal ? "left" : "right" },
		{ label: "mo50", length: 50, removeBestAndWorst: false, align: "right" },
		{ label: "mo100", length: 100, removeBestAndWorst: false, align: "right" },
	];
	return (
		<div className="background" style={{ display: averageDisplay }}>
			{params.map(({ label, length, removeBestAndWorst, align }) => {
				let displayTime = EMPTY_TIMER;
				if (removeBestAndWorst) {
					if (recentTimes.length === length - 1) { // 4/5, 11/12 -> make average without best
						displayTime = formatTime(recentTimes.sort((a, b) => a - b)
							.slice(1)
							.reduce((sum, time) => sum + time, 0) / (length - 2));
					} else if (recentTimes.length >= length) { // otherwise -> make average without best and worst
						displayTime = formatTime(recentTimes.slice(-length)
							.sort((a, b) => a - b)
							.slice(1, -1)
							.reduce((sum, time) => sum + time, 0) / (length - 2));
					}
				} else if (recentTimes.length >= length) {
					if (length === 1) { // best -> pick
						displayTime = formatTime(Math.min(...recentTimes));
					} else { // otherwise -> make mean
						displayTime = formatTime(recentTimes.slice(-length)
							.reduce((sum, time) => sum + time, 0) / length);
					}
				}
				return (
					<h4 key={label} style={{ textAlign: align }}>{align === "left" ? label + " " + displayTime : displayTime + " " + label}</h4>
				);
			})}
		</div>
	);
}
const formatTime = (time) => {
	const minutes = parseInt(Math.floor(time / 60000)).toString();
	const seconds = parseInt(Math.floor((time % 60000) / 1000)).toString().padStart(2, '0');
	const milliseconds = parseInt((time % 1000)).toString().padStart(3, '0');
	return `${minutes}:${seconds}:${milliseconds}`;
}

test("Render Averages", () => {
	let recentTimes = [484, 148567, 4847, 61874, 848975, 1877894, 157, 87974, 4876, 15879, 189687, 489751, 48976, 487, 7888];
	const { container } = render(renderAverages(recentTimes));
	expect(container.innerHTML).toContain('best 0:00:157');
	expect(container.innerHTML).toContain('mo3 0:19:117');
	expect(container.innerHTML).toContain('avg5 1:22:183');
	expect(container.innerHTML).toContain('2:55:636 avg12');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo50');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo100');
});

test("Render incomplete averages", () => {
	const recentTimes = [148567, 484, 4847, 61874];
	const { container } = render(renderAverages(recentTimes));
	expect(container.innerHTML).toContain('best 0:00:484');
	expect(container.innerHTML).toContain('mo3 0:22:401');
	expect(container.innerHTML).toContain('avg5 1:11:762');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' avg12');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo50');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo100');
});
