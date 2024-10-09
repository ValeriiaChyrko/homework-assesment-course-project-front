import CorrectIcon from '../assets/correct-icon.svg';
import IncorrectIcon from '../assets/incorrect-icon.svg';
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import StatusBox from "./TaskStatusBox.tsx";
import CheckStatusBox from "./TaskCheckStatusBox.tsx";
import { AttemptTitle, SectionTitle } from "../styles/TaskStyles.ts";
import {Attempt} from "../models/Attempt.ts";

const AttemptResultBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Lora, serif',
    fontWeight: 400,
    fontSize: 15,
    color: '#000000',
});
const AttemptBlockStyled = styled(Box)({
    padding: '20px',
    marginTop: '20px',
    border: '2px solid #ccc',
    borderRadius: '10px',
});
const SectionBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
});

interface AttemptBlockProps {
    attempt: Attempt;
}

function AttemptBlock({ attempt }: AttemptBlockProps) {
    const totalScore = attempt.compilationScore + attempt.testsScore + attempt.qualityScore;

    return (
        <AttemptBlockStyled>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
                <AttemptTitle>Спроба №{attempt.number}</AttemptTitle>
                <StatusBox value={totalScore} />
            </Box>

            <Box mt={3} marginLeft="20px">
                {[
                    { title: "Компiляція", score: attempt.compilationScore },
                    { title: "Тести", score: attempt.testsScore },
                    { title: "Якість", score: attempt.qualityScore },
                ].map(({ title, score }) => (
                    <SectionBox key={title}>
                        <img src={CorrectIcon} alt={title} style={{width: '40px', marginRight: '10px'}}/>
                        <img src={IncorrectIcon} alt={title} style={{width: '40px', marginRight: '10px'}}/>
                        <Box>
                            <Box display="flex" alignItems="center">
                                <SectionTitle>{title}</SectionTitle>
                                <CheckStatusBox isPassed={score > 0}/>
                            </Box>
                            <AttemptResultBox>
                                <span>Бали:</span>
                                <Box ml={0.5} mr={1} fontWeight={700}>{score}</Box>
                                <span>Максимальний бал:</span>
                                <Box ml={0.5} mr={1} fontWeight={700}>{attempt.maxScore}</Box>
                                <span>Мінімальний бал:</span>
                                <Box ml={0.5} mr={1} fontWeight={700}>{attempt.minScore}</Box>
                            </AttemptResultBox>
                        </Box>
                    </SectionBox>
                ))}
            </Box>
        </AttemptBlockStyled>
    );
}

export default AttemptBlock;
