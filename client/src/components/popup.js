import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { renderStats, renderAllTimes } from './statsHelper';

const Popup = (props) => {
    const recentTimes = props.content.recentTimes;
    const recentScrambles = props.content.recentScrambles;

    const popupContent = useRef(null);

    const selectContent = () => {
        if (popupContent.current) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(popupContent.current);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button className="popup-icon" onClick={selectContent}>S</Button>
                <Button className="restart popup-icon" onClick={props.onPopupClose}>X</Button>
            </div>
            <div ref={popupContent}>{
                <>
                    {renderStats({ times: recentTimes })}
                    <br></br>
                    {renderAllTimes({ recentTimes, recentScrambles })}
                </>
            }
            </div>
        </div>
    );
};

export default Popup;
