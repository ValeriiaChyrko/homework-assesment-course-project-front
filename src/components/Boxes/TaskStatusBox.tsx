import { Box } from "@mui/material";
import { StyledTaskStatusBox } from "../../assets/styles/SectionStyles.ts";
import { TASK_ATTEMPT_STATUS_LABEL } from "../../assets/constants/texts.ts";

const getColorForValue = (x: number) => {
    if (x >= 91) {
        return {
            backgroundColor: 'rgba(185,240,183,0.5)', // 91-100      A
            color: 'rgb(56,105,60)',
        };
    } else if (x >= 83) {
        return {
            backgroundColor: 'rgb(199,238,169, 0.5)', // 83-90.9    B
            color: 'rgb(56,105,60, 0.9)',
        };
    } else if (x >= 76) {
        return {
            backgroundColor: 'rgb(246,241,147, 0.5)', // 76-82.9    C
            color: 'rgb(238,124,41)',
        };
    } else if (x >= 68) {
        return {
            backgroundColor: 'rgb(255,190,152, 0.5)', // 68-75.9    D
            color: 'rgb(232,92,13)',
        };
    } else if (x >= 61) {
        return {
            backgroundColor: 'rgb(255,138,138, 0.5)', // 61-67.9     E
            color: 'rgb(196,12,12)',
        };
    } else {
        return {
            backgroundColor: 'rgb(238,95,95, 0.5)', // 0-60.9     F
            color: '#a01517',
        };
    }
};

const StatusBox = ({ value }: { value: number }) => {
    const { backgroundColor, color } = getColorForValue(value);

    return (
        <StyledTaskStatusBox bgColor={backgroundColor} textColor={color}>
            {TASK_ATTEMPT_STATUS_LABEL}
            <Box ml={1} fontWeight={700}>{value} / 100</Box>
        </StyledTaskStatusBox>
    );
};

export default StatusBox;