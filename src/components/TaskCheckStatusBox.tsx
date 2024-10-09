import { Box } from "@mui/material";
import { styled } from "@mui/system";

const getStatusForBoolean = (isPassed: boolean) => {
    if (isPassed) {
        return {
            bgColor: 'rgba(185,240,183,0.5)',
            textColor: 'rgb(56,105,60)',
            text: 'Пройдено'
        };
    } else {
        return {
            bgColor: 'rgba(238,95,95,0.5)',
            textColor: '#a01517',
            text: 'Провалено'
        };
    }
};

interface StatusBoxProps {
    bgColor?: string;
    textColor?: string;
}

const StyledStatusBox = styled(Box)<StatusBoxProps>(({ bgColor, textColor }) => ({
    backgroundColor: bgColor,
    maxWidth: '100px',
    borderRadius: '10px',
    padding: '7px 10px',
    marginInline: '10px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '10px',
    color: textColor,
}));

const CheckStatusBox = ({ isPassed }: { isPassed: boolean }) => {
    const { bgColor, textColor, text } = getStatusForBoolean(isPassed);

    return (
        <StyledStatusBox bgColor={bgColor} textColor={textColor}>
            <span>{text}</span>
        </StyledStatusBox>
    );
};

export default CheckStatusBox;
