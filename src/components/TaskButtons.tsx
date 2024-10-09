import {styled} from "@mui/system";
import {Button} from "@mui/material";

const BaseButton = styled(Button)({
    fontFamily: 'Lora, serif',
    fontWeight: 600,
    fontSize: 20,
    lineHeight: '28px',
    textAlign: 'center',
    padding: '10px 20px',
    cursor: 'pointer',
});

const getButtonColorForStatus = (status: string) => {
    switch (status) {
        case 'started':
            return {
                bgColor: 'rgb(193,232,255)',
                textColor: 'rgb(24,101,132)',
                hoverColor: 'rgb(176,223,248)',
            };
        case 'onGoing':
            return {
                bgColor: 'rgb(201,218,196)',
                textColor: 'rgb(76,102,43)',
                hoverColor: 'rgb(175,196,169)',
            };
        case 'finished':
            return {
                bgColor: 'rgb(229,222,255)',
                textColor: 'rgb(112,94,178)',
                hoverColor: 'rgb(203,194,255)',
            };
        default:
            return {
                bgColor: 'transparent',
                textColor: '#000',
                hoverColor: 'transparent',
            };
    }
};

const StyledButton = styled(BaseButton)<{ bgColor: string; textColor: string, hoverColor: string }>(({ bgColor, textColor, hoverColor }) => ({
    backgroundColor: bgColor,
    color: textColor,
    '&:hover': {
        backgroundColor: hoverColor,
    },
}));


const TaskButton = ({ status, isDisabled }: { status: string; isDisabled?: boolean }) => {
    const { bgColor, textColor, hoverColor } = getButtonColorForStatus(status);

    switch (status) {
        case 'started':
            return <StyledButton disabled={isDisabled} variant="contained" bgColor={bgColor} textColor={textColor} hoverColor={hoverColor}>Розпочати</StyledButton>;
        case 'onGoing':
            return <StyledButton disabled={isDisabled} variant="contained" bgColor={bgColor} textColor={textColor} hoverColor={hoverColor}>Завершити</StyledButton>;
        case 'finished':
            return <StyledButton disabled={isDisabled} variant="contained" bgColor={bgColor} textColor={textColor} hoverColor={hoverColor}>Відновити</StyledButton>;
        default:
            return null;
    }
};

export default TaskButton;