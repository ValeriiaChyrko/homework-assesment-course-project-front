import React from 'react';
import { Box } from '@mui/material';
import { InfoBlockProps } from "../../types/InfoBlockProps.ts";
import { InfoBlockSubtitle, InfoBlockTitle } from "../../assets/styles/TextStyles.ts";
import { InfoBlockContainer } from "../../assets/styles/SectionStyles.ts";

const InfoBlock: React.FC<InfoBlockProps> = ({ imgSrc, title, subtitle, action }) => {
    return (
        <InfoBlockContainer>
            <img src={imgSrc} alt={title} style={{ width: '55px', marginRight: '10px' }} />
            <Box>
                <InfoBlockTitle>{title}</InfoBlockTitle>
                {!action && <InfoBlockSubtitle>{subtitle}</InfoBlockSubtitle>}
                {action}
            </Box>
        </InfoBlockContainer>
    );
};

export default InfoBlock;