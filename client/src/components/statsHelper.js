import { EMPTY_TIMER } from "../constants";

export const formatTime = (elapsedTime) => {
    const minutes = parseInt(Math.floor(elapsedTime / 60000)).toString();
    const seconds = parseInt(Math.floor((elapsedTime % 60000) / 1000)).toString().padStart(2, '0');
    const milliseconds = parseInt((elapsedTime % 1000)).toString().padStart(3, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}

export const renderAllTimes = ({ recentTimes, recentScrambles }) => {
    return recentTimes.map((time, index) => (
        <h4 key={index + 1}>
            {index + 1}{")"} {formatTime(time)} {recentScrambles[index]}
        </h4>
    ));
}

export const renderStats = ({ times, formatter = formatTime, averageDisplay = "grid", className = "", params = [
    { label: "mean", length: 0, what: "mean", removeBestAndWorst: false, align: "left" },
    { label: "median", length: 0, what: "median", removeBestAndWorst: false, align: "left" },
    { label: "1", length: -1 },
    { label: "best", length: 1, what: "best", removeBestAndWorst: false, align: "left" },
    { label: "worst", length: 1, what: "worst", removeBestAndWorst: false, align: "left" },
    { label: "last", length: 1, what: "last", removeBestAndWorst: false, align: "left" },
    { label: "2", length: -1 },
    { label: "best mo3", length: 3, what: "best", removeBestAndWorst: false, align: "left" },
    { label: "worst mo3", length: 3, what: "worst", removeBestAndWorst: false, align: "left" },
    { label: "current mo3", length: 3, what: "last", removeBestAndWorst: false, align: "left" },
    { label: "3", length: -1 },
    { label: "best avg5", length: 5, what: "best", removeBestAndWorst: true, align: "left" },
    { label: "worst avg5", length: 5, what: "worst", removeBestAndWorst: true, align: "left" },
    { label: "current avg5", length: 5, what: "last", removeBestAndWorst: true, align: "left" },
    { label: "4", length: -1 },
    { label: "best avg12", length: 12, what: "best", removeBestAndWorst: true, align: "left" },
    { label: "worst avg12", length: 12, what: "worst", removeBestAndWorst: true, align: "left" },
    { label: "current avg12", length: 12, what: "last", removeBestAndWorst: true, align: "left" },
    { label: "5", length: -1 },
    { label: "best mo50", length: 50, what: "best", removeBestAndWorst: false, align: "left" },
    { label: "worst mo50", length: 50, what: "worst", removeBestAndWorst: false, align: "left" },
    { label: "current mo50", length: 50, what: "last", removeBestAndWorst: false, align: "left" },
    { label: "6", length: -1 },
    { label: "best mo100", length: 100, what: "best", removeBestAndWorst: false, align: "left" },
    { label: "worst mo100", length: 100, what: "worst", removeBestAndWorst: false, align: "left" },
    { label: "current mo100", length: 100, what: "last", removeBestAndWorst: false, align: "left" },
] }) => {
    return (
        <div className={className} style={{ display: averageDisplay }}>
            {params.map(({ label, length, what, removeBestAndWorst, align }) => {
                if (length === - 1) {
                    return (<h4 key={label}> </h4>)
                }
                let displayTime = EMPTY_TIMER;
                let aux = [...times];
                if (removeBestAndWorst) {
                    if ("last" === what) {
                        if (aux.length === length - 1) {
                            displayTime = formatter(aux.sort((a, b) => a - b)
                                .slice(1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        } else if (aux.length >= length) {
                            displayTime = formatter(aux.slice(-length)
                                .sort((a, b) => a - b)
                                .slice(1, -1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        }
                    } else if ("best" === what) {
                        if (aux.length === length - 1) {
                            displayTime = formatter(aux.sort((a, b) => a - b)
                                .slice(1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        } else if (aux.length >= length) {
                            for (let i = 0; i <= times.length - length; i++) {
                                let aux2 = [...aux];
                                let newAverage = aux2.slice(0, length)
                                    .sort((a, b) => a - b)
                                    .slice(1, -1)
                                    .reduce((sum, time) => sum + time, 0) / (length - 2)
                                displayTime = i === 0 || newAverage < displayTime ? newAverage : displayTime;
                                aux.shift();
                            }
                            displayTime = formatter(displayTime);
                        }
                    } else if ("worst" === what) {
                        if (aux.length === length - 1) {
                            displayTime = formatter(aux.sort((a, b) => a - b)
                                .slice(1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        } else if (aux.length >= length) {
                            for (let i = 0; i <= times.length - length; i++) {
                                let aux2 = [...aux];
                                let newAverage = aux2.slice(0, length)
                                    .sort((a, b) => a - b)
                                    .slice(1, -1)
                                    .reduce((sum, time) => sum + time, 0) / (length - 2)
                                displayTime = i === 0 || newAverage > displayTime ? newAverage : displayTime;
                                aux.shift();
                            }
                            displayTime = formatter(displayTime);
                        }
                    }
                } else if (aux.length >= length) {
                    if (length === 0 && aux.length > 0) {
                        if (what === "mean") {
                            displayTime = formatter(aux.reduce((sum, time) => sum + time, 0) / aux.length);
                        } else if (what === "median") {
                            let sorted = aux.sort((a, b) => a - b);
                            displayTime = sorted.length % 2 !== 0
                                ? formatTime(sorted[Math.floor(sorted.length / 2)])
                                : formatTime((sorted[Math.floor(sorted.length / 2) - 1] + sorted[Math.floor(sorted.length / 2)]) / 2);
                        }
                    } else if (length === 1) {
                        if (what === "last") {
                            displayTime = formatter(aux[aux.length - 1]);
                        } else if (what === "best") {
                            displayTime = formatter(Math.min(...aux));
                        } else if (what === "worst") {
                            displayTime = formatter(Math.max(...aux));
                        }
                    } else {
                        if (what === "last") {
                            displayTime = formatter(aux.slice(-length)
                                .reduce((sum, time) => sum + time, 0) / length);
                        } else if (what === "best") {
                            for (let i = 0; i <= times.length - length; i++) {
                                let aux2 = [...aux];
                                let newAverage = aux2.slice(0, length)
                                    .reduce((sum, time) => sum + time, 0) / length
                                displayTime = i === 0 || newAverage < displayTime ? newAverage : displayTime;
                                aux.shift();
                            }
                            displayTime = formatter(displayTime);
                        } else if (what === "worst") {
                            for (let i = 0; i <= times.length - length; i++) {
                                let aux2 = [...aux];
                                let newAverage = aux2.slice(0, length)
                                    .reduce((sum, time) => sum + time, 0) / length
                                displayTime = i === 0 || newAverage > displayTime ? newAverage : displayTime;
                                aux.shift();
                            }
                            displayTime = formatter(displayTime);
                        }
                    }
                }
                return (
                    <h4 key={label} style={{ textAlign: align }}>{align === "left" ? label + " " + displayTime : displayTime + " " + label}</h4>
                );
            })}
        </div>
    );
}
