import React from "react";

export interface InfoBlockProps {
    imgSrc: string;
    title: string;
    subtitle: string;
    action?: React.ReactNode | null;
}