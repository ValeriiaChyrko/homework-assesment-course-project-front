import { StyledStatusBox } from "../../assets/styles/SectionStyles.ts";
import {ATTEMPT_RESULT_STATUS} from "../../assets/constants/texts.ts";

const getStatusForBoolean = (isPassed: boolean) => {
    if (isPassed) {
        return {
            backgroundColor: 'rgba(185,240,183,0.5)',
            color: 'rgb(56,105,60)',
            text: ATTEMPT_RESULT_STATUS.passed
        };
    } else {
        return {
            backgroundColor: 'rgba(238,95,95,0.5)',
            color: '#a01517',
            text: ATTEMPT_RESULT_STATUS.failed
        };
    }
};

const CheckStatusBox = ({ isPassed }: { isPassed: boolean }) => {
    const { backgroundColor, color, text } = getStatusForBoolean(isPassed);

    return (
        <StyledStatusBox style={{ backgroundColor, color }}>
            {text}
        </StyledStatusBox>
    );
};

export default CheckStatusBox;