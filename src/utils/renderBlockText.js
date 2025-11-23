// src/utils/renderBlockText.js
import React from 'react';

export const renderBlockText = (content) => {
  if (!content) return null;
  if (typeof content === 'string') return content;
  
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === 'paragraph' || !block.type) {
        return (
          <p key={index} className="mb-4">
            {block.children?.map((child) => child.text).join('')}
          </p>
        );
      }
      if (block.type === 'heading') {
         return <h4 key={index} className="font-bold text-lg mb-2 text-amber-500">{block.children?.map(c => c.text).join('')}</h4>
      }
      return null;
    });
  }
  return null; 
};