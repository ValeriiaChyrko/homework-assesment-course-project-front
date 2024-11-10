import {styled} from "@mui/system";
import {Box} from "@mui/material";
import {StatusBoxProps} from "../../types/StatusBoxProps.ts";

export const TaskInformationContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '40px',
});
export const InfoSection = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: '40px'
});
export const StyledAttemptAmountBox = styled(Box)({
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
});
export const StyledStatusBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor'
})<StatusBoxProps>(({ bgColor, textColor }) => ({
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
export const StyledTaskStatusBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor'
})<StatusBoxProps>(({ bgColor, textColor }) => ({
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
export const AttemptResultBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Lora, serif',
    fontWeight: 400,
    fontSize: 15,
    color: '#000000',
});
export const AttemptBlockStyled = styled(Box)({
    padding: '20px',
    marginTop: '20px',
    border: '2px solid #ccc',
    borderRadius: '10px',
});
export const SectionBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
});
export const InfoBlockContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    width: '30%',
    marginRight: '10px',
    padding: '10px',
    border: '2px solid #ccc',
    borderRadius: '10px',
});