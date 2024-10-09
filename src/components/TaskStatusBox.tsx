import { Box } from "@mui/material";
import { styled } from "@mui/system";

const getColorForValue = (x:number) => {
    if (x >= 91) {
        return {
            bgColor: 'rgba(185,240,183,0.5)', // 91-100      A
            textColor: 'rgb(56,105,60)',
        };
    } else if (x >= 83) {
        return {
            bgColor: 'rgb(199,238,169, 0.5)', // 83-90.9    B
            textColor: 'rgb(56,105,60, 0.9)',
        };
    } else if (x >= 76) {
        return {
            bgColor: 'rgb(246,241,147, 0.5)', // 76-82.9    C
            textColor: 'rgb(238,124,41)',
        };
    } else if (x >= 68) {
        return {
            bgColor: 'rgb(255,190,152, 0.5)', // 68-75.9    D
            textColor: 'rgb(232,92,13)',
        };
    } else if (x >= 61) {
        return {
            bgColor: 'rgb(255,138,138, 0.5)', // 61-67.9     E
            textColor: 'rgb(196,12,12)',
        };
    } else {
        return {
            bgColor: 'rgb(238,95,95, 0.5)', // 0-60.9     F
            textColor: '#a01517',
        };
    }
};

interface StatusBoxProps {
    bgColor?: string;
    textColor?: string;
}

const StyledStatusBox = styled(Box)<StatusBoxProps>(({ bgColor, textColor }) => ({
    backgroundColor: bgColor,
    maxWidth: '130px',
    borderRadius: '10px',
    padding: '10px 15px',
    marginInline: '20px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '12px',
    color: textColor,
}));

const StatusBox = ({ value } : {value:number}) => {
    const { bgColor, textColor } = getColorForValue(value);

    return (
        <StyledStatusBox bgColor={bgColor} textColor={textColor}>
            <span>Завершено:</span>
            <Box ml={1} fontWeight={700}>{value} / 100</Box>
        </StyledStatusBox>
    );
};

export default StatusBox;