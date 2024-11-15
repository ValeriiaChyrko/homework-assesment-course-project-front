import {TASK_ATTEMPT_AMOUNT_LABEL} from "../../assets/constants/texts.ts";
import {AttemptLabel, AttemptLabelBold} from "../../assets/styles/TextStyles.ts";
import {StyledAttemptAmountBox} from "../../assets/styles/SectionStyles.ts";


const AttemptAmountBox = ({ usedAttemptAmount, maxAttemptAmount } : {usedAttemptAmount:number, maxAttemptAmount:number}) => {

    return (
        <StyledAttemptAmountBox>
            <AttemptLabel style={{ marginRight: '8px' }}>{TASK_ATTEMPT_AMOUNT_LABEL}</AttemptLabel>
            <AttemptLabelBold>{usedAttemptAmount} / {maxAttemptAmount}</AttemptLabelBold>
        </StyledAttemptAmountBox>
    );
};

export default AttemptAmountBox;