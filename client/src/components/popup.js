import { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { renderStats, renderAllTimes } from './statsHelper';
import icon from '../assets/images/copy.png'

const Popup = (props) => {
    const recentTimes = props.content.recentTimes;
    const recentScrambles = props.content.recentScrambles;

    const [isEditTimeVisible, setIsEditTimeVisible] = useState(false);

    const popupContent = useRef(null);
    const selectedTime = useRef(null);

    const selectContent = () => {
        if (popupContent.current) {
            const range = document.createRange();
            range.selectNodeContents(popupContent.current);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            try {
                document.execCommand('copy');
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleTimeClick = (key) => {
        setIsEditTimeVisible(true);
        selectedTime.current = key;
    };

    const setToEmpty = () => {
        let timeToRemove = selectedTime.current;
        recentTimes[timeToRemove] = Infinity;
        selectedTime.current = null;
        setIsEditTimeVisible(false);
    };

    const deleteTime = () => {
        let timeToRemove = selectedTime.current;
        recentTimes.splice(timeToRemove, 1);
        recentScrambles.splice(timeToRemove, 1);
        selectedTime.current = null;
        setIsEditTimeVisible(false);
    };
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {!isEditTimeVisible
                    ? <Button className="popup-icon" onClick={selectContent}>
                        <img src={icon} alt="" width={"20x"} height={"20px"}></img>
                    </Button>
                    : <div></div>
                }
                <Button className="restart popup-icon"
                    onClick={isEditTimeVisible
                        ? () => { selectedTime.current = null; setIsEditTimeVisible(false) }
                        : props.onPopupClose}>X
                </Button>
            </div>
            {
                !isEditTimeVisible
                    ? <div ref={popupContent}>{
                        <>
                            {renderStats({ times: recentTimes })}
                            <br></br>
                            {renderAllTimes({ recentTimes, recentScrambles, onClickEffect: (key) => handleTimeClick(key) })}
                        </>
                    }
                    </div>
                    : <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button className="fifty-percent" onClick={setToEmpty}>DNF</Button>
                        <Button className="fifty-percent restart" onClick={deleteTime}>Delete</Button>
                    </div>
            }
        </div >
    );
};

export default Popup;
