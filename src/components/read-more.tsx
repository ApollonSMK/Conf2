'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ReadMoreProps {
  text: string;
  charLimit?: number;
  className?: string;
}

export function ReadMore({ text, charLimit = 350, className }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  const isLongText = text.length > charLimit;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isLongText && !isExpanded ? `${text.substring(0, charLimit)}...` : text;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-foreground/90 whitespace-pre-wrap">{displayText}</p>
      {isLongText && (
        <Button variant="link" onClick={toggleExpansion} className="p-0 h-auto">
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </Button>
      )}
    </div>
  );
}
