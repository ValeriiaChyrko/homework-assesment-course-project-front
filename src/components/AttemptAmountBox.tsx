import { Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledAttemptAmountBox = styled(Box)({
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Lora, serif',
    fontWeight: 400,
    fontSize: '16px',
    color: '#000000',
});

const AttemptAmountBox = ({ usedAttemptAmount, maxAttemptAmount } : {usedAttemptAmount:number, maxAttemptAmount:number}) => {

    return (
        <StyledAttemptAmountBox>
            <span>Кількість спроб:</span>
            <Box ml={1} fontWeight={700}>{usedAttemptAmount} / {maxAttemptAmount}</Box>
        </StyledAttemptAmountBox>
    );
};

export default AttemptAmountBox;