import GitHubIcon from '../assets/git-hub-icon.svg';
import DateTimeIcon from '../assets/date-time-icon.svg';
import FinalScoreIcon from '../assets/final-score-icon.svg';
import {Box} from "@mui/material";
import {styled} from "@mui/system";
import InfoBlock from "./InfoBlock.tsx";
import {TaskDescriptionText, TaskInformationText} from "../styles/TaskStyles.ts";

const TaskInformationContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '40px',
});

const InfoSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

function TaskInformation() {
  return (
      <Box
          maxWidth="lg"
          sx={{
            bgcolor: '#EDF1F5',
            paddingTop: '20px',
            paddingX: '40px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
      >
        <Box
            alignItems="center"
            bgcolor="#FFFFFF"
            borderRadius="10px"
            padding="40px"
        >
          <TaskInformationText>
            Опис завдання
          </TaskInformationText>
          <TaskInformationContainer>
            <InfoSection>
              <InfoBlock imgSrc={GitHubIcon} title="https://github.com" subtitle="ValeriiaChyrko" />
              <InfoBlock imgSrc={DateTimeIcon} title="Виконати до" subtitle="15.03.2024 09:00" />
              <InfoBlock imgSrc={FinalScoreIcon} title="Максимальний бал" subtitle="100" />
            </InfoSection>
          </TaskInformationContainer>

          <TaskDescriptionText>
            <p>
              Завдання рівня для початківців для практики налагодження модульних
              тестів у Visual Studio.
            </p>
            <p>
              Детальний опис завдання можна знайти в репозиторії завдань. Запустіть
              завдання та натисніть посилання на репозиторій завдань. Ви перейдете
              на сторінку сховища завдань на порталі GitHub, де ви зможете знайти
              опис завдання у файлі README.md.
            </p>
            <p>Орієнтовний час виконання завдання – 1 год.</p>
          </TaskDescriptionText>

        </Box>
      </Box>
  );
}

export default TaskInformation;
