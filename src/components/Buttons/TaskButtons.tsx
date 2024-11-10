import { useNavigate } from 'react-router-dom';
import { BaseButton } from "../../assets/styles/ButtonStyles.ts";

const getButtonColorForStatus = (status: string) => {
    switch (status) {
        case 'started':
            return {
                backgroundColor: 'rgb(193,232,255)',
                color: 'rgb(24,101,132)',
                hoverColor: 'rgb(176,223,248)',
            };
        case 'onGoing':
            return {
                backgroundColor: 'rgb(201,218,196)',
                color: 'rgb(76,102,43)',
                hoverColor: 'rgb(175,196,169)',
            };
        case 'finished':
            return {
                backgroundColor: 'rgb(229,222,255)',
                color: 'rgb(112,94,178)',
                hoverColor: 'rgb(203,194,255)',
            };
        default:
            return {
                backgroundColor: 'transparent',
                color: '#000',
                hoverColor: 'transparent',
            };
    }
};

const TaskButton = ({ status, isDisabled }: { status: string; isDisabled?: boolean }) => {
    const navigate = useNavigate();
    const { backgroundColor, color, hoverColor } = getButtonColorForStatus(status);

    const handleClick = () => {
        switch (status) {
            case 'started':
                navigate('/task-ongoing');
                break;
            case 'onGoing':
                navigate('/task-finished');
                break;
            case 'finished':
                navigate('/task-started');
                break;
            default:
                console.log('No action defined for this status');
        }
    };

    return (
        <BaseButton
            onClick={handleClick}
            disabled={isDisabled}
            variant="contained"
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                '&:hover': {
                    backgroundColor: hoverColor,
                }
            }}
        >
            {status === 'started' && 'Розпочати'}
            {status === 'onGoing' && 'Завершити'}
            {status === 'finished' && 'Відновити'}
        </BaseButton>
    );
};

export default TaskButton;