import React from 'react';
import { useDrop } from 'react-dnd';

const DropSlot = ({ id, onDrop, onClick, children, newestMatch, olderMatch, cover }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item) => onDrop(item, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      onClick={() => onClick(id)}
      style={{
        border: '1px solid black',
        width: '100px',
        height: '150px',
        backgroundColor: isOver ? 'lightgray' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        // filter: cover ? 'brightness(0) opacity(0.5)' : newestMatch ? 'brightness(0.5) sepia(1) hue-rotate(0deg) saturate(10)' : olderMatch ? 'brightness(0.5) sepia(1) hue-rotate(200deg) saturate(5)' : 'none',
        position: 'relative',
      }}
    >
      {children}
      {cover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

export default DropSlot;
