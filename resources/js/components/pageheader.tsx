import React from 'react';

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, description }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="from-primary to-primary/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">{icon}</div>
            <div className="flex-1 space-y-1">
                <h1 className="text-foreground text-2xl font-bold lg:text-3xl">{title}</h1>
                <p className="text-muted-foreground text-sm lg:text-base">{description}</p>
            </div>
        </div>
    );
};

export default SectionHeader;
