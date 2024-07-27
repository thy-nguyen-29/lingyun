import React from 'react';
import { useDrag } from 'react-dnd';

const Card = ({ id, image, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id, image },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}
      onClick={onClick}
    >
      <img src={image} alt={`Card ${id}`} width="100" height="150" />
    </div>
  
  );
};

export default Card;
