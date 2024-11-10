import CorrectIcon from '../../assets/images/correct-icon.svg';
import IncorrectIcon from '../../assets/images/incorrect-icon.svg';
import { Box } from "@mui/material";
import StatusBox from "../Boxes/TaskStatusBox.tsx";
import CheckStatusBox from "../Boxes/TaskCheckStatusBox.tsx";
import { AttemptTitle, SectionTitle } from "../../assets/styles/TaskStyles.ts";
import {
    ATTEMPT_RESULT_BLOCKS,
    ATTEMPT_RESULT_MAIN_BLOCKS,
    TASK_ATTEMPT_NUMBER_LABEL
} from "../../assets/constants/texts.ts";
import { AttemptBlockStyled, AttemptResultBox, SectionBox } from "../../assets/styles/SectionStyles.ts";
import { AttemptBlockProps } from "../../types/AttemptBlockProps.ts";

function AttemptBlock({ attempt, task }: AttemptBlockProps) {
    if (!attempt || !task) {
        return <SectionTitle>No attempt or task data available.</SectionTitle>;
    }

    const { attemptNumber, finalScore, compilationScore, testsScore, qualityScore } = attempt;

    const sections = [
        {
            title: ATTEMPT_RESULT_MAIN_BLOCKS.compilationSectionLabel,
            score: compilationScore,
            minScore: task.compilationSection?.minScore || 0,
            maxScore: task.compilationSection?.maxScore || 0,
        },
        {
            title: ATTEMPT_RESULT_MAIN_BLOCKS.testsSectionLabel,
            score: testsScore,
            minScore: task.testsSection?.minScore || 0,
            maxScore: task.testsSection?.maxScore || 0,
        },
        {
            title: ATTEMPT_RESULT_MAIN_BLOCKS.qualitySectionLabel,
            score: qualityScore,
            minScore: task.qualitySection?.minScore || 0,
            maxScore: task.qualitySection?.maxScore || 0,
        },
    ];

    return (
        <AttemptBlockStyled>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
                <AttemptTitle>{TASK_ATTEMPT_NUMBER_LABEL}{attemptNumber}</AttemptTitle>
                <StatusBox value={finalScore} />
            </Box>

            <Box mt={3} marginLeft="20px">
                {sections.map(({ title, score, minScore, maxScore }) => (
                    <SectionBox key={title}>
                        <img
                            src={score < minScore ? IncorrectIcon : CorrectIcon}
                            alt={title}
                            style={{ width: '40px', marginRight: '10px' }}
                        />
                        <Box>
                            <Box display="flex" alignItems="center">
                                <SectionTitle>{title}</SectionTitle>
                                <CheckStatusBox isPassed={score > minScore} />
                            </Box>
                            <AttemptResultBox>
                                {ATTEMPT_RESULT_BLOCKS.currentScoreLabel}
                                <Box ml={0.5} mr={1} fontWeight={700}>{score}</Box>
                                {ATTEMPT_RESULT_BLOCKS.maxScoreLabel}
                                <Box ml={0.5} mr={1} fontWeight={700}>{maxScore}</Box>
                                {ATTEMPT_RESULT_BLOCKS.minScoreLabel}
                                <Box ml={0.5} mr={1} fontWeight={700}>{minScore}</Box>
                            </AttemptResultBox>
                        </Box>
                    </SectionBox>
                ))}
            </Box>
        </AttemptBlockStyled>
    );
}

export default AttemptBlock;