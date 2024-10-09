import React from 'react';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/system';

const InfoBlockContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    width: '30%',
    marginRight: '10px',
    padding: '10px',
    border: '2px solid #ccc',
    borderRadius: '10px',
});

const InfoBlockTitle = styled(Typography)({
    fontFamily: 'Lora, serif',
    fontWeight: 400,
    fontSize: 15,
    color: '#000000',
});

const InfoBlockSubtitle = styled(Typography)({
    fontFamily: 'Lora, serif',
    fontWeight: 600,
    fontSize: 18,
    color: '#000000',
});

interface InfoBlockProps {
    imgSrc: string;
    title: string;
    subtitle: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ imgSrc, title, subtitle }) => {
    return (
        <InfoBlockContainer>
            <img src={imgSrc} alt={title} style={{ width: '55px', marginRight: '10px' }} />
            <Box>
                <InfoBlockTitle>{title}</InfoBlockTitle>
                <InfoBlockSubtitle>{subtitle}</InfoBlockSubtitle>
            </Box>
        </InfoBlockContainer>
    );
};

export default InfoBlock;
